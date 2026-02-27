import { prisma } from "@/lib/prisma";
import { CreditCard, TrendingDown, AlertCircle, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
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
              <div className="space-y-12 animate-fade-in-up">
                     {/* Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <CreditCard className="w-5 h-5" />
                                          </div>
                                          <h1 className="text-3xl font-bold tracking-tight">Cuentas Corrientes</h1>
                                   </div>
                                   <p className="text-muted-foreground font-medium">
                                          Control estratégico de saldos, seguimiento de cobranzas y gestión de envases.
                                   </p>
                            </div>
                     </header>

                     {/* Global Stats Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-8 border-border bg-card shadow-sm flex flex-col justify-between rounded-2xl">
                                   <div>
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Deuda Global</p>
                                          <h3 className="text-4xl font-bold tracking-tight text-rose-600 dark:text-rose-400">${totalDebt.toLocaleString()}</h3>
                                   </div>
                                   <div className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                          <AlertCircle className="w-3.5 h-3.5" />
                                          Saldo a cobrar de {debtors.filter((c: any) => c.balance > 0).length} clientes
                                   </div>
                            </Card>

                            <Card className="p-8 border-border bg-card shadow-sm flex flex-col justify-between rounded-2xl">
                                   <div>
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Envases en Calle</p>
                                          <h3 className="text-4xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{totalBottles.toLocaleString()} <span className="text-xl font-medium opacity-60">unid.</span></h3>
                                   </div>
                                   <div className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                          <Droplets className="w-3.5 h-3.5" />
                                          Stock estimado en circulación externa
                                   </div>
                            </Card>
                     </div>

                     {/* Main List Area */}
                     <section className="pt-8 border-t border-border">
                            <DebtorsList initialDebtors={debtors} />
                     </section>
              </div>
       );
}
