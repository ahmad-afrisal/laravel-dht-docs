# CRUD IOT DEVICE
Panduan ini akan membimbing Anda membuat sistem manajemen perangkat IoT menggunakan Laravel 13, ULID sebagai primary key, dan DataTables untuk tampilan list yang interaktif.

## Langkah 1: Persiapan Model & Database
Pertama, buat model beserta file migrasinya dengan satu perintah:

`php artisan make:model IotDevice -m`

![Deskripsi Gambar](/images/crud-device-1.png)

### Modifikasi Migration
Gunakan `ulid` untuk keamanan ID perangkat agar tidak mudah ditebak oleh pihak luar.

```php
public function up(): void
    {
        Schema::create('iot_devices', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->double('humidity', 10, 2)->nullable();
            $table->double('temperature', 10, 2)->nullable();
            $table->timestamps();
        });
    }

```

Lalu jalankan migrasi:  `php artisan migrate`.

![Deskripsi Gambar](/images/crud-device-2.png)


### Konfigurasi Model IotDevice
Di Laravel 13, pastikan Anda menggunakan trait `HasUlids`. Perhatikan juga penggunaan metode `casts()` yang sekarang lebih disarankan daripada properti `$casts`.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IotDevice extends Model
{
    // Menggunakan Trait HasUlids karena primary key Anda menggunakan ULID
    use HasUlids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Atribut yang dapat diisi secara massal.
     */
    protected $fillable = [
        'user_id',
        'is_active',
        'humidity',
        'temperature',
    ];

    /**
     * Mendefinisikan cast atribut.
     * Di Laravel 13, kita menggunakan metode casts() alih-alih properti $casts.
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'humidity' => 'double',
            'temperature' => 'double',
        ];
    }

    /**
     * Relasi ke User (Satu device dimiliki oleh satu user)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}


```


tambahkan relasi di model user

```php
    public function iotDevices()
    {
        return $this->hasMany(IotDevice::class);
    }

```

## Langkah 2: Validasi (Form Request)
Buat request khusus untuk memisahkan logika validasi dari controller:

`php artisan make:request IotDeviceStoreRequest`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IotDeviceStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'is_active' => 'required|boolean',
            'humidiy' => 'nullable|numeric',
            'temperature' => 'nullable|numeric',
        ];
    }
}



```

## Langkah 3: Controller dengan DataTables
Gunakan `Yajra DataTables` untuk menangani ribuan data perangkat dengan cepat secara server-side.

`php artisan make:controller IotDeviceController`

Lalu modfifikasi filenya yang berada di `app/Http/Controllers/IotDeviceController.php`.

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\IotDeviceStoreRequest;
use App\Models\IotDevice;
use App\Models\User;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class IotDeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (request()->ajax()) {
            $query = IotDevice::query();

            return DataTables::of($query)
                ->addColumn('user.id', function ($item) {
                    return $item->user ? $item->user->id : '-';
                })
                ->addColumn('user.name', function ($item) {
                    return $item->user ? $item->user->name : '-';
                })
                ->addColumn('is_active', function ($item) {
                    if ($item->is_active == 1) {
                        return '<span class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Aktif
                    </span>';
                    } else {
                        return '<span class="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Tidak Aktif
                    </span>';
                    }
                })
                ->addColumn('action', function ($item) {
                    return '
                    <a href="' . route('iot-devices.show', $item->id) . '" 
                        class="inline-block bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-1 px-2 rounded shadow-lg">
                        Detail
                    </a>
                    <a href="' . route('iot-devices.edit', $item->id) . '" 
                        class="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded shadow-lg">
                        Edit
                    </a>
                    <form class="inline-block" action="' . route('iot-devices.destroy', $item->id) . '" method="POST" onsubmit="return confirm(\'Yakin hapus data ini?\')">
                        ' . csrf_field() . method_field('delete') . '
                        <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 mx-3 rounded shadow-lg">
                            Hapus
                        </button>
                    </form>
                ';
                })
                ->rawColumns(['action', 'is_active'])
                ->make(true);
        }

        return view('admin.iot-device.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::role('user')->pluck('name', 'id');

        return view('admin.iot-device.create', compact('users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(IotDeviceStoreRequest $request)
    {
        $data = $request->validated();

        IotDevice::create($data);

        return redirect()->route('iot-devices.index')->with('success', 'Perangkat IoT berhasil ditambahkan.');
    }
}



```

## Langkah 4: Routing & Integrasi Menu
Daftarkan resource di `routes/web.php`. Pastikan diletakkan di dalam group middleware `auth` dan `role:admin`.
```php
<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\IotDeviceController; // Jan lupa
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('users', UserController::class)->middleware('role:admin');
    Route::resource('iot-devices', IotDeviceController::class)->middleware('role:admin'); // Tambahkan Ini


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';



```
### Update Navigasi
Tambahkan link pada file   `navigation.blade.php`:


```php
        {{-- Menu Pengguna --}}
        @role('admin')
            <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <x-nav-link :href="route('users.index')" :active="request()->routeIs('users*')">
                    {{ __('Pengguna') }}
                </x-nav-link>
            </div>
        // Menu Perangkat
            <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <x-nav-link :href="route('iot-devices.index')" :active="request()->routeIs('iot-devices*')">
                    {{ __('Perangkat') }}
                </x-nav-link>
            </div>
        @endrole

```

## Langkah 5: Membuat Halaman Semua Perangkat

buat file view di `resources/views/admin/iot-device/index.blade.php`, lalu tambahkan kode seperti dibawah ini

```php
<x-app-layout>

    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Perangkat') }}
        </h2>
    </x-slot>

    <x-slot name="script">
        <script>
            // AJAX DataTable

            var datatable = $('#crudTable').DataTable({
                responsive: true, // <--- aktifkan fitur ini
                ajax: {
                    url: '{!! url()->current() !!}'
                },
                columns: [{
                        data: 'id',
                        name: 'id',
                        width: '10%'
                    },
                    {
                        data: 'user.id',
                        name: 'user.id',
                    },
                    {
                        data: 'user.name',
                        name: 'user.name',
                    },
                    {
                        data: 'is_active',
                        name: 'is_active',
                    },
                    {
                        data: 'action',
                        name: 'action',
                        orderable: false,
                        searchable: false,
                        width: '15%',
                    }
                ]
            })
        </script>
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
                    <span class="text-gray-500">Perangkat</span>
                </nav>
                @if (session('error'))
                    <div class="mb-5" role="alert">
                        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Error
                        </div>
                        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            {{ session('error') }}
                        </div>
                    </div>
                @endif

                @if (session('success'))
                    <div class="mb-5" role="alert">
                        <div class="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                            Berhasil
                        </div>
                        <div class="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
                            {{ session('success') }}
                        </div>
                    </div>
                @endif
                <div class="mb-10">
                    <a href="{{ route('iot-devices.create') }}"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded shadow-lg">+
                        Perangkat
                    </a>
                </div>



                <div class="shadow overflow-hidden sm-rounded-md">
                    <div class="px-4 py-5 bg-white sm:p-6">
                        <table id="crudTable" class="display cell-border">
                            <thead>
                                <tr>
                                    <th>ID Perangkat</th>
                                    <th>ID Pengguna</th>
                                    <th>Pengguna</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>

</x-app-layout>




```


## Langkah 6: Membuat Halaman Tambah Perangkat
Setelah Controller dan Route siap, langkah selanjutnya adalah menyediakan antarmuka (UI) agar Admin dapat menginputkan data perangkat baru ke dalam database.

### 1. Membuat File View
Buatlah file baru di direktori:
`resources/views/admin/iot-device/create.blade.php`

### 2. Implementasi Kode UI
Gunakan komponen Laravel Breeze/Starter Kit (x-app-layout) untuk menjaga konsistensi desain. Masukkan kode berikut:

```php

<x-app-layout>


    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Perangkat') }}
        </h2>
    </x-slot>

    <x-slot name="style">

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
                    <span class="text-gray-500">Perangka IoT</span>
                    <span>›</span>
                    <span class="text-gray-500">Tambah</span>
                </nav>
                @if ($errors->any())
                    <div class="mb-5" role="alert">
                        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Terdapat kesalahan
                        </div>
                        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                @endif

                <form action="{{ route('iot-devices.store') }}" method="post" enctype="multipart/form-data"
                    class="bg-white p-6 rounded-lg shadow-md">
                    @csrf

                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2">Pilih Pengguna <span
                                class="text-red-500">*</span></label>
                        <select name="user_id" id="user_id"
                            class=" block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                            <option value="">-- Pilih --</option>
                            @foreach ($users as $id => $name)
                                <option value="{{ $id }}" {{ old('user_id') == $id ? 'selected' : '' }}>
                                    {{ $id }} - {{ $name }}
                                </option>
                            @endforeach
                        </select>
                    </div>



                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3">
                            <label class="block mb-2 font-medium">
                                Status
                            </label>
                            <div class="flex items-center gap-8"> <!-- gunakan gap-8 agar jarak lebih lebar -->
                                <label class="inline-flex items-center">
                                    <input type="radio" name="is_active" value="1"
                                        class="form-radio text-green-600"
                                        {{ old('is_active', 1) == 1 ? 'checked' : '' }}>
                                    <span class="ml-2 text-gray-700">Aktif</span>
                                </label>

                                <label class="inline-flex items-center">
                                    <input type="radio" name="is_active" value="0"
                                        class="form-radio text-red-600" {{ old('is_active') == 0 ? 'checked' : '' }}>
                                    <span class="ml-2 text-gray-700">Tidak Aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>


                    <div class="flex space-x-2">
                        <button type="submit"
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg">
                            Simpan
                        </button>
                        <a href="{{ route('iot-devices.index') }}"
                            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-lg">
                            Kembali
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </main>

</x-app-layout>
```
### Penjelasan Bagian Penting:
1. `@csrf`: Token keamanan wajib di Laravel untuk mencegah serangan Cross-Site Request Forgery. Tanpa ini, form Anda akan menghasilkan error 419 Page Expired.
2. old('field_name'): Fungsi ini sangat penting untuk pengalaman pengguna. Jika validasi gagal, input yang sudah diketik sebelumnya tidak akan hilang (tetap terisi).
3. Dropdown Pengguna: Data $users dikirim dari IotDeviceController@create menggunakan pluck('name', 'id'). Ini memudahkan admin mencocokkan perangkat dengan user yang ada.
4. Tailwind CSS: Kita menggunakan utilitas seperti flex, shadow-md, dan rounded-lg untuk membuat tampilan modern tanpa menulis file CSS terpisah.

## Hasil Akhir Halaman
Setelah kode di atas disimpan, akses menu Perangkat > Tambah Perangkat. Anda akan melihat tampilan form yang bersih dan responsif seperti gambar di bawah ini:

:::Catatan: Pastikan Anda sudah menjalankan `npm run dev` agar styling Tailwind CSS muncul dengan sempurna pada browser Anda. Di Laravel 13, jika Anda menggunakan ULID, Anda tidak perlu menginputkan ID secara manual di form karena trait HasUlids di model akan membuatnya secara otomatis saat data disimpan.

![Deskripsi Gambar](/images/crud-device-5.png)
