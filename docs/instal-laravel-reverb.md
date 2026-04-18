#

## Langkah 1 :  Install & Setup Realtime (Laravel Reverb)

`php artisan install:broadcasting`

Pilih `Reverb` saat muncul pilihan.

### Jalankan Server Reverb:
Di terminal baru, jalankan agar koneksi WebSocket aktif:
`php artisan reverb:start`

## Langkah 2 : Membuat Event Broadcasting
Event ini yang akan "berteriak" ke browser setiap ada data masuk dari NodeMCU.
Di terminal jalankan perintah :
`php artisan make:event DeviceSensorUpdated`

Buka `app/Events/DeviceSensorUpdated.php` dan sesuaikan:

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeviceSensorUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $device;

    public function __construct($device)
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
}


```


### Langkah 3 : Membuat API Controller (Endpoint NodeMCU)
Buat controller `DeviceApiController.php` dengan menjalankan perintah
`php artisan make:controller Api\DeviceApiController`

buka file `app/Http/Controllers/Api/DeviceApiController.php`

```php
public function update(Request $request)
{
    // Cari perangkat berdasarkan id (ULID)
    $device = IotDevice::findOrFail($request->id);

    // Update data di MySQL (Menimpa data lama)
    $device->update([
        'last_temp' => $request->temp,
        'last_hum'  => $request->hum,
        'last_seen' => now(),
    ]);

    // Kirim sinyal Realtime
    broadcast(new DeviceSensorUpdated($device));

    return response()->json(['status' => 'Data Updated!']);
}
```

lalu buat route. NodeMCU akan mengirim data ke sini via HTTP POST.
Route (`routes/api.php`):

jika menggunakan laravel 13 file tersebut tidak akan otomatis munculnya, anda perlu menginstalnya dengan menjalankan perintah `php artisan install:api` di terminal. lalu jika muncul pertanyaan `One new database migration has been published. Would you like to run all pending database migrations? (yes/no) [yes]:` silahkan ketik `yes` lalu enter. itu akan secara otomatis menjalankan migration.





## Ringkasan Langkah Jika File Routes Tidak Ada:
1. Jalankan `php artisan install:api` -> Muncul `routes/api.php`.
2. Jalankan `php artisan install:broadcasting` -> Muncul `routes/channels.php` dan mengaktifkan Reverb.
3. Pastikan di file `.env`, bagian `BROADCAST_CONNECTION` berubah menjadi `reverb`.

### Tips Tambahan:
Jika Anda mencoba mengakses API dari NodeMCU dan terkena error CSRF atau 401 Unauthorized, pastikan di Laravel 11 Anda memeriksa file `bootstrap/app.php`. Namun, secara default, route di `api.php` sudah dikecualikan dari pengecekan CSRF.