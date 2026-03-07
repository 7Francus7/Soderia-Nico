"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { getARStartOfDay, getAREndOfDay, formatAR } from "@/lib/date-utils";

export async function getDashboardStats() {
       // CALCULACIÓN LOCALIZADA:
       // El "Hoy" real en Argentina, sin importar el servidor UTC.
       const now = new Date();
       const rangeStart = getARStartOfDay(subDays(now, 6)); // Hace 7 días incluyendo hoy
       const rangeEnd = getAREndOfDay(now);

       try {
              // 1. Fetch de órdenes localizadas
              const orders = await prisma.order.findMany({
                     where: {
                            status: "DELIVERED",
                            deliveredAt: {
                                   gte: rangeStart,
                                   lte: rangeEnd
                            },
                     },
                     select: {
                            totalAmount: true,
                            deliveredAt: true,
                     },
              });

              // 2. Fetch de movimientos de caja (cobranzas) localizados
              const movements = await prisma.cashMovement.findMany({
                     where: {
                            type: "INCOME",
                            createdAt: {
                                   gte: rangeStart,
                                   lte: rangeEnd
                            },
                     },
                     select: {
                            amount: true,
                            createdAt: true,
                     },
              });

              // 3. Agrupación por día basada en el Timezone de AR
              const statsMap = new Map();
              for (let i = 0; i < 7; i++) {
                     const dateKey = formatAR(subDays(now, i), "yyyy-MM-dd");
                     statsMap.set(dateKey, { date: dateKey, sales: 0, collections: 0 });
              }

              orders.forEach((o) => {
                     if (o.deliveredAt) {
                            const day = formatAR(o.deliveredAt, "yyyy-MM-dd");
                            if (statsMap.has(day)) {
                                   statsMap.get(day).sales += o.totalAmount;
                            }
                     }
              });

              movements.forEach((m) => {
                     const day = formatAR(m.createdAt, "yyyy-MM-dd");
                     if (statsMap.has(day)) {
                            statsMap.get(day).collections += m.amount;
                     }
              });

              return {
                     success: true,
                     data: Array.from(statsMap.values()).reverse(),
              };
       } catch (error: any) {
              console.error("Analytics Error:", error);
              return { success: false, error: error.message };
       }
}
