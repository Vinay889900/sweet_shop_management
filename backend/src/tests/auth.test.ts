import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
        expect(res.body).toHaveProperty('userId');
    });

    it('should fail if email already exists', async () => {
        // First registration
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'duplicate@example.com',
                password: 'password123',
            });

        // Duplicate registration
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'duplicate@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Email already in use');
    });
});

describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
        // Register user
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'login@example.com',
                password: 'password123',
            });

        // Login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Invalid email or password');
    });
});
