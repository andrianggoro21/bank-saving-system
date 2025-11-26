# API Documentation - Bank Saving System

## Mengapa API Documentation Penting?

**API Documentation adalah CONTRACT antara Frontend & Backend Developer**

### Alasan API Documentation di Step 5:

1. ✅ **Self-Service** - Developer bisa explore API tanpa tanya-tanya
2. ✅ **Interactive Testing** - Swagger UI bisa langsung test API
3. ✅ **Always Up-to-Date** - Documentation as code
4. ✅ **Onboarding** - New developer bisa cepat understand API
5. ✅ **Client Generation** - Auto-generate client SDK dari OpenAPI spec
6. ✅ **API Versioning** - Clear specification untuk setiap version

---

## How to Use This Documentation

### Option 1: Swagger UI (Interactive)

1. **View Online:**
   - Copy `05-api-documentation-swagger.yaml` content
   - Paste ke https://editor.swagger.io/
   - Interactive documentation dengan "Try it out" button

2. **Run Locally:**
   ```bash
   # Install swagger-ui-express
   npm install swagger-ui-express yamljs

   # Add to Express server
   const swaggerUi = require('swagger-ui-express');
   const YAML = require('yamljs');
   const swaggerDocument = YAML.load('./docs/05-api-documentation-swagger.yaml');

   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   ```

3. **Access:** http://localhost:3000/api-docs

---

### Option 2: Postman (Testing)

1. Import `05-api-documentation-swagger.yaml` ke Postman
2. Postman will auto-generate collection dari OpenAPI spec
3. Ready to test!

---

### Option 3: Generate Client SDK

```bash
# Generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i docs/05-api-documentation-swagger.yaml \
  -g typescript-axios \
  -o src/api-client

# Generate Python client
npx @openapitools/openapi-generator-cli generate \
  -i docs/05-api-documentation-swagger.yaml \
  -g python \
  -o python-client
```

---

## API Overview

### Base URL

```
Development:  http://localhost:3000/api/v1
Production:   https://bank-saving.yourdomain.com/api/v1
```

### Content Type

All requests and responses use `application/json`

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message",
  "meta": { /* pagination, etc */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { /* additional context */ }
  }
}
```

---

## Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/customers` | GET | List customers with pagination |
| `/customers` | POST | Create new customer |
| `/customers/:id` | GET | Get customer detail |
| `/customers/:id` | PUT | Update customer |
| `/customers/:id` | DELETE | Delete customer |
| `/deposito-types` | GET | List all deposito types |
| `/deposito-types` | POST | Create deposito type |
| `/deposito-types/:id` | GET | Get deposito type |
| `/deposito-types/:id` | PUT | Update deposito type |
| `/deposito-types/:id` | DELETE | Delete deposito type |
| `/accounts` | GET | List accounts with filters |
| `/accounts` | POST | Create new account |
| `/accounts/:id` | GET | Get account detail |
| `/accounts/:id` | PUT | Update account |
| `/accounts/:id` | DELETE | Delete account |
| `/transactions` | GET | List transactions |
| `/transactions/deposit` | POST | Deposit money |
| `/transactions/calculate-withdrawal` | POST | Calculate withdrawal preview |
| `/transactions/withdraw` | POST | Withdraw money |

**Total:** 19 endpoints

---

## Error Codes Reference

### Customer Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `CUSTOMER_NOT_FOUND` | 404 | Customer with specified ID not found |
| `CUSTOMER_HAS_ACCOUNTS` | 409 | Cannot delete customer with active accounts |
| `VALIDATION_ERROR` | 400 | Request validation failed |

### Deposito Type Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `DEPOSITO_TYPE_NOT_FOUND` | 404 | Deposito type not found |
| `DEPOSITO_TYPE_IN_USE` | 409 | Cannot delete deposito type in use |
| `DUPLICATE_DEPOSITO_NAME` | 409 | Deposito type name already exists |

### Account Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `ACCOUNT_NOT_FOUND` | 404 | Account not found |
| `ACCOUNT_HAS_BALANCE` | 409 | Cannot delete account with non-zero balance |
| `INVALID_CUSTOMER` | 400 | Customer does not exist |
| `INVALID_DEPOSITO_TYPE` | 400 | Deposito type does not exist |

### Transaction Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INSUFFICIENT_BALANCE` | 400 | Account balance is zero |
| `INVALID_WITHDRAWAL_DATE` | 422 | Withdrawal date invalid |
| `NO_DEPOSITS_FOUND` | 422 | Account has no deposits |
| `INVALID_AMOUNT` | 400 | Amount must be greater than 0 |
| `FUTURE_DATE_NOT_ALLOWED` | 400 | Transaction date cannot be in future |

---

## Calculation Formula

### Interest Calculation (Simple Interest)

**Formula:**
```
ending_balance = starting_balance × (1 + monthly_return × months)

Where:
- monthly_return = yearly_return / 12 / 100
- months = duration in months (decimal, e.g., 10.70)
```

**Example:**
```
Starting Balance: Rp 50,000,000
Yearly Return: 7% (Gold deposito)
Deposit Date: 2025-01-01
Withdrawal Date: 2025-11-22
Duration: 10.70 months

Calculation:
monthly_return = 7 / 12 / 100 = 0.005833
ending_balance = 50,000,000 × (1 + 0.005833 × 10.70)
               = 50,000,000 × 1.062433
               = 53,120,833.33

Interest Earned: 53,120,833 - 50,000,000 = 3,120,833
```

---

## Detailed Endpoint Documentation

### 1. Customer Endpoints

#### GET /api/v1/customers

Get paginated list of customers with search and sorting.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |
| `search` | string | - | Search by name |
| `sort` | string | name | Sort field (name, created_at) |
| `order` | string | asc | Sort order (asc, desc) |

**Response Example:**
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

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/customers?page=1&limit=10&search=john" \
  -H "Content-Type: application/json"
```

---

#### POST /api/v1/customers

Create new customer.

**Request Body:**
```json
{
  "name": "Ahmad Abdullah"
}
```

**Validation:**
- `name`: required, string, 2-255 characters

**Response 201:**
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

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/customers" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmad Abdullah"}'
```

---

### 2. Deposito Type Endpoints

#### GET /api/v1/deposito-types

Get all deposito types (master data).

**Response Example:**
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
      "total_accounts": 28
    },
    {
      "id": 3,
      "name": "Gold",
      "yearly_return": 7.00,
      "monthly_return": 0.5833,
      "total_accounts": 42
    }
  ]
}
```

**Note:** `monthly_return` is auto-calculated: `yearly_return / 12`

---

### 3. Account Endpoints

#### POST /api/v1/accounts

Create new account with optional initial deposit.

**Request Body:**
```json
{
  "customer_id": 1,
  "deposito_type_id": 3,
  "initial_balance": 50000000.00,
  "initial_deposit_date": "2025-01-01"
}
```

**Validation:**
- `customer_id`: required, must exist
- `deposito_type_id`: required, must exist
- `initial_balance`: optional, >= 0, default 0
- `initial_deposit_date`: required if initial_balance > 0

**Response 201:**
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

---

### 4. Transaction Endpoints

#### POST /api/v1/transactions/deposit

Deposit money to account.

**Request Body:**
```json
{
  "account_id": 1,
  "amount": 10000000.00,
  "transaction_date": "2025-11-22",
  "notes": "Monthly deposit"
}
```

**Validation:**
- `account_id`: required, must exist
- `amount`: required, > 0
- `transaction_date`: required, cannot be future date
- `notes`: optional, max 500 chars

**Response 201:**
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

---

#### POST /api/v1/transactions/calculate-withdrawal

Calculate withdrawal preview (CRITICAL ENDPOINT).

**Purpose:** Show user how much they will receive BEFORE actual withdrawal.

**Request Body:**
```json
{
  "account_id": 1,
  "withdrawal_date": "2025-11-22"
}
```

**Response 200:**
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

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/transactions/calculate-withdrawal" \
  -H "Content-Type: application/json" \
  -d '{"account_id":1,"withdrawal_date":"2025-11-22"}'
```

---

#### POST /api/v1/transactions/withdraw

Withdraw money with automatic interest calculation.

**Request Body:**
```json
{
  "account_id": 1,
  "withdrawal_date": "2025-11-22",
  "notes": "Account closure"
}
```

**Validation:**
- `account_id`: required, must exist
- `withdrawal_date`: required, must be >= first deposit date
- `notes`: optional, max 500 chars

**Response 201:**
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

---

## Testing with Swagger UI

### Step 1: View Documentation

1. Go to https://editor.swagger.io/
2. File → Import File → Select `05-api-documentation-swagger.yaml`
3. Interactive documentation akan muncul

### Step 2: Test Endpoints

1. Click endpoint yang ingin ditest (misal: `POST /customers`)
2. Click "Try it out"
3. Edit request body
4. Click "Execute"
5. Lihat response

### Step 3: Test Flow

**Example: Create Customer → Create Account → Deposit → Calculate → Withdraw**

1. POST /customers → Get customer_id
2. POST /accounts → Use customer_id → Get account_id
3. POST /transactions/deposit → Use account_id
4. POST /transactions/calculate-withdrawal → See preview
5. POST /transactions/withdraw → Complete withdrawal

---

## Import to Postman

### Method 1: Import OpenAPI File

1. Postman → Import → Upload `05-api-documentation-swagger.yaml`
2. Postman auto-generates collection
3. Set environment variables
4. Ready to test!

### Method 2: Use Swagger URL

1. Start local server dengan Swagger UI
2. Postman → Import → Link
3. Enter: `http://localhost:3000/api-docs/swagger.json`
4. Import collection

---

## Environment Variables (Postman)

Create Postman environment:

```json
{
  "name": "Bank Saving - Development",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1",
      "enabled": true
    },
    {
      "key": "customer_id",
      "value": "",
      "enabled": true
    },
    {
      "key": "account_id",
      "value": "",
      "enabled": true
    },
    {
      "key": "deposito_type_id",
      "value": "",
      "enabled": true
    }
  ]
}
```

**Usage in requests:**
```
GET {{base_url}}/customers/{{customer_id}}
```

---

## TypeScript Types (Auto-Generated)

Jika menggunakan OpenAPI generator, akan dapat types seperti:

```typescript
// Auto-generated from OpenAPI spec

export interface Customer {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerWithStats extends Customer {
  total_accounts: number;
  total_balance: number;
}

export interface WithdrawalCalculation {
  account_id: number;
  customer_name: string;
  deposito_type: {
    name: string;
    yearly_return: number;
    monthly_return: number;
  };
  calculation: CalculationDetails;
}

export interface CalculationDetails {
  starting_balance: number;
  ending_balance: number;
  interest_earned: number;
  months_duration: number;
  monthly_return_rate: number;
  first_deposit_date: string;
  withdrawal_date: string;
  formula_used: string;
}
```

---

## API Client Usage Example

```typescript
// Auto-generated API client
import { CustomersApi, TransactionsApi } from './api-client';

const customersApi = new CustomersApi();
const transactionsApi = new TransactionsApi();

// Create customer
const customer = await customersApi.createCustomer({
  name: 'Ahmad Abdullah'
});

// Calculate withdrawal
const preview = await transactionsApi.calculateWithdrawal({
  account_id: 1,
  withdrawal_date: '2025-11-22'
});

console.log(`You will receive: Rp ${preview.data.calculation.ending_balance}`);
```

---

## API Versioning Strategy

### Current: v1

All endpoints under `/api/v1/`

### Future: v2

When breaking changes needed:
- Create new endpoints under `/api/v2/`
- Keep v1 endpoints for backward compatibility
- Deprecate v1 after transition period

**Example:**
```
v1: POST /api/v1/transactions/deposit
v2: POST /api/v2/transactions/deposit (with new fields)
```

---

## Rate Limiting

**Recommendation:**

```
100 requests per 15 minutes per IP
```

**Response when limit exceeded:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 15 minutes."
  }
}
```

---

## Summary

### Documentation Files:

1. ✅ **`05-api-documentation-swagger.yaml`** - OpenAPI 3.0 spec (machine-readable)
2. ✅ **`05-api-documentation.md`** - Human-readable guide (this file)

### How to Use:

1. **Interactive Testing** → Swagger UI
2. **API Client Generation** → OpenAPI Generator
3. **Manual Testing** → Postman import
4. **Frontend Development** → TypeScript types

### Benefits:

| Benefit | Impact |
|---------|--------|
| **Self-Service** | Developers don't need to ask questions |
| **Interactive** | Test API directly from browser |
| **Type Safety** | Auto-generated TypeScript types |
| **Always Updated** | Documentation as code |
| **Client SDK** | Auto-generate client libraries |

---

**Status**: ✅ COMPLETE - Ready for Testing
**Format**: OpenAPI 3.0 (Swagger)
**Last Updated**: 2025-11-22
