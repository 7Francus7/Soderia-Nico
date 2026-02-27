const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
       const products = await prisma.product.findMany();
       console.log(`📦 Productos en DB: ${products.length}`);
       products.forEach(p => console.log(`- ${p.name} ($${p.price})`));

       const clients = await prisma.client.findMany();
       console.log(`👥 Clientes en DB: ${clients.length}`);
}

main().finally(() => prisma.$disconnect());
