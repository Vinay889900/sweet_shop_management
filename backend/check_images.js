const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();
const logFile = 'image_check_log.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function main() {
    fs.writeFileSync(logFile, '--- CHECKING IMAGES ---\n');
    const sweets = await prisma.sweet.findMany();

    log(`Total sweets: ${sweets.length}`);
    sweets.forEach(s => {
        log(`[${s.name}]: ${s.imageUrl ? s.imageUrl : 'NULL'}`);
    });
}

main()
    .catch(e => log(e.message))
    .finally(() => prisma.$disconnect());
