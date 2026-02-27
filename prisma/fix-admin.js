const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
       const admin = await prisma.user.findUnique({
              where: { username: 'admin' }
       });

       if (!admin) {
              const hashedPassword = await bcrypt.hash('123456', 10);
              await prisma.user.create({
                     data: {
                            username: 'admin',
                            hashedPassword,
                            fullName: 'Administrador Nico',
                            role: 'ADMIN',
                            isActive: true
                     }
              });
              console.log('✅ Usuario admin creado con éxito (pass: 123456).');
       } else {
              console.log('ℹ️ El usuario admin ya existe.');
       }
}

main()
       .catch((e) => {
              console.error(e);
              process.exit(1);
       })
       .finally(async () => {
              await prisma.$disconnect();
       });
