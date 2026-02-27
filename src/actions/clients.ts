"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { clientSchema, updateClientSchema } from "@/schemas/client";

export async function getClients(search?: string, sortByDebt: boolean = false) {
       try {
              const clients = await prisma.client.findMany({
                     where: search ? {
                            OR: [
                                   { name: { contains: search } },
                                   { address: { contains: search } },
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
              const validated = clientSchema.safeParse(rawData);
              if (!validated.success) {
                     return { success: false, error: validated.error.issues[0].message };
              }
              const data = validated.data;

              // Basic anti-duplicate check
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

export async function deleteClient(id: number) {
       try {
              await prisma.client.delete({ where: { id } });
              revalidatePath("/clientes");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function registerPayment(clientId: number, amount: number, description?: string) {
       try {
              const result = await prisma.$transaction(async (tx) => {
                     // Create Transaction
                     await tx.clientTransaction.create({
                            data: {
                                   clientId,
                                   type: "CREDIT",
                                   amount,
                                   concept: "Pago recibido",
                                   description: description || "Pago a cuenta",
                            }
                     });

                     // Update Client Balance
                     const client = await tx.client.update({
                            where: { id: clientId },
                            data: {
                                   balance: { decrement: amount }
                            }
                     });

                     return client;
              });

              revalidatePath("/clientes");
              revalidatePath(`/clientes/${clientId}`);
              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function registerCharge(clientId: number, amount: number, description?: string) {
       try {
              const result = await prisma.$transaction(async (tx) => {
                     // Create Transaction
                     await tx.clientTransaction.create({
                            data: {
                                   clientId,
                                   type: "DEBIT",
                                   amount,
                                   concept: "Cargo manual",
                                   description: description || "Cargo extra",
                            }
                     });

                     // Update Client Balance
                     const client = await tx.client.update({
                            where: { id: clientId },
                            data: {
                                   balance: { increment: amount }
                            }
                     });

                     return client;
              });

              revalidatePath("/clientes");
              revalidatePath(`/clientes/${clientId}`);
              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
