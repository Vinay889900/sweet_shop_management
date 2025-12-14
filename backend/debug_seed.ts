import { PrismaClient } from '@prisma/client';
import path from 'path';

// Force absolute path log
console.log('Current __dirname:', __dirname);
console.log('Current cwd:', process.cwd());

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:c:/Users/uppu vinaykumar/.gemini/antigravity/scratch/incubyte_assignment/backend/dev.db"
        }
    }
});

async function main() {
    console.log('Connecting to database...');

    await prisma.sweet.deleteMany({});
    console.log('Cleared sweets.');

    const sweets = [
        { name: 'Chocolate Fudge', category: 'Chocolate', price: 5.99, quantity: 50, imageUrl: 'https://images.unsplash.com/photo-1614088685112-0a760b7163c8?w=400' },
        { name: 'Gummy Bears', category: 'Gummies', price: 2.49, quantity: 100, imageUrl: 'https://images.unsplash.com/photo-1582058923517-56e342718e81?w=400' },
        { name: 'Red Velvet Cupcake', category: 'Bakery', price: 3.50, quantity: 20, imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400' },
    ];

    console.log(`Seeding ${sweets.length} items...`);
    for (const s of sweets) {
        await prisma.sweet.create({ data: s });
    }

    const count = await prisma.sweet.count();
    console.log(`Final count in DB: ${count}`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => await prisma.$disconnect());
