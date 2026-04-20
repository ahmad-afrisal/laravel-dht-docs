# Panduan Menjalankan Sistem Monitoring IoT (Laravel + Reverb + ESP32)
Agar sistem berjalan dengan sempurna, pastikan komputer(laravel) dan NodeMcu berada dalam **jaringan (WiFi) yang sama**. setlah itu kamu perlu membuka **tiga terminal** secara bersamaan. Berikut adalah fungsinya masing-masing:

## 1. Terminal 1: Backend & API (Laravel Server)
```bash
php artisan serve --host=0.0.0.0

```

- **Fungsinya**: Menjalankan server web Laravel.
- **Mengapa** `--host=0.0.0.0`? Ini sangat penting agar ESP32 kamu bisa mengirim data melalui jaringan Wi-Fi ke laptop/server kamu. Dengan ini, server tidak hanya bisa diakses via localhost, tapi juga melalui IP lokal laptop kamu (misal: `192.168.1.x`).
- **Hasilnya**: Sistem siap menerima kiriman data suhu dan kelembapan dari DHT22 melalui endpoint API.

## 2. Terminal 2: WebSocket Server (Laravel Reverb)

```bash
php artisan reverb:start --debug

```

- **Fungsinya**: Menjalankan server WebSocket.
- **Mengapa pakai** `--debug`? Agar kamu bisa melihat log aktivitas secara real-time. Setiap kali ada data masuk dari ESP32, Reverb akan "menyiarkan" (broadcast) data tersebut ke browser tanpa kamu perlu me-refresh halaman.
- **Hasilnya**: Jalur komunikasi cepat antara server dan dashboard terbuka.


## 3. Terminal 3: Frontend Assets (Vite)

```bash
npm run dev
```

- **Fungsinya**: Menjalankan Vite untuk mengompilasi JavaScript dan CSS (termasuk Tailwind CSS dan Vue.js/Inertia.js).
- **Peran Penting**: Perintah ini mengaktifkan Laravel Echo. Tanpa ini, browser kamu tidak akan bisa "mendengarkan" sinyal data yang dikirim oleh Reverb di Terminal 2.
- **Hasilnya**: Dashboard menjadi reaktif dan grafik atau angka sensor akan berubah otomatis.


## Alur Kerja Sistem (User Journey)
berikut adalah alur penggunaannya:

### 1. Aktivitas Hardware (Serial Monitor):
Di PlatformIO, pastikan ESP32 sudah terhubung ke Wi-Fi dan mulai mengirim data JSON berisi pembacaan sensor DHT22 ke alamat IP laptop kamu.
![Deskripsi Gambar](/images/system-testing-0.png)

### 2. Autentikasi (Halaman Login):
User harus masuk terlebih dahulu. Ini penting agar sistem tahu perangkat IoT mana yang harus ditampilkan berdasarkan ID pengguna yang sudah terdaftar.
![Deskripsi Gambar](/images/system-testing-1.png)

### 3. Daftar Perangkat (My Devices):
Setelah login, kamu akan melihat daftar perangkat dalam bentuk Cards. Setiap kartu mewakili satu modul ESP32 yang kamu pasang di area pemantauan.
![Deskripsi Gambar](/images/system-testing-2.png)


### 4. Monitoring Real-time (Detail Page):
Saat kartu diklik, kamu akan masuk ke halaman detail. Di sinilah "sihir" dari Reverb dan Echo bekerja. Kamu akan melihat grafik atau angka suhu/kelembapan yang bergerak secara otomatis setiap kali sensor di lapangan mengirimkan data baru.
![Deskripsi Gambar](/images/system-testing-3.png)






