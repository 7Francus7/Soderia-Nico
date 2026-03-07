import { z } from "zod";

export const orderItemSchema = z.object({
       productId: z.number(),
       quantity: z.number().min(1, "La cantidad mínima es 1"),
       unitPrice: z.number().min(0, "El precio no puede ser negativo"),
});

export const createOrderSchema = z.object({
       clientId: z.number(),
       notes: z.string().optional().nullable(),
       items: z.array(orderItemSchema).min(1, "Debe agregar al menos un producto"),
       idempotencyKey: z.string().optional(),
});

export type OrderInput = z.infer<typeof createOrderSchema>;
