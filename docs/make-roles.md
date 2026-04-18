1. Buat seeder untuk role dengan cara menjalankan perintah berikut di terminal

`php artisan make:seeder RolePermissionSeeder`

2. Edit

Jangan gunakan `use WithoutModelEvents`


```php
<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // PENTING: Bersihkan cache permission di awal
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        // Mendefinisikan daftar permission yang akan dibuat

        $permissions = [
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view my-devices',
            'create my-devices',
            'edit my-devices',
            'delete my-devices',
        ];

        // Membuat permission satu per satu
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Membuat role 'admin'
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Memberikan permission kepada role 'admin'
        $adminRole->givePermissionTo($permissions); #1

        $userRole->givePermissionTo([
            'view my-devices',
            'create my-devices',
            'edit my-devices',
            'delete my-devices',
        ]); #2

        ;
    }
}



```
3. Tambahkan seede ke databasesseder


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
        $this->call([RolePermissionSeeder::class]);
    }
}


```


4. Menjalankan seeder secara spesifik (Hanya RolePermissionTableSeeder):

```bash
php artisan db:seed RolePermissionTableSeeder
```

