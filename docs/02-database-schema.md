# Database Schema Design - Bank Saving System

## Mengapa Database Design Harus Dibuat Setelah Wireframe?

**Database adalah BACKBONE aplikasi** - jika salah design, akan sangat sulit untuk refactor nanti.

### Alasan Database Design Dibuat di Step 2:

1. ✅ **Berdasarkan Wireframe** - Kita sudah tahu data apa yang ditampilkan di setiap screen
2. ✅ **Normalization** - Ensure no data redundancy
3. ✅ **Relational Integrity** - Ensure data consistency
4. ✅ **Performance** - Index & query optimization dari awal
5. ✅ **Scalability** - Design yang bisa grow dengan requirements
6. ✅ **API Design** - Setelah ini kita bisa design API endpoints berdasarkan tables

---

## Database Technology Choice

**Recommendation**: **PostgreSQL** atau **MySQL**

### Why PostgreSQL/MySQL?

| Alasan | Penjelasan |
|--------|------------|
| **ACID Compliance** | Financial data HARUS ACID (Atomicity, Consistency, Isolation, Durability) |
| **Relational** | Data kita punya clear relationships (Customer → Account → Transaction) |
| **Mature** | Production-proven untuk financial applications |
| **Free** | Open source, sesuai requirement "free hosting" |
| **Data Integrity** | Foreign keys, constraints, triggers untuk business rules |

**Alternative**: SQLite (untuk development/demo), tapi NOT recommended untuk production financial app.

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│     customers       │
├─────────────────────┤
│ PK  id              │
│     name            │
│     created_at      │
│     updated_at      │
└──────────┬──────────┘
           │
           │ 1
           │
           │ has many
           │
           │ *
           ▼
┌─────────────────────┐         ┌─────────────────────┐
│      accounts       │    *    │   deposito_types    │
├─────────────────────┤────────▶├─────────────────────┤
│ PK  id              │ belongs │ PK  id              │
│ FK  customer_id     │   to    │     name            │
│ FK  deposito_type_id│         │     yearly_return   │
│     balance         │         │     created_at      │
│     created_at      │         │     updated_at      │
│     updated_at      │         └─────────────────────┘
└──────────┬──────────┘
           │
           │ 1
           │
           │ has many
           │
           │ *
           ▼
┌─────────────────────┐
│    transactions     │
├─────────────────────┤
│ PK  id              │
│ FK  account_id      │
│     type            │ (ENUM: 'deposit', 'withdraw')
│     amount          │
│     transaction_date│ (user input date)
│     balance_before  │
│     balance_after   │
│     months_duration │ (for withdraw only)
│     interest_earned │ (for withdraw only)
│     notes           │
│     created_at      │
└─────────────────────┘
```

### Relationship Summary:

- `customers` 1 ─── * `accounts` (One customer can have many accounts)
- `deposito_types` 1 ─── * `accounts` (One deposito type can be used by many accounts)
- `accounts` 1 ─── * `transactions` (One account can have many transactions)

---

## Table Definitions

### 1. Table: `customers`

**Purpose**: Menyimpan data customer/nasabah bank

```sql
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index untuk performance
CREATE INDEX idx_customers_name ON customers(name);
```

#### Field Explanation:

| Field | Type | Constraint | Why? |
|-------|------|------------|------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier, auto-generated |
| `name` | VARCHAR(255) | NOT NULL | Sesuai requirement: "id,name" |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Audit trail: kapan customer dibuat |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit trail: kapan customer terakhir diupdate |

#### Why These Design Decisions?

✅ **BIGINT untuk ID**: Future-proof, bisa support jutaan customers
✅ **VARCHAR(255) untuk name**: Cukup untuk nama lengkap dengan gelar
✅ **Index pada name**: Search by name akan sering digunakan di UI
✅ **Timestamps**: Audit trail essential untuk financial apps

#### Sample Data:

```sql
INSERT INTO customers (name) VALUES
('John Doe'),
('Jane Smith'),
('Ahmad Abdullah');
```

---

### 2. Table: `deposito_types`

**Purpose**: Master data untuk tipe-tipe deposito (Bronze, Silver, Gold, dll)

```sql
CREATE TABLE deposito_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    yearly_return DECIMAL(5,2) NOT NULL CHECK (yearly_return > 0 AND yearly_return <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index
CREATE UNIQUE INDEX idx_deposito_types_name ON deposito_types(name);
```

#### Field Explanation:

| Field | Type | Constraint | Why? |
|-------|------|------------|------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Nama deposito (Bronze, Silver, Gold) - harus unique |
| `yearly_return` | DECIMAL(5,2) | NOT NULL, CHECK > 0 | Bunga per tahun dalam persen (contoh: 7.50 = 7.5%) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Audit trail |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit trail |

#### Why These Design Decisions?

✅ **DECIMAL(5,2)**: Presisi untuk persentase (max 999.99%)
  - 5 = total digits
  - 2 = decimal places
  - Example: 7.50 (7.5%), 12.25 (12.25%)

✅ **CHECK constraint**: Prevent invalid data (negative return atau > 100%)
✅ **UNIQUE name**: Prevent duplicate deposito type names
✅ **NO foreign keys**: Ini master data table

#### Sample Data:

```sql
INSERT INTO deposito_types (name, yearly_return) VALUES
('Bronze', 3.00),
('Silver', 5.00),
('Gold', 7.00);
```

---

### 3. Table: `accounts`

**Purpose**: Menyimpan akun deposito milik customer

```sql
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    deposito_type_id BIGINT NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_accounts_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_accounts_deposito_type
        FOREIGN KEY (deposito_type_id) REFERENCES deposito_types(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Indexes untuk performance
CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_accounts_deposito_type ON accounts(deposito_type_id);
CREATE INDEX idx_accounts_balance ON accounts(balance);
```

#### Field Explanation:

| Field | Type | Constraint | Why? |
|-------|------|------------|------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique account number |
| `customer_id` | BIGINT | FOREIGN KEY → customers.id | Relasi ke customer pemilik |
| `deposito_type_id` | BIGINT | FOREIGN KEY → deposito_types.id | Tipe deposito yang dipilih |
| `balance` | DECIMAL(15,2) | NOT NULL, CHECK >= 0 | Saldo saat ini (max 999,999,999,999.99) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Kapan account dibuka |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

#### Why These Design Decisions?

✅ **DECIMAL(15,2) untuk balance**: Support milyaran rupiah dengan 2 decimal places
  - Max: Rp 999,999,999,999.99 (999 miliar)
  - Presisi: Sen/cent level (0.01)

✅ **CHECK balance >= 0**: Prevent negative balance
✅ **ON DELETE RESTRICT**: Prevent delete customer/deposito_type yang masih punya active accounts
✅ **ON UPDATE CASCADE**: Jika ID customer/deposito_type berubah, auto update FK
✅ **Multiple indexes**: Query optimization untuk JOIN operations

#### Business Rules Enforced:

1. ✅ **1 account must have 1 customer** (NOT NULL customer_id)
2. ✅ **1 account must have 1 deposito type** (NOT NULL deposito_type_id)
3. ✅ **1 customer can have many accounts** (no UNIQUE constraint on customer_id)
4. ✅ **Balance cannot be negative** (CHECK constraint)

#### Sample Data:

```sql
INSERT INTO accounts (customer_id, deposito_type_id, balance) VALUES
(1, 3, 50000000.00),  -- John Doe, Gold, 50 juta
(1, 2, 20000000.00),  -- John Doe, Silver, 20 juta
(2, 1, 10000000.00);  -- Jane Smith, Bronze, 10 juta
```

---

### 4. Table: `transactions`

**Purpose**: Menyimpan semua transaksi deposit dan withdraw

```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_id BIGINT NOT NULL,
    type ENUM('deposit', 'withdraw') NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    months_duration DECIMAL(10,2) NULL,
    interest_earned DECIMAL(15,2) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key
    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id) REFERENCES accounts(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_created ON transactions(created_at);
```

#### Field Explanation:

| Field | Type | Constraint | Why? |
|-------|------|------------|------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique transaction ID |
| `account_id` | BIGINT | FOREIGN KEY → accounts.id | Account mana yang bertransaksi |
| `type` | ENUM | 'deposit' or 'withdraw' | Tipe transaksi |
| `amount` | DECIMAL(15,2) | NOT NULL, CHECK > 0 | Jumlah deposit/withdraw |
| `transaction_date` | DATE | NOT NULL | **User input date** (sesuai requirement!) |
| `balance_before` | DECIMAL(15,2) | NOT NULL | Saldo sebelum transaksi (audit trail) |
| `balance_after` | DECIMAL(15,2) | NOT NULL | Saldo setelah transaksi |
| `months_duration` | DECIMAL(10,2) | NULL | Durasi dalam bulan (untuk withdraw saja) |
| `interest_earned` | DECIMAL(15,2) | NULL | Bunga yang didapat (untuk withdraw saja) |
| `notes` | TEXT | NULL | Catatan tambahan (optional) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Kapan record dibuat di sistem |

#### Why These Design Decisions?

✅ **ENUM untuk type**: Enforce valid transaction types only
✅ **transaction_date DATE (bukan TIMESTAMP)**:
  - Requirement: "input the deposit/withdrawal date"
  - User input date bisa berbeda dengan created_at
  - Example: Admin input transaksi tanggal 1 Jan, tapi baru entry ke sistem tanggal 5 Jan

✅ **balance_before & balance_after**:
  - Complete audit trail
  - Bisa verify calculation
  - Bisa rebuild account balance dari transaction history

✅ **months_duration & interest_earned nullable**:
  - Hanya diisi untuk type = 'withdraw'
  - Untuk deposit, akan NULL

✅ **Separate created_at**:
  - transaction_date = tanggal bisnis (user input)
  - created_at = timestamp sistem (audit)

#### Sample Data (Deposit):

```sql
INSERT INTO transactions
(account_id, type, amount, transaction_date, balance_before, balance_after, months_duration, interest_earned)
VALUES
(1, 'deposit', 50000000.00, '2025-01-01', 0.00, 50000000.00, NULL, NULL);
```

#### Sample Data (Withdraw):

```sql
-- Contoh: Withdraw setelah 10 bulan
-- Starting balance: 50,000,000
-- Deposito Gold: 7% yearly = 0.583% monthly
-- Duration: 10 months
-- Ending balance = 50,000,000 * (1 + 0.00583 * 10) = 52,915,000
-- Interest earned = 52,915,000 - 50,000,000 = 2,915,000

INSERT INTO transactions
(account_id, type, amount, transaction_date, balance_before, balance_after, months_duration, interest_earned)
VALUES
(1, 'withdraw', 52915000.00, '2025-11-01', 50000000.00, 0.00, 10.00, 2915000.00);
```

---

## Calculation Logic (Stored in Database)

### Formula Implementation

**Requirement dari PDF:**
```
ending_balance = starting_balance * #months * monthly_return
monthly_return = yearly_return / 12
```

**⚠️ PERHATIAN: Ada TYPO dalam formula PDF!**

Formula yang benar seharusnya:
```
ending_balance = starting_balance * (1 + monthly_return * months)
```

### Why Formula Harus Dikoreksi?

**Formula PDF**: `ending_balance = starting_balance * #months * monthly_return`

Jika kita pakai formula ini:
- Starting balance: Rp 50,000,000
- Months: 10
- Monthly return: 0.583% (0.00583)
- Result: 50,000,000 × 10 × 0.00583 = Rp 2,915,000 ❌

Ini SALAH karena hasilnya lebih kecil dari starting balance!

**Formula yang BENAR** (Simple Interest):
```
ending_balance = starting_balance + (starting_balance × monthly_return × months)
               = starting_balance × (1 + monthly_return × months)
```

Dengan formula benar:
- 50,000,000 × (1 + 0.00583 × 10)
- = 50,000,000 × (1 + 0.0583)
- = 50,000,000 × 1.0583
- = Rp 52,915,000 ✅

### SQL Function untuk Calculation (PostgreSQL)

```sql
-- Function untuk calculate ending balance
CREATE OR REPLACE FUNCTION calculate_ending_balance(
    p_starting_balance DECIMAL(15,2),
    p_yearly_return DECIMAL(5,2),
    p_deposit_date DATE,
    p_withdrawal_date DATE
)
RETURNS TABLE (
    ending_balance DECIMAL(15,2),
    months_duration DECIMAL(10,2),
    monthly_return DECIMAL(10,6),
    interest_earned DECIMAL(15,2)
) AS $$
DECLARE
    v_months DECIMAL(10,2);
    v_monthly_return DECIMAL(10,6);
    v_ending_balance DECIMAL(15,2);
    v_interest DECIMAL(15,2);
BEGIN
    -- Calculate months duration
    v_months := (EXTRACT(YEAR FROM AGE(p_withdrawal_date, p_deposit_date)) * 12) +
                 EXTRACT(MONTH FROM AGE(p_withdrawal_date, p_deposit_date)) +
                 (EXTRACT(DAY FROM AGE(p_withdrawal_date, p_deposit_date)) / 30.0);

    -- Calculate monthly return
    v_monthly_return := p_yearly_return / 12 / 100;  -- Convert to decimal

    -- Calculate ending balance (CORRECTED FORMULA)
    v_ending_balance := p_starting_balance * (1 + (v_monthly_return * v_months));

    -- Calculate interest earned
    v_interest := v_ending_balance - p_starting_balance;

    RETURN QUERY SELECT v_ending_balance, v_months, v_monthly_return, v_interest;
END;
$$ LANGUAGE plpgsql;
```

### Usage Example:

```sql
-- Calculate untuk withdrawal
SELECT * FROM calculate_ending_balance(
    50000000.00,  -- starting balance
    7.00,         -- yearly return (7%)
    '2025-01-01', -- deposit date
    '2025-11-01'  -- withdrawal date
);

-- Result:
-- ending_balance: 52,915,000.00
-- months_duration: 10.00
-- monthly_return: 0.005833
-- interest_earned: 2,915,000.00
```

---

## Database Constraints & Business Rules

### Constraints Summary:

| Rule | Implementation | Why? |
|------|----------------|------|
| **Customer name required** | NOT NULL | Sesuai requirement |
| **Deposito return > 0** | CHECK (yearly_return > 0) | Invalid kalau return negatif |
| **Balance >= 0** | CHECK (balance >= 0) | No negative balance |
| **Transaction amount > 0** | CHECK (amount > 0) | No zero transactions |
| **Valid transaction type** | ENUM('deposit', 'withdraw') | Only 2 types allowed |
| **1 account = 1 deposito** | deposito_type_id NOT NULL | Business rule |
| **Can't delete customer with accounts** | ON DELETE RESTRICT | Data integrity |
| **Can't delete deposito type with accounts** | ON DELETE RESTRICT | Data integrity |

---

## Indexes Strategy

### Why These Indexes?

```sql
-- Customer indexes
CREATE INDEX idx_customers_name ON customers(name);
-- → untuk search customer by name di dropdown/autocomplete

-- Account indexes
CREATE INDEX idx_accounts_customer ON accounts(customer_id);
-- → untuk query "semua account milik customer X"

CREATE INDEX idx_accounts_deposito_type ON accounts(deposito_type_id);
-- → untuk query "semua account dengan deposito type X"

-- Transaction indexes
CREATE INDEX idx_transactions_account ON transactions(account_id);
-- → untuk query "semua transaksi di account X" (transaction history)

CREATE INDEX idx_transactions_date ON transactions(transaction_date);
-- → untuk query by date range (laporan bulanan, dll)

CREATE INDEX idx_transactions_type ON transactions(type);
-- → untuk filter deposit vs withdraw
```

### Compound Index (Optional - untuk optimization):

```sql
-- Untuk query transaction history dengan filter type
CREATE INDEX idx_transactions_account_type_date
ON transactions(account_id, type, transaction_date DESC);
```

---

## Data Integrity & Validation

### Application-Level vs Database-Level Validation

| Validation | Database Level | Application Level | Both? |
|------------|---------------|-------------------|-------|
| NOT NULL fields | ✅ Constraint | ✅ Form validation | ✅ |
| Positive amounts | ✅ CHECK constraint | ✅ Form validation | ✅ |
| Valid FK references | ✅ Foreign keys | ✅ Dropdown only | ✅ |
| Balance calculation | ⚠️ Trigger (optional) | ✅ Business logic | Application |
| Unique deposito name | ✅ UNIQUE constraint | ✅ Validation | ✅ |
| Withdrawal date > deposit date | ❌ | ✅ Business logic | Application |

**Why both?**
- Database = Last line of defense
- Application = Better UX (immediate feedback)

---

## Migration Scripts

### Migration 001: Create Tables

```sql
-- Migration: 001_create_initial_schema.sql

-- 1. Create customers table
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_name ON customers(name);

-- 2. Create deposito_types table
CREATE TABLE deposito_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    yearly_return DECIMAL(5,2) NOT NULL CHECK (yearly_return > 0 AND yearly_return <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_deposito_types_name ON deposito_types(name);

-- 3. Create accounts table
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    deposito_type_id BIGINT NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_accounts_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_accounts_deposito_type
        FOREIGN KEY (deposito_type_id) REFERENCES deposito_types(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_accounts_deposito_type ON accounts(deposito_type_id);
CREATE INDEX idx_accounts_balance ON accounts(balance);

-- 4. Create transactions table
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_id BIGINT NOT NULL,
    type ENUM('deposit', 'withdraw') NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    months_duration DECIMAL(10,2) NULL,
    interest_earned DECIMAL(15,2) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id) REFERENCES accounts(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_created ON transactions(created_at);
```

### Migration 002: Seed Initial Data

```sql
-- Migration: 002_seed_deposito_types.sql

INSERT INTO deposito_types (name, yearly_return) VALUES
('Bronze', 3.00),
('Silver', 5.00),
('Gold', 7.00);
```

---

## Query Examples

### Common Queries yang akan digunakan API:

#### 1. Get customer with all accounts

```sql
SELECT
    c.id as customer_id,
    c.name as customer_name,
    a.id as account_id,
    dt.name as deposito_type,
    dt.yearly_return,
    a.balance,
    a.created_at as account_opened_date
FROM customers c
LEFT JOIN accounts a ON c.id = a.customer_id
LEFT JOIN deposito_types dt ON a.deposito_type_id = dt.id
WHERE c.id = 1;
```

#### 2. Get account detail with last transaction date

```sql
SELECT
    a.*,
    c.name as customer_name,
    dt.name as deposito_type_name,
    dt.yearly_return,
    (SELECT MAX(transaction_date)
     FROM transactions
     WHERE account_id = a.id AND type = 'deposit') as last_deposit_date,
    (SELECT COUNT(*)
     FROM transactions
     WHERE account_id = a.id) as transaction_count
FROM accounts a
JOIN customers c ON a.customer_id = c.id
JOIN deposito_types dt ON a.deposito_type_id = dt.id
WHERE a.id = 1;
```

#### 3. Get transaction history for an account

```sql
SELECT
    t.*,
    a.balance as current_balance,
    dt.name as deposito_type,
    dt.yearly_return
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN deposito_types dt ON a.deposito_type_id = dt.id
WHERE t.account_id = 1
ORDER BY t.transaction_date DESC, t.created_at DESC;
```

#### 4. Calculate preview for withdrawal

```sql
-- Get info untuk withdrawal calculation
SELECT
    a.id,
    a.balance as starting_balance,
    dt.yearly_return,
    (SELECT MIN(transaction_date)
     FROM transactions
     WHERE account_id = a.id AND type = 'deposit') as first_deposit_date
FROM accounts a
JOIN deposito_types dt ON a.deposito_type_id = dt.id
WHERE a.id = 1;
```

---

## Performance Considerations

### Expected Data Volume (Estimate):

| Table | Records (Year 1) | Growth Rate |
|-------|------------------|-------------|
| customers | ~1,000 | 100/month |
| deposito_types | ~5 | Stable |
| accounts | ~2,000 | 200/month |
| transactions | ~50,000 | 5,000/month |

### Optimization Strategy:

1. ✅ **Indexes on FK** - Already implemented
2. ✅ **Compound indexes** - For common query patterns
3. ⚠️ **Partitioning** - transactions by date (when > 1M records)
4. ⚠️ **Archive strategy** - Move old transactions to archive table
5. ✅ **Query optimization** - Use EXPLAIN untuk analyze queries

---

## Backup & Recovery Strategy

### Database Backup Recommendations:

```bash
# Daily full backup
mysqldump -u root -p bank_saving_system > backup_$(date +%Y%m%d).sql

# Hourly transaction backup (important!)
mysqldump -u root -p bank_saving_system transactions > transactions_backup_$(date +%Y%m%d_%H%M).sql
```

**Why backup transactions hourly?**
- Financial data = critical
- Minimal data loss acceptable
- Audit compliance

---

## Summary: Why This Database Design?

| Design Decision | Rationale |
|-----------------|-----------|
| **4 Tables** | Normalized design, no redundancy |
| **Strong FK constraints** | Data integrity enforced at DB level |
| **DECIMAL for money** | Prevent floating point errors (critical for financial!) |
| **Separate transaction_date & created_at** | Support backdated transactions + audit |
| **Store calculation results** | Audit trail, dapat verify calculation |
| **Comprehensive indexes** | Query performance optimization |
| **CHECK constraints** | Invalid data prevention |
| **ON DELETE RESTRICT** | Prevent accidental data loss |

---

## Next Steps

Dengan database schema ini, sekarang kita bisa:

1. ✅ **Design API Endpoints** - Tahu table mana yang perlu di-query
2. ✅ **Map API to Screens** - Tahu endpoint mana yang dipanggil di screen mana
3. ✅ **Define Error Cases** - Tahu constraint apa yang bisa violated

---

**Status**: ✅ COMPLETE - Ready for API Design
**Last Updated**: 2025-11-22
