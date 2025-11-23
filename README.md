# Bank Saving System

Full-stack monorepo untuk sistem simpanan bank dengan fitur deposito.

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- Port: 8000

### Frontend
- Next.js 14 + TypeScript
- Tailwind CSS
- Port: 3000

## Project Structure

```
bank-saving-system/
├── apps/
│   ├── backend/          # Express API
│   └── frontend/         # Next.js App
├── docs/                 # Documentation
└── package.json          # Monorepo root
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm

### Installation

```bash
# Install all dependencies
npm install

# Setup backend environment
cd apps/backend
cp .env.example .env
# Edit .env with your database credentials

# Setup frontend environment
cd ../frontend
cp .env.example .env.local
```

### Development

```bash
# Run both backend & frontend
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend
```

### Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## API Documentation

API berjalan di `http://localhost:8000/api/v1`

Endpoint utama:
- `/customers` - Manajemen customer
- `/deposito-types` - Jenis deposito
- `/accounts` - Akun deposito
- `/transactions` - Transaksi

## License

MIT
