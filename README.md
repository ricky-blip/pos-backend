# POS Backend

Backend sederhana untuk aplikasi Point of Sale (POS) dengan struktur mirip **NestJS** menggunakan Express.js.

## 📁 Struktur Folder

```
pos-backend/
├── index.js                    # Entry point - menjalankan server
├── package.json                # Dependencies & scripts
├── .gitignore                  # Git ignore rules
│
└── src/
    ├── app.js                  # Setup Express app (middleware, routes, error handler)
    │
    ├── config/
    │   └── app.js              # Konfigurasi aplikasi (port, environment)
    │
    ├── controllers/
    │   ├── product.controller.js       # Handler HTTP untuk Product
    │   └── transaction.controller.js   # Handler HTTP untuk Transaction
    │
    ├── services/
    │   ├── product.service.js          # Business logic Product
    │   └── transaction.service.js      # Business logic Transaction
    │
    ├── repositories/
    │   ├── product.repository.js       # Data access layer Product (CRUD ke storage)
    │   └── transaction.repository.js   # Data access layer Transaction
    │
    ├── models/
    │   ├── product.model.js            # Class/entitas Product
    │   └── transaction.model.js        # Class/entitas Transaction
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
    │   └── logger.js                   # Logging setiap request
    │
    └── utils/
        └── validation.js               # Fungsi validasi umum
```

## 🏗️ Arsitektur

Alur request mengikuti pola **Layered Architecture** seperti NestJS:

```
HTTP Request
    ↓
[Controller]    → Handle HTTP request/response
    ↓
[Service]       → Business logic & validasi (DTO)
    ↓
[Repository]    → Data access (CRUD ke storage)
    ↓
[Model]         → Data entity/class
```

### Penjelasan Setiap Layer

| Layer | Fungsi | Contoh |
|-------|--------|--------|
| **Controller** | Menerima request HTTP, memanggil service, kirim response | `product.controller.js` |
| **Service** | Business logic, validasi DTO, orchestrasi | `product.service.js` |
| **Repository** | Operasi data (create, read, update, delete) | `product.repository.js` |
| **Model** | Representasi data/entity | `Product`, `Transaction` |
| **DTO** | Data Transfer Object - validasi input | `CreateProductDto` |

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan server (development)
```bash
npm run dev
```

### 3. Jalankan server (production)
```bash
npm start
```

Server berjalan di: `http://localhost:3000`

## 📡 API Endpoints

### Health Check
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/health` | Cek status server |

### Products
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/api/products` | Ambil semua produk |
| GET | `/api/products/:id` | Ambil detail produk |
| POST | `/api/products` | Buat produk baru |
| PUT | `/api/products/:id` | Update produk |
| DELETE | `/api/products/:id` | Hapus produk |

### Transactions
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/api/transactions` | Ambil semua transaksi |
| GET | `/api/transactions/:id` | Ambil detail transaksi |
| POST | `/api/transactions` | Buat transaksi baru |

## 📝 Contoh Penggunaan API

### Buat Produk Baru
```bash
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Kopi Susu",
  "price": 15000,
  "stock": 50,
  "category": "Minuman"
}
```

### Buat Transaksi
```bash
POST http://localhost:3000/api/transactions
Content-Type: application/json

{
  "items": [
    { "productId": 1, "quantity": 2 }
  ],
  "paymentMethod": "cash"
}
```

> **Catatan:** Stok produk akan otomatis berkurang saat transaksi berhasil.

## 🛠️ Teknologi yang Digunakan

| Package | Fungsi |
|---------|--------|
| **Express.js** | Web framework |
| **Cors** | Mengatur akses cross-origin |
| **Helmet** | Keamanan HTTP headers |
| **Nodemon** | Auto-restart saat development |

## 📌 Catatan untuk Pemula

- **Storage saat ini menggunakan array di memori** (data hilang saat server restart). Nanti bisa diganti dengan database seperti MySQL, PostgreSQL, atau MongoDB.
- Setiap layer punya tanggung jawab terpisah — ini memudahkan testing & maintenance.
- Pola **Singleton** digunakan pada Service & Repository agar hanya ada 1 instance.
- DTO bertugas memvalidasi input sebelum diproses di service layer.
