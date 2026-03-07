"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions, getRequiredSession } from "@/lib/auth";
import { clientSchema, updateClientSchema } from "@/schemas/client";
import { clientTransactionSchema } from "@/schemas/client-transaction";
import { withIdempotency } from "@/lib/idempotency";

export async function getClients(search?: string, sortByDebt: boolean = false) {
       try {
              const clients = await prisma.client.findMany({
                     where: search ? {
                            OR: [
                                   { name: { contains: search, mode: 'insensitive' } },
                                   { address: { contains: search, mode: 'insensitive' } },
                            ]
                     } : {},
                     orderBy: sortByDebt ? { balance: "desc" } : { name: "asc" },
              });
              return { success: true, data: clients };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function createClient(rawData: any) {
       try {
              await getRequiredSession();
              const validated = clientSchema.safeParse(rawData);
              if (!validated.success) {
                     return { success: false, error: validated.error.issues[0].message };
              }
              const data = validated.data;

              const existing = await prisma.client.findFirst({
                     where: { name: data.name, address: data.address }
              });

              if (existing) return { success: true, data: existing };

              const client = await prisma.client.create({
                     data: {
                            ...data,
                            balance: data.balance ?? 0,
                            bottlesBalance: data.bottlesBalance ?? 0,
                     }
              });

              revalidatePath("/clientes");
              return { success: true, data: client };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function updateClient(id: number, rawData: any) {
       try {
              await getRequiredSession();
              const validated = updateClientSchema.safeParse(rawData);
              if (!validated.success) {
                     return { success: false, error: validated.error.issues[0].message };
              }
              const data = validated.data;
              const client = await prisma.client.update({
                     where: { id },
                     data,
              });

              revalidatePath("/clientes");
              revalidatePath(`/clientes/${id}`);
              return { success: true, data: client };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function registerPayment(rawData: any) {
       try {
              const session: any = await getRequiredSession();
              const userId = parseInt(session.user.id);

              const validated = clientTransactionSchema.safeParse(rawData);
              if (!validated.success) {
                     return { success: false, error: validated.error.issues[0].message };
              }
              const { clientId, amount, description, paymentMethod, idempotencyKey } = validated.data;

              const result = await withIdempotency(idempotencyKey, userId, async (tx) => {
                     const transaction = await tx.clientTransaction.create({
                            data: {
                                   clientId,
                                   type: "CREDIT",
                                   amount,
                                   concept: "Pago recibido",
                                   description: description || `Pago a cuenta via ${paymentMethod}`,
                                   createdBy: userId,
                            }
                     });

                     await tx.client.update({
                            where: { id: clientId },
                            data: {
                                   balance: { decrement: amount }
                            }
                     });

                     await tx.cashMovement.create({
                            data: {
                                   amount,
                                   type: "INCOME",
                                   concept: `Cobranza Cliente (ID: ${clientId})`,
                                   paymentMethod: paymentMethod || "CASH",
                                   createdBy: userId,
                            }
                     });

                     return { transactionId: transaction.id };
              });

              revalidatePath("/clientes");
              revalidatePath(`/clientes/${clientId}`);
              revalidatePath("/caja");
              revalidatePath("/");
              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function registerCharge(rawData: any) {
       try {
              const session: any = await getRequiredSession();
              const userId = parseInt(session.user.id);

              const validated = clientTransactionSchema.safeParse(rawData);
              if (!validated.success) {
                     return { success: false, error: validated.error.issues[0].message };
              }
              const { clientId, amount, description, idempotencyKey } = validated.data;

              const result = await withIdempotency(idempotencyKey, userId, async (tx) => {
                     const transaction = await tx.clientTransaction.create({
                            data: {
                                   clientId,
                                   type: "DEBIT",
                                   amount,
                                   concept: "Cargo manual",
                                   description: description || "Cargo extra realizado por administración",
                                   createdBy: userId,
                            }
                     });

                     await tx.client.update({
                            where: { id: clientId },
                            data: {
                                   balance: { increment: amount }
                            }
                     });

                     return { transactionId: transaction.id };
              });

              revalidatePath("/clientes");
              revalidatePath(`/clientes/${clientId}`);
              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function deleteClient(id: number) {
       try {
              await getRequiredSession();
              await prisma.client.delete({ where: { id } });
              revalidatePath("/clientes");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function updateClientNotes(id: number, notes: string) {
       try {
              await getRequiredSession();
              await prisma.client.update({
                     where: { id },
                     data: { notes },
              });
              revalidatePath(`/clientes/${id}`);
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function updateClientTag(id: number, tag: string | null) {
       try {
              await getRequiredSession();
              await prisma.client.update({
                     where: { id },
                     data: { tag: tag as any },
              });
              revalidatePath(`/clientes/${id}`);
              revalidatePath("/clientes");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
