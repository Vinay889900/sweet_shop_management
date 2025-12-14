import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Clear existing sweets
    console.log('Clearing existing sweets...');
    await prisma.sweet.deleteMany({});

    const sweets = [
        { name: 'Chocolate Fudge', category: 'Chocolate', price: 5.99, quantity: 50, imageUrl: 'https://images.unsplash.com/photo-1614088685112-0a760b7163c8?w=400' },
        { name: 'Gummy Bears', category: 'Gummies', price: 2.49, quantity: 100, imageUrl: 'https://images.unsplash.com/photo-1582058923517-56e342718e81?w=400' },
        { name: 'Red Velvet Cupcake', category: 'Bakery', price: 3.50, quantity: 20, imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400' },
        { name: 'Sour Worms', category: 'Gummies', price: 1.99, quantity: 75, imageUrl: 'https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=400' },
        { name: 'Dark Chocolate Truffles', category: 'Chocolate', price: 12.99, quantity: 30, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?w=400' },
        { name: 'Macarons (Box of 6)', category: 'Bakery', price: 15.00, quantity: 15, imageUrl: 'https://images.unsplash.com/photo-1569864358637-2d1d544bc703?w=400' },
        { name: 'Rainbow Lollipop', category: 'Hard Candy', price: 0.99, quantity: 200, imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400' },
        { name: 'Peppermint Bark', category: 'Chocolate', price: 8.50, quantity: 40, imageUrl: 'https://images.unsplash.com/photo-1632599264426-c2ae9b0d1964?w=400' },
        { name: 'Jelly Beans Mix', category: 'Gummies', price: 3.99, quantity: 80, imageUrl: 'https://images.unsplash.com/photo-1627632608460-637dc4f5b5c9?w=400' },
        { name: 'Salted Caramel Chews', category: 'Caramel', price: 0.50, quantity: 150, imageUrl: 'https://images.unsplash.com/photo-1517926227090-e3251c51a080?w=400' },
        { name: 'Red Licorice Twists', category: 'Candy', price: 2.00, quantity: 60, imageUrl: 'https://www.shutterstock.com/image-photo/red-licorice-candy-on-white-600nw-138350672.jpg' },
        { name: 'Glazed Donut Holes', category: 'Bakery', price: 4.00, quantity: 25, imageUrl: 'https://images.unsplash.com/photo-1533560666687-0b192080a827?w=400' },
        { name: 'Lemon Drops', category: 'Hard Candy', price: 1.50, quantity: 90, imageUrl: 'https://images.unsplash.com/photo-1582058923517-56e342718e81?w=400' },
        { name: 'Peanut Butter Cups', category: 'Chocolate', price: 1.25, quantity: 60, imageUrl: 'https://images.unsplash.com/photo-1621257962495-2bd336829705?w=400' },
        { name: 'Marshmallow Fluff', category: 'Confectionery', price: 2.99, quantity: 45, imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?w=400' },
    ];

    console.log(`Seeding ${sweets.length} unique sweets with images...`);

    for (const sweet of sweets) {
        await prisma.sweet.create({ data: sweet });
    }

    const count = await prisma.sweet.count();
    console.log(`Database seeded successfully! Total sweets: ${count}`);
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
