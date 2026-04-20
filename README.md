# 🚀 PadiPos Backend API (MVP Edition)

Backend untuk aplikasi Point of Sale (POS) PadiPos. Dibangun menggunakan **Node.js, Express, Sequelize ORM, dan PostgreSQL** dengan arsitektur berlapis (Controller-Service-Repository).

---

## 📁 Struktur Proyek
Proyek ini mengikuti standar industri dengan pemisahan tanggung jawab yang jelas:
- `controllers/`: Menangani request HTTP & Response Mapping.
- `services/`: Logika bisnis murni (Auth, Perhitungan Penjualan, Stok).
- `repositories/`: Akses data ke database PostgreSQL.
- `models/`: Definisi skema tabel database.
- `dto/`: Data Transfer Object untuk validasi Request & format Response.
- `middleware/`: Keamanan (JWT Guard, Role Check) & Logging.

---

## 📡 API Endpoints (Daftar Lengkap)

### 🛡️ Auth & Profile
| Method | URL | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Public | Login & mendapatkan JWT Token. |
| POST | `/api/auth/register` | Public | Registrasi akun baru (Default: Kasir). |
| GET | `/api/auth/me` | Protected | Mengambil data profil user yang sedang login. |
| PUT | `/api/auth/change-password` | Protected | Mengganti password user (Butuh password lama). |

### 📦 Katalog & Produk
| Method | URL | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| GET | `/api/menus` | Protected | Melihat daftar produk & stok. |
| POST | `/api/menus` | Admin | Menambah produk baru. |
| PUT | `/api/menus/:id` | Admin | Update info produk atau stok. |
| DELETE | `/api/menus/:id` | Admin | Menghapus produk. |

### 🛒 Transaksi Penjualan
| Method | URL | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| POST | `/api/transactions` | Protected | Membuat transaksi baru & mengurangi stok. |
| GET | `/api/transactions` | Protected | Riwayat transaksi (Kasir: miliknya, Admin: semua). |

### 📊 Laporan & Dashboard (Admin)
| Method | URL | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| GET | `/api/reports/dashboard` | Admin | Statistik ringkasan & data tren 30 hari. |
| GET | `/api/reports/top-selling` | Admin | Daftar produk terlaris per kategori. |

---

## ⚙️ Cara Instalasi

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Buat file `.env` dan lengkapi konfigurasi database:
    ```env
    DB_USER=postgres
    DB_PASSWORD=password_anda
    DB_NAME=pos_db
    DB_HOST=localhost
    JWT_SECRET=rahasia_pos_2024
    PORT=3000
    ```
3.  **Run Development**:
    ```bash
    npm run dev
    ```

---

## 🗄️ Skema Database
Sistem menggunakan **Auto-Sync**. Tabel berikut akan dibuat secara otomatis:
- `Users`: Data Admin & Kasir.
- `Categories`: Pengelompokan produk (Foods, Beverages, Desserts).
- `Menus`: Katalog produk dengan harga dan stok.
- `Transactions`: Header nota penjualan.
- `TransactionItems`: Detail item di dalam setiap nota.

---

## 🛠️ Dokumentasi Lanjutan
Untuk detail arsitektur dan alur kerja yang lebih mendalam, silakan merujuk pada dokumen berikut di folder root:
- [ERD Diagram](file:///erd.md)
- [Flowchart Bisnis](file:///flowchart.md)
- [UML Sequence Diagram](file:///uml.md)
- [Backlog & Roadmap](file:///backlog.md)

---
**Dibuat untuk Sinau Coding Academy** 🎓
