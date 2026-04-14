# Implementasi Seeding User dengan Spatie Role
Dalam tahap ini, kita akan membuat data contoh (dummy data) untuk tabel user dan mengaitkannya dengan peran (role) tertentu menggunakan package Spatie Laravel-Permission.

## Langkah 1: Membuat File Seeder
Langkah pertama adalah membuat file class seeder baru menggunakan Artisan command. Jalankan perintah berikut di terminal Anda:


` php artisan make:seeder UserTableSeeder`

Perintah ini akan menghasilkan file baru di direktori `database/seeders/UserTableSeeder.php`.

## Langkah 2: Menyusun Logika Seeding
Buka file `UserTableSeeder.php` yang baru saja dibuat, lalu sesuaikan kodenya menjadi seperti berikut. Di sini kita akan membuat 10 user biasa dan 1 user admin secara otomatis.

```php

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan role sudah ada (via RolePermissionSeeder)
        // Roles: admin, user

        // Buat 10 user biasa + user
        User::factory(10)->create()->each(function ($user) {
            // Assign role farmer
            $user->assignRole('user');
        });

        // Buat admin user khusus
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);

        $admin->assignRole('admin');
    }
}



```
Catatan: Pastikan Anda sudah menjalankan `RolePermissionSeeder` terlebih dahulu agar role admin dan user sudah tersedia di database sebelum seeder ini dijalankan.


## Langkah 3: Registrasi Seeder ke DatabaseSeeder
Agar seeder yang baru dibuat dapat dijalankan sekaligus melalui perintah utama, kita perlu mendaftarkannya di dalam file `database/seeders/DatabaseSeeder.php`.

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class, // Menyiapkan Role & Permission
            UserTableSeeder::class, // Menyiapkan Data User
        ]);
    }
}
```

## Langkah 4: Menjalankan Seeder
Ada dua cara untuk menjalankan seeder yang telah kita buat:

### Menjalankan secara spesifik (Hanya UserTableSeeder):

`php artisan db:seed UserTableSeeder`

### Menjalankan seluruh seeder (Sesuai urutan di DatabaseSeeder):

`php artisan db:seed`

Jika berhasil, Anda akan melihat pesan sukses di terminal, dan tabel users Anda kini telah terisi dengan data yang siap digunakan untuk pengembangan.