import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- VERIFYING FIX ---');
    console.log('DATABASE_URL from env:', process.env.DATABASE_URL);

    try {
        const count = await prisma.sweet.count();
        console.log(`Successfully connected! Sweet count: ${count}`);

        if (count > 0) {
            const sweet = await prisma.sweet.findFirst();
            console.log('First sweet:', sweet?.name);
        } else {
            console.log('Connected, but database is empty.');
        }
    } catch (error) {
        console.error('ERROR connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
