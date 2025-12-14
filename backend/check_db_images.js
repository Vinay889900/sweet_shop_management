const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();
const logFile = 'final_image_check.txt';

async function main() {
    const sweets = await prisma.sweet.findMany();
    const data = sweets.map(s => `${s.name} => ${s.imageUrl}`).join('\n');
    console.log(data);
    fs.writeFileSync(logFile, data, 'utf8');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
