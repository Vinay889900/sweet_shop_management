const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();
const logFile = 'seed_output_v2.txt';

function log(msg) {
    try {
        fs.appendFileSync(logFile, msg + '\n', 'utf8');
    } catch (e) {
        // ignore
    }
}

const bcrypt = require('bcryptjs');

// Define specific keywords for better image relevance
const sweetsData = [
    { name: 'Chocolate Fudge', category: 'Chocolate', price: 5.99, quantity: 50, imageUrl: 'https://loremflickr.com/300/200/chocolate,fudge?lock=254' },
    { name: 'Gummy Bears', category: 'Gummies', price: 2.49, quantity: 100, imageUrl: 'https://loremflickr.com/300/200/gummy,bears?lock=714' },
    { name: 'Red Velvet Cupcake', category: 'Bakery', price: 3.50, quantity: 20, imageUrl: 'https://loremflickr.com/300/200/cupcake?lock=636' },
    { name: 'Sour Worms', category: 'Gummies', price: 1.99, quantity: 75, imageUrl: 'https://loremflickr.com/300/200/gummy,worm?lock=863' },
    { name: 'Dark Chocolate Truffles', category: 'Chocolate', price: 12.99, quantity: 30, imageUrl: 'https://loremflickr.com/300/200/truffle,chocolate?lock=809' },
    { name: 'Macarons (Box of 6)', category: 'Bakery', price: 15.00, quantity: 15, imageUrl: 'https://loremflickr.com/300/200/macaron?lock=606' },
    { name: 'Rainbow Lollipop', category: 'Hard Candy', price: 0.99, quantity: 200, imageUrl: 'https://loremflickr.com/300/200/lollipop?lock=644' },
    { name: 'Peppermint Bark', category: 'Chocolate', price: 8.50, quantity: 40, imageUrl: 'https://loremflickr.com/300/200/chocolate,bark?lock=2' },
    { name: 'Jelly Beans Mix', category: 'Gummies', price: 3.99, quantity: 80, imageUrl: 'https://loremflickr.com/300/200/jellybeans?lock=109' },
    { name: 'Salted Caramel Chews', category: 'Caramel', price: 0.50, quantity: 150, imageUrl: 'https://loremflickr.com/300/200/caramel,candy?lock=43' },
    { name: 'Red Licorice Twists', category: 'Candy', price: 2.00, quantity: 60, imageUrl: 'https://loremflickr.com/300/200/licorice?lock=760' },
    { name: 'Glazed Donut Holes', category: 'Bakery', price: 4.00, quantity: 25, imageUrl: 'https://loremflickr.com/300/200/donut?lock=951' },
    { name: 'Lemon Drops', category: 'Hard Candy', price: 1.50, quantity: 90, imageUrl: 'https://loremflickr.com/300/200/lemon,candy?lock=410' },
    { name: 'Peanut Butter Cups', category: 'Chocolate', price: 1.25, quantity: 60, imageUrl: 'https://loremflickr.com/300/200/chocolate,candy?lock=762' },
    { name: 'Marshmallow Fluff', category: 'Confectionery', price: 2.99, quantity: 45, imageUrl: 'https://loremflickr.com/300/200/marshmallow?lock=761' },
];

async function main() {
    // Clear log file
    try { fs.writeFileSync(logFile, '--- STARTING SEED V5 (LOREMFLICKR) ---\n', 'utf8'); } catch (e) { }

    log('Starting seed (JS) - Adding LoremFlickr images...');

    try {
        log('Clearing existing sweets...');
        await prisma.sweet.deleteMany({});
        log('Cleared.');
    } catch (e) {
        log('Error clearing sweets: ' + e.message);
    }

    log(`Seeding ${sweetsData.length} unique sweets...`);

    for (const s of sweetsData) {
        // Use provided imageUrl
        const imageUrl = s.imageUrl;

        try {
            await prisma.sweet.create({
                data: {
                    name: s.name,
                    category: s.category,
                    price: s.price,
                    quantity: s.quantity,
                    imageUrl: imageUrl
                }
            });
        } catch (e) {
            log(`Error creating sweet ${s.name}: ${e.message}`);
        }
    }

    // Seed Admin User
    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';
    try {
        const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!existingAdmin) {
            log('Creating Admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            log('Admin user created (admin@example.com / password123)');
        } else {
            log('Admin user already exists.');
        }
    } catch (e) {
        log('Error creating admin: ' + e.message);
    }

    try {
        const count = await prisma.sweet.count();
        log(`Database seeded successfully! Total sweets: ${count}`);
    } catch (e) {
        log('Error counting: ' + e.message);
    }
}

main()
    .catch((e) => {
        log('Seed FATAL error: ' + e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
