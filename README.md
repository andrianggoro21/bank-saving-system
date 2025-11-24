# Bank Saving System

Full-stack monorepo untuk sistem simpanan bank dengan fitur deposito menggunakan modern tech stack.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **Prisma ORM** (v5.19.1)
- **PostgreSQL** (Database)
- **Zod** (Validation)
- Port: **8000**

### Frontend
- **Next.js 14** + **TypeScript**
- **Tailwind CSS**
- Port: **3000**

## ✨ Features

### Backend API
- ✅ RESTful API dengan Express.js
- ✅ Repository Pattern architecture
- ✅ Zod validation untuk semua endpoints
- ✅ Custom error handling dengan error classes
- ✅ Response formatter yang konsisten
- ✅ BIGINT untuk ID (auto-increment)
- ✅ Decimal type untuk monetary values
- ✅ BigInt JSON serialization

### Modules
1. **Customer Management**
   - CRUD operations
   - Email uniqueness validation
   - Pagination support

2. **Deposito Types**
   - Berbagai jenis deposito (3, 6, 12, 24 bulan)
   - Yearly return percentage management

3. **Account Management**
   - Customer account dengan deposito type
   - Balance tracking
   - Foreign key validation

4. **Transaction System**
   - **Deposit** - menambah balance
   - **Withdraw** - mengurangi balance (dengan validasi)
   - **Interest** - kalkulasi otomatis berdasarkan:
     - Balance account
     - Yearly return dari deposito type
     - Duration dalam bulan
     - Formula: `balance × (yearlyReturn / 100) × (months / 12)`
   - Complete audit trail (balanceBefore, balanceAfter, interestEarned)
   - Auto-update account balance

## 📁 Project Structure

```
bank-saving-system/
├── apps/
│   ├── backend/                      # Express API
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   ├── seed.ts              # Sample data seeder
│   │   │   └── migrations/          # Database migrations
│   │   ├── src/
│   │   │   ├── config/              # Database config
│   │   │   ├── controllers/         # Request handlers
│   │   │   ├── dtos/                # Data Transfer Objects
│   │   │   ├── middleware/          # Express middleware
│   │   │   ├── repositories/        # Database access layer
│   │   │   ├── routes/              # API routes
│   │   │   ├── schemas/             # Zod validation schemas
│   │   │   ├── services/            # Business logic
│   │   │   ├── utils/               # Utilities (error, response, asyncHandler)
│   │   │   ├── app.ts               # Express app setup
│   │   │   └── server.ts            # Server entry point
│   │   ├── test/                    # API test files (*.http)
│   │   └── package.json
│   └── frontend/                     # Next.js App
│       └── ...
├── docs/                             # Documentation
│   ├── requirements.md
│   └── technical-spec.md
└── package.json                      # Monorepo root
```

## 🎯 Getting Started

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bank-saving-system
```

2. **Install all dependencies**
```bash
npm install
```

3. **Setup backend environment**
```bash
cd apps/backend
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bank_saving_dev"
NODE_ENV=development
PORT=8000
```

4. **Setup database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed sample data (optional)
npm run prisma:seed
```

5. **Setup frontend environment**
```bash
cd ../frontend
cp .env.example .env.local
```

### Running the Application

#### Development Mode

```bash
# From root directory - run both backend & frontend
npm run dev

# Or run separately:

# Backend only (port 8000)
npm run dev:backend

# Frontend only (port 3000)
npm run dev:frontend
```

#### Production Build

```bash
# Backend
cd apps/backend
npm run build
npm start

# Frontend
cd apps/frontend
npm run build
npm start
```

## 📚 API Documentation

Base URL: `http://localhost:8000/api/v1`

### Health Check
```http
GET /health
```

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get all customers (with pagination) |
| GET | `/customers/:id` | Get customer by ID |
| POST | `/customers` | Create new customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

**Example Request:**
```json
POST /api/v1/customers
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "address": "Jl. Sudirman No. 123"
}
```

### Deposito Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/deposito-types` | Get all deposito types |
| GET | `/deposito-types/:id` | Get deposito type by ID |
| POST | `/deposito-types` | Create new deposito type |
| PUT | `/deposito-types/:id` | Update deposito type |
| DELETE | `/deposito-types/:id` | Delete deposito type |

**Example Request:**
```json
POST /api/v1/deposito-types
{
  "name": "Deposito 12 Bulan",
  "yearlyReturn": 5.5
}
```

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts` | Get all accounts |
| GET | `/accounts/:id` | Get account by ID |
| GET | `/accounts/customer/:customerId` | Get accounts by customer ID |
| POST | `/accounts` | Create new account |
| PUT | `/accounts/:id` | Update account |
| DELETE | `/accounts/:id` | Delete account |

**Example Request:**
```json
POST /api/v1/accounts
{
  "customerId": "1",
  "depositoTypeId": "2",
  "balance": 10000000
}
```

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/:id` | Get transaction by ID |
| GET | `/transactions/account/:accountId` | Get transactions by account ID |
| POST | `/transactions` | Create new transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

**Example Requests:**

**Deposit:**
```json
POST /api/v1/transactions
{
  "accountId": "1",
  "type": "deposit",
  "amount": 5000000,
  "transactionDate": "2025-11-23T10:00:00Z",
  "notes": "Initial deposit"
}
```

**Withdraw:**
```json
POST /api/v1/transactions
{
  "accountId": "1",
  "type": "withdraw",
  "amount": 2000000,
  "transactionDate": "2025-11-23T11:00:00Z",
  "notes": "Partial withdrawal"
}
```

**Interest Calculation:**
```json
POST /api/v1/transactions
{
  "accountId": "1",
  "type": "interest",
  "amount": 0,
  "transactionDate": "2025-11-23T12:00:00Z",
  "monthsDuration": 12,
  "notes": "12 months interest"
}
```

### Response Format

**Success Response:**
```json
{
  "code": 200,
  "status": "OK",
  "message": "Success message",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**
```json
{
  "code": 400,
  "status": "BAD_REQUEST",
  "message": "Validation failed",
  "error": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🗄️ Database Schema

### Models

#### Customer
```prisma
model Customer {
  id        BigInt   @id @default(autoincrement())
  name      String   @db.VarChar(255)
  email     String   @unique @db.VarChar(255)
  phone     String   @db.VarChar(20)
  address   String   @db.VarChar(500)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  accounts  Account[]
}
```

#### DepositoType
```prisma
model DepositoType {
  id           BigInt   @id @default(autoincrement())
  name         String   @unique @db.VarChar(100)
  yearlyReturn Decimal  @db.Decimal(5, 2)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  accounts     Account[]
}
```

#### Account
```prisma
model Account {
  id              BigInt        @id @default(autoincrement())
  customerId      BigInt
  depositoTypeId  BigInt
  balance         Decimal       @db.Decimal(15, 2)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  customer        Customer      @relation(fields: [customerId], references: [id])
  depositoType    DepositoType  @relation(fields: [depositoTypeId], references: [id])
  transactions    Transaction[]
}
```

#### Transaction
```prisma
model Transaction {
  id              BigInt    @id @default(autoincrement())
  accountId       BigInt
  type            String    @db.VarChar(20)
  amount          Decimal   @db.Decimal(15, 2)
  transactionDate DateTime
  balanceBefore   Decimal   @db.Decimal(15, 2)
  balanceAfter    Decimal   @db.Decimal(15, 2)
  monthsDuration  Decimal?  @db.Decimal(3, 0)
  interestEarned  Decimal?  @db.Decimal(15, 2)
  notes           String?   @db.VarChar(500)
  createdAt       DateTime  @default(now())
  account         Account   @relation(fields: [accountId], references: [id])
}
```

### Relationships
- **Customer** → **Account** (One-to-Many)
- **DepositoType** → **Account** (One-to-Many)
- **Account** → **Transaction** (One-to-Many)

## 🛠️ Development

### Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Reset database (careful!)
npx prisma migrate reset

# Seed sample data
npm run prisma:seed

# Open Prisma Studio (GUI)
npm run prisma:studio
```

### Sample Data (Seed)

Run `npm run prisma:seed` to populate database with:
- 5 Sample customers
- 4 Deposito types (3, 6, 12, 24 months)
- 6 Accounts with realistic balances
- 9 Transactions (deposits, withdrawals, interest calculations)

### Testing

API test files tersedia di `apps/backend/test/*.http`

Gunakan REST Client extension di VS Code untuk menjalankan tests:
- `customer-api-tests.http`
- `deposito-type-api-tests.http`
- `account-api-tests.http`
- `transaction-api-tests.http`

### Architecture

```
┌─────────────┐
│  Controller │ ← Request Handler
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Service   │ ← Business Logic
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Repository  │ ← Database Access
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Prisma    │ ← ORM
└─────────────┘
```

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Repository Pattern
- DTOs for type safety
- Zod for validation
- Custom error classes

## 📝 License

MIT

## 👤 Author

Engineering Test - Belimbing.ai

---

**Note:** This is a test project for Belimbing.ai engineering assessment.
