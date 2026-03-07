import { z } from "zod";

export const cashMovementSchema = z.object({
       amount: z.number().positive("El monto debe ser mayor a 0"),
       type: z.enum(["INCOME", "EXPENSE"]),
       concept: z.string().min(3, "El concepto es demasiado corto"),
       paymentMethod: z.enum(["CASH", "TRANSFER"]),
       referenceId: z.number().optional().nullable(),
       idempotencyKey: z.string().optional(),
});

export type CashMovementInput = z.infer<typeof cashMovementSchema>;
