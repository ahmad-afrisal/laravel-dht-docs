# Membuat Halaman Monitoring Real-Time
Halaman ini berfungsi untuk menampilkan data dari sensor DHT22 secara langsung tanpa perlu refresh halaman, menggunakan teknologi **Laravel Reverb (WebSockets)** dan **Laravel Echo**.


## 1. Persiapan Struktur Blade
Buat file baru di `resources/views/user/my-device/show.blade.php`. Kita menggunakan Layout Component (`<x-app-layout>`) untuk menjaga konsistensi tampilan dengan dashboard Laravel lainnya.

```php
<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Perangkat') }}
        </h2>
    </x-slot>

    {{-- Masukkan script ke slot yang dikenali layout --}}
    <x-slot name="script">
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                console.log('Mencoba menyambung ke channel: device.{{ $device->id }}');

                window.Echo.channel('device.{{ $device->id }}')
                    .listen('.sensor.updated', (e) => { // Gunakan titik di depan!
                        console.log('DATA DITERIMA!', e);

                        // Pastikan nama property 'temperature' dan 'humidity' sesuai dengan kolom DB Anda
                        document.getElementById('temp-display').innerText = e.device.temperature;
                        document.getElementById('hum-display').innerText = e.device.humidity;
                    })
                    .error((err) => {
                        console.error('Echo Error:', err);
                    });
            });
        </script>
    </x-slot>

    <main class="flex-1 overflow-y-auto">
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <nav class="flex items-center text-sm text-gray-600 space-x-2 mb-7">
                    <a href="{{ route('dashboard') }}" class="flex items-center hover:text-green-600">
                        Home
                    </a>
                    <span>›</span>
                    <span class="text-gray-500">Perangkat Saya</span>
                    <span>›</span>
                    <span class="text-gray-500">{{ $device->id }}</span>
                </nav>

                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-blue-100 p-4 rounded-lg">
                        <p class="text-sm">Suhu</p>
                        <h1 class="text-3xl font-bold">
                            <span id="temp-display">{{ $device->temperature ?? '0' }}</span>°C
                        </h1>
                    </div>
                    <div class="bg-green-100 p-4 rounded-lg">
                        <p class="text-sm">Kelembapan</p>
                        <h1 class="text-3xl font-bold">
                            <span id="hum-display">{{ $device->humidity ?? '0' }}</span>%
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </main>
</x-app-layout>

```


![Deskripsi Gambar](/images/detail-monitoring-1.png)


##  2. Implementasi UI (Frontend)
Kita menggunakan **Tailwind CSS** untuk membuat tampilan kartu (cards) yang bersih:
- **Grid System**: Membagi layar menjadi dua kolom untuk Suhu dan Kelembapan.
- **Warna Kontras**: Biru (bg-blue-100) untuk suhu dan Hijau (bg-green-100) untuk kelembapan agar mudah dibedakan secara visual.
- **ID Selector**: Memberikan id="temp-display" dan id="hum-display" pada tag `<span></span>` agar JavaScript bisa mengubah angkanya secara dinamis.

## 3. Integrasi Laravel Echo (The "Magic")
Bagian terpenting adalah skrip JavaScript di dalam `<x-slot name="script">`. Berikut adalah penjelasan alurnya:


