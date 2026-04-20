# Install Breeze

Install Laravel Breeze melalui composer, buka terminal lalu jalankan perintah berikut

```bash
 composer require laravel/breeze --dev 
 ```


![Deskripsi Gambar](/images/1.png)

Selanjutnya, Kamu harus menjalankan php artisan breeze:install lalu kamu akan melihat stack yang umum digunakan yang bisa kamu pilih sesuai kebutuhan,

```bash 
php artisan breeze:install 
```

Kemudian akan muncul beberapa pertanyaan, Silahkan diikuti seperti ini,


![Deskripsi Gambar](/images/1.1.png)

![Deskripsi Gambar](/images/2.png)

![Deskripsi Gambar](/images/3.png)

## Error yang mungkin terjadi

![Deskripsi Gambar](/images/breeze-error.jpeg)

Ketika teman-teman mendapati error seperti di atas, tidak perlu khawatir, anda hanya perlu membuat file `bootstrap.js` di dalam folder `resources/js` dengan isi file tersebut seperti ini :

```php
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


```

![Deskripsi Gambar](/images/error-breeze-1.png)

