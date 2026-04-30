Sumber : https://chatgpt.com/share/688f5a25-7310-800f-b6e5-435fff11b056

![Deskripsi Gambar](/images/types-of-software-testing.jpeg)


```text
Software Testing
├── Static Testing
│   ├── Review
│   ├── Walkthrough
│   └── Inspection
│
└── Dynamic Testing
    ├── Functional Testing
    │   ├── White Box Testing
    │   │   ├── Unit Testing
    │   │   ├── Code/Statement/Path Testing
    │   │   └── Branch Coverage
    │   │
    │   └── Black Box Testing
    │       ├── Integration Testing
    │       ├── Smoke / Sanity Testing
    │       ├── Functionality Testing
    │       ├── Regression Testing
    │       ├── System Testing
    │       └── User Acceptance Testing
    │
    └── Non-Functional Testing
        ├── Performance Testing
        │   ├── Load Testing
        │   ├── Stress Testing
        │   ├── Spike Testing
        │   ├── Endurance (Soak) Testing
        │   └── Scalability Testing
        │
        ├── Usability Testing
        ├── Security Testing
        ├── Compatibility Testing
        ├── Recovery Testing
        └── Cookies Testing
```

# Software Testing
Merupakan proses untuk mengevaluasi dan memastikan bahwa perangkat lunak bekerja sesuai harapan.


## A. Static Testing (Pengujian Statis)
Static Testing dilakukan tanpa menjalankan kode, berfokus pada Review, Walkhthrough dan inspection yang bertujuan untuk mencari kesalahn pada dokumen desain, requirment dan kode sebelum dijalankan.

- Review: Pemeriksaan dokumen (misalnya kode atau desain) oleh rekan tim.

 Contoh: Seorang developer meminta rekannya mengecek logika dari pseudocode sebelum menulis kode.

- Walkthrough: Penjelasan oleh penulis dokumen kepada tim untuk mendapatkan masukan.

 Contoh: Seorang analis sistem menjelaskan flowchart ke tim untuk diskusi.

- Inspection: Pemeriksaan formal dan terstruktur terhadap dokumen.

Contoh: Tim QA memeriksa dokumen requirement untuk mencari ketidaksesuaian.

## B. Dynamic Testing (Pengujian Dinamis)

### 1. Functional Testing

### 1.1 White Box Testing
### 1.1.1 Unit Testing
Apa itu Unit Testing?

Unit testing adalah proses pengujian bagian terkecil dari kode program — biasanya satu fungsi atau metode — untuk memastikan bahwa bagian tersebut berjalan dengan benar dan sesuai harapan.

Unit testing dilakukan oleh developer selama proses pengembangan, biasanya menggunakan framework seperti Jest (JavaScript), PHPUnit (PHP), JUnit (Java), dll.

Teknik-Teknik Pengujian dalam Unit Testing

Saat melakukan unit testing, sebenarnya kita juga dapat mengevaluasi cakupan pengujian menggunakan beberapa teknik:

1. Code Coverage

**Code coverage** adalah ukuran seberapa banyak kode sumber yang telah diuji oleh unit test. Semakin tinggi cakupannya, semakin besar kemungkinan bug bisa ditemukan lebih awal.

> Contoh: Jika 90% code coverage, berarti 90% baris kode telah dieksekusi saat testing.

2. Statement Testing

**Statement testing** memastikan bahwa setiap baris kode (*statement*) dalam program dieksekusi minimal satu kali selama pengujian.

> Tujuannya: Menjamin bahwa semua baris kode tidak ada yang “terlewat” atau tidak digunakan.
3. Branch Testing (Branch Coverage)

**Branch testing** berfokus pada jalur percabangan (seperti `if`, `else`, `switch`) dalam program. Setiap kemungkinan kondisi harus diuji, baik kondisi `true` maupun `false`.

> Tujuannya: Memastikan setiap kemungkinan jalur logika telah dites.

4. Path Testing

**Path testing** menguji semua jalur eksekusi logis yang mungkin terjadi dalam program dari awal hingga akhir.

> Ini adalah teknik yang paling menyeluruh, karena mencoba menelusuri kombinasi jalur yang berbeda dalam kode.

Kesimpulan

Saat developer menulis unit test, sebenarnya mereka sudah melakukan pendekatan terhadap **statement testing**, **branch testing**, dan bahkan **path testing**. Tools seperti code coverage membantu melihat sejauh mana testing tersebut menjangkau seluruh kode program.

Semakin lengkap dan luas cakupan pengujian, maka semakin tinggi kepercayaan terhadap kualitas dan kestabilan kode tersebut.


### 1.2 Black Box Testing

### 1.2.1 Integration Testing
### 1.2.2 Smoke / Sanity Testing
### 1.2.3 Functionality Testing
### 1.2.4 Regression Testing
### 1.2.5 System Testing
### 1.2.6 User Acceptance Testing


### 2. Non-Functional Testing
Mengukur aspek kinerja, keamanan, dan pengalaman pengguna.


### 2.1 Performance Testing
Performance testing adalah teknik pengujian non fungsional yang dilakukan untuk mengetahui mengetahui seberapa responsif dan stabil suatu sistem saat diberi beban kerja tertentu.

Tujuan dari performance testing bukan untuk mencari bug, tapi untuk mengidentifikasi performa dan sistem

Apa jadinya kalau website atau aplikasi lemot ?
- High bounce rate : user malas nunggu, semakin tinggi bounce rate, semakin jelek 
- Bussiness Impact : Setiap 1 detik delay bisa turunin conversation rate
- Wasted Budget : Sudah bayar ads, pagenya ngadat
- Bottleneck : fitur baru tidak maksimal

Manfaat Performance Testing :
- Validasi fitur dalam beban nyata : fitur tetap jalan lancar saat banyak user akses
- Ukur kecepatan dan stabilitas aplikasi : seberapa cepat dan stabil suatu sistem
- Bikin Pengguna Happy : Aplikasi yang responsif membuat user betah dan bikin balik lagi
- Optimasi berbasis data : Gak asal nebak, optimasi berdasarkan data
- Temukan masalah tersembunyi : Bottleneck, bug performa, hingga konfigurasi server

Jenis-jenis performance test :
- Load testing adalah proses menguji performa sistem dengan memberikan beban sesuai kapasitas normal yang diharapkan. Tujuannya adalah untuk mengetahui bagaimana aplikasi merespons saat digunakan oleh sejumlah pengguna atau permintaan tertentu dalam situasi biasa. Misalnya, menguji apakah sistem tetap responsif ketika 500 pengguna mengaksesnya secara bersamaan. Load testing membantu mengidentifikasi bottleneck dan memastikan sistem berjalan optimal pada beban yang diperkirakan terjadi sehari-hari.
- Stress Testing : Stress testing dilakukan untuk mengukur batas maksimum performa sistem dengan memberikan beban yang melebihi kapasitas normal. Tujuannya bukan hanya melihat kapan sistem gagal, tetapi bagaimana sistem menangani kegagalan tersebut, misalnya apakah tetap memberikan notifikasi yang ramah pengguna atau crash secara total. Contohnya, jika sistem biasanya menampung 1.000 pengguna, maka stress testing dapat mendorong hingga 5.000 pengguna untuk melihat sejauh mana sistem bisa bertahan sebelum tidak mampu merespons.
- Spike Testing : Spike testing adalah pengujian performa sistem dengan memberikan beban secara tiba-tiba dalam waktu singkat, lalu kembali ke beban normal. Tujuan dari spike testing adalah melihat seberapa cepat sistem merespons lonjakan trafik yang tidak terduga, seperti saat promosi besar-besaran atau viral traffic. Misalnya, dalam waktu 5 menit tiba-tiba pengguna melonjak dari 100 ke 5.000 orang, lalu turun kembali. Pengujian ini menilai elastisitas dan stabilitas sistem dalam menghadapi perubahan ekstrem dalam waktu singkat.
- Soak Testing Soak testing atau endurance testing menguji stabilitas sistem dengan memberikan beban normal dalam jangka waktu lama. Tujuannya adalah untuk melihat adanya kebocoran memori, penurunan performa secara bertahap, atau masalah tersembunyi lainnya yang hanya muncul dalam operasi jangka panjang. Misalnya, menjalankan aplikasi dengan 1.000 pengguna selama 24 jam non-stop dan mengamati apakah terjadi penurunan kecepatan, crash, atau masalah koneksi.
- Scalability Testing Scalability testing adalah pengujian untuk menilai kemampuan sistem dalam menangani peningkatan beban dengan cara menambah sumber daya. Fokus utama dari pengujian ini adalah melihat apakah sistem tetap stabil dan responsif saat skala diperbesar, baik secara vertikal (menambah CPU/RAM pada server) maupun horizontal (menambah jumlah server atau node). Misalnya, jika sistem awalnya mampu melayani 1.000 pengguna dengan 2 core CPU, maka scalability testing mengamati apakah dengan 4 core CPU sistem bisa melayani 2.000 pengguna secara proporsional. Pengujian ini sangat penting untuk sistem yang diproyeksikan akan tumbuh secara signifikan.

### 2.2 Usability Testing
### 2.3 Security Testing
### 2.4 Compatibility Testing
### 2.5 Recovery Testing
### 2.6 Cookies Testing


# Level of Testing

![Deskripsi Gambar](/images/Software-Testing-Levels-2.webp)


Penjelasan Singkat: Mengapa System Testing sejajar dengan jenis testing lain?
System Testing adalah level pengujian, bukan jenis pengujian seperti load, stress, atau unit testing.

Penjabaran Sederhana:
Ada beberapa level pengujian dalam siklus pengembangan perangkat lunak, dan salah satu level itu adalah:

![Deskripsi Gambar](/images/Levels-of-Software-Testing-1.webp)

- Unit Testing – menguji potongan kecil kode (biasanya fungsi/method).
- Integration Testing – menguji antar bagian/koneksi antar modul.
- System Testing – menguji seluruh sistem sebagai satu kesatuan.
- Acceptance Testing – pengujian oleh user sebelum aplikasi dirilis.

Nah, di dalam System Testing, kita bisa melakukan berbagai jenis pengujian lain seperti:
- Functional Testing
- Non-Functional Testing seperti: Load Testing, Stress Testing, Security Testing ,Usability Testing danPerformance Testing

Jadi, System Testing adalah fase/level, bukan kategori seperti Performance Testing. Di dalam system testing, kita bisa melakukan berbagai jenis pengujian tergantung tujuan pengujian.

Analogi
Bayangkan kamu sedang menguji mobil yang baru dibuat:
- Unit testing → kamu uji satu-satu: roda, rem, setir.
- Integration testing → kamu pasang rem ke roda, dan coba apakah bisa bekerja bareng.
- System testing → kamu uji mobil secara keseluruhan: apakah bisa jalan dari A ke B, bisa ngerem, lampu nyala, dsb.
- Di dalam System Testing ini, kamu juga bisa melakukan:
1. Uji performa (berapa kecepatan maksimalnya?)
2. Uji daya tahan (apa yang terjadi kalau dipakai 10 jam nonstop?)
3. Uji beban (bisa nggak bawa 5 orang + 200kg barang?)



Cara melakukan System Testing melibatkan pendekatan menyeluruh untuk menguji fungsi dan performa seluruh sistem sebagai satu kesatuan. Berikut adalah langkah-langkah umumnya:

1. Persiapkan Environment
- Siapkan lingkungan testing yang menyerupai produksi (mirip dengan lingkungan aslinya).
- Install sistem lengkap: database, backend, frontend, dan service lainnya.

2. Pahami Spesifikasi Sistem
- Baca dokumen kebutuhan fungsional (FSD) dan non-fungsional (NFR).
- Tujuannya agar tahu fitur apa saja yang harus diuji dan bagaimana sistem seharusnya berperilaku.

3. Buat Test Case dan Test Scenario
- Test case: langkah-langkah detail untuk menguji satu fungsi.
- Test scenario: skenario pengguna dalam menjalankan sistem.

Contoh:
Test Case: Login → masukkan username & password → klik login → dashboard muncul.

4. Lakukan Functional Testing
- Uji semua fitur: login, register, transaksi, logout, dsb.
- Tujuannya memastikan setiap fungsi bekerja sesuai spesifikasi.

5. Lakukan Non-Functional Testing
Misalnya:
- Performance Testing → sistem bisa menangani 1000 user?
- Load Testing → apakah sistem stabil di bawah beban?
- Security Testing → apakah sistem aman dari akses ilegal?

6. Gunakan Black Box Testing
System testing biasanya menggunakan metode black box, artinya:
- Pengujian dilakukan tanpa melihat isi kode.
- Fokus hanya pada input dan output sistem.

7. Catat & Evaluasi Hasil
- Tandai test case yang lolos atau gagal.
- Dokumentasikan error atau bug yang ditemukan.
- Lakukan bug reporting ke developer.

8. Regression Testing (opsional)
Setelah bug diperbaiki, lakukan testing ulang untuk memastikan fitur lainnya tetap normal.

📌 Contoh Tools yang Biasa Digunakan
Manual: Excel, Google Sheet, TestRail

Otomatisasi: Selenium, JMeter, Postman, Katalon, Cypress

✍️ Kesimpulan Sederhana:
System Testing adalah tahap pengujian seluruh sistem, mencakup semua fungsi dan performa, dari awal sampai akhir — seolah-olah kamu adalah user sebenarnya yang mencoba sistem lengkapnya.



✅ Template Test Case – System Testing
| No. | Modul/Fitur     | Test Scenario                          | Langkah Pengujian                                                               | Data Uji                                     | Expected Result                          | Status    | Catatan               |
| --- | --------------- | -------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------- | --------- | --------------------- |
| 1   | Login           | Login berhasil dengan kredensial benar | 1. Buka halaman login<br>2. Masukkan username & password valid<br>3. Klik login | user: admin<br>pass: 123456                  | Redirect ke dashboard                    | Pass/Fail | -                     |
| 2   | Login           | Gagal login dengan password salah      | Masukkan username benar & password salah                                        | user: admin<br>pass: salah                   | Muncul pesan "Password salah"            |           |                       |
| 3   | Registrasi      | Pengguna baru melakukan pendaftaran    | 1. Buka halaman daftar<br>2. Isi data valid<br>3. Klik daftar                   | email: [test@mail.com](mailto:test@mail.com) | Akun berhasil dibuat, diarahkan ke login |           |                       |
| 4   | Transaksi       | Pengguna melakukan pembelian produk    | 1. Login<br>2. Pilih produk<br>3. Klik beli<br>4. Konfirmasi pembayaran         | produk: A<br>qty: 1                          | Transaksi sukses, muncul halaman struk   |           |                       |
| 5   | Logout          | Pengguna logout dari sistem            | Klik tombol logout di dashboard                                                 | -                                            | Dialihkan ke halaman login               |           |                       |
| 6   | Dashboard Admin | Admin melihat data pengguna            | Login sebagai admin lalu buka halaman user                                      | admin login                                  | Tabel daftar pengguna muncul             |           |                       |
| 7   | Error Handling  | Server down                            | Matikan service backend dan akses sistem                                        | -                                            | Muncul pesan "Server tidak tersedia"     |           | Simulasi dengan dev   |
| 8   | Performa        | Cek kecepatan akses halaman            | Akses dashboard saat data banyak                                                | -                                            | Halaman tetap terbuka di bawah 3 detik   |           | Uji dengan data besar |
| 9   | Keamanan        | Akses halaman admin tanpa login        | Ketik langsung URL dashboard admin tanpa login                                  | -                                            | Dialihkan ke halaman login               |           |                       |


📌 Kapan System Testing Dilakukan?
✅ Secara Umum (Metode Tradisional atau Waterfall):
System Testing dilakukan setelah semua modul selesai dibuat dan diintegrasikan. Jadi:

Semua modul sudah selesai coding-nya.

Sudah dilakukan Unit Testing dan Integration Testing.

Baru dilakukan System Testing untuk mengecek fungsi sistem secara keseluruhan (end-to-end).

Contoh: Setelah fitur login, dashboard, transaksi, dan laporan jadi, maka System Testing dilakukan untuk menguji seluruh alur, misalnya: Login → Beli Produk → Cetak Laporan.

✅ Dalam Metode Agile atau PXP (Personal Extreme Programming):
System Testing dilakukan di setiap iterasi, bukan hanya di akhir proyek.

Karena di PXP:

Tiap iterasi menghasilkan versi mini dari sistem (inkremental).

Versi itu harus bisa diuji secara menyeluruh (meski hanya sebagian fitur).

Maka System Testing dilakukan di setiap akhir iterasi, untuk menguji sistem dalam bentuk saat itu.

Contoh: Jika dalam iterasi 1 hanya login dan dashboard yang selesai, maka System Testing dilakukan untuk:

Login

Navigasi dashboard

Cek keamanan navigasi

| Aspek                | Waterfall/Tradisional       | PXP/Agile                         |
| -------------------- | --------------------------- | --------------------------------- |
| Waktu System Testing | Setelah semua modul selesai | Setiap akhir iterasi              |
| Cakupan              | Seluruh sistem final        | Sebagian sistem yang sudah dibuat |
| Tujuan               | Validasi akhir sistem       | Validasi fungsional per iterasi   |

✅ Kesimpulan
Dalam Personal Extreme Programming, System Testing dilakukan setiap iterasi untuk menguji sistem yang dibangun secara bertahap. Ini memungkinkan deteksi masalah lebih cepat dan lebih ringan dibanding menunggu semua fitur selesai.
