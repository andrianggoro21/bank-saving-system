# Error Handling & Edge Cases - Bank Saving System

## Mengapa Error Handling Documentation Penting?

**Error Handling adalah QUALITY ASSURANCE untuk Production Readiness**

### Alasan Error Handling di Step 9 (Final):

1. ✅ **Prevent System Crashes** - Graceful degradation, tidak app crash
2. ✅ **User Experience** - Clear error messages, user tahu apa yang salah
3. ✅ **Security** - Prevent information leakage via error messages
4. ✅ **Debugging** - Proper logging untuk troubleshooting
5. ✅ **Data Integrity** - Prevent invalid data masuk ke database
6. ✅ **Compliance** - Financial apps need robust error handling
7. ✅ **Testing Guide** - Tahu test cases apa yang harus dibuat

---

## Error Handling Strategy

### Layered Error Handling

```
┌─────────────────────────────────────┐
│   1. Frontend Validation            │  ← Immediate feedback
│   (Client-side, before API call)    │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   2. API Validation (Middleware)    │  ← Request validation
│   (Zod/express-validator)           │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   3. Business Logic Validation      │  ← Business rules
│   (Service Layer)                   │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   4. Database Constraints           │  ← Data integrity
│   (Foreign keys, CHECK, UNIQUE)     │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   5. Global Error Handler           │  ← Catch all
│   (Express middleware)              │
└─────────────────────────────────────┘
```

---

## HTTP Status Codes Strategy

| Code | Category | Usage | Example |
|------|----------|-------|---------|
| **200** | Success | GET, PUT, DELETE success | Customer retrieved |
| **201** | Created | POST success | Customer created |
| **204** | No Content | DELETE success (no body) | Customer deleted |
| **400** | Bad Request | Validation error, invalid input | Name too short |
| **401** | Unauthorized | Not authenticated | No token provided |
| **403** | Forbidden | No permission | Not owner of resource |
| **404** | Not Found | Resource doesn't exist | Customer ID 999 not found |
| **409** | Conflict | Constraint violation | Customer has accounts |
| **422** | Unprocessable | Business logic error | Withdrawal date invalid |
| **500** | Server Error | Unhandled exception | Database connection failed |

---

## Error Response Format

### Standard Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable message
    details?: any;          // Additional context (optional)
  };
}
```

### Examples

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "name": ["Name is required", "Name must be at least 2 characters"],
      "amount": ["Amount must be greater than 0"]
    }
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer with ID 999 not found"
  }
}
```

**Business Logic Error (422):**
```json
{
  "success": false,
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

## Error Codes Reference

### Customer Errors

| Code | HTTP | Trigger | Message |
|------|------|---------|---------|
| `CUSTOMER_NOT_FOUND` | 404 | GET/PUT/DELETE non-existent customer | Customer with ID {id} not found |
| `CUSTOMER_HAS_ACCOUNTS` | 409 | DELETE customer with active accounts | Cannot delete customer with existing accounts |
| `CUSTOMER_NAME_REQUIRED` | 400 | POST/PUT with empty name | Name is required |
| `CUSTOMER_NAME_TOO_SHORT` | 400 | POST/PUT name < 2 chars | Name must be at least 2 characters |
| `CUSTOMER_NAME_TOO_LONG` | 400 | POST/PUT name > 255 chars | Name must not exceed 255 characters |

---

### Deposito Type Errors

| Code | HTTP | Trigger | Message |
|------|------|---------|---------|
| `DEPOSITO_TYPE_NOT_FOUND` | 404 | GET/PUT/DELETE non-existent type | Deposito type with ID {id} not found |
| `DEPOSITO_TYPE_IN_USE` | 409 | DELETE type used by accounts | Cannot delete deposito type with existing accounts |
| `DUPLICATE_DEPOSITO_NAME` | 409 | POST/PUT duplicate name | Deposito type with name '{name}' already exists |
| `INVALID_YEARLY_RETURN` | 400 | POST/PUT return < 0.01 or > 100 | Yearly return must be between 0.01 and 100 |

---

### Account Errors

| Code | HTTP | Trigger | Message |
|------|------|---------|---------|
| `ACCOUNT_NOT_FOUND` | 404 | GET/PUT/DELETE non-existent account | Account with ID {id} not found |
| `ACCOUNT_HAS_BALANCE` | 409 | DELETE account with balance > 0 | Cannot delete account with non-zero balance |
| `INVALID_CUSTOMER` | 400 | POST with non-existent customer_id | Customer does not exist |
| `INVALID_DEPOSITO_TYPE` | 400 | POST with non-existent deposito_type_id | Deposito type does not exist |
| `INITIAL_DEPOSIT_DATE_REQUIRED` | 400 | POST with balance > 0 but no date | Deposit date is required when initial balance > 0 |

---

### Transaction Errors

| Code | HTTP | Trigger | Message |
|------|------|---------|---------|
| `INSUFFICIENT_BALANCE` | 400 | Withdraw with balance = 0 | Account balance is zero. Nothing to withdraw. |
| `INVALID_AMOUNT` | 400 | POST with amount <= 0 | Amount must be greater than 0 |
| `FUTURE_DATE_NOT_ALLOWED` | 400 | POST with future transaction_date | Transaction date cannot be in the future |
| `INVALID_WITHDRAWAL_DATE` | 422 | Withdraw date < first deposit date | Withdrawal date cannot be before first deposit date |
| `NO_DEPOSITS_FOUND` | 422 | Calculate withdrawal on account with no deposits | Account has no deposits yet. Cannot calculate withdrawal. |
| `NEGATIVE_DURATION` | 422 | Withdrawal date before deposit date | Duration cannot be negative |

---

## Edge Cases Documentation

### 1. Customer Management

#### Edge Case: Delete Customer with Accounts

**Scenario:**
```
1. Customer "John Doe" (ID: 1) exists
2. Customer has 2 active accounts
3. Admin tries to delete customer
```

**Expected Behavior:**
- ❌ DELETE should FAIL
- Return 409 Conflict
- Show clear error message

**Error Response:**
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

**Frontend Handling:**
```typescript
if (error.code === 'CUSTOMER_HAS_ACCOUNTS') {
  showError(
    `Cannot delete ${customer.name}. ` +
    `Customer has ${error.details.active_accounts} active accounts. ` +
    `Please close all accounts first.`
  );
}
```

**Test Cases:**
```typescript
describe('DELETE /customers/:id', () => {
  it('should fail when customer has accounts', async () => {
    const customer = await createCustomer();
    await createAccount({ customer_id: customer.id });

    const response = await request(app)
      .delete(`/customers/${customer.id}`)
      .expect(409);

    expect(response.body.error.code).toBe('CUSTOMER_HAS_ACCOUNTS');
  });
});
```

---

#### Edge Case: Customer Name Edge Cases

**Scenario 1: Empty Name**
```json
POST /customers
{ "name": "" }
```
**Expected:** 400 with `CUSTOMER_NAME_REQUIRED`

**Scenario 2: Name Too Short**
```json
POST /customers
{ "name": "A" }
```
**Expected:** 400 with `CUSTOMER_NAME_TOO_SHORT`

**Scenario 3: Name Too Long**
```json
POST /customers
{ "name": "A".repeat(256) }
```
**Expected:** 400 with `CUSTOMER_NAME_TOO_LONG`

**Scenario 4: Special Characters**
```json
POST /customers
{ "name": "John Doe @#$%" }
```
**Expected:** ✅ 201 Created (allow special chars unless business rule says otherwise)

**Scenario 5: Unicode Characters**
```json
POST /customers
{ "name": "李明 (Li Ming)" }
```
**Expected:** ✅ 201 Created (support international names)

---

### 2. Deposito Type Management

#### Edge Case: Delete Deposito Type in Use

**Scenario:**
```
1. Deposito type "Gold" (ID: 3) exists
2. 42 accounts using "Gold"
3. Admin tries to delete "Gold"
```

**Expected Behavior:**
- ❌ DELETE should FAIL
- Return 409 Conflict

**Error Response:**
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

#### Edge Case: Duplicate Deposito Type Name

**Scenario:**
```
1. Deposito type "Gold" already exists
2. Admin tries to create another "Gold"
```

**Expected:** 409 with `DUPLICATE_DEPOSITO_NAME`

**Database Constraint:**
```sql
CREATE UNIQUE INDEX idx_deposito_types_name ON deposito_types(name);
```

---

#### Edge Case: Invalid Yearly Return

**Scenario 1: Negative Return**
```json
POST /deposito-types
{ "name": "Bad", "yearly_return": -5.00 }
```
**Expected:** 400 with `INVALID_YEARLY_RETURN`

**Scenario 2: Zero Return**
```json
{ "name": "Zero", "yearly_return": 0.00 }
```
**Expected:** 400 (return must be > 0)

**Scenario 3: Return > 100%**
```json
{ "name": "Scam", "yearly_return": 150.00 }
```
**Expected:** 400 (unrealistic return)

**Scenario 4: Very Small Return**
```json
{ "name": "Tiny", "yearly_return": 0.01 }
```
**Expected:** ✅ 201 Created (valid, minimum 0.01%)

---

### 3. Account Management

#### Edge Case: Delete Account with Balance

**Scenario:**
```
1. Account has balance Rp 50,000,000
2. Admin tries to delete account
```

**Expected Behavior:**
- ❌ DELETE should FAIL
- Return 409 Conflict

**Error Response:**
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

**User Guidance:**
```
"Cannot delete account. Current balance: Rp 50,000,000.
Please withdraw all money before closing the account."
```

---

#### Edge Case: Create Account with Initial Deposit

**Scenario 1: Balance > 0 but No Date**
```json
POST /accounts
{
  "customer_id": 1,
  "deposito_type_id": 3,
  "initial_balance": 50000000.00
  // missing initial_deposit_date
}
```
**Expected:** 400 with `INITIAL_DEPOSIT_DATE_REQUIRED`

**Scenario 2: Balance = 0 with Date**
```json
{
  "customer_id": 1,
  "deposito_type_id": 3,
  "initial_balance": 0,
  "initial_deposit_date": "2025-01-01"
}
```
**Expected:** ✅ 201 Created (date ignored if balance = 0)

---

#### Edge Case: Invalid References

**Scenario 1: Non-existent Customer**
```json
POST /accounts
{
  "customer_id": 999,  // doesn't exist
  "deposito_type_id": 3,
  "initial_balance": 0
}
```
**Expected:** 400 with `INVALID_CUSTOMER`

**Scenario 2: Non-existent Deposito Type**
```json
{
  "customer_id": 1,
  "deposito_type_id": 999,  // doesn't exist
  "initial_balance": 0
}
```
**Expected:** 400 with `INVALID_DEPOSITO_TYPE`

---

### 4. Transaction Management (CRITICAL)

#### Edge Case: Deposit Zero or Negative Amount

**Scenario 1: Zero Deposit**
```json
POST /transactions/deposit
{
  "account_id": 1,
  "amount": 0.00,
  "transaction_date": "2025-11-22"
}
```
**Expected:** 400 with `INVALID_AMOUNT`

**Scenario 2: Negative Deposit**
```json
{
  "account_id": 1,
  "amount": -10000.00,
  "transaction_date": "2025-11-22"
}
```
**Expected:** 400 with `INVALID_AMOUNT`

---

#### Edge Case: Future Transaction Date

**Scenario:**
```
Today: 2025-11-22
Deposit date: 2025-12-01 (future)
```

**Expected:** 400 with `FUTURE_DATE_NOT_ALLOWED`

**Validation:**
```typescript
if (new Date(transaction_date) > new Date()) {
  throw new BadRequestError('Transaction date cannot be in the future');
}
```

---

#### Edge Case: Withdraw Before Deposit (CRITICAL)

**Scenario:**
```
First deposit: 2025-01-01
Withdrawal date: 2024-12-01 (before first deposit)
```

**Expected Behavior:**
- ❌ Calculate/Withdraw should FAIL
- Return 422 Unprocessable Entity

**Error Response:**
```json
{
  "success": false,
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

**Validation:**
```typescript
const firstDeposit = await getFirstDepositDate(accountId);
if (withdrawalDate < firstDeposit) {
  throw new UnprocessableEntityError(
    'INVALID_WITHDRAWAL_DATE',
    'Withdrawal date cannot be before first deposit date',
    { first_deposit_date: firstDeposit, withdrawal_date: withdrawalDate }
  );
}
```

---

#### Edge Case: Withdraw with No Deposits

**Scenario:**
```
1. Account created with initial_balance = 0
2. No deposits made
3. Try to calculate withdrawal
```

**Expected:** 422 with `NO_DEPOSITS_FOUND`

**Error Response:**
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

#### Edge Case: Withdraw Same Day as Deposit

**Scenario:**
```
Deposit date: 2025-01-01
Withdrawal date: 2025-01-01 (same day)
```

**Expected Behavior:**
- ✅ Should SUCCEED
- Duration: 0 months
- Interest: 0 (no time passed)
- Ending balance = Starting balance

**Calculation:**
```typescript
months = 0
interest = starting_balance × (1 + 0.005833 × 0) = starting_balance
ending_balance = starting_balance (no interest)
```

**Test Case:**
```typescript
it('should allow withdrawal on same day with zero interest', async () => {
  const account = await createAccountWithDeposit({
    amount: 50000000,
    date: '2025-01-01'
  });

  const calc = await calculateWithdrawal(account.id, '2025-01-01');

  expect(calc.months_duration).toBe(0);
  expect(calc.interest_earned).toBe(0);
  expect(calc.ending_balance).toBe(50000000);
});
```

---

#### Edge Case: Withdrawal After Many Years

**Scenario:**
```
Deposit: 2025-01-01
Withdrawal: 2035-01-01 (10 years later)
Duration: 120 months
```

**Expected Behavior:**
- ✅ Should SUCCEED
- Interest calculation accurate for long duration

**Calculation:**
```typescript
starting_balance = 50,000,000
yearly_return = 7%
months = 120
monthly_return = 7 / 12 / 100 = 0.005833

ending_balance = 50,000,000 × (1 + 0.005833 × 120)
               = 50,000,000 × (1 + 0.7)
               = 50,000,000 × 1.7
               = 85,000,000

interest_earned = 35,000,000
```

**Warning:** Simple interest for 10 years might not be realistic. Consider mentioning compound interest in production.

---

#### Edge Case: Fractional Month Calculation

**Scenario:**
```
Deposit: 2025-01-01
Withdrawal: 2025-01-15 (15 days later)
```

**Expected Calculation:**
```typescript
months = 0 + 0 + (15 / 30) = 0.5 months

ending_balance = 50,000,000 × (1 + 0.005833 × 0.5)
               = 50,000,000 × 1.0029165
               = 50,145,825

interest_earned = 145,825
```

**Test Case:**
```typescript
it('should calculate fractional months correctly', async () => {
  const calc = await calculateWithdrawal(
    50000000,
    7.00,
    '2025-01-01',
    '2025-01-15'
  );

  expect(calc.months_duration).toBeCloseTo(0.5, 2);
  expect(calc.interest_earned).toBeCloseTo(145825, 0);
});
```

---

#### Edge Case: Multiple Deposits (IMPORTANT)

**Scenario:**
```
Deposit 1: Rp 30,000,000 on 2025-01-01
Deposit 2: Rp 20,000,000 on 2025-06-01
Withdrawal: 2025-12-01
```

**Expected Behavior:**
- Use **FIRST deposit date** for duration calculation
- Use **TOTAL balance** (50M) for interest calculation

**Calculation:**
```typescript
starting_balance = 50,000,000 (total of all deposits)
first_deposit_date = 2025-01-01 (earliest deposit)
withdrawal_date = 2025-12-01
months = 11

ending_balance = 50,000,000 × (1 + 0.005833 × 11)
               = 50,000,000 × 1.064163
               = 53,208,150
```

**⚠️ Note:** This is simplified. In real banking:
- Each deposit might have different interest calculation
- Consider weighted average or separate calculation per deposit
- For test purposes, using first deposit date + total balance is acceptable

---

### 5. Concurrent Access (Race Conditions)

#### Edge Case: Concurrent Deposits

**Scenario:**
```
Initial balance: Rp 50,000,000
User A deposits: Rp 10,000,000 (at same time)
User B deposits: Rp 5,000,000  (at same time)
```

**Without Locking (BAD):**
```
Thread A reads: 50,000,000
Thread B reads: 50,000,000
Thread A writes: 60,000,000 ❌ (lost Thread B's deposit!)
Thread B writes: 55,000,000 ❌ (lost Thread A's deposit!)
Final: 55,000,000 (WRONG, should be 65,000,000)
```

**With Locking (GOOD):**
```sql
BEGIN TRANSACTION;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;  -- Lock row
-- Calculate new balance
UPDATE accounts SET balance = 60000000 WHERE id = 1;
COMMIT;
```

**Prisma Implementation:**
```typescript
await prisma.$transaction(async (tx) => {
  const account = await tx.account.findUnique({
    where: { id: accountId }
  });

  const newBalance = account.balance + amount;

  await tx.account.update({
    where: { id: accountId },
    data: { balance: newBalance }
  });
});
```

---

#### Edge Case: Double Withdrawal

**Scenario:**
```
Balance: Rp 50,000,000
User clicks "Withdraw" twice quickly
```

**Expected Behavior:**
- First withdrawal: SUCCESS, balance → 0
- Second withdrawal: FAIL with `INSUFFICIENT_BALANCE`

**Protection:**
```typescript
await prisma.$transaction(async (tx) => {
  const account = await tx.account.findUnique({ where: { id } });

  if (account.balance === 0) {
    throw new BadRequestError('INSUFFICIENT_BALANCE', 'Account balance is zero');
  }

  // Process withdrawal
});
```

---

### 6. Data Type Edge Cases

#### Edge Case: Very Large Numbers

**Scenario:**
```json
POST /transactions/deposit
{
  "account_id": 1,
  "amount": 999999999999.99  // Almost 1 trillion
}
```

**Expected:** ✅ Should succeed if DECIMAL(15,2) can handle it

**Database Limit:**
```
DECIMAL(15,2) max: 999,999,999,999.99
```

**Overflow Test:**
```json
{
  "amount": 9999999999999.99  // Exceeds DECIMAL(15,2)
}
```
**Expected:** Database error or validation error

---

#### Edge Case: Floating Point Precision

**Scenario:**
```
Amount: 10000000.33333333 (many decimals)
```

**Expected:** Rounded to 2 decimal places: 10000000.33

**Validation:**
```typescript
amount = Math.round(amount * 100) / 100;  // Round to 2 decimals
```

---

### 7. Date Edge Cases

#### Edge Case: Leap Year

**Scenario:**
```
Deposit: 2024-02-01
Withdrawal: 2024-03-01
Duration: 29 days (leap year) = 0.97 months
```

**Expected:** Calculation should handle leap years correctly

---

#### Edge Case: Month End

**Scenario:**
```
Deposit: 2025-01-31
Withdrawal: 2025-02-28
Duration: 28 days = 0.93 months
```

**Expected:** Use day/30 calculation (as per formula)

---

#### Edge Case: Invalid Date Format

**Scenario:**
```json
{
  "transaction_date": "2025-13-01"  // Invalid month
}
```
**Expected:** 400 with validation error

**Scenario 2:**
```json
{
  "transaction_date": "not-a-date"
}
```
**Expected:** 400 with validation error

---

## Error Handling Implementation

### Backend (Express + TypeScript)

#### Custom Error Classes

```typescript
// errors/CustomErrors.ts

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(code: string, message: string, details?: any) {
    super(400, code, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(code: string, message: string, details?: any) {
    super(409, code, message, details);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(code: string, message: string, details?: any) {
    super(422, code, message, details);
  }
}
```

---

#### Global Error Handler Middleware

```typescript
// middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/CustomErrors';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error('Error:', err);

  // Handle custom application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  // Handle validation errors (Zod, express-validator)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.message
      }
    });
  }

  // Default: Internal Server Error
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message
    }
  });
};

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError, res: Response) {
  switch (err.code) {
    case 'P2002': // Unique constraint violation
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: `${err.meta?.target} already exists`
        }
      });

    case 'P2003': // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REFERENCE',
          message: 'Referenced record does not exist'
        }
      });

    case 'P2025': // Record not found
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found'
        }
      });

    default:
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Database error occurred'
        }
      });
  }
}
```

---

#### Service Layer Example

```typescript
// services/TransactionService.ts

export class TransactionService {
  async withdraw(data: WithdrawDTO): Promise<WithdrawalResult> {
    // Validate account exists
    const account = await this.prisma.account.findUnique({
      where: { id: data.account_id },
      include: { deposito_type: true }
    });

    if (!account) {
      throw new NotFoundError(
        'ACCOUNT_NOT_FOUND',
        `Account with ID ${data.account_id} not found`
      );
    }

    // Validate balance
    if (account.balance === 0) {
      throw new BadRequestError(
        'INSUFFICIENT_BALANCE',
        'Account balance is zero. Nothing to withdraw.'
      );
    }

    // Get first deposit date
    const firstDeposit = await this.getFirstDepositDate(data.account_id);

    if (!firstDeposit) {
      throw new UnprocessableEntityError(
        'NO_DEPOSITS_FOUND',
        'Account has no deposits yet. Cannot calculate withdrawal.',
        { account_id: data.account_id, current_balance: account.balance }
      );
    }

    // Validate withdrawal date
    if (new Date(data.withdrawal_date) < new Date(firstDeposit.transaction_date)) {
      throw new UnprocessableEntityError(
        'INVALID_WITHDRAWAL_DATE',
        'Withdrawal date cannot be before first deposit date',
        {
          first_deposit_date: firstDeposit.transaction_date,
          withdrawal_date: data.withdrawal_date
        }
      );
    }

    // Process withdrawal...
    return await this.processWithdrawal(account, data);
  }
}
```

---

### Frontend Error Handling

```typescript
// utils/errorHandler.ts

export function handleApiError(error: any) {
  if (!error.response) {
    // Network error
    return {
      title: 'Connection Error',
      message: 'Unable to connect to server. Please check your internet connection.',
      type: 'network'
    };
  }

  const { status, data } = error.response;
  const errorCode = data?.error?.code;
  const errorMessage = data?.error?.message;

  // Map error codes to user-friendly messages
  switch (errorCode) {
    case 'CUSTOMER_HAS_ACCOUNTS':
      return {
        title: 'Cannot Delete Customer',
        message: `${errorMessage}. Please close all accounts first.`,
        type: 'conflict'
      };

    case 'INVALID_WITHDRAWAL_DATE':
      return {
        title: 'Invalid Withdrawal Date',
        message: errorMessage,
        type: 'validation',
        details: data.error.details
      };

    case 'INSUFFICIENT_BALANCE':
      return {
        title: 'Cannot Withdraw',
        message: 'Account balance is zero.',
        type: 'business'
      };

    default:
      return {
        title: 'Error',
        message: errorMessage || 'An error occurred',
        type: 'unknown'
      };
  }
}

// Usage in React component
async function handleDelete(customerId: number) {
  try {
    await api.delete(`/customers/${customerId}`);
    toast.success('Customer deleted successfully');
  } catch (error) {
    const errorInfo = handleApiError(error);
    toast.error(errorInfo.message, { title: errorInfo.title });
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('TransactionService - Withdraw', () => {
  it('should throw INSUFFICIENT_BALANCE when balance is zero', async () => {
    const account = await createAccount({ balance: 0 });

    await expect(
      transactionService.withdraw({
        account_id: account.id,
        withdrawal_date: '2025-11-22'
      })
    ).rejects.toThrow('INSUFFICIENT_BALANCE');
  });

  it('should throw INVALID_WITHDRAWAL_DATE when date before first deposit', async () => {
    const account = await createAccountWithDeposit({
      date: '2025-01-01'
    });

    await expect(
      transactionService.withdraw({
        account_id: account.id,
        withdrawal_date: '2024-12-01'  // Before deposit
      })
    ).rejects.toThrow('INVALID_WITHDRAWAL_DATE');
  });
});
```

---

### Integration Tests

```typescript
describe('POST /transactions/withdraw', () => {
  it('should return 422 when withdrawal date is invalid', async () => {
    const account = await createAccountWithDeposit({ date: '2025-01-01' });

    const response = await request(app)
      .post('/api/v1/transactions/withdraw')
      .send({
        account_id: account.id,
        withdrawal_date: '2024-12-01'
      })
      .expect(422);

    expect(response.body.error.code).toBe('INVALID_WITHDRAWAL_DATE');
    expect(response.body.error.details.first_deposit_date).toBe('2025-01-01');
  });
});
```

---

## Summary

### Error Handling Checklist:

- ✅ Custom error classes defined
- ✅ Global error handler middleware
- ✅ All HTTP status codes mapped
- ✅ Error response format standardized
- ✅ Prisma errors handled
- ✅ Validation errors handled
- ✅ Business logic errors handled
- ✅ Frontend error handling
- ✅ User-friendly error messages
- ✅ Edge cases documented
- ✅ Test cases for errors

### Edge Cases Covered:

| Category | Edge Cases | Total |
|----------|------------|-------|
| Customer | Name validation, delete with accounts | 5 |
| Deposito Type | Duplicate name, invalid return, delete in use | 6 |
| Account | Delete with balance, invalid references | 4 |
| Transaction | Zero amount, future date, invalid withdrawal date | 10 |
| Concurrent | Race conditions, double withdrawal | 2 |
| Data Types | Large numbers, precision, dates | 5 |

**Total Edge Cases Documented:** 32+

---

**Status**: ✅ COMPLETE - Production Ready Error Handling
**Last Updated**: 2025-11-22
