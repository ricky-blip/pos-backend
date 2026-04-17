# POS Backend

Backend sederhana untuk aplikasi Point of Sale (POS) dengan struktur mirip **NestJS** menggunakan Express.js + Sequelize ORM + PostgreSQL.

---

## 📁 Struktur Folder

```
pos-backend/
├── index.js                    # Entry point - menjalankan server + dotenv
├── package.json                # Dependencies & scripts
├── .env                        # Environment variables (tidak di-commit)
├── .env.example                # Template .env
├── .gitignore                  # Git ignore rules
│
└── src/
    ├── app.js                  # Setup Express app (middleware, routes, error handler, DB sync)
    │
    ├── config/
    │   ├── app.js              # Konfigurasi aplikasi (port, environment)
    │   └── database.js         # Konfigurasi koneksi database Sequelize
    │
    ├── controllers/
    │   ├── auth.controller.js          # Handler HTTP Auth (register, login)
    │   ├── product.controller.js       # Handler HTTP Product CRUD
    │   └── transaction.controller.js   # Handler HTTP Transaction CRUD
    │
    ├── services/
    │   ├── auth.service.js             # Business logic Auth (JWT, password hash)
    │   ├── product.service.js          # Business logic Product
    │   └── transaction.service.js      # Business logic Transaction
    │
    ├── repositories/
    │   ├── user.repository.js          # Data access layer User
    │   ├── product.repository.js       # Data access layer Product
    │   └── transaction.repository.js   # Data access layer Transaction
    │
    ├── models/
    │   ├── user.model.js               # Sequelize model User
    │   ├── product.model.js            # Sequelize model Product
    │   └── transaction.model.js        # Sequelize model Transaction
    │
    ├── dto/
    │   ├── create-product.dto.js       # Validasi input Product
    │   └── create-transaction.dto.js   # Validasi input Transaction
    │
    ├── routes/
    │   └── index.js                    # Definisi semua route API
    │
    ├── middleware/
    │   ├── errorHandler.js             # Global error handling
    │   ├── logger.js                   # Logging setiap request
    │   └── authMiddleware.js           # Verifikasi JWT token & role guard
    │
    ├── seeders/
    │   └── user.seeder.js              # Seeder user default (admin & kasir)
    │
    └── utils/
        └── validation.js               # Fungsi validasi umum
```

---

## 🏗️ Arsitektur

Alur request mengikuti pola **Layered Architecture** seperti NestJS:

```
HTTP Request
    ↓
[Controller]    → Handle HTTP request/response
    ↓
[Service]       → Business logic & validasi (DTO, JWT, bcrypt)
    ↓
[Repository]    → Data access (CRUD via Sequelize ORM)
    ↓
[Model]         → Sequelize model (definisi tabel database)
    ↓
[PostgreSQL]    → Database storage
```

### Penjelasan Setiap Layer

| Layer | Fungsi | Contoh |
|-------|--------|--------|
| **Controller** | Menerima request HTTP, panggil service, kirim response | `auth.controller.js`, `product.controller.js` |
| **Service** | Business logic, validasi DTO, JWT, password hashing | `auth.service.js` |
| **Repository** | Operasi data (create, read, update, delete) via Sequelize | `user.repository.js` |
| **Model** | Definisi tabel database (Sequelize) | `User`, `Product`, `Transaction` |
| **DTO** | Data Transfer Object - validasi input | `CreateProductDto` |
| **Middleware** | Cross-cutting concerns (auth, logging, error) | `authMiddleware.js` |

---

## 🔐 Autentikasi & Authorization

### Flow Login
```
POST /api/auth/login
    ↓
Cari user di database (by username)
    ↓
Cek password (bcrypt.compare)
    ↓
Generate JWT token
    ↓
Return { user, token }
```

### Flow Protected Route
```
Request → Middleware cek Authorization header
    ↓
Verifikasi JWT token
    ↓
Token valid → Lanjut ke controller
    ↓
Token invalid → 401 Unauthorized
```

### Role-Based Access
```javascript
authMiddleware          // Cek token valid
roleMiddleware('admin') // Cek role = admin
roleMiddleware('cashier') // Cek role = cashier
```

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Database (PostgreSQL)

Buat database `pos_db` di pgAdmin:
- Klik kanan **Databases** → **Create** → **Database**
- Name: `pos_db`
- Owner: `postgres`

### 3. Konfigurasi Environment

Buat file `.env` (copy dari `.env.example`):
```bash
copy .env.example .env
```

Edit sesuai database kamu:
```env
DB_USER=postgres
DB_PASSWORD=password_pgadmin_kamu
DB_NAME=pos_db
DB_HOST=localhost
DB_PORT=5432
PORT=3000
NODE_ENV=development
JWT_SECRET=pos-secret-key-2024
```

### 4. Jalankan server

**Development (auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server berjalan di: `http://localhost:3000`

---

## 📡 API Endpoints

### Health Check
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/health` | Cek status server & database |

### Auth (Public - tidak perlu token)
| Method | URL | Deskripsi |
|--------|-----|-----------|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login user |

### Products (Protected - butuh token)
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/api/products` | Ambil semua produk |
| GET | `/api/products/:id` | Ambil detail produk |
| POST | `/api/products` | Buat produk baru |
| PUT | `/api/products/:id` | Update produk |
| DELETE | `/api/products/:id` | Hapus produk |

### Transactions (Protected - butuh token)
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/api/transactions` | Ambil semua transaksi |
| GET | `/api/transactions/:id` | Ambil detail transaksi |
| POST | `/api/transactions` | Buat transaksi baru |

---

## 📝 Contoh Penggunaan API

### 1. Registrasi User Baru
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "kasir1",
  "email": "kasir1@pos.com",
  "password": "password123",
  "role": "cashier"
}
```

### 2. Login (Dapat Token)
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@pos.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Akses Endpoint Protected
```bash
GET http://localhost:3000/api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 4. Buat Produk Baru
```bash
POST http://localhost:3000/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Kopi Susu",
  "price": 15000,
  "stock": 50,
  "category": "Minuman"
}
```

### 5. Buat Transaksi
```bash
POST http://localhost:3000/api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "productId": 1, "quantity": 2 }
  ],
  "paymentMethod": "cash"
}
```

> **Catatan:** Stok produk otomatis berkurang saat transaksi berhasil.

---

## 🗄️ Database

### Teknologi
- **PostgreSQL** — Database
- **Sequelize ORM** — ORM (Object-Relational Mapping)
- **Auto Sync** — Tabel otomatis dibuat saat server start

### Tabel yang Dibuat Otomatis

| Tabel | Kolom | Deskripsi |
|-------|-------|-----------|
| **users** | id, username, email, password (hashed), role, createdAt, updatedAt | Data user |
| **products** | id, name, price, stock, category, createdAt, updatedAt | Data produk |
| **transactions** | id, items (JSON), totalAmount, paymentMethod, status, createdAt, updatedAt | Data transaksi |

### Seed User (Otomatis)

Saat server dijalankan, user default otomatis dibuat:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | admin |
| `kasir` | `kasir123` | cashier |

---

## 🛠️ Teknologi yang Digunakan

| Package | Fungsi |
|---------|--------|
| **Express.js** | Web framework |
| **Sequelize** | ORM untuk PostgreSQL |
| **pg** | Driver PostgreSQL |
| **pg-hstore** | Serializer hstore untuk PostgreSQL |
| **bcryptjs** | Hash password |
| **jsonwebtoken** | JWT token (autentikasi) |
| **dotenv** | Load environment variables dari .env |
| **Cors** | Mengatur akses cross-origin |
| **Helmet** | Keamanan HTTP headers |
| **Nodemon** | Auto-restart saat development |

---

## 📌 Catatan untuk Pemula

- **Setiap layer punya tanggung jawab terpisah** — memudahkan testing & maintenance
- **Pola Singleton** pada Service & Repository — hanya 1 instance
- **DTO** memvalidasi input sebelum diproses di service layer
- **JWT Token** expire dalam 7 hari (bisa diubah di `.env`)
- **Password di-hash** pakai bcrypt — tidak tersimpan plain text
- **Database auto-sync** — tabel dibuat otomatis saat server start
- **Seeder otomatis** — user admin & kasir langsung tersedia

---

**Dibuat untuk Final Project Sinau Coding Academy** 🎓
