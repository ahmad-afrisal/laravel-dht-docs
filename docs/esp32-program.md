# ESP32 Program

## Buka VScode
![Deskripsi Gambar](/images/esp32-program-0.png)


## Jalankan PlatformIo
![Deskripsi Gambar](/images/esp32-program-1.png)

## Jalankan PlatformIo
![Deskripsi Gambar](/images/esp32-program-2.png)

![Deskripsi Gambar](/images/esp32-program-3.png)

![Deskripsi Gambar](/images/esp32-program-4.png)

`platformio.ini`


![Deskripsi Gambar](/images/esp32-program-5.png)

```cpp
monitor_speed = 115200

lib_deps =
    adafruit/DHT sensor library
    adafruit/Adafruit Unified Sensor


```
![Deskripsi Gambar](/images/esp32-program-6.png)

di folder `src/main.cpp`


```cpp
#include <Arduino.h>

#include <WiFi.h> // Header untuk ESP32
#include <HTTPClient.h>
#include <DHT.h>

// --- Konfigurasi WiFi ---
const char* ssid = "isal";
const char* password = "isal1234";

// --- Konfigurasi API Laravel ---
// Gunakan IP Laptop Anda (Contoh: 192.168.1.10) jika server berjalan lokal
const char* serverUrl = "http://10.11.141.180:8000/api/update-sensor";
const char* deviceId = "01kpcdckcprkttxkrmfn4ph5bc"; // Masukkan ULID perangkat dari DB

// --- Konfigurasi Sensor ---
#define DHTPIN 4      // Kita gunakan GPIO 4
#define DHTTYPE DHT22 // Ganti ke DHT22 jika menggunakan DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (isnan(t) || isnan(h)) {
      Serial.println("Gagal membaca sensor!");
      return;
    }

    Serial.printf("Suhu: %.2f, Hum: %.2f\n", t, h);

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Kirim JSON berisi ID (ULID), Suhu, dan Kelembapan
    String jsonPayload = "{\"id\":\"" + String(deviceId) + "\",\"temp\":" + String(t) + ",\"hum\":" + String(h) + "}";
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("Response Code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  
  delay(10000); // Kirim data setiap 10 detik
}


```

Hubungkan nodemcu dengan komputer, untuk upload program dengang rangkaian sebagai berikut

### Skema Pinout ESP32 ke DHT11/22
Sensor DHT biasanya memiliki 3 atau 4 pin (VCC, Data, NC, GND). Pada ESP32, kita akan menggunakan pin GPIO 4 (D4) sebagai pin data karena lokasinya yang mudah dijangkau.

| Pin DHT11/22 | Pin ESP32 | Keterangan |
| :--- | :--- | :--- |
| VCC3 | V3 atau Vin | Gunakan 3V3 jika kabel pendek, Vin jika kabel panjang (>2 meter)|
| Data | GPIO 4 (D4) | Pin komunikasi data|
| GND | GND | Ground (Negatif) |



1. Build Program
![Deskripsi Gambar](/images/esp32-program-8.png)

2. Upload Program
![Deskripsi Gambar](/images/esp32-program-9.png)

3. Cek di Serial Monitor
![Deskripsi Gambar](/images/esp32-program-10.png)

