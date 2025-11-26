# API to Screen Mapping - Bank Saving System

## Mengapa API-Screen Mapping Penting?

**Mapping ini adalah BLUEPRINT untuk Frontend Development**

### Alasan API-Screen Mapping di Step 4:

1. ✅ **Wireframe Sudah Ada** - Tahu screen apa saja yang ada
2. ✅ **API Endpoints Sudah Defined** - Tahu endpoint apa saja yang tersedia
3. ✅ **Frontend Developer Ready** - Tahu exact API calls untuk setiap screen
4. ✅ **Prevent Over-fetching** - Fetch data yang benar-benar dibutuhkan
5. ✅ **Optimize Performance** - Tahu kapan perlu loading state, caching, dll
6. ✅ **Testing Plan** - Tahu integration testing scenarios

---

## Screen Overview

Berdasarkan wireframe (docs/01-wireframe-user-flow.md), kita punya **9 screens**:

### Customer Management (2 screens)
1. Customer List
2. Add/Edit Customer Form

### Deposito Type Management (2 screens)
3. Deposito Type List
4. Add/Edit Deposito Type Form

### Account Management (2 screens)
5. Account List
6. Add/Edit Account Form

### Transaction Management (3 screens)
7. Account Detail & Transaction History
8. Deposit Form
9. Withdraw Form

---

## API Mapping by Screen

---

## 1. CUSTOMER LIST SCREEN

### Screen Purpose:
- Display all customers in table
- Search customers by name
- Navigate to edit/delete customer
- Navigate to create new customer

### API Calls:

#### On Page Load:
```
GET /api/v1/customers?page=1&limit=10&sort=name&order=asc
```

**Why:**
- Load initial customer list dengan pagination
- Default sort by name (alphabetical)

**Response Usage:**
```typescript
interface CustomerListResponse {
  success: true;
  data: Array<{
    id: number;
    name: string;
    total_accounts: number;      // ← Display di table column
    total_balance: number;        // ← Display di table column
    created_at: string;
    updated_at: string;
  }>;
  meta: {
    current_page: number;         // ← Pagination component
    per_page: number;
    total: number;                // ← Show "Total: X customers"
    total_pages: number;          // ← Pagination component
  };
}
```

**UI Elements → Data Mapping:**

| UI Element | Data Source | API Field |
|------------|-------------|-----------|
| Customer Name Column | Response | `data[].name` |
| Total Accounts Column | Response | `data[].total_accounts` |
| Total Balance Column | Response | `data[].total_balance` |
| Edit Button | Response | `data[].id` (untuk navigate) |
| Delete Button | Response | `data[].id` (untuk API call) |
| Pagination Info | Response | `meta.total`, `meta.current_page` |

---

#### On Search Input:
```
GET /api/v1/customers?page=1&limit=10&search=john&sort=name&order=asc
```

**Trigger:** User types in search box (debounced 300ms)

**Why:**
- Filter customers by name
- Reset to page 1 saat search

---

#### On Delete Customer Click:
```
DELETE /api/v1/customers/:id
```

**Flow:**
1. User clicks Delete button
2. Show confirmation dialog: "Are you sure?"
3. If confirmed → API call
4. If success (200) → Remove from list, show success toast
5. If error (409) → Show error: "Cannot delete customer with accounts"

**Error Handling:**
```typescript
// Response 409 Conflict
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

// Show to user:
"Cannot delete John Doe. Customer has 2 active accounts."
```

---

#### On Pagination Click:
```
GET /api/v1/customers?page=2&limit=10&sort=name&order=asc
```

**Trigger:** User clicks page 2 in pagination

---

### State Management (Frontend):

```typescript
// React example
interface CustomerListState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
  searchQuery: string;
}
```

---

## 2. ADD/EDIT CUSTOMER FORM SCREEN

### Screen Purpose:
- Create new customer
- Edit existing customer

### API Calls:

#### On Page Load (Edit Mode Only):
```
GET /api/v1/customers/:id
```

**Why:**
- Populate form dengan existing data
- Only dipanggil jika edit mode

**Response Usage:**
```typescript
// Populate form fields
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe"  // ← Set as input value
  }
}
```

---

#### On Form Submit (Create):
```
POST /api/v1/customers
Content-Type: application/json

{
  "name": "Ahmad Abdullah"
}
```

**Flow:**
1. User fills name
2. Click "Save" button
3. Validate form (frontend)
4. If valid → API call
5. If success (201) → Navigate to customer list, show success toast
6. If error (400) → Show validation errors

**Error Handling:**
```typescript
// Response 400
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

// Show errors below input field
<input name="name" />
<span class="error">{errors.name.join(', ')}</span>
```

---

#### On Form Submit (Edit):
```
PUT /api/v1/customers/:id
Content-Type: application/json

{
  "name": "John Doe Updated"
}
```

**Flow:** Same as create, tapi navigate back setelah success

---

### Form Validation (Frontend):

```typescript
const validateCustomerForm = (data: { name: string }) => {
  const errors: Record<string, string[]> = {};

  if (!data.name) {
    errors.name = ['Name is required'];
  } else if (data.name.length < 2) {
    errors.name = ['Name must be at least 2 characters'];
  } else if (data.name.length > 255) {
    errors.name = ['Name must not exceed 255 characters'];
  }

  return errors;
};
```

---

## 3. DEPOSITO TYPE LIST SCREEN

### Screen Purpose:
- Display all deposito types
- Show yearly return & monthly return
- Manage deposito types (add/edit/delete)

### API Calls:

#### On Page Load:
```
GET /api/v1/deposito-types
```

**Why:**
- Load all deposito types (no pagination - master data biasanya sedikit)
- Show monthly return (calculated di backend)

**Response Usage:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bronze",
      "yearly_return": 3.00,        // ← Display: "3.00%"
      "monthly_return": 0.25,       // ← Display: "0.25%"
      "total_accounts": 15,         // ← Display: "15 accounts"
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

**UI Elements → Data Mapping:**

| UI Element | Data Source |
|------------|-------------|
| Name Column | `data[].name` |
| Yearly Return Column | `data[].yearly_return` + "%" |
| Monthly Return Column | `data[].monthly_return` + "%" (auto-calculated) |
| Total Accounts Column | `data[].total_accounts` |
| Edit Button | `data[].id` |
| Delete Button | `data[].id` |

---

#### On Delete Deposito Type:
```
DELETE /api/v1/deposito-types/:id
```

**Error Handling:**
```typescript
// Response 409 - Deposito type in use
{
  "error": {
    "code": "DEPOSITO_TYPE_IN_USE",
    "message": "Cannot delete deposito type with existing accounts",
    "details": {
      "deposito_type_id": 3,
      "active_accounts": 42
    }
  }
}

// Show to user:
"Cannot delete Gold. There are 42 active accounts using this deposito type."
```

---

## 4. ADD/EDIT DEPOSITO TYPE FORM SCREEN

### API Calls:

#### On Page Load (Edit Mode):
```
GET /api/v1/deposito-types/:id
```

---

#### On Form Submit (Create):
```
POST /api/v1/deposito-types
Content-Type: application/json

{
  "name": "Platinum",
  "yearly_return": 10.00
}
```

**Validation:**
- `name`: required, max 100 chars
- `yearly_return`: required, number, 0.01 - 100

**Error Handling:**
```typescript
// Response 409 - Duplicate name
{
  "error": {
    "code": "DUPLICATE_DEPOSITO_NAME",
    "message": "Deposito type with name 'Gold' already exists"
  }
}
```

---

#### On Form Submit (Edit):
```
PUT /api/v1/deposito-types/:id
Content-Type: application/json

{
  "name": "Gold Premium",
  "yearly_return": 7.50
}
```

---

## 5. ACCOUNT LIST SCREEN

### Screen Purpose:
- Display all accounts
- Filter by customer / deposito type
- Show balance & account info
- Navigate to account detail

### API Calls:

#### On Page Load:
```
GET /api/v1/accounts?page=1&limit=10&sort=created_at&order=desc
```

**Why:**
- Load accounts, newest first
- Include customer & deposito type info (JOIN)

**Response Usage:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer": {
        "id": 1,
        "name": "John Doe"           // ← Display di table
      },
      "deposito_type": {
        "id": 3,
        "name": "Gold",              // ← Display di table
        "yearly_return": 7.00,       // ← Display: "Gold (7%)"
        "monthly_return": 0.5833
      },
      "balance": 50000000.00,        // ← Display: "Rp 50,000,000"
      "last_transaction_date": "2025-01-01",
      "transaction_count": 1,        // ← Display: "1 transaction"
      "created_at": "..."
    }
  ],
  "meta": { /* pagination */ }
}
```

**UI Elements → Data Mapping:**

| UI Element | Data Source |
|------------|-------------|
| Account ID Column | `data[].id` |
| Customer Name Column | `data[].customer.name` |
| Deposito Type Column | `data[].deposito_type.name + " (" + data[].deposito_type.yearly_return + "%)"` |
| Balance Column | Format: `data[].balance` → "Rp 50,000,000" |
| Transactions Count | `data[].transaction_count` |
| View Button | Navigate to `/accounts/:id` |

---

#### On Filter by Customer:
```
GET /api/v1/accounts?page=1&limit=10&customer_id=1
```

**Trigger:** User selects customer from dropdown filter

---

#### On Filter by Deposito Type:
```
GET /api/v1/accounts?page=1&limit=10&deposito_type_id=3
```

---

## 6. ADD/EDIT ACCOUNT FORM SCREEN

### Screen Purpose:
- Create new account for customer
- Select deposito type
- Optional: initial deposit

### API Calls:

#### On Page Load:
```
// Load customer dropdown options
GET /api/v1/customers?limit=1000

// Load deposito type dropdown options
GET /api/v1/deposito-types
```

**Why 2 API calls:**
- Need customer list untuk dropdown
- Need deposito types untuk dropdown
- Both dapat dipanggil **parallel** (Promise.all)

**Response Usage:**
```typescript
// Customer dropdown
<select name="customer_id">
  {customers.map(c => (
    <option value={c.id}>{c.name}</option>
  ))}
</select>

// Deposito type dropdown
<select name="deposito_type_id">
  {depositoTypes.map(dt => (
    <option value={dt.id}>
      {dt.name} ({dt.yearly_return}% yearly)
    </option>
  ))}
</select>
```

---

#### On Form Submit (Create):
```
POST /api/v1/accounts
Content-Type: application/json

{
  "customer_id": 1,
  "deposito_type_id": 3,
  "initial_balance": 50000000.00,
  "initial_deposit_date": "2025-01-01"
}
```

**Validation:**
- `customer_id`: required
- `deposito_type_id`: required
- `initial_balance`: optional, >= 0
- `initial_deposit_date`: required if initial_balance > 0

**Conditional Logic:**
```typescript
// Show date picker only if initial_balance > 0
{initialBalance > 0 && (
  <input
    type="date"
    name="initial_deposit_date"
    required
  />
)}
```

---

#### On Form Submit (Edit):
```
PUT /api/v1/accounts/:id
Content-Type: application/json

{
  "deposito_type_id": 2
}
```

**Note:** Only deposito_type_id yang bisa diubah

---

## 7. ACCOUNT DETAIL & TRANSACTION HISTORY SCREEN

### Screen Purpose:
- Show account details
- Show customer & deposito info
- Show transaction history
- Button: Deposit / Withdraw

### API Calls:

#### On Page Load:
```
GET /api/v1/accounts/:id
```

**Why:**
- Single endpoint returns semua data yang dibutuhkan:
  - Account info
  - Customer info
  - Deposito type info
  - Statistics (total deposits, withdrawals, etc)
  - Transaction history

**Response Usage:**
```typescript
{
  "success": true,
  "data": {
    "id": 1,
    "customer": {
      "id": 1,
      "name": "John Doe"              // ← Header: "Account for John Doe"
    },
    "deposito_type": {
      "id": 3,
      "name": "Gold",                 // ← Show: "Deposito: Gold"
      "yearly_return": 7.00,          // ← Show: "7% yearly"
      "monthly_return": 0.5833        // ← Show: "0.58% monthly"
    },
    "balance": 50000000.00,           // ← Large display: "Rp 50,000,000"
    "created_at": "2025-01-01",       // ← Show: "Opened: Jan 1, 2025"
    "statistics": {
      "total_deposits": 50000000.00,  // ← Show in summary card
      "total_withdrawals": 0.00,
      "transaction_count": 1,
      "first_deposit_date": "2025-01-01",
      "last_transaction_date": "2025-01-01"
    },
    "transactions": [                 // ← Render in table
      {
        "id": 1,
        "type": "deposit",            // ← Badge: green for deposit
        "amount": 50000000.00,        // ← "+Rp 50,000,000"
        "transaction_date": "2025-01-01",
        "balance_before": 0.00,
        "balance_after": 50000000.00, // ← Show balance after
        "created_at": "..."
      }
    ]
  }
}
```

**UI Layout:**

```
┌─────────────────────────────────────────────┐
│ Account Detail - John Doe                   │
├─────────────────────────────────────────────┤
│ Current Balance: Rp 50,000,000              │ ← data.balance
│ Deposito: Gold (7% yearly / 0.58% monthly)  │ ← data.deposito_type
│ Opened: 2025-01-01                          │ ← data.created_at
│                                             │
│ [Deposit] [Withdraw]                        │
├─────────────────────────────────────────────┤
│ Statistics:                                 │
│ - Total Deposits: Rp 50,000,000             │ ← data.statistics
│ - Total Withdrawals: Rp 0                   │
│ - Total Transactions: 1                     │
│ - First Deposit: 2025-01-01                 │
├─────────────────────────────────────────────┤
│ Transaction History                         │
│ ┌────────┬─────────┬──────────┬──────────┐ │
│ │ Date   │ Type    │ Amount   │ Balance  │ │
│ ├────────┼─────────┼──────────┼──────────┤ │
│ │ 01/01  │ Deposit │ +50M     │ 50M      │ │ ← data.transactions[]
│ └────────┴─────────┴──────────┴──────────┘ │
└─────────────────────────────────────────────┘
```

---

## 8. DEPOSIT FORM SCREEN

### Screen Purpose:
- Deposit money to account
- Input: amount, date
- Preview new balance before submit

### API Calls:

#### On Page Load:
```
GET /api/v1/accounts/:id
```

**Why:**
- Get current balance untuk display
- Get account info (customer name, deposito type)

---

#### On Form Submit:
```
POST /api/v1/transactions/deposit
Content-Type: application/json

{
  "account_id": 1,
  "amount": 10000000.00,
  "transaction_date": "2025-11-22",
  "notes": "Monthly deposit"
}
```

**Flow:**
1. User inputs amount & date
2. Show preview: "New balance will be: Rp 60,000,000"
3. User clicks "Confirm Deposit"
4. API call
5. If success (201) → Navigate back to account detail, show toast
6. If error → Show error message

**Validation:**
- `amount`: required, > 0
- `transaction_date`: required, cannot be future date
- `notes`: optional

**Preview Calculation (Frontend):**
```typescript
const previewBalance = currentBalance + amount;
// Show: "Current: Rp 50,000,000 → New: Rp 60,000,000"
```

---

## 9. WITHDRAW FORM SCREEN (MOST IMPORTANT)

### Screen Purpose:
- Withdraw money with interest calculation
- Show calculation preview BEFORE confirm
- Input: withdrawal date

### API Calls:

#### On Page Load:
```
GET /api/v1/accounts/:id
```

**Why:**
- Get current balance
- Get first deposit date (untuk calculation)
- Get deposito type info

---

#### On Withdrawal Date Change (Calculate Preview):
```
POST /api/v1/transactions/calculate-withdrawal
Content-Type: application/json

{
  "account_id": 1,
  "withdrawal_date": "2025-11-22"
}
```

**Trigger:** User selects withdrawal date (onChange)

**Why:**
- **CRITICAL REQUIREMENT**: "system must calculate and show to customer"
- User harus lihat calculation SEBELUM confirm
- Real-time calculation saat user change date

**Response Usage:**
```typescript
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

**UI Display:**

```
┌─────────────────────────────────────────────┐
│ Withdraw from Account #1                    │
├─────────────────────────────────────────────┤
│ Customer: John Doe                          │
│ Deposito: Gold (7% yearly)                  │
│                                             │
│ Starting Balance: Rp 50,000,000             │ ← calculation.starting_balance
│ First Deposit Date: 2025-01-01              │ ← calculation.first_deposit_date
│                                             │
│ Withdrawal Date: [2025-11-22] 📅           │ ← User input
│                                             │
├─────────────────────────────────────────────┤
│ CALCULATION PREVIEW                         │
├─────────────────────────────────────────────┤
│ Duration: 10 months 21 days (10.70 months)  │ ← calculation.duration
│ Monthly Return Rate: 0.5833%                │ ← calculation.monthly_return_rate
│                                             │
│ Interest Earned: Rp 3,120,833               │ ← calculation.interest_earned (GREEN)
│                                             │
│ ═══════════════════════════════════════════ │
│ Total You Will Receive: Rp 53,120,833       │ ← calculation.ending_balance (LARGE, BOLD)
│ ═══════════════════════════════════════════ │
│                                             │
│ Formula Used:                               │
│ ending_balance = starting_balance ×         │
│                  (1 + monthly_return × months)│
│                                             │
│ Notes: [___________________________]        │
│                                             │
│ [Cancel]  [Confirm Withdrawal]              │
└─────────────────────────────────────────────┘
```

---

#### On Form Submit (Confirm Withdrawal):
```
POST /api/v1/transactions/withdraw
Content-Type: application/json

{
  "account_id": 1,
  "withdrawal_date": "2025-11-22",
  "notes": "Account closure"
}
```

**Flow:**
1. User sees calculation preview
2. User clicks "Confirm Withdrawal"
3. Show confirmation dialog: "Are you sure you want to withdraw Rp 53,120,833?"
4. If confirmed → API call
5. If success (201) → Show success message with total amount, navigate to account list
6. Account balance becomes 0

**Success Message:**
```
"Withdrawal successful!
You will receive: Rp 53,120,833
(Principal: Rp 50,000,000 + Interest: Rp 3,120,833)"
```

**Error Handling:**
```typescript
// Response 400 - Insufficient balance
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Account balance is zero. Nothing to withdraw."
  }
}

// Response 422 - Invalid date
{
  "error": {
    "code": "INVALID_WITHDRAWAL_DATE",
    "message": "Withdrawal date cannot be before first deposit date",
    "details": {
      "first_deposit_date": "2025-01-01",
      "withdrawal_date": "2024-12-01"
    }
  }
}
```

---

## API Call Optimization Strategies

### 1. Parallel API Calls

**Example: Account Form (load dropdowns)**
```typescript
// ❌ BAD: Sequential (slow)
const customers = await fetch('/api/v1/customers');
const depositoTypes = await fetch('/api/v1/deposito-types');

// ✅ GOOD: Parallel (fast)
const [customers, depositoTypes] = await Promise.all([
  fetch('/api/v1/customers'),
  fetch('/api/v1/deposito-types')
]);
```

---

### 2. Debouncing Search Input

**Example: Customer List search**
```typescript
// ✅ Debounce 300ms - prevent too many API calls
const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  if (debouncedSearch) {
    fetchCustomers({ search: debouncedSearch });
  }
}, [debouncedSearch]);
```

---

### 3. Caching Master Data

**Example: Deposito Types (rarely changes)**
```typescript
// Cache deposito types untuk 1 hour
const { data: depositoTypes } = useSWR(
  '/api/v1/deposito-types',
  fetcher,
  { revalidateOnFocus: false, dedupingInterval: 3600000 }
);
```

---

### 4. Optimistic Updates

**Example: Delete customer**
```typescript
// Remove from UI immediately, rollback if API fails
const optimisticDelete = async (id: number) => {
  // Update UI first
  setCustomers(prev => prev.filter(c => c.id !== id));

  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    // Rollback on error
    fetchCustomers(); // Reload from server
    showError('Failed to delete customer');
  }
};
```

---

## Loading States by Screen

| Screen | Loading State | Duration |
|--------|---------------|----------|
| Customer List | Skeleton table rows | ~200ms |
| Customer Form (edit) | Spinner on form | ~100ms |
| Account List | Skeleton table rows | ~300ms (JOIN queries) |
| Account Detail | Skeleton cards | ~400ms (complex query) |
| Withdraw Form - Calculate | Spinner on preview section | ~150ms |
| Deposit/Withdraw Submit | Button loading spinner | ~500ms (transaction) |

---

## Error Handling Patterns

### 1. Validation Errors (400)

```typescript
// Show errors below form fields
{errors.name && (
  <span className="text-red-500 text-sm">
    {errors.name.join(', ')}
  </span>
)}
```

---

### 2. Not Found (404)

```typescript
// Redirect to list or show 404 page
if (error.code === 'CUSTOMER_NOT_FOUND') {
  navigate('/customers');
  toast.error('Customer not found');
}
```

---

### 3. Conflict Errors (409)

```typescript
// Show user-friendly message with details
if (error.code === 'CUSTOMER_HAS_ACCOUNTS') {
  const { active_accounts } = error.details;
  toast.error(
    `Cannot delete customer. They have ${active_accounts} active accounts.`
  );
}
```

---

### 4. Server Errors (500)

```typescript
// Generic error message, log to monitoring
toast.error('Something went wrong. Please try again later.');
console.error('Server error:', error);
// Send to error tracking (Sentry, etc)
```

---

## API Call Summary Table

| Screen | On Load | On User Action | Total API Calls |
|--------|---------|----------------|-----------------|
| Customer List | GET /customers | DELETE /customers/:id | 1-2 |
| Customer Form | GET /customers/:id (edit) | POST/PUT /customers | 1-2 |
| Deposito Type List | GET /deposito-types | DELETE /deposito-types/:id | 1-2 |
| Deposito Type Form | GET /deposito-types/:id | POST/PUT /deposito-types | 1-2 |
| Account List | GET /accounts | - | 1 |
| Account Form | GET /customers + GET /deposito-types | POST/PUT /accounts | 2-3 |
| Account Detail | GET /accounts/:id | - | 1 |
| Deposit Form | GET /accounts/:id | POST /transactions/deposit | 2 |
| Withdraw Form | GET /accounts/:id | POST /calculate-withdrawal → POST /withdraw | 3 |

**Total Unique Endpoints Used:** 19

---

## Frontend State Management Recommendation

### Option 1: React Query (Recommended)

```typescript
// Automatic caching, refetching, loading states
import { useQuery, useMutation } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['customers', page],
  queryFn: () => fetchCustomers({ page })
});

const deleteMutation = useMutation({
  mutationFn: (id: number) => deleteCustomer(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  }
});
```

---

### Option 2: SWR

```typescript
import useSWR from 'swr';

const { data, error, isLoading } = useSWR(
  '/api/v1/customers',
  fetcher
);
```

---

### Option 3: Redux Toolkit (If complex state)

```typescript
// For complex apps with shared state across many components
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
```

---

## API Response Transformation

### Example: Format currency for display

```typescript
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Usage:
<td>{formatCurrency(account.balance)}</td>
// Output: "Rp 50.000.000"
```

---

### Example: Format date

```typescript
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Usage:
<td>{formatDate(transaction.transaction_date)}</td>
// Output: "22 November 2025"
```

---

## Summary: Why This Mapping Matters

| Benefit | Impact |
|---------|--------|
| **Clear Development Path** | Frontend dev tahu exact API calls untuk setiap screen |
| **No Over-fetching** | Only fetch data yang benar-benar dibutuhkan |
| **Better UX** | Loading states di tempat yang tepat |
| **Error Handling** | Tahu error cases dan bagaimana handle |
| **Performance** | Parallel calls, caching, debouncing strategies clear |
| **Testing** | Integration test scenarios sudah jelas |

---

## Next Steps

Dengan API-Screen Mapping ini:

1. ✅ **Frontend Implementation** - Developer bisa mulai coding
2. ✅ **Integration Testing** - Tahu flow yang harus ditest
3. ✅ **API Documentation** - Swagger/OpenAPI (next deliverable)
4. ✅ **Postman Collection** - For manual testing

---

**Status**: ✅ COMPLETE - Ready for Frontend Development
**Last Updated**: 2025-11-22
