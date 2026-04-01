import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.investment.deleteMany()

  // Dummy Transactions
  await prisma.transaction.createMany({
    data: [
      { type: 'INCOME', amount: 5000, category: 'Salary', date: new Date('2026-03-01') },
      { type: 'INCOME', amount: 800, category: 'Freelance', date: new Date('2026-03-15') },
      { type: 'EXPENSE', amount: 1200, category: 'Rent', date: new Date('2026-03-02') },
      { type: 'EXPENSE', amount: 400, category: 'Groceries', date: new Date('2026-03-05') },
      { type: 'EXPENSE', amount: 150, category: 'Utilities', date: new Date('2026-03-10') },
      { type: 'EXPENSE', amount: 300, category: 'Entertainment', date: new Date('2026-03-20') },
    ],
  })

  // Dummy Investments
  await prisma.investment.createMany({
    data: [
      { symbol: 'AAPL', type: 'STOCK', quantity: 10, buyPrice: 150.5 },
      { symbol: 'TSLA', type: 'STOCK', quantity: 5, buyPrice: 180.2 },
      { symbol: 'BTC', type: 'CRYPTO', quantity: 0.5, buyPrice: 45000 },
      { symbol: 'ETH', type: 'CRYPTO', quantity: 2, buyPrice: 2800 },
    ],
  })

  console.log('Seeded database with dummy transactions and investments.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
