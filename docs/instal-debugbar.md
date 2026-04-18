# Instalasi Laravel Debugbar
Laravel Debugbar (oleh Barryvdh) menyediakan bilah alat di bagian bawah browser yang menampilkan informasi debug secara mendalam tanpa harus mengecek log manual.

## Langkah 1: Instalasi via Composer
Karena paket ini hanya dibutuhkan saat tahap pengembangan, kita akan menginstalnya sebagai --dev dependency. Jalankan perintah berikut di terminal:

`composer require barryvdh/laravel-debugbar --dev`

![Deskripsi Gambar](/images/debugbar-0.png)


## Langkah 2: Konfigurasi Environment
Secara default, Laravel Debugbar akan otomatis aktif jika variabel APP_DEBUG di file `.env` Anda bernilai true.

Pastikan file `.env` Anda memiliki pengaturan berikut:
![Deskripsi Gambar](/images/debugbar-1.png)


Peringatan Keamanan: Jangan pernah mengaktifkan APP_DEBUG=true di lingkungan production, karena Debugbar dapat membocorkan data sensitif seperti kredensial database dan variabel environment.

## Langkah 3: Publish Konfigurasi (Opsional)
Jika Anda ingin mengubah pengaturan default (seperti menyembunyikan tab tertentu atau mengatur hak akses), Anda bisa mempublikasikan file konfigurasi ke folder config/ Anda:

`php artisan vendor:publish --provider="Barryvdh\Debugbar\ServiceProvider"`

![Deskripsi Gambar](/images/debugbar-2.png)



## Langkah 4: Cara Penggunaan
Setelah instalasi selesai, cukup buka aplikasi Laravel Anda di browser. dengan cara menjalankan perintah
```bash
php artisan serv
```
dan diterminal lain
```bash
npm run dev
```

 Anda akan melihat bilah alat (toolbar) kecil di bagian bawah layar.

![Deskripsi Gambar](/images/debugbar-3.png)



Fitur Utama yang Sering Digunakan:

1. Messages: Tempat untuk melakukan Debugbar::info($data) (mirip console.log).
2. Timeline: Melihat berapa lama waktu yang dibutuhkan aplikasi untuk memuat halaman.
3. Queries: Menampilkan semua query SQL yang dijalankan, termasuk masalah N+1 query.
4. Models: Menunjukkan model apa saja yang sedang dimuat di halaman tersebut.
5. Gate: Memeriksa izin (permission) yang sedang aktif untuk user tersebut.