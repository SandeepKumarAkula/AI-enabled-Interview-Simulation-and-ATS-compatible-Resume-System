const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('ADMIN_EMAIL or ADMIN_PASSWORD not set; skipping admin seed.');
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { hashedPassword: hashed, role: 'ADMIN', emailVerified: new Date() },
    create: {
      email: adminEmail,
      name: 'Administrator',
      hashedPassword: hashed,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('Admin user ensured:', adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
