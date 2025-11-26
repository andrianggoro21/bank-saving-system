# Postman Collection Guide - Bank Saving System

## Mengapa Postman Collection Penting?

**Postman Collection adalah EXECUTABLE DOCUMENTATION**

### Alasan Postman Collection di Step 6:

1. ✅ **Ready-to-Test** - Import dan langsung bisa test API
2. ✅ **Environment Variables** - Easy switch antara dev & production
3. ✅ **Automated Tests** - Built-in test scripts
4. ✅ **Team Collaboration** - Share collection dengan team
5. ✅ **Collection Runner** - Run complete flow automation
6. ✅ **Pre-request Scripts** - Auto-save IDs untuk next requests

---

## Files Included

| File | Purpose |
|------|---------|
| `06-postman-collection.json` | Complete API collection dengan 19 endpoints + test flow |
| `06-postman-environment.json` | Development environment variables |
| `06-postman-environment-production.json` | Production environment variables |
| `06-postman-guide.md` | This guide |

---

## Quick Start

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Drag & drop `06-postman-collection.json`
4. Collection "Bank Saving System API" akan muncul

### Step 2: Import Environment

1. Click **Import** button
2. Drag & drop `06-postman-environment.json`
3. Select environment di top-right dropdown: **Bank Saving - Development**

### Step 3: Test Your First Request

1. Expand collection → **Customers** folder
2. Click **"Create Customer"**
3. Click **Send** button
4. See response → Customer created!
5. Check environment variables → `customer_id` auto-saved!

---

## Environment Variables

### Development Environment

```
base_url: http://localhost:3000/api/v1
customer_id: (auto-filled by requests)
account_id: (auto-filled by requests)
deposito_type_id: (auto-filled by requests)
transaction_id: (auto-filled by requests)
```

### Production Environment

```
base_url: https://bank-saving.yourdomain.com/api/v1
(same variables as dev)
```

### How Variables Work

Variables menggunakan syntax `{{variable_name}}`:

**Example Request URL:**
```
{{base_url}}/customers/{{customer_id}}
```

**Actual URL (Development):**
```
http://localhost:3000/api/v1/customers/1
```

**Actual URL (Production):**
```
https://bank-saving.yourdomain.com/api/v1/customers/1
```

---

## Collection Structure

### 1. Customers Folder (5 endpoints)

```
├── Get All Customers (GET)
├── Get Customer by ID (GET)
├── Create Customer (POST)
├── Update Customer (PUT)
└── Delete Customer (DELETE)
```

### 2. Deposito Types Folder (5 endpoints)

```
├── Get All Deposito Types (GET)
├── Get Deposito Type by ID (GET)
├── Create Deposito Type (POST)
├── Update Deposito Type (PUT)
└── Delete Deposito Type (DELETE)
```

### 3. Accounts Folder (5 endpoints)

```
├── Get All Accounts (GET)
├── Get Account by ID (GET)
├── Create Account (POST)
├── Update Account (PUT)
└── Delete Account (DELETE)
```

### 4. Transactions Folder (4 endpoints)

```
├── Get All Transactions (GET)
├── Deposit Money (POST)
├── Calculate Withdrawal Preview (POST) ⭐ CRITICAL
└── Withdraw Money (POST) ⭐ CRITICAL
```

### 5. Complete Test Flow Folder (6 steps)

```
├── 1. Create Customer
├── 2. Create Deposito Type
├── 3. Create Account with Initial Deposit
├── 4. Add More Deposit
├── 5. Calculate Withdrawal Preview
└── 6. Withdraw Money
```

**Total:** 19 individual endpoints + 6 flow steps

---

## Automated Tests

### What Tests Are Included?

Setiap request punya **test scripts** yang otomatis run:

#### Example: Create Customer Tests

```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Customer created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.data).to.have.property('id');
});

// Auto-save customer_id
var jsonData = pm.response.json();
pm.environment.set("customer_id", jsonData.data.id);
```

#### Example: Calculate Withdrawal Tests

```javascript
pm.test("Calculation includes all required fields", function () {
    var jsonData = pm.response.json();
    var calc = jsonData.data.calculation;
    pm.expect(calc.starting_balance).to.exist;
    pm.expect(calc.ending_balance).to.exist;
    pm.expect(calc.interest_earned).to.exist;
});

pm.test("Interest earned is positive", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.calculation.interest_earned).to.be.above(0);
});

pm.test("Ending balance > Starting balance", function () {
    var jsonData = pm.response.json();
    var calc = jsonData.data.calculation;
    pm.expect(calc.ending_balance).to.be.above(calc.starting_balance);
});
```

### View Test Results

After sending request:
1. Check **Test Results** tab di response section
2. ✅ Green = test passed
3. ❌ Red = test failed

---

## How to Use Collection Runner

### What is Collection Runner?

Tool untuk run multiple requests secara sequence dengan automation.

### Use Case: Complete Test Flow

Run 6 steps automatically dari create customer sampai withdraw:

#### Step 1: Open Runner

1. Click collection **"Bank Saving System API"**
2. Click **Run** button (or right-click → Run collection)

#### Step 2: Select Folder

1. Uncheck all folders
2. Check only **"Complete Test Flow"**
3. Click **Run Bank Saving System API**

#### Step 3: Watch Automation

Postman akan run 6 requests secara otomatis:

```
✅ 1. Create Customer
   → customer_id saved

✅ 2. Create Deposito Type
   → deposito_type_id saved

✅ 3. Create Account
   → account_id saved
   → Initial deposit: Rp 50,000,000

✅ 4. Add More Deposit
   → Balance: Rp 60,000,000

✅ 5. Calculate Withdrawal Preview
   → Starting: Rp 60,000,000
   → Interest: Rp 3,500,000
   → Ending: Rp 63,500,000

✅ 6. Withdraw Money
   → Total received: Rp 63,500,000
   → Balance: Rp 0

🎉 COMPLETE!
```

#### Step 4: View Results

1. See run summary
2. All tests passed? ✅
3. Check console logs untuk detail calculation

---

## Manual Testing Workflow

### Workflow 1: Create Customer & Account

1. **Create Customer**
   - POST `/customers`
   - Body: `{"name": "John Doe"}`
   - Response: `customer_id` auto-saved

2. **Create Deposito Type** (if not exist)
   - POST `/deposito-types`
   - Body: `{"name": "Gold", "yearly_return": 7.00}`
   - Response: `deposito_type_id` auto-saved

3. **Create Account**
   - POST `/accounts`
   - Body uses: `{{customer_id}}` and `{{deposito_type_id}}`
   - Response: `account_id` auto-saved

---

### Workflow 2: Deposit & Withdraw

1. **Deposit Money**
   - POST `/transactions/deposit`
   - Body:
     ```json
     {
       "account_id": {{account_id}},
       "amount": 50000000.00,
       "transaction_date": "2025-01-01"
     }
     ```

2. **Calculate Preview** (CRITICAL STEP)
   - POST `/transactions/calculate-withdrawal`
   - Body:
     ```json
     {
       "account_id": {{account_id}},
       "withdrawal_date": "2025-11-22"
     }
     ```
   - Check response: ending_balance, interest_earned

3. **Withdraw Money**
   - POST `/transactions/withdraw`
   - Body:
     ```json
     {
       "account_id": {{account_id}},
       "withdrawal_date": "2025-11-22"
     }
     ```
   - Account balance → 0

---

## Request Body Examples

### Create Customer
```json
{
  "name": "Ahmad Abdullah"
}
```

### Create Deposito Type
```json
{
  "name": "Platinum",
  "yearly_return": 10.00
}
```

### Create Account (with initial deposit)
```json
{
  "customer_id": {{customer_id}},
  "deposito_type_id": {{deposito_type_id}},
  "initial_balance": 50000000.00,
  "initial_deposit_date": "2025-01-01"
}
```

### Create Account (without initial deposit)
```json
{
  "customer_id": {{customer_id}},
  "deposito_type_id": {{deposito_type_id}},
  "initial_balance": 0
}
```

### Deposit Money
```json
{
  "account_id": {{account_id}},
  "amount": 10000000.00,
  "transaction_date": "2025-11-22",
  "notes": "Monthly deposit"
}
```

### Calculate Withdrawal
```json
{
  "account_id": {{account_id}},
  "withdrawal_date": "2025-11-22"
}
```

### Withdraw Money
```json
{
  "account_id": {{account_id}},
  "withdrawal_date": "2025-11-22",
  "notes": "Account closure"
}
```

---

## Query Parameters Examples

### Get Customers with Filters
```
GET {{base_url}}/customers?page=1&limit=10&search=john&sort=name&order=asc
```

### Get Accounts by Customer
```
GET {{base_url}}/accounts?customer_id={{customer_id}}
```

### Get Transactions by Date Range
```
GET {{base_url}}/transactions?start_date=2025-01-01&end_date=2025-12-31&type=deposit
```

---

## Error Testing

### Test Error: Delete Customer with Accounts

1. Create customer
2. Create account for that customer
3. Try to delete customer
4. Expected: **409 Conflict**
   ```json
   {
     "success": false,
     "error": {
       "code": "CUSTOMER_HAS_ACCOUNTS",
       "message": "Cannot delete customer with existing accounts"
     }
   }
   ```

### Test Error: Withdraw Before Deposit

1. Create account (no initial deposit)
2. Try to withdraw
3. Expected: **400 Bad Request**
   ```json
   {
     "success": false,
     "error": {
       "code": "INSUFFICIENT_BALANCE",
       "message": "Account balance is zero"
     }
   }
   ```

### Test Error: Invalid Withdrawal Date

1. Create account with deposit date 2025-01-01
2. Try to withdraw with date 2024-12-01 (before deposit)
3. Expected: **422 Unprocessable Entity**
   ```json
   {
     "success": false,
     "error": {
       "code": "INVALID_WITHDRAWAL_DATE",
       "message": "Withdrawal date cannot be before first deposit date"
     }
   }
   ```

---

## Advanced Features

### Pre-request Scripts

Beberapa requests punya pre-request scripts untuk setup data:

```javascript
// Example: Set current date as transaction_date
pm.environment.set("current_date", new Date().toISOString().split('T')[0]);
```

Usage di request body:
```json
{
  "transaction_date": "{{current_date}}"
}
```

### Console Logging

Test scripts log informasi penting ke console:

```javascript
console.log("✅ Step 1: Customer created, ID =", jsonData.data.id);
console.log("   Balance:", jsonData.data.balance);
```

**View Console:**
- Postman → View → Show Postman Console
- Or: `Ctrl + Alt + C` (Windows) / `Cmd + Alt + C` (Mac)

---

## Team Collaboration

### Export & Share

**Export Collection:**
1. Right-click collection
2. Export
3. Collection v2.1 (recommended)
4. Share JSON file with team

**Export Environment:**
1. Click environment dropdown
2. Click gear icon
3. Select environment
4. Export
5. Share JSON file

### Import Shared Collection

1. Receive JSON file from teammate
2. Postman → Import
3. Upload file
4. Ready to use!

---

## CI/CD Integration

### Run Collection with Newman (CLI)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run 06-postman-collection.json \
  -e 06-postman-environment.json \
  --reporters cli,json

# Run specific folder
newman run 06-postman-collection.json \
  -e 06-postman-environment.json \
  --folder "Complete Test Flow"
```

### Add to CI Pipeline

**Example: GitHub Actions**

```yaml
name: API Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run API tests
        run: |
          npm install -g newman
          newman run docs/06-postman-collection.json \
            -e docs/06-postman-environment.json
```

---

## Tips & Tricks

### 1. Duplicate Requests

Right-click request → Duplicate → Modify untuk test variations

### 2. Save Response as Example

After successful request:
- Click **Save Response** → **Save as Example**
- Berguna untuk documentation

### 3. Use Variables for Dates

Set variable untuk consistent dates:
```javascript
pm.environment.set("deposit_date", "2025-01-01");
pm.environment.set("withdrawal_date", "2025-11-22");
```

### 4. Bulk Edit

Select multiple requests → Edit → Change base URL semua sekaligus

### 5. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Send request |
| `Ctrl/Cmd + S` | Save request |
| `Ctrl/Cmd + Alt + C` | Open console |
| `Ctrl/Cmd + K` | Search requests |

---

## Troubleshooting

### Issue: Variable Not Defined

**Symptom:** `{{customer_id}}` shows as text in URL

**Solution:**
1. Check environment is selected (top-right)
2. Run prerequisite requests first (Create Customer → then use customer_id)

### Issue: Tests Failing

**Symptom:** Red X in test results

**Solution:**
1. Check response status code
2. Read test error message
3. Check request body format
4. Verify server is running

### Issue: Connection Refused

**Symptom:** `Error: connect ECONNREFUSED`

**Solution:**
1. Make sure backend server is running: `npm run dev`
2. Check `base_url` in environment
3. Verify port number (default: 3000)

---

## Summary

### What You Get:

| Feature | Benefit |
|---------|---------|
| **19 Endpoints** | Complete API coverage |
| **Automated Tests** | Validate responses automatically |
| **Environment Variables** | Easy dev/prod switching |
| **Complete Test Flow** | End-to-end testing in 1 click |
| **Collection Runner** | Automation ready |
| **Team Ready** | Easy export/import for collaboration |
| **CI/CD Ready** | Newman integration |

### How to Start:

1. ✅ Import collection
2. ✅ Import environment
3. ✅ Select environment
4. ✅ Run "Complete Test Flow" folder
5. ✅ Watch automation magic!

---

**Status**: ✅ COMPLETE - Ready for Testing
**Files**: 3 files (collection + 2 environments)
**Last Updated**: 2025-11-22
