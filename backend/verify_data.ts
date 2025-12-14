import { PrismaClient } from '@prisma/client';

// Pass explict URL relative to CWD to match what we think is happening
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:./prisma/dev.db"
        }
    }
});

async function main() {
    console.log('Checking backend/prisma/dev.db ...');
    const count = await prisma.sweet.count();
    console.log(`Sweet Count: ${count}`);
    if (count > 0) {
        const s = await prisma.sweet.findFirst();
        console.log('Sample:', s);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
