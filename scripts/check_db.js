const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
       const warehouses = await prisma.warehouse.findMany();
       console.log('Warehouses:', warehouses);
}

main().catch(console.error).finally(() => prisma.$disconnect());
