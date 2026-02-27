"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
       try {
              const products = await prisma.product.findMany({
                     orderBy: { name: "asc" },
              });
              return { success: true, data: products };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function createProduct(data: { name: string; code: string; price: number; isReturnable: boolean }) {
       try {
              const product = await prisma.product.create({
                     data,
              });
              revalidatePath("/productos");
              return { success: true, data: product };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function updateProduct(id: number, data: { name?: string; code?: string; price?: number; isReturnable?: boolean }) {
       try {
              const product = await prisma.product.update({
                     where: { id },
                     data,
              });
              revalidatePath("/productos");
              return { success: true, data: product };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function deleteProduct(id: number) {
       try {
              await prisma.product.delete({
                     where: { id },
              });
              revalidatePath("/productos");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
