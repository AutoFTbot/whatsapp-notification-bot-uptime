# WhatsApp Bot

## Deskripsi
WhatsApp Bot ini adalah aplikasi yang dibangun menggunakan Node.js dan Baileys untuk mengelola grup WhatsApp. Bot ini memungkinkan admin untuk menambahkan atau menghapus grup dari daftar notifikasi dan mengirim pesan ke grup yang terdaftar.

## Fitur
- Menambahkan grup ke daftar notifikasi dengan perintah `!tambah`.
- Menghapus grup dari daftar notifikasi dengan perintah `!hapus`.
- Menampilkan daftar grup yang terdaftar dengan perintah `!daftar`.
- Mengirim notifikasi ke semua grup yang terdaftar melalui webhook.

## Prerequisites
Sebelum menjalankan proyek ini, pastikan Anda memiliki:
- Node.js terinstal di sistem Anda.
- NPM (Node Package Manager) untuk mengelola dependensi.

## Instalasi
1. Clone repositori ini ke mesin lokal Anda:
   ```bash
   git clone https://github.com/AutoFTbot/whatsapp-notification-bot-uptime.git
   cd whatsapp-notification-bot-uptime
   ```

2. Instal dependensi yang diperlukan:
   ```bash
   npm install
   ```

3. Buat file `grup.json` di direktori yang sama untuk menyimpan daftar grup (atau biarkan bot membuatnya secara otomatis).

4. Jalankan aplikasi:
   ```bash
   node uptime/whatsapp.js
   ```

## Penggunaan
- Untuk menambahkan grup, kirim pesan `!tambah` di grup WhatsApp.
- Untuk menghapus grup, kirim pesan `!hapus` di grup WhatsApp.
- Untuk melihat daftar grup yang terdaftar, kirim pesan `!daftar`.

## Kontribusi
Jika Anda ingin berkontribusi pada proyek ini, silakan buat fork repositori ini dan kirim pull request dengan perubahan Anda.

## Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## Kontak
Jika Anda memiliki pertanyaan atau saran, silakan hubungi saya di Telegram: @AutoFtbot
