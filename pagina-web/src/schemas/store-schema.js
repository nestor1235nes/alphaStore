import {z} from 'zod';

export const addProductSchema = z.object({
    productName: z.string({
        required_error: "Se requiere el nombre del producto"
    }),
    productCode: z.string({
        required_error: "Se requiere el codigo del producto"
    }),
    productAmount: z.string({
        required_error: "Se requiere la cantidad del producto"
    }),
    priceProvider: z.string({
        required_error: "Se requiere el precio del producto comprado"
    }),
    salePrice: z.string({
        required_error: "Se requiere el valor de la venta del producto "
    }),
}) 