# Wireframe & User Journey Flow - Bank Saving System

## Mengapa Dokumen Ini Penting?

**Wireframe & User Flow adalah FONDASI dari seluruh aplikasi** karena:

1. ✅ **Visualisasi Requirement** - Mengubah requirement text menjadi visual yang jelas
2. ✅ **Validasi dengan Stakeholder** - Memastikan semua pihak punya pemahaman yang sama
3. ✅ **Panduan untuk Developer** - Blueprint untuk frontend development
4. ✅ **Identifikasi Missing Features** - Menemukan fitur yang terlewat saat analisa awal
5. ✅ **Estimasi Effort** - Menghitung berapa banyak screen/component yang harus dibuat

---

## User Roles

### 1. Admin/Bank Staff
- Manage customers
- Manage accounts
- Manage deposito types
- View all transactions

### 2. Customer (Optional - jika ada customer portal)
- View own accounts
- Deposit money
- Withdraw money
- View transaction history

---

## Screen List & Wireframe

### **A. CUSTOMER MANAGEMENT**

#### Screen 1: Customer List
```
+----------------------------------------------------------+
|  [+ Add Customer]                    [Search: ________]  |
+----------------------------------------------------------+
| ID    | Name              | Total Accounts | Actions      |
|-------|-------------------|----------------|--------------|
| C001  | John Doe          | 2              | [Edit][Del]  |
| C002  | Jane Smith        | 1              | [Edit][Del]  |
| C003  | Ahmad Abdullah    | 3              | [Edit][Del]  |
+----------------------------------------------------------+
```

**Why this screen?**
- CRUD Customer diminta dalam requirement
- Perlu list view untuk manage semua customer
- Search diperlukan untuk scalability (banyak customer)

---

#### Screen 2: Add/Edit Customer Form
```
+----------------------------------+
|  Add New Customer                |
+----------------------------------+
|                                  |
|  Name: [___________________]     |
|                                  |
|  [Cancel]  [Save]                |
+----------------------------------+
```

**Why minimal fields?**
- Requirement hanya minta: id, name
- Keep it simple sesuai spec
- ID auto-generated (best practice)

---

### **B. DEPOSITO TYPE MANAGEMENT**

#### Screen 3: Deposito Type List
```
+----------------------------------------------------------+
|  [+ Add Deposito Type]                                   |
+----------------------------------------------------------+
| ID    | Name              | Yearly Return  | Actions      |
|-------|-------------------|----------------|--------------|
| DT001 | Bronze            | 3%             | [Edit][Del]  |
| DT002 | Silver            | 5%             | [Edit][Del]  |
| DT003 | Gold              | 7%             | [Edit][Del]  |
+----------------------------------------------------------+
```

**Why this screen?**
- Manage master data deposito types
- Admin bisa add/edit/delete tipe deposito
- Yearly return bisa berubah sewaktu-waktu

---

#### Screen 4: Add/Edit Deposito Type Form
```
+----------------------------------+
|  Add Deposito Type               |
+----------------------------------+
|                                  |
|  Name: [___________________]     |
|                                  |
|  Yearly Return (%):              |
|  [____]                          |
|                                  |
|  [Cancel]  [Save]                |
+----------------------------------+
```

**Why?**
- Simple form untuk master data
- Validation: yearly return harus > 0

---

### **C. ACCOUNT MANAGEMENT**

#### Screen 5: Account List
```
+------------------------------------------------------------------------------+
|  [+ Add Account]                               [Search: ________]           |
+------------------------------------------------------------------------------+
| Account ID | Customer      | Deposito Type | Balance       | Actions        |
|------------|---------------|---------------|---------------|----------------|
| A001       | John Doe      | Gold (7%)     | Rp 50,000,000 | [View][Edit]   |
| A002       | John Doe      | Silver (5%)   | Rp 20,000,000 | [View][Edit]   |
| A003       | Jane Smith    | Bronze (3%)   | Rp 10,000,000 | [View][Edit]   |
+------------------------------------------------------------------------------+
```

**Why this screen?**
- Central view untuk semua accounts
- Show customer name (tidak hanya ID) untuk UX yang baik
- Balance displayed untuk quick overview
- 1 customer bisa punya multiple accounts (sesuai requirement)

---

#### Screen 6: Add/Edit Account Form
```
+----------------------------------+
|  Create New Account              |
+----------------------------------+
|                                  |
|  Customer:                       |
|  [Select Customer ▼]             |
|                                  |
|  Deposito Type:                  |
|  [Select Deposito Type ▼]        |
|                                  |
|  Initial Balance:                |
|  Rp [___________________]        |
|                                  |
|  [Cancel]  [Create Account]      |
+----------------------------------+
```

**Why?**
- Dropdown untuk customer: prevent typo, ensure valid customer
- Dropdown untuk deposito type: ensure valid type
- Initial balance: account bisa dibuat dengan saldo awal 0 atau ada nilai

---

### **D. TRANSACTION (CORE FEATURE)**

#### Screen 7: Account Detail & Transaction
```
+----------------------------------------------------------+
|  Account: A001                          [Back to List]   |
+----------------------------------------------------------+
|  Customer: John Doe                                      |
|  Deposito Type: Gold (7% yearly / 0.583% monthly)        |
|  Current Balance: Rp 50,000,000                          |
|  Account Created: 2025-01-01                             |
+----------------------------------------------------------+
|                                                          |
|  [+ Deposit]  [- Withdraw]                               |
|                                                          |
+----------------------------------------------------------+
|  Transaction History                                     |
+----------------------------------------------------------+
| Date       | Type     | Amount         | Balance After   |
|------------|----------|----------------|-----------------|
| 2025-11-20 | Deposit  | +10,000,000    | 50,000,000      |
| 2025-06-15 | Withdraw | -15,750,000    | 40,000,000      |
| 2025-01-01 | Deposit  | +50,000,000    | 50,000,000      |
+----------------------------------------------------------+
```

**Why this screen?**
- Complete view untuk 1 account
- Show deposito calculation (monthly return)
- Transaction history untuk transparency
- Button Deposit & Withdraw untuk core features

---

#### Screen 8: Deposit Form
```
+----------------------------------+
|  Deposit Money                   |
+----------------------------------+
|  Account: A001 - John Doe        |
|  Current Balance: Rp 50,000,000  |
|                                  |
|  Deposit Amount:                 |
|  Rp [___________________]        |
|                                  |
|  Deposit Date:                   |
|  [____/____/____] 📅             |
|                                  |
|  New Balance:                    |
|  Rp 50,000,000 + input           |
|                                  |
|  [Cancel]  [Confirm Deposit]     |
+----------------------------------+
```

**Why?**
- Amount input dengan validation (must > 0)
- **Date input WAJIB** (requirement: input the deposit date)
- Show preview new balance
- Confirmation pattern untuk financial transaction

---

#### Screen 9: Withdraw Form (MOST IMPORTANT)
```
+----------------------------------+
|  Withdraw Money                  |
+----------------------------------+
|  Account: A001 - John Doe        |
|  Deposito: Gold (7% yearly)      |
|                                  |
|  Starting Balance: Rp 50,000,000 |
|  Last Deposit: 2025-01-01        |
|                                  |
|  Withdrawal Date:                |
|  [____/____/____] 📅             |
|                                  |
|  --- CALCULATION PREVIEW ---     |
|  Duration: 10 months 20 days     |
|  Monthly Return: 0.583%          |
|                                  |
|  Ending Balance:                 |
|  Rp 53,083,333                   |
|                                  |
|  Interest Earned:                |
|  Rp 3,083,333                    |
|                                  |
|  [Cancel]  [Confirm Withdraw]    |
+----------------------------------+
```

**Why ini screen PALING PENTING?**
- Requirement mewajibkan: **system must calculate the ending balance when customer withdraw**
- Formula: `ending_balance = starting_balance × #months × monthly_return`
- User harus lihat calculation SEBELUM confirm
- Transparency: show interest earned
- Date input WAJIB (requirement: input the withdrawal date)

---

## User Journey Flow

### Journey 1: Customer Opens Deposito Account

```
[Start]
   ↓
[Admin creates Customer] (Screen 2)
   ↓
[Customer record saved]
   ↓
[Admin creates Account for Customer] (Screen 6)
   ↓
[Select Customer from dropdown]
   ↓
[Select Deposito Type (Bronze/Silver/Gold)]
   ↓
[Input Initial Balance]
   ↓
[Account Created] (Screen 7)
   ↓
[End]
```

**Why this flow?**
- Customer harus ada dulu sebelum bisa buka account
- Deposito type harus dipilih saat account creation
- Linear flow, mudah dipahami

---

### Journey 2: Customer Deposits Money

```
[Start]
   ↓
[Admin goes to Account Detail] (Screen 7)
   ↓
[Click "Deposit" button]
   ↓
[Deposit Form opens] (Screen 8)
   ↓
[Input: Amount + Date]
   ↓
[Preview new balance]
   ↓
[Confirm]
   ↓
[Balance updated]
   ↓
[Transaction recorded]
   ↓
[Back to Account Detail - see updated balance]
   ↓
[End]
```

**Why this flow?**
- Simple, straightforward
- Preview sebelum confirm (best practice untuk financial)
- Date tracking (required by spec)

---

### Journey 3: Customer Withdraws Money (CORE JOURNEY)

```
[Start]
   ↓
[Admin goes to Account Detail] (Screen 7)
   ↓
[Click "Withdraw" button]
   ↓
[Withdraw Form opens] (Screen 9)
   ↓
[Input: Withdrawal Date]
   ↓
[System AUTO-CALCULATES:]
   - Duration (months between deposit & withdrawal)
   - Monthly return (yearly return ÷ 12)
   - Ending balance (formula)
   - Interest earned
   ↓
[Show calculation preview to user]
   ↓
[User reviews calculation]
   ↓
[Confirm withdrawal]
   ↓
[Account balance updated to 0]
   ↓
[Transaction recorded with ending balance]
   ↓
[Show success message with final amount]
   ↓
[End]
```

**Why this is the MOST CRITICAL flow?**
- Ini adalah **CORE REQUIREMENT** dari test
- Sistem harus calculate ending balance
- Formula harus benar: `ending_balance = starting_balance × #months × monthly_return`
- User harus melihat perhitungan sebelum confirm
- Edge cases harus dihandle (lihat section Error Handling nanti)

---

### Journey 4: Admin Manages Deposito Types

```
[Start]
   ↓
[Admin goes to Deposito Type List] (Screen 3)
   ↓
[Click "Add Deposito Type"]
   ↓
[Fill form: Name + Yearly Return] (Screen 4)
   ↓
[Save]
   ↓
[New deposito type available for accounts]
   ↓
[End]
```

**Why?**
- Bank perlu flexibility untuk add new deposito products
- Yearly return bisa berubah (promo, market conditions)
- Master data management essential

---

## Navigation Structure

```
Main Dashboard
│
├── Customers
│   ├── Customer List (Screen 1)
│   └── Add/Edit Customer (Screen 2)
│
├── Deposito Types
│   ├── Deposito Type List (Screen 3)
│   └── Add/Edit Deposito Type (Screen 4)
│
└── Accounts
    ├── Account List (Screen 5)
    ├── Add/Edit Account (Screen 6)
    └── Account Detail (Screen 7)
        ├── Deposit Form (Screen 8)
        └── Withdraw Form (Screen 9)
```

**Why this structure?**
- Logical grouping by entity
- Maximum 2-3 clicks to reach any screen
- Breadcrumb pattern untuk navigation

---

## Key UI/UX Decisions & Rationale

### 1. Why Separate Screens for List & Form?
- ✅ Better UX: Clear separation of concerns
- ✅ Easier to implement (both backend & frontend)
- ✅ Standard pattern yang familiar untuk users

### 2. Why Show Calculation Preview Before Withdraw?
- ✅ **REQUIREMENT WAJIB**: "system must calculate and show to customer"
- ✅ Transparency: Customer tahu berapa yang akan diterima
- ✅ Prevent disputes: Ada konfirmasi sebelum execute
- ✅ Error prevention: User bisa cancel jika salah input date

### 3. Why Transaction History in Account Detail?
- ✅ Audit trail
- ✅ User bisa verify semua transaksi
- ✅ Debugging: Cek kenapa balance sekian

### 4. Why Dropdown Instead of Text Input for Customer/Deposito Type?
- ✅ Prevent invalid data
- ✅ Better UX (no typing error)
- ✅ Ensure referential integrity

---

## Responsive Considerations

### Desktop (Primary)
- Table layout untuk list screens
- Side-by-side form layout
- Wide calculation preview

### Mobile (Secondary - jika ada bonus points)
- Stack form vertically
- Cards instead of tables
- Collapsed navigation

---

## Color Coding (Visual Hierarchy)

### Actions
- 🟢 **Green**: Deposit, Save, Create (positive actions)
- 🔴 **Red**: Withdraw, Delete (destructive actions)
- 🔵 **Blue**: Edit, View (neutral actions)
- ⚪ **Gray**: Cancel (secondary actions)

**Why color coding?**
- Visual cues mencegah user error
- Especially penting untuk financial transactions
- Accessibility: jangan hanya rely on color (add icons too)

---

## Missing Features / Out of Scope

Berikut yang **TIDAK** termasuk berdasarkan requirement:

❌ User Authentication/Login (tidak diminta)
❌ Multi-currency (assume IDR only)
❌ Partial withdrawal (withdraw = close account)
❌ Transfer between accounts
❌ Interest compounding (simple interest only)
❌ Reporting/Analytics dashboard
❌ Email notifications
❌ Print statements

**Why explicitly list this?**
- Prevent scope creep
- Focus on core requirements
- Bisa dijadikan "future enhancements"

---

## Summary: Why Wireframe First?

| Alasan | Penjelasan |
|--------|------------|
| **Requirement Validation** | Ensure semua requirement tercakup |
| **Early Feedback** | Stakeholder bisa review sebelum development |
| **Effort Estimation** | Tahu berapa screen/component yang perlu dibuat |
| **API Design** | Jadi basis untuk define API endpoints (next step) |
| **Database Design** | Tahu data apa yang perlu disimpan (next step) |
| **Test Cases** | Basis untuk define edge cases & error handling |
| **Developer Handoff** | Blueprint jelas untuk frontend developer |

---

## Next Steps

Setelah wireframe approved:
1. ✅ Database Schema Design (tahu data apa yang perlu disimpan)
2. ✅ API Endpoints Design (tahu API apa yang dipanggil di setiap screen)
3. ✅ Error Handling (based on user flows & edge cases)

---

**Status**: ✅ COMPLETE - Ready for Review
**Last Updated**: 2025-11-22
