import {z} from 'zod';

export const messagesSchema = z.object({
    name: z.string({
        required_error: "No puedo ir vacío"
    }),
    email: z.string({
        required_error: "No puedo ir vacío"
    }),
    phone: z.string({
        required_error: "No puedo ir vacío"
    }),
    message: z.string({
        required_error: "No puedo ir vacío"
    }),
    
})