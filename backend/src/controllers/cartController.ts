import { Request, Response } from 'express';
import prisma from '../prismaClient';


interface CartItem {
    sweetId: string;
    quantity: number;
}

export const checkout = async (req: Request, res: Response) => {
    const { items } = req.body as { items: CartItem[] };

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    try {
        // Use a transaction to ensure all items are purchased together or none at all
        const result = await prisma.$transaction(async (tx: any) => {
            const purchasedItems = [];

            for (const item of items) {
                const sweet = await tx.sweet.findUnique({ where: { id: item.sweetId } });

                if (!sweet) {
                    throw new Error(`Sweet not found: ${item.sweetId}`);
                }

                if (sweet.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for: ${sweet.name}`);
                }

                const updatedSweet = await tx.sweet.update({
                    where: { id: item.sweetId },
                    data: { quantity: sweet.quantity - item.quantity },
                });

                purchasedItems.push(updatedSweet);
            }

            return purchasedItems;
        });

        res.json({ message: 'Checkout successful', items: result });
    } catch (error: any) {
        console.error('Checkout failed:', error.message);
        res.status(400).json({ error: error.message || 'Checkout failed' });
    }
};
