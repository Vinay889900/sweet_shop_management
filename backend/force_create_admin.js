const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'password123';

    console.log(`Resetting admin user: ${email}`);

    try {
        // Delete if exists
        const deleted = await prisma.user.deleteMany({
            where: { email: email }
        });
        console.log(`Deleted existing checks: ${deleted.count}`);

        // Create new
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('SUCCESS: Admin user created.');
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);

    } catch (e) {
        console.error('ERROR:', e);
    }
}

main()
    .finally(async () => await prisma.$disconnect());
