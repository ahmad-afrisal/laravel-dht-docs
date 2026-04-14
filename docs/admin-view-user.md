# Mengelola Data Pengguna (Admin)
Tutorial ini akan membahas cara membuat fitur manajemen pengguna menggunakan Yajra DataTables untuk sisi server-side rendering, serta membatasi akses menu hanya untuk pengguna dengan role `admin`.

## Langkah 1: Membuat Controller Admin
Pertama, buatlah controller khusus di dalam namespace `Admin` untuk menjaga struktur kode tetap rapi.

`$ php artisan make:controller Admin/UserController`

![Deskripsi Gambar](/images/admin-user-1.png)

Buka file `app/Http/Controllers/Admin/UserController.php` dan sesuaikan kodenya. Di sini kita menggunakan AJAX untuk menangani DataTables:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class UserController extends Controller
{
    public function index()
    {
        // Mengecek apakah request datang dari DataTables (AJAX)
        if (request()->ajax()) {
            $query = User::query(); // ambil data  + user

            return DataTables::of($query)

                ->addColumn('action', function ($item) {
                    return '
                    <a href="' . route('users.edit', $item->id) . '" 
                        class="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded shadow-lg">
                        Edit
                    </a>
                    <form class="inline-block" action="' . route('users.destroy', $item->id) . '" method="POST" onsubmit="return confirm(\'Yakin hapus data ini?\')">
                        ' . csrf_field() . method_field('delete') . '
                        <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 mx-3 rounded shadow-lg">
                            Hapus
                        </button>
                    </form>
                ';
                })
                ->rawColumns(['action']) // Memberitahu DataTables bahwa kolom 'action' mengandung HTML
                ->make(true);
        }

        return view('admin.user.index');
    }
}


```

## Langkah 2: Konfigurasi Routing
Daftarkan resource route di file `routes/web.php`. Kita akan membungkusnya dengan middleware auth dan role:admin untuk memastikan hanya admin yang bisa mengelola data ini.


```php

use App\Http\Controllers\Admin\UserController;

Route::middleware('auth')->group(function () {
    // Resource route untuk CRUD User dengan proteksi role admin
    Route::resource('users', UserController::class)->middleware('role:admin');
    
    // Route profile bawaan Laravel Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // ... route lainnya
});


```
![Deskripsi Gambar](/images/admin-user-2.1.png)

## Langkah 3: Menambahkan Menu Navigasi
Agar menu "Pengguna" hanya muncul di layar Admin, kita gunakan directive `@role` dari Spatie pada file `resources/views/layouts/navigation.blade.php`.



```php
    {{-- Menu Navigasi Khusus Admin --}}
    @role('admin')
        <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
            <x-nav-link :href="route('users.index')" :active="request()->routeIs('users*')">
                {{ __('Pengguna') }}
            </x-nav-link>
        </div>
    @endrole

```

![Deskripsi Gambar](/images/admin-user-2.png)


## Langkah 4: Konfigurasi Tailwind Safelist
Karena tombol "Edit" dan "Hapus" di dalam DataTables dibuat melalui string HTML di Controller, Tailwind CSS tidak akan mendeteksi class tersebut saat proses build. Kita perlu menambahkannya ke dalam `safelist` di `tailwind.config.js`.

```php
export default {
    content: [
        './resources/views/**/*.blade.php',
        // ... content lainnya
    ],
    // Menjamin class tetap ada meskipun tidak tertulis langsung di file Blade
    safelist: [
        'bg-gray-500',
        'bg-gray-700',
        'bg-red-500',
        'bg-red-700',
        'bg-blue-500',
        'bg-blue-700',
    ],
    theme: {
        extend: {
            // ...
        },
    },
};

```


## Langkah 5: Pengujian Fitur
Terakhir, lakukan login menggunakan akun administrator yang sudah dibuat melalui seeder sebelumnya untuk memastikan semua berfungsi dengan baik.

Email: admin@admin.com
Password: password

Kunjungi menu Pengguna, dan Anda akan melihat daftar user yang dimuat menggunakan DataTables

![Deskripsi Gambar](/images/admin-user-3.png)