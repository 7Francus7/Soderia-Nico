import { z } from "zod";

export const clientTransactionSchema = z.object({
       clientId: z.number(),
       amount: z.number().positive("El monto debe ser mayor a 0"),
       description: z.string().max(200, "Descripción demasiado larga").optional(),
       paymentMethod: z.enum(["CASH", "TRANSFER"]).optional().default("CASH"),
       idempotencyKey: z.string().optional(),
});

export type ClientTransactionInput = z.infer<typeof clientTransactionSchema>;
