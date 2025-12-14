import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:./dev.db"
        }
    }
});

async function main() {
    console.log('Testing connection with RELATIVE path...');
    console.log('CWD:', process.cwd());
    const count = await prisma.sweet.count();
    console.log(`Success! Count: ${count}`);
}

main()
    .catch(e => {
        console.error('Connection failed:', e.message);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
