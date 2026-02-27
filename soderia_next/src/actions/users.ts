"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
       try {
              const users = await prisma.user.findMany({
                     orderBy: { createdAt: "desc" },
              });
              return { success: true, data: users };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function createUser(data: {
       username: string;
       password: string;
       fullName?: string;
       role: "ADMIN" | "CHOFER" | "VENDEDOR";
}) {
       try {
              const hashedPassword = await bcrypt.hash(data.password, 10);
              const user = await prisma.user.create({
                     data: {
                            username: data.username,
                            hashedPassword,
                            fullName: data.fullName,
                            role: data.role,
                            isActive: true,
                     },
              });
              revalidatePath("/usuarios");
              return { success: true, data: user };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function updateUser(id: number, data: any) {
       try {
              const user = await prisma.user.update({
                     where: { id },
                     data,
              });
              revalidatePath("/usuarios");
              return { success: true, data: user };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}

export async function deleteUser(id: number) {
       try {
              await prisma.user.delete({ where: { id } });
              revalidatePath("/usuarios");
              return { success: true };
       } catch (error: any) {
              return { success: false, error: error.message };
       }
}
