"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getRequiredSession } from "@/lib/auth";
import { withIdempotency } from "@/lib/idempotency";
import {
       deliverOrderSchema,
       DeliverOrderInput,
       registerOrderIncidentSchema,
       RegisterOrderIncidentInput,
       registerCollectionSchema,
       RegisterCollectionInput
} from "@/schemas/delivery";

/**
 * Registra una cobranza de un cliente (pago de deuda).
 */
export async function registerCollection(rawInput: RegisterCollectionInput) {
       try {
              const session = await getRequiredSession();
              const userId = (session.user as any).id;
              const input = registerCollectionSchema.parse(rawInput);
              const { clientId, orderId, amount, paymentMethod, notes, idempotencyKey } = input;

              const result = await withIdempotency(idempotencyKey, userId, async (tx) => {
                     // 1. Crear movimiento de caja
                     const cash = await tx.cashMovement.create({
                            data: {
                                   amount,
                                   type: "INCOME",
                                   concept: orderId ? `Cobranza en Reparto (Pedido #${orderId})` : "Cobranza en Reparto (Pago de Cuenta)",
                                   paymentMethod,
                                   referenceId: orderId,
                                   createdBy: userId,
                            }
                     });

                     // 2. Crear movimiento en cuenta corriente (CREDITO para reducir deuda)
                     const transaction = await tx.clientTransaction.create({
                            data: {
                                   clientId,
                                   type: "CREDIT",
                                   amount,
                                   concept: "Cobranza en Reparto",
                                   description: notes || `Pago recibido por ${paymentMethod}`,
                                   referenceId: orderId,
                                   createdBy: userId,
                            }
                     });

                     // 3. Actualizar saldo del cliente
                     const client = await tx.client.update({
                            where: { id: clientId },
                            data: { balance: { decrement: amount } }
                     });

                     // 4. Si hay pedido, dejar registro en historial
                     if (orderId) {
                            await tx.orderHistory.create({
                                   data: {
                                          orderId,
                                          status: "COLLECTION",
                                          comment: `Cobranza de $${amount.toLocaleString()} por ${paymentMethod}.`,
                                          userId
                                   }
                            });
                     }

                     return { cashId: cash.id, transactionId: transaction.id, clientBalance: client.balance };
              });

              revalidatePath("/clientes");
              revalidatePath("/caja");
              if (orderId) revalidatePath(`/repartos`);

              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

/**
 * Registra la entrega efectiva de un pedido.
 */
export async function deliverOrder(rawInput: DeliverOrderInput) {
       try {
              const session = await getRequiredSession();
              const userId = (session.user as any).id;
              const input = deliverOrderSchema.parse(rawInput);
              const { orderId, paymentMethod, returnedBottles, notes, idempotencyKey } = input;

              const result = await withIdempotency(idempotencyKey, userId, async (tx) => {
                     const order = await tx.order.findUnique({
                            where: { id: orderId },
                            include: {
                                   items: { include: { product: true } },
                                   client: true,
                            }
                     });

                     if (!order) throw new Error("Pedido no encontrado");
                     if (order.status === "DELIVERED") throw new Error("Este pedido ya fue entregado");

                     let borrowedBottles = 0;
                     for (const item of order.items) {
                            if (item.product.isReturnable) {
                                   borrowedBottles += item.quantity;
                            }
                     }

                     const client = order.client;
                     const totalAmount = order.totalAmount;

                     let warehouse = await tx.warehouse.findFirst();
                     if (!warehouse) {
                            warehouse = await tx.warehouse.create({ data: { name: "Depósito Central" } });
                     }

                     for (const item of order.items) {
                            await tx.stock.upsert({
                                   where: { warehouseId_productId: { warehouseId: warehouse.id, productId: item.productId } },
                                   update: { quantity: { decrement: item.quantity } },
                                   create: { warehouseId: warehouse.id, productId: item.productId, quantity: -item.quantity }
                            });
                     }

                     let paymentStatus = "PAID";
                     if (paymentMethod === "CURRENT_ACCOUNT") {
                            paymentStatus = "ON_ACCOUNT";
                            await tx.clientTransaction.create({
                                   data: {
                                          clientId: client.id,
                                          type: "DEBIT",
                                          amount: totalAmount,
                                          concept: `Pedido #${order.id} (Entregado)`,
                                          description: notes || "Venta a Cuenta Corriente",
                                          referenceId: order.id,
                                          createdBy: userId,
                                   }
                            });
                            await tx.client.update({
                                   where: { id: client.id },
                                   data: {
                                          balance: { increment: totalAmount },
                                          bottlesBalance: { increment: borrowedBottles - returnedBottles }
                                   }
                            });
                     } else {
                            await tx.cashMovement.create({
                                   data: {
                                          amount: totalAmount,
                                          type: "INCOME",
                                          concept: `Cobro Pedido #${order.id}`,
                                          paymentMethod: paymentMethod,
                                          referenceId: order.id,
                                          createdBy: userId,
                                   }
                            });
                            await tx.client.update({
                                   where: { id: client.id },
                                   data: { bottlesBalance: { increment: borrowedBottles - returnedBottles } }
                            });
                     }

                     await tx.orderHistory.create({
                            data: {
                                   orderId: order.id,
                                   status: "DELIVERED",
                                   comment: notes || "Entrega confirmada",
                                   userId
                            }
                     });

                     const updated = await tx.order.update({
                            where: { id: orderId },
                            data: {
                                   status: "DELIVERED",
                                   paymentMethod,
                                   paymentStatus,
                                   paymentAmount: paymentMethod === "CURRENT_ACCOUNT" ? 0 : totalAmount,
                                   paidAt: paymentMethod === "CURRENT_ACCOUNT" ? null : new Date(),
                                   deliveredAt: new Date(),
                                   notes: notes || order.notes,
                            }
                     });

                     return { id: updated.id, status: updated.status, deliveryId: updated.deliveryId };
              });

              revalidatePath("/repartos");
              revalidatePath(`/repartos/${result.deliveryId}`);
              revalidatePath("/caja");
              revalidatePath("/clientes");

              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

/**
 * Registra una incidencia con protección de idempotencia.
 */
export async function registerOrderIncident(rawInput: RegisterOrderIncidentInput) {
       try {
              const session = await getRequiredSession();
              const userId = (session.user as any).id;
              const input = registerOrderIncidentSchema.parse(rawInput);
              const { orderId, type, reason, idempotencyKey } = input;

              const result = await withIdempotency(idempotencyKey, userId, async (tx) => {
                     const order = await tx.order.findUnique({ where: { id: orderId } });
                     if (!order) throw new Error("Pedido no encontrado");
                     if (order.status === "DELIVERED") throw new Error("No se puede registrar incidencia en pedido entregado");

                     await tx.orderHistory.create({
                            data: {
                                   orderId,
                                   status: type,
                                   comment: reason,
                                   userId
                            }
                     });

                     const updated = await tx.order.update({
                            where: { id: orderId },
                            data: {
                                   status: type,
                                   notes: `${type}: ${reason}`,
                            }
                     });

                     return { id: updated.id, status: updated.status, deliveryId: updated.deliveryId };
              });

              revalidatePath("/repartos");
              revalidatePath(`/repartos/${result.deliveryId}`);

              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function createDelivery(orderIds: number[], notes?: string) {
       try {
              const delivery = await prisma.$transaction(async (tx) => {
                     const newDelivery = await tx.delivery.create({ data: { notes, status: "PENDING" } });
                     await tx.order.updateMany({
                            where: { id: { in: orderIds } },
                            data: { deliveryId: newDelivery.id, status: "CONFIRMED" },
                     });
                     return newDelivery;
              });
              revalidatePath("/repartos");
              return { success: true, data: delivery };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function deleteDelivery(id: number) {
       try {
              await prisma.$transaction(async (tx) => {
                     await tx.order.updateMany({ where: { deliveryId: id }, data: { deliveryId: null, status: "DRAFT" } });
                     await tx.delivery.delete({ where: { id } });
              });
              revalidatePath("/repartos");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
