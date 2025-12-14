import prisma from './src/prismaClient';

async function main() {
    try {
        const count = await prisma.sweet.count();
        console.log('Count from singleton:', count);
        const sweets = await prisma.sweet.findMany({ take: 3 });
        console.log('First 3 sweets:', sweets.map(s => s.name));
    } catch (e) {
        console.error('Singleton failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
