import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from './config/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@primetrade.ai' },
    update: {},
    create: {
      email: 'admin@primetrade.ai',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create demo user
  const userPassword = await bcrypt.hash('User@123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@primetrade.ai' },
    update: {},
    create: {
      email: 'user@primetrade.ai',
      passwordHash: userPassword,
      role: Role.USER,
    },
  });
  console.log(`✅ Demo user created: ${user.email}`);

  // Create sample trade signals
  const signals = [
    { symbol: 'BTC/USDT', entryPrice: 67500.00, targetPrice: 72000.00, stopLoss: 65000.00 },
    { symbol: 'ETH/USDT', entryPrice: 3450.00, targetPrice: 3800.00, stopLoss: 3200.00 },
    { symbol: 'SOL/USDT', entryPrice: 145.00, targetPrice: 165.00, stopLoss: 135.00 },
    { symbol: 'AAPL', entryPrice: 195.50, targetPrice: 210.00, stopLoss: 185.00 },
    { symbol: 'TSLA', entryPrice: 178.25, targetPrice: 200.00, stopLoss: 165.00 },
    { symbol: 'NIFTY50', entryPrice: 22500.00, targetPrice: 23500.00, stopLoss: 22000.00 },
  ];

  for (const signal of signals) {
    await prisma.signal.create({
      data: {
        ...signal,
        createdById: admin.id,
      },
    });
  }
  console.log(`✅ ${signals.length} sample signals created`);

  console.log('\n📋 Seed Summary:');
  console.log('   Admin Login  → admin@primetrade.ai / Admin@123');
  console.log('   User Login   → user@primetrade.ai / User@123');
  console.log('\n🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
