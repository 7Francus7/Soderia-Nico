"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function getDashboardStats() {
       const today = startOfDay(new Date());
       const last7Days = subDays(today, 6);

       try {
              // Fetch orders delivered in the last 7 days
              const orders = await prisma.order.findMany({
                     where: {
                            status: "DELIVERED",
                            deliveredAt: { gte: last7Days },
                     },
                     select: {
                            totalAmount: true,
                            deliveredAt: true,
                     },
              });

              // Fetch cash movements (income) in the last 7 days
              const movements = await prisma.cashMovement.findMany({
                     where: {
                            type: "INCOME",
                            createdAt: { gte: last7Days },
                     },
                     select: {
                            amount: true,
                            createdAt: true,
                     },
              });

              // Group by day
              const statsMap = new Map();
              for (let i = 0; i < 7; i++) {
                     const date = format(subDays(today, i), "yyyy-MM-dd");
                     statsMap.set(date, { date, sales: 0, collections: 0 });
              }

              orders.forEach((o) => {
                     const day = format(o.deliveredAt || new Date(), "yyyy-MM-dd");
                     if (statsMap.has(day)) {
                            statsMap.get(day).sales += o.totalAmount;
                     }
              });

              movements.forEach((m) => {
                     const day = format(m.createdAt, "yyyy-MM-dd");
                     if (statsMap.has(day)) {
                            statsMap.get(day).collections += m.amount;
                     }
              });

              return {
                     success: true,
                     data: Array.from(statsMap.values()).reverse(),
              };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
