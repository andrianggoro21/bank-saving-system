import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.depositoType.deleteMany();
  await prisma.customer.deleteMany();

  // Seed Customers
  console.log('👥 Seeding customers...');
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Siti Rahmawati',
      email: 'siti.rahmawati@email.com',
      phone: '081234567891',
      address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@email.com',
      phone: '081234567892',
      address: 'Jl. Thamrin No. 78, Jakarta Pusat',
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: 'Dewi Lestari',
      email: 'dewi.lestari@email.com',
      phone: '081234567893',
      address: 'Jl. Kuningan No. 90, Jakarta Selatan',
    },
  });

  const customer5 = await prisma.customer.create({
    data: {
      name: 'Rudi Hartono',
      email: 'rudi.hartono@email.com',
      phone: '081234567894',
      address: 'Jl. Rasuna Said No. 12, Jakarta Selatan',
    },
  });

  console.log(`✅ Created ${5} customers`);

  // Seed Deposito Types
  console.log('💰 Seeding deposito types...');
  const deposito3Months = await prisma.depositoType.create({
    data: {
      name: 'Deposito 3 Bulan',
      yearlyReturn: new Decimal(3.5),
    },
  });

  const deposito6Months = await prisma.depositoType.create({
    data: {
      name: 'Deposito 6 Bulan',
      yearlyReturn: new Decimal(4.0),
    },
  });

  const deposito12Months = await prisma.depositoType.create({
    data: {
      name: 'Deposito 12 Bulan',
      yearlyReturn: new Decimal(5.5),
    },
  });

  const deposito24Months = await prisma.depositoType.create({
    data: {
      name: 'Deposito 24 Bulan',
      yearlyReturn: new Decimal(6.5),
    },
  });

  console.log(`✅ Created ${4} deposito types`);

  // Seed Accounts
  console.log('🏦 Seeding accounts...');
  const account1 = await prisma.account.create({
    data: {
      customerId: customer1.id,
      depositoTypeId: deposito12Months.id,
      balance: new Decimal(50000000),
    },
  });

  const account2 = await prisma.account.create({
    data: {
      customerId: customer1.id,
      depositoTypeId: deposito6Months.id,
      balance: new Decimal(25000000),
    },
  });

  const account3 = await prisma.account.create({
    data: {
      customerId: customer2.id,
      depositoTypeId: deposito12Months.id,
      balance: new Decimal(100000000),
    },
  });

  const account4 = await prisma.account.create({
    data: {
      customerId: customer3.id,
      depositoTypeId: deposito3Months.id,
      balance: new Decimal(15000000),
    },
  });

  const account5 = await prisma.account.create({
    data: {
      customerId: customer4.id,
      depositoTypeId: deposito24Months.id,
      balance: new Decimal(200000000),
    },
  });

  const account6 = await prisma.account.create({
    data: {
      customerId: customer5.id,
      depositoTypeId: deposito6Months.id,
      balance: new Decimal(30000000),
    },
  });

  console.log(`✅ Created ${6} accounts`);

  // Seed Transactions
  console.log('💸 Seeding transactions...');

  // Account 1 transactions
  await prisma.transaction.create({
    data: {
      accountId: account1.id,
      type: 'deposit',
      amount: new Decimal(50000000),
      transactionDate: new Date('2025-01-15'),
      balanceBefore: new Decimal(0),
      balanceAfter: new Decimal(50000000),
      notes: 'Initial deposit',
    },
  });

  // Calculate interest for account 1 (12 months, 5.5% yearly)
  const interest1 = new Decimal(50000000)
    .times(5.5)
    .dividedBy(100)
    .times(12)
    .dividedBy(12);

  await prisma.transaction.create({
    data: {
      accountId: account1.id,
      type: 'interest',
      amount: interest1,
      transactionDate: new Date('2025-11-15'),
      balanceBefore: new Decimal(50000000),
      balanceAfter: new Decimal(50000000).plus(interest1),
      monthsDuration: new Decimal(12),
      interestEarned: interest1,
      notes: '12 months interest',
    },
  });

  // Account 2 transactions
  await prisma.transaction.create({
    data: {
      accountId: account2.id,
      type: 'deposit',
      amount: new Decimal(25000000),
      transactionDate: new Date('2025-03-01'),
      balanceBefore: new Decimal(0),
      balanceAfter: new Decimal(25000000),
      notes: 'Initial deposit',
    },
  });

  // Account 3 transactions
  await prisma.transaction.create({
    data: {
      accountId: account3.id,
      type: 'deposit',
      amount: new Decimal(100000000),
      transactionDate: new Date('2025-02-10'),
      balanceBefore: new Decimal(0),
      balanceAfter: new Decimal(100000000),
      notes: 'Initial deposit',
    },
  });

  await prisma.transaction.create({
    data: {
      accountId: account3.id,
      type: 'withdraw',
      amount: new Decimal(10000000),
      transactionDate: new Date('2025-08-10'),
      balanceBefore: new Decimal(100000000),
      balanceAfter: new Decimal(90000000),
      notes: 'Partial withdrawal',
    },
  });

  // Calculate interest for account 3 (6 months, 5.5% yearly)
  const interest3 = new Decimal(90000000)
    .times(5.5)
    .dividedBy(100)
    .times(6)
    .dividedBy(12);

  await prisma.transaction.create({
    data: {
      accountId: account3.id,
      type: 'interest',
      amount: interest3,
      transactionDate: new Date('2025-11-10'),
      balanceBefore: new Decimal(90000000),
      balanceAfter: new Decimal(90000000).plus(interest3),
      monthsDuration: new Decimal(6),
      interestEarned: interest3,
      notes: '6 months interest',
    },
  });

  // Account 4 transactions
  await prisma.transaction.create({
    data: {
      accountId: account4.id,
      type: 'deposit',
      amount: new Decimal(15000000),
      transactionDate: new Date('2025-09-01'),
      balanceBefore: new Decimal(0),
      balanceAfter: new Decimal(15000000),
      notes: 'Initial deposit',
    },
  });

  // Account 5 transactions
  await prisma.transaction.create({
    data: {
      accountId: account5.id,
      type: 'deposit',
      amount: new Decimal(200000000),
      transactionDate: new Date('2025-01-01'),
      balanceBefore: new Decimal(0),
      balanceAfter: new Decimal(200000000),
      notes: 'Initial deposit - High value customer',
    },
  });

  // Account 6 transactions
  await prisma.transaction.create({
    data: {
      accountId: account6.id,
      type: 'deposit',
      amount: new Decimal(30000000),
      transactionDate: new Date('2025-06-15'),
      balanceBefore: new Decimal(0),
      balanceAfter: new Decimal(30000000),
      notes: 'Initial deposit',
    },
  });

  console.log(`✅ Created ${9} transactions`);

  console.log('✨ Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Customers: 5`);
  console.log(`   - Deposito Types: 4`);
  console.log(`   - Accounts: 6`);
  console.log(`   - Transactions: 9`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
