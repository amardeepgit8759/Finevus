const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    await prisma.$connect();
    const count = await prisma.user.count();
    console.log('DB_STATUS: CONNECTED');
    console.log(`DB_USER_COUNT: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error('DB_STATUS: NOT_CONNECTED');
    console.error(err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

check();
