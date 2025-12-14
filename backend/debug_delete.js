const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DEBUG DELETE ---');

    // Find Rainbow Lollipop
    const sweet = await prisma.sweet.findFirst({
        where: { name: 'Rainbow Lollipop' }
    });

    if (!sweet) {
        console.log('Error: "Rainbow Lollipop" not found in DB.');
        return;
    }

    console.log(`Found sweet: ${sweet.name} (ID: ${sweet.id})`);

    // Attempt Delete
    try {
        await prisma.sweet.delete({
            where: { id: sweet.id }
        });
        console.log('SUCCESS: Sweet deleted via Prisma.');
    } catch (e) {
        console.log('FAILURE: Could not delete sweet.');
        console.error(e);
    }
}

main()
    .finally(async () => await prisma.$disconnect());
