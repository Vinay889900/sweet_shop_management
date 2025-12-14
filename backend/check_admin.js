const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('--- ALL USERS ---');
    users.forEach(u => {
        console.log(`Email: ${u.email}, Role: ${u.role}, PasswordHash: ${u.password.substring(0, 10)}...`);
    });
    console.log('-----------------');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
