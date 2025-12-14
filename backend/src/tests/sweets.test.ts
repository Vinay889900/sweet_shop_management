import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
let adminToken: string;
let userToken: string;

beforeAll(async () => {
    await prisma.$connect();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET as string);

    // Create User
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: userPassword,
            role: 'USER',
        },
    });
    userToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('POST /api/sweets', () => {
    it('should allow admin to add a sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Chocolate Fudge',
                category: 'Chocolate',
                price: 5.99,
                quantity: 100,
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Chocolate Fudge');
    });

    it('should deny non-admin users', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Forbidden Candy',
                category: 'Candy',
                price: 1.00,
                quantity: 10,
            });

        expect(res.statusCode).toEqual(403);
    });

    it('should deny unauthenticated requests', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .send({
                name: 'Ghost Candy',
            });

        expect(res.statusCode).toEqual(401);
    });
});
