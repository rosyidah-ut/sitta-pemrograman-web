# Dashboard Admin Tracking Bahan Ajar

## Overview
Sistem dashboard admin untuk tracking pengiriman bahan ajar Universitas Terbuka (UT). Aplikasi ini dibuat menggunakan HTML, CSS, dan JavaScript vanilla (tanpa framework) dengan fitur login, manajemen stok bahan ajar, dan tracking pengiriman dengan visualisasi progress yang menarik.

## Fitur Utama
1. **Halaman Login** - Autentikasi pengguna dengan email dan password dari data dummy
2. **Dashboard Utama** - Menampilkan statistik dan fitur pencarian delivery order
3. **Tracking Pengiriman** - Visualisasi status pengiriman dengan progress bar dan timeline
4. **Informasi Bahan Ajar** - Tabel data dinamis dengan fitur tambah stok menggunakan DOM manipulation

## Struktur Project
```
/
├── index.html           # Halaman login
├── dashboard.html       # Dashboard utama dengan pencarian DO
├── tracking.html        # Halaman tracking pengiriman
├── stok.html           # Halaman informasi bahan ajar
├── css/
│   └── style.css       # Styling untuk semua halaman
└── js/
    ├── data.js         # Data dummy (pengguna, bahan ajar, tracking)
    └── script.js       # Logika aplikasi utama
```

## Data Dummy untuk Login
- Email: admin@ut.ac.id
- Password: admin123

Atau gunakan kredensial lain dari file `js/data.js`:
- rina@ut.ac.id / rina123
- agus@ut.ac.id / agus123
- siti@ut.ac.id / siti123
- doni@ut.ac.id / doni123

## Nomor Delivery Order untuk Testing
- 2023001234 (Status: Dalam Perjalanan)
- 2023005678 (Status: Terkirim)

## Teknologi yang Digunakan
- HTML5
- CSS3 (Vanilla CSS dengan variabel CSS dan animasi)
- JavaScript ES6+ (Vanilla JS, tanpa framework)
- Python HTTP Server untuk development

## Recent Changes
- 31 Oktober 2025: Initial setup dengan semua fitur dasar
  - Implementasi sistem login dengan validasi
  - Dashboard dengan statistik dan pencarian DO
  - Visualisasi tracking dengan progress bar animasi
  - Fitur tambah bahan ajar menggunakan DOM manipulation
  - Desain responsif dan modern

## User Preferences
- Gunakan HTML, CSS, dan JavaScript murni tanpa framework tambahan
- Data disimpan dalam variabel JavaScript (dataPengguna, dataBahanAjar, dataTracking)
- Visualisasi status pengiriman menggunakan progress bar berwarna dan timeline

## Project Architecture
- **Frontend**: Pure HTML/CSS/JavaScript
- **Session Management**: sessionStorage untuk menyimpan data user login
- **Data Layer**: Variabel JavaScript global (data.js)
- **Server**: Python HTTP Server untuk serving static files
