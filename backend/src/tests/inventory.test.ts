import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
let adminToken: string;
let userToken: string;
let sweetId: string;

beforeAll(async () => {
    await prisma.$connect();
    // Setup users...
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin_i@example.com' },
        update: {},
        create: {
            email: 'admin_i@example.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET as string);

    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user_i@example.com' },
        update: {},
        create: {
            email: 'user_i@example.com',
            password: userPassword,
            role: 'USER',
        },
    });
    userToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string);
});

beforeEach(async () => {
    await prisma.sweet.deleteMany();
    const sweet = await prisma.sweet.create({
        data: {
            name: 'Inventory Item',
            category: 'Test',
            price: 5.0,
            quantity: 10,
        },
    });
    sweetId = sweet.id;
});

afterAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('POST /api/sweets/:id/purchase', () => {
    it('should allow user to purchase sweet and decrease stock', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 2 });
        expect(res.statusCode).toEqual(200);

        const check = await prisma.sweet.findUnique({ where: { id: sweetId } });
        expect(check?.quantity).toEqual(8); // 10 - 2
    });

    it('should fail if not enough stock', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 20 });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Insufficient stock');
    });
});

describe('POST /api/sweets/:id/restock', () => {
    it('should allow admin to restock', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 5 });
        expect(res.statusCode).toEqual(200);

        const check = await prisma.sweet.findUnique({ where: { id: sweetId } });
        expect(check?.quantity).toEqual(15); // 10 + 5
    });

    it('should deny non-admin restock', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 5 });
        expect(res.statusCode).toEqual(403);
    });
});
