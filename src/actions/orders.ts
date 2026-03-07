"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions, getRequiredSession } from "@/lib/auth";
import { createOrderSchema } from "@/schemas/order";
import { withIdempotency } from "@/lib/idempotency";

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

export async function createOrder(rawData: any) {
       try {
              const session: any = await getRequiredSession();
              const userId = parseInt(session.user.id);

              const validated = createOrderSchema.safeParse(rawData);
              if (!validated.success) {
                     return { success: false, error: validated.error.issues[0].message };
              }
              const { idempotencyKey, ...data } = validated.data;

              const result = await withIdempotency(idempotencyKey, userId, async (tx) => {
                     // 1. Calculate total
                     let totalAmount = 0;
                     for (const item of data.items) {
                            totalAmount += item.quantity * item.unitPrice;
                     }

                     // 2. Create Order
                     return await tx.order.create({
                            data: {
                                   clientId: data.clientId,
                                   notes: data.notes,
                                   totalAmount,
                                   status: "CONFIRMED",
                                   createdBy: userId,
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
                                   client: true
                            }
                     });
              });

              revalidatePath("/repartos");
              revalidatePath("/pedidos");
              revalidatePath("/");
              return { success: true, data: result };
       } catch (error: any) {
              console.error("Error creating order:", error);
              return { success: false, error: error.message };
       }
}

export async function deleteOrder(id: number) {
       try {
              await getRequiredSession();

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
              await getRequiredSession();
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
