import { prisma } from "@/lib/prisma";
import { Banknote, ArrowUpRight, ArrowDownLeft, Wallet, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import CashMovementList from "@/components/finance/CashMovementList";
import NewCashMovementButton from "@/components/finance/NewCashMovementButton";

export default async function CajaPage() {
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       const tomorrow = new Date(today);
       tomorrow.setDate(tomorrow.getDate() + 1);

       const movements = await prisma.cashMovement.findMany({
              where: {
                     createdAt: {
                            gte: today,
                            lt: tomorrow
                     }
              },
              orderBy: { createdAt: "desc" }
       });

       const totals = movements.reduce((acc: any, curr: any) => {
              if (curr.type === "INCOME") acc.income += curr.amount;
              else acc.expense += curr.amount;

              if (curr.paymentMethod === "CASH") {
                     if (curr.type === "INCOME") acc.cash += curr.amount;
                     else acc.cash -= curr.amount;
              } else {
                     if (curr.type === "INCOME") acc.digital += curr.amount;
                     else acc.digital -= curr.amount;
              }
              return acc;
       }, { income: 0, expense: 0, cash: 0, digital: 0 });

       return (
              <div className="space-y-12 animate-fade-in-up">
                     {/* Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <Banknote className="w-5 h-5" />
                                          </div>
                                          <h1 className="text-3xl font-bold tracking-tight">Caja Diaria</h1>
                                   </div>
                                   <p className="text-muted-foreground font-medium">
                                          Supervisión en tiempo real de flujos de efectivo, transferencias y arqueo preventivo.
                                   </p>
                            </div>
                            <NewCashMovementButton />
                     </header>

                     {/* Financial Summary Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <BalanceCard label="Ingresos Hoy" value={totals.income} icon={<ArrowUpRight className="w-4 h-4" />} color="emerald" />
                            <BalanceCard label="Egresos Hoy" value={totals.expense} icon={<ArrowDownLeft className="w-4 h-4" />} color="rose" />
                            <BalanceCard label="Efectivo en Caja" value={totals.cash} icon={<Wallet className="w-4 h-4" />} color="primary" />
                            <BalanceCard label="Digital / Bancos" value={totals.digital} icon={<Landmark className="w-4 h-4" />} color="blue" />
                     </div>

                     {/* Detailed Movements List */}
                     <section className="pt-8 border-t border-border">
                            <div className="flex items-center gap-3 mb-8">
                                   <h2 className="text-xl font-semibold tracking-tight">Registro de Movimientos</h2>
                                   <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{movements.length} ops</span>
                            </div>
                            <CashMovementList initialMovements={movements} />
                     </section>
              </div>
       );
}

function BalanceCard({ label, value, icon, color }: any) {
       const colors: any = {
              emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5",
              rose: "text-rose-600 dark:text-rose-400 bg-rose-500/5",
              primary: "text-primary bg-primary/5",
              blue: "text-blue-600 dark:text-blue-400 bg-blue-500/5",
       }

       return (
              <Card className="p-6 border-border bg-card shadow-sm rounded-2xl flex flex-col justify-between">
                     <div className="flex justify-between items-center mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                            <div className={`p-2 rounded-lg ${colors[color]} border border-border`}>{icon}</div>
                     </div>
                     <h3 className={`text-2xl font-bold tracking-tight ${color === 'rose' && value > 0 ? 'text-rose-600' : ''}`}>
                            ${value.toLocaleString()}
                     </h3>
              </Card>
       )
}
