# Tutorial Cek IP di Windows Menggunakan CMD
Alamat IP adalah identitas perangkat Anda dalam sebuah jaringan. Umumnya ada dua jenis IP yang perlu diketahui:

1. **IP Lokal (Private IP)**: Alamat perangkat di dalam jaringan Wi-Fi rumah atau kantor.
2. **IP Publik**: Alamat yang dikenali oleh internet secara global.
Berikut adalah tutorial langkah-demi-langkah cara mengecek alamat IP di Windows menggunakan Command Prompt (CMD).

## Langkah 1: Membuka Command Prompt (CMD)

Ada dua cara cepat untuk membuka CMD:
1. **Cara A**: Tekan tombol Windows + R di keyboard, ketik cmd, lalu tekan Enter.
2. **Cara B**: Klik tombol Start, cari "cmd" atau "Command Prompt", lalu klik aplikasinya.


## Langkah 2: Menjalankan Perintah ipconfig
Setelah jendela hitam muncul, ketik perintah di bawah ini dan tekan Enter:

```dos 
ipconfig 
```

## Langkah 3: Membaca Hasilnya
Scroll sedikit ke atas dan cari bagian koneksi yang sedang Anda gunakan:
1. Jika memakai Wi-Fi, cari bagian **"Wireless LAN adapter Wi-Fi".**
2. Jika memakai kabel, cari bagian **"Ethernet adapter".**

Fokus pada baris berikut:
1. **IPv4 Address**: Inilah alamat IP lokal perangkat Anda (Contoh: 192.168.1.10).
2. **Default Gateway**: Ini adalah alamat IP router atau modem Anda (Contoh: 192.168.1.1).

![Deskripsi Gambar](/images/check-ip-1.png)



### Cara Cek IP Publik Melalui CMD
Perintah ipconfig hanya menampilkan IP internal. Jika Anda ingin tahu IP yang "dilihat" oleh dunia internet tanpa membuka browser, ketik perintah ini di CMD:

```dos 
curl ifconfig.me
```

(Atau gunakan `curl icanhazip.com` jika perintah di atas tidak muncul).

### Tabel Ringkasan Perintah CMD

| Perintah | Fungsi |
| :--- | :--- |
| `ipconfig` | Menampilkan informasi dasar IP Lokal. |
| `ipconfig /all` | Menampilkan informasi detail (termasuk DNS dan MAC Address). |
| `curl ifconfig.me` | Menampilkan IP Publik Anda secara langsung. | 
| `cls` | Menghapus semua teks di layar CMD agar bersih kembali. |


### Tips Tambahan:
Untuk menyalin teks di CMD, cukup blok tulisan yang diinginkan dengan mouse, lalu tekan Klik Kanan (ini otomatis menyalin). Setelah itu, Anda bisa langsung menempelnya (Paste) di Notepad atau chat.