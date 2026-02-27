import { z } from "zod";

export const clientSchema = z.object({
       name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
       address: z.string().min(5, "La dirección es demasiado corta"),
       phone: z.string().optional(),
       zone: z.string().optional(),
       balance: z.number().optional().default(0),
       bottlesBalance: z.number().optional().default(0),
});

export const updateClientSchema = clientSchema.partial();

export type ClientInput = z.infer<typeof clientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
