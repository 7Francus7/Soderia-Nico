"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions, getRequiredSession } from "@/lib/auth";
import { cashMovementSchema } from "@/schemas/cash";
import { getARStartOfDay, getAREndOfDay } from "@/lib/date-utils";
import { withIdempotency } from "@/lib/idempotency";

export async function getCashMovements(date?: Date) {
       try {
              const startOfDay = getARStartOfDay(date || new Date());
              const endOfDay = getAREndOfDay(date || new Date());

              const movements = await prisma.cashMovement.findMany({
                     where: {
                            createdAt: {
                                   gte: startOfDay,
                                   lte: endOfDay,
                            }
                     },
                     orderBy: { createdAt: "desc" },
              });
              return { success: true, data: movements };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function createCashMovement(rawData: any) {
       try {
              const session: any = await getRequiredSession();
              const userId = parseInt(session.user.id);

              const validated = cashMovementSchema.safeParse(rawData);
              if (!validated.success) {
                     return { success: false, error: validated.error.issues[0].message };
              }
              const { idempotencyKey, ...data } = validated.data;

              const result = await withIdempotency(idempotencyKey, userId, async (tx) => {
                     return await tx.cashMovement.create({
                            data: {
                                   ...data,
                                   createdBy: userId,
                            }
                     });
              });

              revalidatePath("/caja");
              revalidatePath("/");
              return { success: true, data: result };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function getCashBalance() {
       try {
              const incomes = await prisma.cashMovement.aggregate({
                     where: { type: "INCOME" },
                     _sum: { amount: true }
              });
              const expenses = await prisma.cashMovement.aggregate({
                     where: { type: "EXPENSE" },
                     _sum: { amount: true }
              });

              return {
                     success: true,
                     data: (incomes._sum.amount || 0) - (expenses._sum.amount || 0)
              };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
