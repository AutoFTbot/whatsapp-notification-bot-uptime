const express = require('express');
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sock = null;
let daftarGrup = new Set();
const adminNumbers = new Set(['621234567890@s.whatsapp.net']); //NOMOR ADMIN

try {
    const grupTersimpan = fs.readFileSync('grup.json', 'utf8');
    daftarGrup = new Set(JSON.parse(grupTersimpan));
} catch (error) {
    console.log('Belum ada grup yang tersimpan');
}

function simpanGrup() {
    fs.writeFileSync('grup.json', JSON.stringify([...daftarGrup]));
}

async function tanganiPesan(pesan) {
    const teks = pesan.message?.conversation || pesan.message?.extendedTextMessage?.text || '';
    const pengirim = pesan.key.remoteJid;
    const nomorPengirim = pesan.key.participant || pengirim;
    const nomorBot = sock.user.id.split(':')[0];

    if (!adminNumbers.has(nomorPengirim) || pesan.key.fromMe) {
        return;
    }

    if (teks.startsWith('!tambah') && pengirim.endsWith('@g.us')) {
        if (!daftarGrup.has(pengirim)) {
            daftarGrup.add(pengirim);
            simpanGrup();
            await sock.sendMessage(pengirim, { 
                text: '✅ Grup berhasil ditambahkan ke daftar notifikasi' 
            });
        } else {
            await sock.sendMessage(pengirim, { 
                text: '⚠️ Grup sudah terdaftar sebelumnya' 
            });
        }
    }
    
    if (teks.startsWith('!hapus') && pengirim.endsWith('@g.us')) {
        if (daftarGrup.has(pengirim)) {
            daftarGrup.delete(pengirim);
            simpanGrup();
            await sock.sendMessage(pengirim, { 
                text: '✅ Grup berhasil dihapus dari daftar notifikasi' 
            });
        } else {
            await sock.sendMessage(pengirim, { 
                text: '⚠️ Grup tidak terdaftar dalam daftar notifikasi' 
            });
        }
    }

    if (teks.startsWith('!daftar')) {
        const grup = [...daftarGrup];
        const pesan = grup.length > 0 ? 
            'Daftar grup yang menerima notifikasi:\n' + grup.join('\n') :
            'Belum ada grup yang terdaftar';
        await sock.sendMessage(pengirim, { text: pesan });
    }
}

async function hubungkanWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('sesi_whatsapp');
    
    sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: P({ level: 'silent' })
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if(connection === 'close') {
            const harusRekoneksi = (lastDisconnect?.error instanceof Boom)? 
                lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut : true;
            
            if(harusRekoneksi) {
                hubungkanWhatsApp();
            }
        } else if(connection === 'open') {
            console.log('WhatsApp terhubung');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const pesan = messages[0];
        if (pesan.key.fromMe) return;
        await tanganiPesan(pesan);
    });

    sock.ev.on('creds.update', saveCreds);
}

app.post('/webhook', async (req, res) => {
    try {
        let pesanStatus = '';

        pesanStatus = '> Status Server Terkini';

        if (req.body.msg) {
            pesanStatus += `\nKeterangan: ${req.body.msg}`;
        }

        for (const idGrup of daftarGrup) {
            try {
                await sock.sendMessage(idGrup, { text: pesanStatus });
            } catch (error) {
                console.error(`Gagal mengirim pesan ke grup ${idGrup}:`, error);
            }
        }
        
        res.status(200).json({
            status: true,
            pesan: 'Notifikasi terkirim'
        });
    } catch (error) {
        console.error('Kesalahan:', error);
        res.status(500).json({
            status: false,
            pesan: 'Terjadi kesalahan: ' + error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`);
});

hubungkanWhatsApp();
