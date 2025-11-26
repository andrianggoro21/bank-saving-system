# API Endpoints Definition - Bank Saving System

## Mengapa API Design Harus Dibuat Setelah Database Schema?

**API adalah JEMBATAN antara Frontend dan Database**

### Alasan API Design di Step 3:

1. ✅ **Database Schema Sudah Clear** - Tahu table & fields apa yang ada
2. ✅ **Wireframe Sudah Ada** - Tahu screen apa yang perlu data apa
3. ✅ **Request/Response Structure Jelas** - Berdasarkan database columns
4. ✅ **RESTful Best Practices** - Standard HTTP methods & status codes
5. ✅ **Validation Rules** - Berdasarkan database constraints
6. ✅ **Frontend Development Ready** - Frontend dev bisa mulai parallel

---

## API Architecture

### Technology Stack:

**Backend:** **Express.js + TypeScript + Prisma ORM**

**Why This Stack?**

| Technology | Why? |
|------------|------|
| **Express.js** | Minimalist, flexible, widely used |
| **TypeScript** | Type safety, better DX, catch errors at compile time |
| **Prisma ORM** | Type-safe database client, auto-generated types, great DX |

### Tech Stack Details:

```
Language:          TypeScript 5.x
Backend Framework: Express.js 4.x
ORM:               Prisma 5.x
Database:          PostgreSQL (recommended) or MySQL
Validation:        Zod (type-safe validation)
Environment:       dotenv
```

### Why Prisma?

| Feature | Benefit |
|---------|---------|
| ✅ **Type Safety** | Auto-generated TypeScript types dari schema |
| ✅ **Prisma Client** | Intuitive API, autocomplete di IDE |
| ✅ **Migrations** | Database schema versioning |
| ✅ **Prisma Studio** | Visual database browser (GUI) |
| ✅ **Performance** | Optimized queries, connection pooling |
| ✅ **Great DX** | Excellent developer experience |

---

## API Design Principles

### RESTful Standards:

```
GET     /resource       → List all
GET     /resource/:id   → Get one
POST    /resource       → Create new
PUT     /resource/:id   → Update (full replace)
PATCH   /resource/:id   → Update (partial)
DELETE  /resource/:id   → Delete
```

### HTTP Status Codes:

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE (no response body) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource, constraint violation |
| 422 | Unprocessable Entity | Validation error (business logic) |
| 500 | Internal Server Error | Server error, unhandled exception |

---

## Base URL Structure

```
Production:  https://bank-saving.yourdomain.com/api/v1
Development: http://localhost:3000/api/v1
```

**Why `/api/v1`?**
- `/api` = clear separation from frontend routes
- `/v1` = versioning support (future: v2, v3)

---

## API Endpoints Overview

| Resource | Endpoints | Count |
|----------|-----------|-------|
| **Customers** | CRUD operations | 5 |
| **Deposito Types** | CRUD operations | 5 |
| **Accounts** | CRUD + transactions | 5 |
| **Transactions** | List, deposit, withdraw, calculate | 4 |
| **Total** | | **19 endpoints** |

---

## 1. CUSTOMER ENDPOINTS

### 1.1 Get All Customers

```
GET /api/v1/customers
```

**Purpose:** List all customers (for dropdown, table list)

**Query Parameters:**
```
?page=1              // Pagination page number (default: 1)
?limit=10            // Items per page (default: 10)
?search=john         // Search by name
?sort=name           // Sort field (name, created_at)
?order=asc           // Sort order (asc, desc)
```

**Request Example:**
```http
GET /api/v1/customers?page=1&limit=10&search=john&sort=name&order=asc
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "total_accounts": 2,
      "total_balance": 70000000.00,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "total_accounts": 1,
      "total_balance": 10000000.00,
      "created_at": "2025-01-02T00:00:00.000Z",
      "updated_at": "2025-01-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**TypeScript Types:**
```typescript
interface Customer {
  id: number;
  name: string;
  total_accounts: number;
  total_balance: number;
  created_at: Date;
  updated_at: Date;
}

interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
```

---

### 1.2 Get Customer by ID

```
GET /api/v1/customers/:id
```

**Purpose:** Get customer detail with all accounts

**Request Example:**
```http
GET /api/v1/customers/1
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "accounts": [
      {
        "id": 1,
        "deposito_type": {
          "id": 3,
          "name": "Gold",
          "yearly_return": 7.00
        },
        "balance": 50000000.00,
        "created_at": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total_accounts": 1,
    "total_balance": 50000000.00
  }
}
```

**Response 404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer with ID 999 not found"
  }
}
```

---

### 1.3 Create Customer

```
POST /api/v1/customers
```

**Purpose:** Create new customer

**Request Body:**
```json
{
  "name": "Ahmad Abdullah"
}
```

**Validation Rules:**
- `name`: required, string, min 2 chars, max 255 chars

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Ahmad Abdullah",
    "created_at": "2025-11-22T10:30:00.000Z",
    "updated_at": "2025-11-22T10:30:00.000Z"
  },
  "message": "Customer created successfully"
}
```

**Response 400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "name": ["Name is required", "Name must be at least 2 characters"]
    }
  }
}
```

---

### 1.4 Update Customer

```
PUT /api/v1/customers/:id
```

**Purpose:** Update customer data

**Request Body:**
```json
{
  "name": "John Doe Updated"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-11-22T10:35:00.000Z"
  },
  "message": "Customer updated successfully"
}
```

---

### 1.5 Delete Customer

```
DELETE /api/v1/customers/:id
```

**Purpose:** Delete customer (only if no accounts)

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

**Response 409 Conflict:**
```json
{
  "success": false,
  "error": {
    "code": "CUSTOMER_HAS_ACCOUNTS",
    "message": "Cannot delete customer with existing accounts",
    "details": {
      "customer_id": 1,
      "active_accounts": 2
    }
  }
}
```

---

## 2. DEPOSITO TYPE ENDPOINTS

### 2.1 Get All Deposito Types

```
GET /api/v1/deposito-types
```

**Purpose:** List all deposito types (master data)

**Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bronze",
      "yearly_return": 3.00,
      "monthly_return": 0.25,
      "total_accounts": 15,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Silver",
      "yearly_return": 5.00,
      "monthly_return": 0.4167,
      "total_accounts": 28,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Gold",
      "yearly_return": 7.00,
      "monthly_return": 0.5833,
      "total_accounts": 42,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Why include `monthly_return`?**
- Frontend tidak perlu calculate sendiri
- Consistency: semua calculation di backend
- Formula: `monthly_return = yearly_return / 12`

---

### 2.2 Get Deposito Type by ID

```
GET /api/v1/deposito-types/:id
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Gold",
    "yearly_return": 7.00,
    "monthly_return": 0.5833,
    "total_accounts": 42,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 2.3 Create Deposito Type

```
POST /api/v1/deposito-types
```

**Request Body:**
```json
{
  "name": "Platinum",
  "yearly_return": 10.00
}
```

**Validation Rules:**
- `name`: required, string, unique, max 100 chars
- `yearly_return`: required, number, min 0.01, max 100

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Platinum",
    "yearly_return": 10.00,
    "monthly_return": 0.8333,
    "total_accounts": 0,
    "created_at": "2025-11-22T10:40:00.000Z",
    "updated_at": "2025-11-22T10:40:00.000Z"
  },
  "message": "Deposito type created successfully"
}
```

**Response 409 Conflict:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_DEPOSITO_NAME",
    "message": "Deposito type with name 'Gold' already exists"
  }
}
```

---

### 2.4 Update Deposito Type

```
PUT /api/v1/deposito-types/:id
```

**Request Body:**
```json
{
  "name": "Gold Premium",
  "yearly_return": 7.50
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Gold Premium",
    "yearly_return": 7.50,
    "monthly_return": 0.625,
    "total_accounts": 42,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-11-22T10:45:00.000Z"
  },
  "message": "Deposito type updated successfully"
}
```

---

### 2.5 Delete Deposito Type

```
DELETE /api/v1/deposito-types/:id
```

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Deposito type deleted successfully"
}
```

**Response 409 Conflict:**
```json
{
  "success": false,
  "error": {
    "code": "DEPOSITO_TYPE_IN_USE",
    "message": "Cannot delete deposito type with existing accounts",
    "details": {
      "deposito_type_id": 3,
      "active_accounts": 42
    }
  }
}
```

---

## 3. ACCOUNT ENDPOINTS

### 3.1 Get All Accounts

```
GET /api/v1/accounts
```

**Purpose:** List all accounts with filters

**Query Parameters:**
```
?page=1
?limit=10
?customer_id=1           // Filter by customer
?deposito_type_id=3      // Filter by deposito type
?sort=balance            // Sort field
?order=desc              // Sort order
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer": {
        "id": 1,
        "name": "John Doe"
      },
      "deposito_type": {
        "id": 3,
        "name": "Gold",
        "yearly_return": 7.00,
        "monthly_return": 0.5833
      },
      "balance": 50000000.00,
      "last_transaction_date": "2025-01-01",
      "transaction_count": 1,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

---

### 3.2 Get Account by ID

```
GET /api/v1/accounts/:id
```

**Purpose:** Get account detail with transaction history

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer": {
      "id": 1,
      "name": "John Doe"
    },
    "deposito_type": {
      "id": 3,
      "name": "Gold",
      "yearly_return": 7.00,
      "monthly_return": 0.5833
    },
    "balance": 50000000.00,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "statistics": {
      "total_deposits": 50000000.00,
      "total_withdrawals": 0.00,
      "transaction_count": 1,
      "first_deposit_date": "2025-01-01",
      "last_transaction_date": "2025-01-01"
    },
    "transactions": [
      {
        "id": 1,
        "type": "deposit",
        "amount": 50000000.00,
        "transaction_date": "2025-01-01",
        "balance_before": 0.00,
        "balance_after": 50000000.00,
        "created_at": "2025-01-01T08:30:00.000Z"
      }
    ]
  }
}
```

---

### 3.3 Create Account

```
POST /api/v1/accounts
```

**Purpose:** Open new account for customer

**Request Body:**
```json
{
  "customer_id": 1,
  "deposito_type_id": 3,
  "initial_balance": 50000000.00,
  "initial_deposit_date": "2025-01-01"
}
```

**Validation Rules:**
- `customer_id`: required, must exist in customers table
- `deposito_type_id`: required, must exist in deposito_types table
- `initial_balance`: optional, number, min 0, default 0
- `initial_deposit_date`: required if initial_balance > 0

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "customer": {
      "id": 1,
      "name": "John Doe"
    },
    "deposito_type": {
      "id": 3,
      "name": "Gold",
      "yearly_return": 7.00
    },
    "balance": 50000000.00,
    "created_at": "2025-11-22T11:00:00.000Z",
    "updated_at": "2025-11-22T11:00:00.000Z"
  },
  "message": "Account created successfully"
}
```

**What happens internally (Prisma Transaction):**
```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. Create account
  const account = await tx.account.create({
    data: {
      customer_id,
      deposito_type_id,
      balance: initial_balance || 0
    }
  });

  // 2. If initial_balance > 0, create deposit transaction
  if (initial_balance > 0) {
    await tx.transaction.create({
      data: {
        account_id: account.id,
        type: 'deposit',
        amount: initial_balance,
        transaction_date: initial_deposit_date,
        balance_before: 0,
        balance_after: initial_balance
      }
    });
  }

  return account;
});
```

---

### 3.4 Update Account

```
PUT /api/v1/accounts/:id
```

**Purpose:** Update account (change deposito type only)

**Request Body:**
```json
{
  "deposito_type_id": 2
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer": {
      "id": 1,
      "name": "John Doe"
    },
    "deposito_type": {
      "id": 2,
      "name": "Silver",
      "yearly_return": 5.00
    },
    "balance": 50000000.00,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-11-22T11:05:00.000Z"
  },
  "message": "Account updated successfully"
}
```

**⚠️ Note:**
- Customer TIDAK bisa diubah (business rule)
- Balance TIDAK bisa diubah via update (only via deposit/withdraw)

---

### 3.5 Delete Account

```
DELETE /api/v1/accounts/:id
```

**Purpose:** Close account (only if balance = 0)

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Response 409 Conflict:**
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_HAS_BALANCE",
    "message": "Cannot delete account with non-zero balance",
    "details": {
      "account_id": 1,
      "current_balance": 50000000.00
    }
  }
}
```

---

## 4. TRANSACTION ENDPOINTS

### 4.1 Get Transactions

```
GET /api/v1/transactions
```

**Purpose:** List all transactions (for reporting)

**Query Parameters:**
```
?page=1
?limit=20
?account_id=1            // Filter by account
?type=deposit            // Filter: deposit or withdraw
?start_date=2025-01-01   // Date range start
?end_date=2025-12-31     // Date range end
?sort=transaction_date   // Sort field
?order=desc              // Sort order
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "account": {
        "id": 1,
        "customer_name": "John Doe",
        "deposito_type": "Gold"
      },
      "type": "deposit",
      "amount": 50000000.00,
      "transaction_date": "2025-01-01",
      "balance_before": 0.00,
      "balance_after": 50000000.00,
      "months_duration": null,
      "interest_earned": null,
      "notes": null,
      "created_at": "2025-01-01T08:30:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

### 4.2 Deposit Money

```
POST /api/v1/transactions/deposit
```

**Purpose:** Deposit money to account (CORE FEATURE)

**Request Body:**
```json
{
  "account_id": 1,
  "amount": 10000000.00,
  "transaction_date": "2025-11-22",
  "notes": "Monthly deposit"
}
```

**Validation Rules:**
- `account_id`: required, must exist
- `amount`: required, number, must be > 0
- `transaction_date`: required, date, cannot be future date
- `notes`: optional, string, max 500 chars

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 25,
      "account_id": 1,
      "type": "deposit",
      "amount": 10000000.00,
      "transaction_date": "2025-11-22",
      "balance_before": 50000000.00,
      "balance_after": 60000000.00,
      "notes": "Monthly deposit",
      "created_at": "2025-11-22T11:15:00.000Z"
    },
    "account": {
      "id": 1,
      "balance": 60000000.00
    }
  },
  "message": "Deposit successful"
}
```

**Prisma Transaction Implementation:**
```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. Get & lock account
  const account = await tx.account.findUnique({
    where: { id: account_id }
  });

  if (!account) throw new Error('Account not found');

  const newBalance = account.balance + amount;

  // 2. Create transaction record
  const transaction = await tx.transaction.create({
    data: {
      account_id,
      type: 'deposit',
      amount,
      transaction_date,
      balance_before: account.balance,
      balance_after: newBalance,
      notes
    }
  });

  // 3. Update account balance
  await tx.account.update({
    where: { id: account_id },
    data: { balance: newBalance }
  });

  return { transaction, account: { id: account_id, balance: newBalance } };
});
```

---

### 4.3 Calculate Withdrawal Preview (CRITICAL ENDPOINT)

```
POST /api/v1/transactions/calculate-withdrawal
```

**Purpose:** Calculate ending balance BEFORE actual withdrawal (preview)

**Request Body:**
```json
{
  "account_id": 1,
  "withdrawal_date": "2025-11-22"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "account_id": 1,
    "customer_name": "John Doe",
    "deposito_type": {
      "name": "Gold",
      "yearly_return": 7.00,
      "monthly_return": 0.5833
    },
    "calculation": {
      "starting_balance": 50000000.00,
      "first_deposit_date": "2025-01-01",
      "withdrawal_date": "2025-11-22",
      "duration": {
        "months": 10,
        "days": 21,
        "total_months_decimal": 10.70
      },
      "monthly_return_rate": 0.005833,
      "interest_earned": 3120833.33,
      "ending_balance": 53120833.33,
      "formula_used": "ending_balance = starting_balance × (1 + monthly_return × months)"
    }
  },
  "message": "If you withdraw on 2025-11-22, you will receive Rp 53,120,833.33"
}
```

**Why this endpoint is CRITICAL?**
- ✅ **Requirement**: "system must calculate and show to customer"
- ✅ User harus lihat calculation SEBELUM confirm withdrawal
- ✅ Transparency + trust
- ✅ Prevent disputes

**Response 422 Unprocessable Entity:**
```json
{
  "success": false,
  "error": {
    "code": "NO_DEPOSITS_FOUND",
    "message": "Account has no deposits yet. Cannot calculate withdrawal.",
    "details": {
      "account_id": 1,
      "current_balance": 0.00
    }
  }
}
```

---

### 4.4 Withdraw Money (CORE FEATURE)

```
POST /api/v1/transactions/withdraw
```

**Purpose:** Withdraw money from account with interest calculation

**Request Body:**
```json
{
  "account_id": 1,
  "withdrawal_date": "2025-11-22",
  "notes": "Account closure"
}
```

**Validation Rules:**
- `account_id`: required, must exist
- `withdrawal_date`: required, date, must be >= first deposit date
- `notes`: optional, string, max 500 chars

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 26,
      "account_id": 1,
      "type": "withdraw",
      "amount": 53120833.33,
      "transaction_date": "2025-11-22",
      "balance_before": 50000000.00,
      "balance_after": 0.00,
      "months_duration": 10.70,
      "interest_earned": 3120833.33,
      "notes": "Account closure",
      "created_at": "2025-11-22T11:30:00.000Z"
    },
    "account": {
      "id": 1,
      "balance": 0.00
    },
    "calculation_details": {
      "starting_balance": 50000000.00,
      "months_duration": 10.70,
      "monthly_return_rate": 0.005833,
      "interest_earned": 3120833.33,
      "total_received": 53120833.33
    }
  },
  "message": "Withdrawal successful. Total amount: Rp 53,120,833.33"
}
```

**Prisma Transaction Implementation:**
```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. Get account with deposito type
  const account = await tx.account.findUnique({
    where: { id: account_id },
    include: { deposito_type: true }
  });

  if (!account) throw new Error('Account not found');
  if (account.balance === 0) throw new Error('Insufficient balance');

  // 2. Get first deposit date
  const firstDeposit = await tx.transaction.findFirst({
    where: { account_id, type: 'deposit' },
    orderBy: { transaction_date: 'asc' }
  });

  // 3. Calculate withdrawal
  const calculation = calculateWithdrawal(
    account.balance,
    account.deposito_type.yearly_return,
    firstDeposit.transaction_date,
    withdrawal_date
  );

  // 4. Create withdrawal transaction
  const transaction = await tx.transaction.create({
    data: {
      account_id,
      type: 'withdraw',
      amount: calculation.endingBalance,
      transaction_date: withdrawal_date,
      balance_before: account.balance,
      balance_after: 0,
      months_duration: calculation.monthsDuration,
      interest_earned: calculation.interestEarned,
      notes
    }
  });

  // 5. Update account balance to 0
  await tx.account.update({
    where: { id: account_id },
    data: { balance: 0 }
  });

  return { transaction, account: { id: account_id, balance: 0 }, calculation };
});
```

---

## Calculation Formula Implementation

### Formula (Corrected from PDF):

```typescript
// ❌ WRONG (dari PDF):
// ending_balance = starting_balance * months * monthly_return

// ✅ CORRECT (Simple Interest):
ending_balance = starting_balance * (1 + (monthly_return * months))

// Where:
// monthly_return = yearly_return / 12 / 100
// months = duration in months (decimal, e.g., 10.7)
```

### TypeScript Implementation:

```typescript
// src/utils/calculateWithdrawal.ts

interface WithdrawalCalculation {
  startingBalance: number;
  endingBalance: number;
  interestEarned: number;
  monthsDuration: number;
  monthlyReturnRate: number;
  depositDate: string;
  withdrawalDate: string;
}

export function calculateWithdrawal(
  startingBalance: number,
  yearlyReturn: number,
  depositDate: Date | string,
  withdrawalDate: Date | string
): WithdrawalCalculation {
  // Parse dates
  const start = new Date(depositDate);
  const end = new Date(withdrawalDate);

  // Calculate duration in months (decimal)
  const yearsDiff = end.getFullYear() - start.getFullYear();
  const monthsDiff = end.getMonth() - start.getMonth();
  const daysDiff = end.getDate() - start.getDate();

  const totalMonths = yearsDiff * 12 + monthsDiff + daysDiff / 30;

  // Calculate monthly return rate (as decimal)
  const monthlyReturnRate = yearlyReturn / 12 / 100;

  // Calculate ending balance (CORRECTED FORMULA)
  const endingBalance = startingBalance * (1 + monthlyReturnRate * totalMonths);

  // Calculate interest earned
  const interestEarned = endingBalance - startingBalance;

  return {
    startingBalance: parseFloat(startingBalance.toFixed(2)),
    endingBalance: parseFloat(endingBalance.toFixed(2)),
    interestEarned: parseFloat(interestEarned.toFixed(2)),
    monthsDuration: parseFloat(totalMonths.toFixed(2)),
    monthlyReturnRate: parseFloat(monthlyReturnRate.toFixed(6)),
    depositDate: start.toISOString().split('T')[0],
    withdrawalDate: end.toISOString().split('T')[0],
  };
}
```

---

## API Response Format Standard

### Success Response:

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}
```

### Error Response:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
```

---

## Express + TypeScript + Prisma Setup

### Project Structure:

```
backend/
├── src/
│   ├── controllers/
│   │   ├── customerController.ts
│   │   ├── depositoTypeController.ts
│   │   ├── accountController.ts
│   │   └── transactionController.ts
│   ├── routes/
│   │   ├── customerRoutes.ts
│   │   ├── depositoTypeRoutes.ts
│   │   ├── accountRoutes.ts
│   │   └── transactionRoutes.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validateRequest.ts
│   ├── utils/
│   │   ├── calculateWithdrawal.ts
│   │   └── responseFormatter.ts
│   ├── types/
│   │   └── api.types.ts
│   ├── prisma/
│   │   └── client.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json
└── tsconfig.json
```

### Main Server File:

```typescript
// src/server.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import customerRoutes from './routes/customerRoutes';
import depositoTypeRoutes from './routes/depositoTypeRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/deposito-types', depositoTypeRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## API Endpoints Summary Table

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/customers` | GET | List customers |
| `/api/v1/customers/:id` | GET | Get customer detail |
| `/api/v1/customers` | POST | Create customer |
| `/api/v1/customers/:id` | PUT | Update customer |
| `/api/v1/customers/:id` | DELETE | Delete customer |
| `/api/v1/deposito-types` | GET | List deposito types |
| `/api/v1/deposito-types/:id` | GET | Get deposito type |
| `/api/v1/deposito-types` | POST | Create deposito type |
| `/api/v1/deposito-types/:id` | PUT | Update deposito type |
| `/api/v1/deposito-types/:id` | DELETE | Delete deposito type |
| `/api/v1/accounts` | GET | List accounts |
| `/api/v1/accounts/:id` | GET | Get account detail |
| `/api/v1/accounts` | POST | Create account |
| `/api/v1/accounts/:id` | PUT | Update account |
| `/api/v1/accounts/:id` | DELETE | Delete account |
| `/api/v1/transactions` | GET | List transactions |
| `/api/v1/transactions/deposit` | POST | Deposit money |
| `/api/v1/transactions/calculate-withdrawal` | POST | Calculate preview |
| `/api/v1/transactions/withdraw` | POST | Withdraw money |

**Total:** 19 endpoints

---

## Next Steps

Dengan API Endpoints definition ini:

1. ✅ **Map APIs to Screens** - Screen mana call endpoint mana
2. ✅ **Create API Documentation** - Swagger/OpenAPI format
3. ✅ **Create Postman Collection** - For testing
4. ✅ **Prisma Schema** - Database schema with Prisma

---

**Status**: ✅ COMPLETE - Ready for API Mapping
**Technology**: Express.js + TypeScript + Prisma ORM
**Last Updated**: 2025-11-22
