import { prisma } from "@/lib/prisma";
import { CreditCard, Droplets, AlertCircle, TrendingUp, Users, Calendar } from "lucide-react";
import DebtorsList from "@/components/finance/DebtorsList";

export default async function CuentasPage() {
       const debtors = await prisma.client.findMany({
              where: {
                     OR: [
                            { balance: { gt: 0 } },
                            { bottlesBalance: { not: 0 } }
                     ]
              },
              include: {
                     transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                     },
                     orders: {
                            where: {
                                   status: { in: ['CONFIRMED', 'PENDING'] }
                            },
                            take: 1
                     }
              },
              orderBy: { balance: "desc" }
       });

       // Get total collected today
       const today = new Date();
       today.setHours(0, 0, 0, 0);

       const collectionsToday = await prisma.clientTransaction.aggregate({
              where: {
                     type: 'CREDIT',
                     createdAt: { gte: today }
              },
              _sum: { amount: true }
       });

       const totalDebt = debtors.reduce((acc: number, c: any) => acc + c.balance, 0);
       const totalBottles = debtors.reduce((acc: number, c: any) => acc + (c.bottlesBalance > 0 ? c.bottlesBalance : 0), 0);
       const clientsWithDebt = debtors.filter((c: any) => c.balance > 0).length;

       // Enriquecer deudores con info calculada
       const enrichedDebtors = debtors.map(client => {
              const lastTransaction = client.transactions[0];
              const lastPaymentDate = client.transactions.find(t => t.type === 'CREDIT')?.createdAt;
              const oldestDebtDate = client.transactions.find(t => t.type === 'DEBIT')?.createdAt; // Simplificación

              return {
                     ...client,
                     lastPaymentDate,
                     oldestDebtDate,
                     inRoute: client.orders.length > 0,
                     // Días de mora (si balance > 0, calculamos desde createdAt o oldestDebtDate)
                     daysOverdue: client.balance > 0
                            ? Math.floor((new Date().getTime() - (oldestDebtDate?.getTime() || client.createdAt.getTime())) / (1000 * 3600 * 24))
                            : 0
              };
       });

       const criticalDebtors = enrichedDebtors.filter(d => d.daysOverdue > 15).length;

       return (
              <div className="page-container space-y-8 lg:space-y-12 text-white">
                     {/* Header */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 pb-6 border-b border-white/5">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                          </div>
                                          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Cuentas Corrientes</h1>
                                   </div>
                                   <p className="text-sm text-muted-foreground">
                                          Control de saldos, cobranzas y envases en circulación.
                                   </p>
                            </div>
                     </header>

                     {/* Stats Grid - 4 cards now */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                            {/* Total Deuda */}
                            <div className="p-4 sm:p-5 border border-rose-500/10 bg-rose-500/5 rounded-2xl flex flex-col justify-between">
                                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-400/60 mb-2">Deuda Global</p>
                                   <h3 className="text-xl sm:text-2xl font-bold text-rose-400 tabular-nums">
                                          ${totalDebt.toLocaleString()}
                                   </h3>
                                   <div className="mt-2 flex items-center gap-1.5 text-[10px] text-rose-400/50">
                                          <Users className="w-3 h-3" />
                                          <span>{clientsWithDebt} clie.</span>
                                   </div>
                            </div>

                            {/* Envases */}
                            <div className="p-4 sm:p-5 border border-amber-500/10 bg-amber-500/5 rounded-2xl flex flex-col justify-between">
                                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/60 mb-2">Envases en Calle</p>
                                   <h3 className="text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">
                                          {totalBottles.toLocaleString()} <span className="text-xs opacity-50">unid.</span>
                                   </h3>
                                   <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400/50">
                                          <Droplets className="w-3 h-3" />
                                          <span>En circulación</span>
                                   </div>
                            </div>

                            {/* Cobrado Hoy */}
                            <div className="p-4 sm:p-5 border border-emerald-500/10 bg-emerald-500/5 rounded-2xl flex flex-col justify-between">
                                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/60 mb-2">Cobrado Hoy</p>
                                   <h3 className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
                                          ${(collectionsToday._sum.amount || 0).toLocaleString()}
                                   </h3>
                                   <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400/50">
                                          <TrendingUp className="w-3 h-3" />
                                          <span>Ingresos caja</span>
                                   </div>
                            </div>

                            {/* Vencidos */}
                            <div className="p-4 sm:p-5 border border-slate-500/10 bg-slate-500/5 rounded-2xl flex flex-col justify-between">
                                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400/60 mb-2">Críticos (+15d)</p>
                                   <h3 className="text-xl sm:text-2xl font-bold text-slate-400 tabular-nums">
                                          {criticalDebtors} <span className="text-xs opacity-50">clie.</span>
                                   </h3>
                                   <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400/50">
                                          <Calendar className="w-3 h-3" />
                                          <span>Atención requerida</span>
                                   </div>
                            </div>
                     </div>

                     {/* Debtors List */}
                     <section className="pt-6 border-t border-white/5">
                            <DebtorsList initialDebtors={enrichedDebtors} />
                     </section>
              </div>
       );
}

