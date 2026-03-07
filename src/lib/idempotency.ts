import { prisma } from "@/lib/prisma";

/**
 * Utility to run server actions with idempotency protection.
 * 
 * @param key The unique idempotency key from the client.
 * @param userId The ID of the user performing the action.
 * @param action The actual business logic to execute.
 */
export async function withIdempotency<T>(
       key: string | undefined,
       userId: number,
       action: (tx: any) => Promise<T>
): Promise<T> {
       if (!key) {
              // If no key is provided, we run without idempotency protection (not recommended for critical actions)
              return await prisma.$transaction(async (tx) => {
                     return await action(tx);
              });
       }

       return await prisma.$transaction(async (tx) => {
              // 1. Check if the key already exists
              const existing = await tx.idempotencyKey.findUnique({
                     where: { key }
              });

              if (existing) {
                     if (existing.status === "COMPLETED" && existing.response) {
                            return JSON.parse(existing.response) as T;
                     }
                     if (existing.status === "STARTED") {
                            throw new Error("Esta operación ya está siendo procesada.");
                     }
                     throw new Error("Esta operación falló anteriormente y no puede ser reintentada con la misma clave.");
              }

              // 2. Register the key
              await tx.idempotencyKey.create({
                     data: {
                            key,
                            userId,
                            status: "STARTED"
                     }
              });

              try {
                     // 3. Execute the action
                     const result = await action(tx);

                     // 4. Mark as completed and save response
                     await tx.idempotencyKey.update({
                            where: { key },
                            data: {
                                   status: "COMPLETED",
                                   response: JSON.stringify(result)
                            }
                     });

                     return result;
              } catch (error: any) {
                     // 5. Mark as failed so it can't be reused blindly (or we could delete it to allow retry)
                     // For now, we delete it to allow the user to retry if it was a transient error
                     await tx.idempotencyKey.delete({ where: { key } });
                     throw error;
              }
       });
}
