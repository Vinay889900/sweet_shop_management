import { Request, Response } from 'express';
import prisma from '../prismaClient';


export const addSweet = async (req: Request, res: Response) => {
    const { name, category, price, quantity } = req.body;
    const user = (req as any).user;

    if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const sweet = await prisma.sweet.create({
            data: {
                name,
                category,
                price,
                quantity,
            },
        });
        res.status(201).json(sweet);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSweets = async (req: Request, res: Response) => {
    try {
        console.log('Fetching sweets (REAL DB)...');
        console.log('Server CWD:', process.cwd());
        console.log('DATABASE_URL:', process.env.DATABASE_URL);

        const sweets = await prisma.sweet.findMany();
        console.log(`Found ${sweets.length} sweets.`);
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const searchSweets = async (req: Request, res: Response) => {
    const { q } = req.query;
    try {
        const sweets = await prisma.sweet.findMany({
            where: {
                OR: [
                    { name: { contains: q as string } },
                    { category: { contains: q as string } },
                ],
            },
        });
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateSweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;
    const user = (req as any).user;

    if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const sweet = await prisma.sweet.update({
            where: { id },
            data: { name, category, price, quantity },
        });
        res.json(sweet);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteSweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;
    const fs = require('fs');

    fs.appendFileSync('delete_log.txt', `[${new Date().toISOString()}] Attempting delete ID: ${id} by User: ${user.email} (${user.role})\n`);

    if (user.role !== 'ADMIN') {
        fs.appendFileSync('delete_log.txt', `[${new Date().toISOString()}] Access denied.\n`);
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        await prisma.sweet.delete({ where: { id } });
        fs.appendFileSync('delete_log.txt', `[${new Date().toISOString()}] Delete successful.\n`);
        res.json({ message: 'Sweet deleted successfully' });
    } catch (error: any) {
        fs.appendFileSync('delete_log.txt', `[${new Date().toISOString()}] Error: ${error.message}\n`);
        // Return the actual error to the frontend for visibility
        res.status(500).json({ error: `Delete failed: ${error.message}` });
    }
};

export const purchaseSweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const sweet = await prisma.sweet.findUnique({ where: { id } });
        if (!sweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }

        if (sweet.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        const updatedSweet = await prisma.sweet.update({
            where: { id },
            data: { quantity: sweet.quantity - quantity },
        });

        res.json(updatedSweet);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const restockSweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = (req as any).user;

    if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const sweet = await prisma.sweet.findUnique({ where: { id } });
        if (!sweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }

        const updatedSweet = await prisma.sweet.update({
            where: { id },
            data: { quantity: sweet.quantity + quantity },
        });

        res.json(updatedSweet);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
