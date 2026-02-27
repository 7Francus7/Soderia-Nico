"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStockLevels() {
       try {
              const stock = await prisma.stock.findMany({
                     include: {
                            product: true,
                            warehouse: true,
                     },
              });
              return { success: true, data: stock };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function updateStock(warehouseId: number, productId: number, delta: number) {
       try {
              const stock = await prisma.stock.upsert({
                     where: {
                            warehouseId_productId: { warehouseId, productId },
                     },
                     update: {
                            quantity: { increment: delta },
                     },
                     create: {
                            warehouseId,
                            productId,
                            quantity: delta,
                     },
              });
              revalidatePath("/productos");
              return { success: true, data: stock };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function getWarehouses() {
       try {
              const warehouses = await prisma.warehouse.findMany();
              return { success: true, data: warehouses };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
