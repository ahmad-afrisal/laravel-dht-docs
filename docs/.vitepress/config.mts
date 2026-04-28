import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
// Tambahkan ini agar path CSS/JS tidak pecah saat di-deploy
  // Sesuaikan dengan nama repository Anda di GitHub
  base: '/laravel-dht-docs/',

  title: "Laravel 13 DHT",
  description: "The Next of IoT",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Pertemuan 1 - 10/04/2026',
        collapsed: false,
        items: [
          { text: 'Tools', link: '/tools' },
          { text: 'Instal Breeze', link: '/instal-breeze' },
          { text: 'Instal Yajra Datatables', link: '/instal-yajra-datatables' },
          { text: 'Instal Spatie Permissions', link: '/instal-spatie-permissions' },
          { text: 'Buat Hak Akses', link: '/make-roles' },
          { text: 'Buat Pengguna', link: '/make-users' },
          { text: 'Instal Debugbar', link: '/instal-debugbar' },
          { text: 'Menampilkan Pengguna', link: '/admin-view-user' },
          { text: 'Set Default User Role', link: '/set-default-user-role' },
          { text: 'CRUD IoT Device', link: '/crud-iot-device' },
        ],
      },
      {
        text: 'Pertemuan 2 - 17/04/2026',
        collapsed: false,
        items: [
          { text: 'Menampilkan Perangkat Saya', link: '/my-iot-device' },
          { text: 'Instal Laravel Reverb', link: '/instal-laravel-reverb' },
          { text: 'Detail Monitoring', link: '/detail-monitoring' },
          { text: 'Cek IP Lokal', link: '/check-ip-local' },
          { text: 'ESP32 Program', link: '/esp32-program' },
          { text: 'Uji Sistem', link: '/system-testing' },
          { text: 'ShouldBroadcastNow', link: '/shouldbroadcast-vs-shouldboradcastnow' },
          // Tambahkan item Part 2 di sini
        ],
      },
      {
        text: 'Pertemuan 3 - 24/04/2026',
        collapsed: false,
        items: [
          { text: 'Buat Akun EMQX Cloud', link: '/new-account-emqx-cloud' },
          { text: 'Setup Laravel MQTT & Reverb', link: '/laravel-mqtt' },

        ],
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
