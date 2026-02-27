"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCashMovements(date?: Date) {
       try {
              const startOfDay = date ? new Date(date.setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
              const endOfDay = date ? new Date(date.setHours(23, 59, 59, 999)) : new Date(new Date().setHours(23, 59, 59, 999));

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

export async function createCashMovement(data: { amount: number; type: string; concept: string; paymentMethod: string }) {
       try {
              const movement = await prisma.cashMovement.create({
                     data: {
                            amount: data.amount,
                            type: data.type,
                            concept: data.concept,
                            paymentMethod: data.paymentMethod,
                     }
              });

              revalidatePath("/caja");
              revalidatePath("/");
              return { success: true, data: movement };
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
