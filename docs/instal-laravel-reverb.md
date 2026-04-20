# Install Laravel Reverb (Realtime)

## Langkah 1 :  Install & Setup Realtime (Laravel Reverb)

```bash 
php artisan install:broadcasting
```

Pilih `Reverb` saat muncul pilihan.

![Deskripsi Gambar](/images/laravel-reverb-1.png)

![Deskripsi Gambar](/images/laravel-reverb-2.png)


### Jalankan Server Reverb:
Di terminal baru, jalankan agar koneksi WebSocket aktif:
```bash
php artisan reverb:start
```

## Langkah 2 : Membuat Event Broadcasting
Event ini yang akan "berteriak" ke browser setiap ada data masuk dari NodeMCU.
Di terminal jalankan perintah :
```bash
php artisan make:event DeviceSensorUpdated
```

Buka `app/Events/DeviceSensorUpdated.php` dan sesuaikan:

```php
<?php

namespace App\Events;

use App\Models\IotDevice;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeviceSensorUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $device;

    public function __construct(IotDevice $device)
    {
        // Membawa data model perangkat yang sudah diupdate
        $this->device = $device;
    }

    public function broadcastOn(): array
    {
        // Channel unik berdasarkan ID perangkat (ULID)
        return [
            new Channel('device.' . $this->device->id),
        ];
    }

    // Tambahkan ini di dalam class DeviceSensorUpdated
    public function broadcastAs(): string
    {
        return 'sensor.updated';
    }
}



```


### Langkah 3 : Membuat API Controller (Endpoint NodeMCU)
Buat controller `DeviceApiController.php` dengan menjalankan perintah
```bash
php artisan make:controller Api\DeviceApiController
```

buka file `app/Http/Controllers/Api/DeviceApiController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Events\DeviceSensorUpdated;
use App\Http\Controllers\Controller;
use App\Models\IotDevice;
use Illuminate\Http\Request;

class DeviceApiController extends Controller
{
    public function update(Request $request)
    {
        // Cari perangkat berdasarkan id (ULID)
        $device = IotDevice::findOrFail($request->id);

        // Update data di MySQL (Menimpa data lama)
        $device->update([
            'temperature' => $request->temp,
            'humidity'  => $request->hum,
            'updated_at' => now(),
        ]);

        // Kirim sinyal Realtime
        broadcast(new DeviceSensorUpdated($device));

        return response()->json(['status' => 'Data Updated!']);
    }
}

```

lalu buat route khusus api (`routes/api.php`) yang nantinya akan di hit oleh NodeMCU untuk mengirim data via HTTP POST. Jika menggunakan laravel 13 file tersebut tidak akan otomatis munculnya, anda perlu menginstalnya dengan menjalankan perintah di bawah ini
```bash 
php artisan install:api
``` 
lalu jika muncul pertanyaan `One new database migration has been published. Would you like to run all pending database migrations? (yes/no) [yes]:` silahkan ketik `yes` lalu enter. itu akan secara otomatis menjalankan migration dan memunculkan file `routes/api.php`

lalu pada file `api.php`, tambahkan kode seperti dibawah ini :

```php

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DeviceApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/update-sensor', [DeviceApiController::class, 'update']);


```


![Deskripsi Gambar](/images/laravel-reverb-3.png)

kemudian pada file `bootstrap/app.php`, tambahkan kode seperti dibawah ini :
`api: __DIR__.'/../routes/api.php',` sehingga menjadi seperti ini :


```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        channels: __DIR__.'/../routes/channels.php',
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // <--- Pastikan baris ini ada
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

```


dan terakhir modfikasi juga file `app.js` yang terletak pada folder `resources/js` menjadi :

```php
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */

import './echo'; // tambahkan ini



```



## Ringkasan Langkah Jika File Routes Tidak Ada:
1. Jalankan `php artisan install:api` -> Muncul `routes/api.php`.
2. Jalankan `php artisan install:broadcasting` -> Muncul `routes/channels.php` dan mengaktifkan Reverb.
3. Pastikan di file `.env`, bagian `BROADCAST_CONNECTION` berubah menjadi `reverb`.

### Tips Tambahan:
Jika Anda mencoba mengakses API dari NodeMCU dan terkena error CSRF atau 401 Unauthorized, pastikan di Laravel 11 Anda memeriksa file `bootstrap/app.php`. Namun, secara default, route di `api.php` sudah dikecualikan dari pengecekan CSRF.