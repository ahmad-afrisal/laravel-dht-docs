# Menampilkan Perangkat Milik User
Pada tahap ini, kita akan membuat halaman khusus bagi pengguna (dengan role user) agar mereka dapat melihat daftar perangkat IoT yang mereka miliki.

## Langkah 1: Buat Controller
Buatlah controller baru untuk menangani logika tampilan perangkat di sisi pengguna.

`php artisan make:controller MyIotDeviceController`

### Modifikasi Controller
Pastikan kita hanya mengambil data perangkat yang `user_id`-nya cocok dengan pengguna yang sedang login.

```php
<?php

namespace App\Http\Controllers;

use App\Models\IotDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MyIotDeviceController extends Controller
{
    /**
     * Menampilkan daftar perangkat milik user yang sedang login.
     */
    public function index()
    {
        // Mengambil hanya ID perangkat milik user aktif
        $myDevices = IotDevice::where('user_id', Auth::id())
            ->latest()
            ->pluck('id');

        return view('user.my-device.index', compact('myDevices'));
    }

    /**
     * Menampilkan detail perangkat tertentu.
     */
    public function show(IotDevice $my_iot_device)
    {
        // Proteksi: Pastikan perangkat ini memang milik user yang login
        if ($my_iot_device->user_id !== Auth::id()) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        return view('user.my-device.show', compact('my_iot_device'));
    }
}




```



## Langkah 2: Konfigurasi Routing
Daftarkan route di `routes/web.php`. Gunakan middleware `auth` dan proteksi tambahan dengan role `user`.


```php

    use App\Http\Controllers\MyIotDeviceController;

   Route::middleware(['auth'])->group(function () {
    // Route untuk pengguna melihat perangkatnya sendiri
    Route::resource('my-iot-devices', MyIotDeviceController::class)
        ->only(['index', 'show'])
        ->middleware('role:user');
});

```

### Tambahkan Link di Navigasi
Update file `resources/views/layouts/navigation.blade.php`:

```php
    @role('user')
        <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
            <x-nav-link :href="route('my-iot-devices.index')" :active="request()->routeIs('my-iot-devices*')">
                {{ __('Perangkat Saya') }}
            </x-nav-link>
        </div>

    @endrole

```
## Langkah 3: Membuat Tampilan (View)
Gunakan grid sistem dari Tailwind CSS untuk membuat tampilan kartu yang responsif. Jangan lupa untuk menyiapkan gambar placeholder jika perangkat belum memiliki foto unik.

1. Persiapan Gambar
Unduh gambar placeholder melalui link berikut  https://drive.google.com/file/d/1UbFndQHBpU-kQBioTC7smRkbIZbob0g8/view?usp=sharing  dan simpan di `public/assets/images/img-card.png`. Gambar ini akan muncul jika gambar spesifik perangkat tidak ditemukan.
![Deskripsi Gambar](/images/crud-my-device-1.png)

2. File View Index
Buat file di `resources/views/user/my-device/index.blade.php`:


```php
<x-app-layout>


    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Perangkat') }}
        </h2>
    </x-slot>

    <x-slot name="script">

    </x-slot>
    <main class="flex-1 overflow-y-auto">

        {{-- @include('components.header') --}}

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <!-- Breadcrumb -->
                <nav class="flex items-center text-sm text-gray-600 space-x-2 mb-7">
                    <a href="{{ route('dashboard') }}" class="flex items-center hover:text-green-600">
                        <i data-lucide="home" class="w-4 h-4 mr-1"></i> Home
                    </a>
                    <span>›</span>
                    <span class="text-gray-500">Perangkat Saya</span>
                </nav>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    @foreach ($myDevices as $id)
                        <a href="{{ route('my-iot-devices.show', $id) }}"
                            class="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">

                            <div class="relative h-44 bg-gray-100">
                                <img src="{{ asset('images/devices/' . $id . '.png') }}"
                                    onerror="this.src='{{ asset('assets/images/img-card.png') }}'"
                                    alt="Device {{ $id }}"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">

                                <div class="absolute top-3 left-3">
                                    <span
                                        class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-sm rounded">
                                        IoT Device
                                    </span>
                                </div>
                            </div>

                            <div class="p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Device
                                        ID</span>
                                    <i data-lucide="cpu" class="w-4 h-4 text-green-500"></i>
                                </div>

                                <h3 class="text-sm font-mono font-bold text-gray-800 break-all leading-relaxed">
                                    {{ $id }}
                                </h3>

                                <div
                                    class="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-green-600 text-sm font-bold">
                                    <span>Lihat Kontrol</span>
                                    <i data-lucide="arrow-right"
                                        class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>

            </div>
        </div>
    </main>

</x-app-layout>


```

### Tips Pengembangan:
1. Keamanan: Pada method show, sangat penting untuk mengecek user_id. Jika tidak, user bisa menebak ID perangkat orang lain di URL dan melihat datanya.
2. UI/UX: Penggunaan @forelse sangat disarankan daripada @foreach agar kamu bisa menampilkan pesan "Data Kosong" jika user belum memiliki perangkat sama sekali.




