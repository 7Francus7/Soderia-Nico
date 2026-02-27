"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDelivery(orderIds: number[], notes?: string) {
       try {
              const delivery = await prisma.$transaction(async (tx) => {
                     const newDelivery = await tx.delivery.create({
                            data: {
                                   notes,
                                   status: "PENDING",
                            },
                     });

                     await tx.order.updateMany({
                            where: {
                                   id: { in: orderIds },
                            },
                            data: {
                                   deliveryId: newDelivery.id,
                            },
                     });

                     return newDelivery;
              });

              revalidatePath("/repartos");
              return { success: true, data: delivery };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function deliverOrder(orderId: number, data: {
       paymentMethod: string;
       returnedBottles: number;
       notes?: string;
}) {
       try {
              const result = await prisma.$transaction(async (tx) => {
                     // 1. Get Order with Items and Client
                     const order = await tx.order.findUnique({
                            where: { id: orderId },
                            include: {
                                   items: {
                                          include: { product: true }
                                   },
                                   client: true,
                            }
                     });

                     if (!order) throw new Error("Order not found");
                     if (order.status === "DELIVERED") return order;

                     // 2. Calculate borrowed bottles from returnable products
                     let borrowedBottles = 0;
                     for (const item of order.items) {
                            if (item.product.isReturnable) {
                                   borrowedBottles += item.quantity;
                            }
                     }

                     // 3. Update Client Balance & Bottles
                     const client = order.client;
                     const totalAmount = order.totalAmount;

                     let paymentStatus = "PAID";
                     if (data.paymentMethod === "CURRENT_ACCOUNT") {
                            paymentStatus = "ON_ACCOUNT";

                            // Debit Ledger
                            await tx.clientTransaction.create({
                                   data: {
                                          clientId: client.id,
                                          type: "DEBIT",
                                          amount: totalAmount,
                                          concept: `Pedido #${order.id} (Entregado)`,
                                          description: data.notes || "Venta a Cuenta Corriente",
                                          referenceId: order.id,
                                   }
                            });

                            // Update Client Debt
                            await tx.client.update({
                                   where: { id: client.id },
                                   data: {
                                          balance: { increment: totalAmount },
                                          bottlesBalance: { increment: borrowedBottles - data.returnedBottles }
                                   }
                            });
                     } else {
                            // Cash / Transfer / Mixed
                            // Create Cash Movement
                            await tx.cashMovement.create({
                                   data: {
                                          amount: totalAmount,
                                          type: "INCOME",
                                          concept: `Cobro Pedido #${order.id}`,
                                          paymentMethod: data.paymentMethod,
                                          referenceId: order.id,
                                   }
                            });

                            // Update just bottles
                            await tx.client.update({
                                   where: { id: client.id },
                                   data: {
                                          bottlesBalance: { increment: borrowedBottles - data.returnedBottles }
                                   }
                            });
                     }

                     // 4. Update Order Status
                     const updatedOrder = await tx.order.update({
                            where: { id: orderId },
                            data: {
                                   status: "DELIVERED",
                                   paymentMethod: data.paymentMethod,
                                   paymentStatus,
                                   paymentAmount: data.paymentMethod === "CURRENT_ACCOUNT" ? 0 : totalAmount,
                                   paidAt: new Date(),
                                   deliveredAt: new Date(),
                            }
                     });

                     return updatedOrder;
              });

              revalidatePath("/repartos");
              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function deleteDelivery(id: number) {
       try {
              await prisma.$transaction([
                     prisma.order.updateMany({
                            where: { deliveryId: id },
                            data: { deliveryId: null }
                     }),
                     prisma.delivery.delete({
                            where: { id }
                     })
              ]);

              revalidatePath("/repartos");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
