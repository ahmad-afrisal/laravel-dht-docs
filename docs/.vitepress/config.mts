import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Laravel 13 DHT",
  description: "The Next of IoT",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Examples',
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
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
