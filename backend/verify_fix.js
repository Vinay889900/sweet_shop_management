const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();
const logFile = 'verification_result.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function main() {
    fs.writeFileSync(logFile, '--- VERIFYING FIX (JS) ---\n');
    log('DATABASE_URL from env: ' + process.env.DATABASE_URL);

    try {
        const count = await prisma.sweet.count();
        log(`Successfully connected! Sweet count: ${count}`);

        if (count > 0) {
            const sweet = await prisma.sweet.findFirst();
            log('First sweet: ' + (sweet ? sweet.name : 'None'));
        } else {
            log('Connected, but database is empty.');
        }
    } catch (error) {
        log('ERROR connecting to database: ' + error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
