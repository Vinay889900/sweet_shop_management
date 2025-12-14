const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();
const logFile = 'url_status_check.txt';

function log(msg) {
    try {
        fs.appendFileSync(logFile, msg + '\n', 'utf8');
    } catch (e) {
        // ignore
    }
}

async function checkUrl(url, name) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            log(`[OK] ${name}`);
        } else {
            log(`[FAIL ${response.status}] ${name}: ${url}`);
        }
    } catch (error) {
        log(`[ERROR] ${name}: ${error.message}`);
    }
}

async function main() {
    try { fs.writeFileSync(logFile, '--- CHECKING URLS ---\n', 'utf8'); } catch (e) { }

    const sweets = await prisma.sweet.findMany();
    log(`Checking ${sweets.length} images...`);

    for (const sweet of sweets) {
        if (!sweet.imageUrl) {
            log(`[MISSING] ${sweet.name}`);
            continue;
        }
        await checkUrl(sweet.imageUrl, sweet.name);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
