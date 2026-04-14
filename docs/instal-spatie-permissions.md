# Installation in Laravel

## Laravel Version Compatibility
See the `Prerequisites` documentation page for compatibility details.

## Installing

1. Consult the Prerequisites page for important considerations regarding your User models!

2. This package publishes a config/permission.php file. If you already have a file by that name, you must rename or remove it.

3. You can install the package via composer:

 `composer require spatie/laravel-permission`

![Deskripsi Gambar](/images/yajra-1.png)


4. The Service Provider will automatically be registered; however, if you wish to manually register it, you can manually add the `Spatie\Permission\PermissionServiceProvider::class` service provider to the array in `bootstrap/providers.php` (`config/app.php` in Laravel 10 or older).

5. You should publish the migration and the `config/permission.php` config file with:

`php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"`

![Deskripsi Gambar](/images/yajra-2.png)


6. BEFORE RUNNING MIGRATIONS

If you are using UUIDs, see the Advanced section of the docs on UUID steps, before you continue. It explains some changes you may want to make to the migrations and config file before continuing. It also mentions important considerations after extending this package's models for UUID capability.

If you are going to use the TEAMS features you must update your `config/permission.php` config file:

must set 'teams' => true,
and (optional) you may set team_foreign_key name in the config file if you want to use a custom foreign key in your database for teams
If you are using MySQL 8+, look at the migration files for notes about MySQL 8+ to set/limit the index key length, and edit accordingly. If you get ERROR: 1071 Specified key was too long then you need to do this.

If you are using CACHE_STORE=database, be sure to install Laravel's cache migration, else you will encounter cache errors.

7. Clear your config cache. This package requires access to the permission config settings in order to run migrations. If you've been caching configurations locally, clear your config cache with either of these commands:

 `php artisan optimize:clear`
  or
 `php artisan config:clear`

![Deskripsi Gambar](/images/yajra-3.png)


8. Run the migrations: After the config and migration have been published and configured, you can create the tables for this package by running:

 `php artisan migrate`

![Deskripsi Gambar](/images/yajra-4.png)


9. Add the necessary trait to your User model:

 // The User model requires this trait
 `use HasRoles;`

 Buka Model `app/Models/User.php`, Lalu modifikasi file tersebut hingga seperti ini

 ```php
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles; // Trait untuk Spatie Permissions

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}


 ```

10. Consult the Basic Usage section of the docs to get started using the features of this package.


11. Modfifikasi file `app.php` yang ada pada `bootstrap/app.php`, menjadi seperti dibawah ini

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    // Tambahkan ini
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
    })
    //
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

```

.