import { prisma } from "@/lib/prisma";
import { CreditCard, Droplets, AlertCircle } from "lucide-react";
import DebtorsList from "@/components/finance/DebtorsList";

export default async function CuentasPage() {
       const debtors = await prisma.client.findMany({
              where: {
                     OR: [
                            { balance: { gt: 0 } },
                            { bottlesBalance: { not: 0 } }
                     ]
              },
              orderBy: { balance: "desc" }
       });

       const totalDebt = debtors.reduce((acc: number, c: any) => acc + c.balance, 0);
       const totalBottles = debtors.reduce((acc: number, c: any) => acc + (c.bottlesBalance > 0 ? c.bottlesBalance : 0), 0);

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

                     {/* Stats Grid - side by side on mobile */}
                     <div className="grid grid-cols-2 gap-3 sm:gap-5">
                            {/* Total Deuda */}
                            <div className="p-4 sm:p-6 lg:p-8 border border-rose-500/10 bg-rose-500/5 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between">
                                   <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-rose-400/60 mb-3">Deuda Global</p>
                                   <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-rose-400 tabular-nums">
                                          ${totalDebt.toLocaleString()}
                                   </h3>
                                   <div className="mt-3 flex items-center gap-1.5 text-[9px] sm:text-xs font-medium text-rose-400/50">
                                          <AlertCircle className="w-3 h-3 shrink-0" />
                                          <span className="truncate">{debtors.filter((c: any) => c.balance > 0).length} clientes</span>
                                   </div>
                            </div>

                            {/* Envases */}
                            <div className="p-4 sm:p-6 lg:p-8 border border-amber-500/10 bg-amber-500/5 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between">
                                   <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/60 mb-3">Envases en Calle</p>
                                   <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-amber-400 tabular-nums">
                                          {totalBottles.toLocaleString()} <span className="text-sm sm:text-xl font-medium opacity-50">unid.</span>
                                   </h3>
                                   <div className="mt-3 flex items-center gap-1.5 text-[9px] sm:text-xs font-medium text-amber-400/50">
                                          <Droplets className="w-3 h-3 shrink-0" />
                                          <span className="truncate">Stock en circulación</span>
                                   </div>
                            </div>
                     </div>

                     {/* Debtors List */}
                     <section className="pt-6 border-t border-white/5">
                            <DebtorsList initialDebtors={debtors} />
                     </section>
              </div>
       );
}
