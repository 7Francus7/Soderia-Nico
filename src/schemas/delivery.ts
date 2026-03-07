import { z } from "zod";

export const deliverOrderSchema = z.object({
       orderId: z.number(),
       paymentMethod: z.enum(["CASH", "TRANSFER", "CURRENT_ACCOUNT"]),
       returnedBottles: z.number().min(0).default(0),
       notes: z.string().optional(),
       idempotencyKey: z.string().optional(),
});

export type DeliverOrderInput = z.infer<typeof deliverOrderSchema>;

export const registerOrderIncidentSchema = z.object({
       orderId: z.number(),
       type: z.enum(["ABSENT", "REJECTED", "RESCHEDULE", "OTHER"]),
       reason: z.string().min(3, "El motivo es obligatorio"),
       idempotencyKey: z.string().optional(),
});

export type RegisterOrderIncidentInput = z.infer<typeof registerOrderIncidentSchema>;

export const registerCollectionSchema = z.object({
       clientId: z.number(),
       orderId: z.number().optional(),
       amount: z.number().positive("El monto debe ser mayor a 0"),
       paymentMethod: z.enum(["CASH", "TRANSFER"]),
       notes: z.string().optional(),
       idempotencyKey: z.string().optional(),
});

export type RegisterCollectionInput = z.infer<typeof registerCollectionSchema>;
