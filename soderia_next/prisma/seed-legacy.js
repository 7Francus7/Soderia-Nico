const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
       const dataPath = path.join(__dirname, 'legacy_data.json');
       if (!fs.existsSync(dataPath)) {
              console.log('❌ No se encontró el archivo de datos legacy.');
              return;
       }

       const { products, clients } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

       console.log('🌱 Iniciando siembra de datos...');

       // Sembrar Productos
       for (const p of products) {
              await prisma.product.upsert({
                     where: { code: p.code },
                     update: { price: p.price },
                     create: {
                            name: p.name,
                            code: p.code,
                            price: p.price,
                            isReturnable: p.name.toLowerCase().includes('soda') || p.name.toLowerCase().includes('bidon')
                     }
              });
       }
       console.log(`✅ ${products.length} productos procesados.`);

       // Sembrar Clientes
       for (const c of clients) {
              await prisma.client.create({
                     data: {
                            name: c.name,
                            address: c.address || 'Sin dirección',
                            phone: c.phone,
                            balance: c.balance || 0
                     }
              });
       }
       console.log(`✅ ${clients.length} clientes procesados.`);

}

main()
       .catch(e => console.error(e))
       .finally(() => prisma.$disconnect());
