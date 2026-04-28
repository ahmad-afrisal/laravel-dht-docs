# Real-Time Dashboard IoT: Integrasi Laravel, MQTT (EMQX), dan Reverb
Tutorial ini akan memandu Anda menghubungkan perangkat **ESP32** ke **Laravel** menggunakan protokol **MQTT** untuk pembaruan data secara real-time melalui Laravel Reverb.


## 1. Persiapan Environment Laravel
Pertama, instal library `php-mqtt` agar Laravel dapat bertindak sebagai *subscriber*.

Jalankan perintah berikut di terminal :
```bash
composer require php-mqtt/laravel-client
```

![Deskripsi Gambar](/images/emqx-22.png)

Setelah instalasi, publish file konfigurasi untuk menyesuaikan pengaturan koneksi nanti:

```bash
php artisan vendor:publish --provider="PhpMqtt\Client\MqttClientServiceProvider"
```


### Konfigurasi `.env`
Tambahkan kredensial MQTT Broker Anda (misalnya EMQX Cloud) ke dalam file `.env`.

Pastikan file sertifikat CA diletakkan di folder storage/app/private/ agar tidak bisa diakses langsung via web browser.

```php

MQTT_HOST=x12345.emqxsl.com  # Sesuaikan 
MQTT_PORT=8883
MQTT_AUTH_USERNAME= # Sesuaikan 
MQTT_AUTH_PASSWORD= # Sesuaikan 
MQTT_TLS_ENABLED=true
MQTT_TLS_CA_FILE=storage/app/private/mqtt/emqxsl-ca.crt


```

## 2. Membuat "The Bridge" (MQTT Listener)
Buat perintah Artisan yang akan berjalan berjalan terus-menerus di background untuk mendengarkan pesan dari broker.

```bash
php artisan make:command MqttListener
```
setelah menjalankan perintah tersebut di terminal, secara otomatis akan menghasilkan sebuah file `MqttListener.php` di folder `app/Console/Commands/`, Selanjutnya isi file tersebut dengan kode sebagai berikut :

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\IotDevice;
use App\Events\DeviceSensorUpdated;

#[Signature('mqtt:listener')]
#[Description('Mendengarkan data sensor dari MQTT Broker')]
class MqttListener extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Subscribe ke semua alat: v1/devices/ID_ALAT/telemetry
        $mqtt = \PhpMqtt\Client\Facades\MQTT::connection();
        $this->info("Menghubungkan ke MQTT Broker...");
        // Panggil subscribe melalui instance $mqtt
        $mqtt->subscribe('v1/devices/+/telemetry', function (string $topic, string $message) use ($mqtt) {
            $parts = explode('/', $topic);
            $deviceId = $parts[2]; // Mengambil ID_ALAT

            $this->info("Data masuk dari Topic: {$topic}");

            $device = IotDevice::where('id', $deviceId)->first();

            if ($device) {
            $data = json_decode($message, true);

            $device->update([
                'temperature' => $data['temp'] ?? $device->temperature,
                'humidity'    => $data['humi'] ?? $device->humidity,
                'last_seen'        => now(),
            ]);

            broadcast(new DeviceSensorUpdated($device));
            
            $this->info("Berhasil update Device: {$deviceId}");
        } else {
            $this->error("Device ID tidak dikenal: {$deviceId}");
        }
        }, 0);
// Jalankan loop melalui instance $mqtt
        $mqtt->loop(true);
    }
}


```
Kode ini menangkap data, menyimpannya ke database, dan langsung mem-broadcast-nya melalui Laravel Reverb.

## 3. Konfigurasi Broadcasting (Reverb)

Agar data bisa diterima oleh Dashboard (Frontend), kita perlu mendaftarkan *Private Channel* di `routes/channels.php`:


```php
<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\IotDevice;


// // Jika menggunakan Opsi B (Channel Device)
Broadcast::channel('device.{deviceId}', function ($deviceId) {
  // Logika otorisasi: pastikan user memiliki akses ke device ini
    return IotDevice::where('id', $deviceId)
        ->exists();
});


```





## 4. Setup Perangkat (ESP32 & DHT22)
Gunakan **PlatformIO** untuk mengelola library. Tambahkan dependency berikut pada `platformio.ini`:

```cpp
lib_deps =
    knolleary/PubSubClient @ ^2.8
    adafruit/DHT sensor library
    adafruit/Adafruit Unified Sensor


```
### Kode Utama ESP32 (src/main.cpp)
Berikut adalah kode untuk membaca sensor DHT22 dan mengirimkannya ke topik yang sesuai dengan ID di Laravel.

```cpp
#include <Arduino.h>

#include <WiFi.h>              // Header khusus ESP32
#include <WiFiClientSecure.h>  // Untuk koneksi SSL/TLS port 8883
#include <PubSubClient.h>
#include <DHT.h>


// --- Konfigurasi WiFi ---
const char* ssid = "isal"; // Sesuaikan
const char* password = "isal1234";

// Konfigurasi MQTT EMQX Cloud
const char* mqtt_server = "s.emqxsl.com";
const int mqtt_port = 8883; 
const char* mqtt_user = ""; // Sesuaikan
const char* mqtt_pass = ""; // Sesuaikan
const char* device_id = "01kpcdckcprkttxkrmfn4ph5bc"; // Pastikan ID ini terdaftar di tabel IotDevices

// Inisialisasi Sensor & Client
#define DHTPIN 4 // Pin Data DHT22 (sesuaikan dengan GPIO yang Anda gunakan di ESP32)
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Mencoba connect
    if (client.connect(device_id, mqtt_user, mqtt_pass)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();

  // Khusus ESP32 untuk mengabaikan verifikasi sertifikat SSL (seperti setInsecure)
  espClient.setInsecure(); 
  
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  // Kirim data setiap 5 detik tanpa menggunakan delay() agar client.loop() lancar
  if (now - lastMsg > 5000) {
    lastMsg = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t) && !isnan(h)) {
      String topic = "v1/devices/" + String(device_id) + "/telemetry";
      String payload = "{\"temp\":" + String(t) + ",\"humi\":" + String(h) + "}";
      
      Serial.print("Publish message: ");
      Serial.println(payload);
      
      client.publish(topic.c_str(), payload.c_str());
    } else {
      Serial.println("Failed to read from DHT sensor!");
    }
  }
}


```

## 5. Menjalankan Sistem
Untuk memulai sinkronisasi data dari perangkat ke dashboard, jalankan perintah ini di server Laravel Anda:


```bash

php artisan mqtt:listener
```