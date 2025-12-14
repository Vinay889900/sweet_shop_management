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
        where: { email: 'admin_u@example.com' },
        update: {},
        create: {
            email: 'admin_u@example.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET as string);

    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user_u@example.com' },
        update: {},
        create: {
            email: 'user_u@example.com',
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
            name: 'Search Me',
            category: 'Test',
            price: 10.0,
            quantity: 50,
        },
    });
    sweetId = sweet.id;
});

afterAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('GET /api/sweets/search', () => {
    it('should search sweets by name', async () => {
        const res = await request(app)
            .get('/api/sweets/search?q=Search')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toContain('Search');
    });
});

describe('PUT /api/sweets/:id', () => {
    it('should update sweet if admin', async () => {
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ price: 15.0 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.price).toEqual(15.0);
    });

    it('should deny update if not admin', async () => {
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ price: 15.0 });
        expect(res.statusCode).toEqual(403);
    });
});

describe('DELETE /api/sweets/:id', () => {
    it('should delete sweet if admin', async () => {
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);

        const check = await prisma.sweet.findUnique({ where: { id: sweetId } });
        expect(check).toBeNull();
    });
});
