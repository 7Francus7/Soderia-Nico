"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getOrders(clientId?: number, status?: string) {
       try {
              const orders = await prisma.order.findMany({
                     where: {
                            ...(clientId && { clientId }),
                            ...(status && { status }),
                     },
                     include: {
                            client: true,
                            items: {
                                   include: { product: true },
                            },
                     },
                     orderBy: { createdAt: "desc" },
              });
              return { success: true, data: orders };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function createOrder(data: {
       clientId: number;
       notes?: string;
       items: { productId: number; quantity: number; unitPrice: number }[];
}) {
       try {
              const order = await prisma.$transaction(async (tx) => {
                     // 1. Calculate total
                     let totalAmount = 0;
                     for (const item of data.items) {
                            totalAmount += item.quantity * item.unitPrice;
                     }

                     // 2. Create Order (Status: CONFIRMED by default for simplicity in mobile, or DRAFT if preferred)
                     // I'll use CONFIRMED because in this system "Draft" isn't used much if created from UI
                     const newOrder = await tx.order.create({
                            data: {
                                   clientId: data.clientId,
                                   notes: data.notes,
                                   totalAmount,
                                   status: "CONFIRMED",
                                   createdBy: 1, // Default user for now
                                   items: {
                                          create: data.items.map((item) => ({
                                                 productId: item.productId,
                                                 quantity: item.quantity,
                                                 unitPrice: item.unitPrice,
                                                 subtotal: item.quantity * item.unitPrice,
                                          })),
                                   },
                            },
                            include: {
                                   items: true,
                            }
                     });

                     return newOrder;
              });

              revalidatePath("/repartos");
              revalidatePath("/pedidos");
              return { success: true, data: order };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function deleteOrder(id: number) {
       try {
              const order = await prisma.order.findUnique({ where: { id } });
              if (order?.status === "DELIVERED") {
                     throw new Error("No se puede eliminar un pedido entregado");
              }

              await prisma.$transaction([
                     prisma.orderItem.deleteMany({ where: { orderId: id } }),
                     prisma.order.delete({ where: { id } }),
              ]);

              revalidatePath("/pedidos");
              revalidatePath("/repartos");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function cancelOrder(id: number) {
       try {
              const order = await prisma.order.update({
                     where: { id },
                     data: { status: "CANCELLED" },
              });
              revalidatePath("/pedidos");
              revalidatePath("/repartos");
              return { success: true, data: order };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
