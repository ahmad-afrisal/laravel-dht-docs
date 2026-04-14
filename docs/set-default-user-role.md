# Auto Assign Role saat Registrasi
Secara default, Laravel Breeze hanya membuat data user tanpa memberikan role tertentu. Dalam tutorial ini, kita akan memodifikasi `RegisteredUserController` agar secara otomatis memberikan role `user` segera setelah akun berhasil dibuat.

## Langkah 1: Buka Controller Registrasi
Buka file controller yang menangani proses pendaftaran pengguna baru di:
`app/Http/Controllers/Auth/RegisteredUserController.php`.

## Langkah 2: Modifikasi Logic Store
Cari method `store`. Kita akan menambahkan method `assignRole()` tepat setelah user berhasil disimpan ke dalam database, namun sebelum event Registered dipicu.

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Menampilkan halaman registrasi.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Menangani permintaan registrasi masuk.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 1. Membuat data user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 2. Memberikan role default secara otomatis (Auto Assign Role)
        // Pastikan role 'user' sudah ada di database melalui Seeder
        $user->assignRole('user');

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
```

## Langkah 3: Penjelasan Kode
1. `User::create(...)`: Bagian ini tetap sama, berfungsi untuk memasukkan data nama, email, dan password ter-enkripsi ke tabel `users`.

2. `$user->assignRole('user')`: Ini adalah bagian krusial. Method ini berasal dari package Spatie Laravel-Permission. Kita memberikan string 'user' sebagai role default.

3. Urutan Penempatan: Kita meletakkannya sebelum `Auth::login($user)` agar saat user pertama kali masuk ke dashboard, session mereka sudah mengenali role yang dimiliki.

## Langkah 4: Verifikasi
Untuk memastikan fitur ini berjalan:
1. Lakukan registrasi akun baru di website Anda.
2. Cek database pada tabel `model_has_roles`.
3. Pastikan `model_id` yang baru saja dibuat terhubung dengan role_id milik role 'user'.

Penting: Jika Anda mendapatkan error Role 'user' does not exist, pastikan Anda sudah menjalankan `RolePermissionSeeder` yang kita buat di bab sebelumnya.