import {z} from 'zod';

export const saleSchema = z.object({
    products: z.array(z.object({
        productName: z.string(),
        productCode: z.string(),
        saleAmount: z.string(),
        priceProvider: z.string(),
        salePrice: z.string(),
        saleTotal: z.string(),
        date: z.string().optional(),
    })),
    date: z.string().optional(),
});