import { prisma } from "@/lib/prisma";
import { Banknote, ArrowUpRight, ArrowDownLeft, Wallet, Landmark } from "lucide-react";
import CashMovementList from "@/components/finance/CashMovementList";
import NewCashMovementButton from "@/components/finance/NewCashMovementButton";
import CierreDiario from "@/components/finance/CierreDiario";

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

       const balance = totals.income - totals.expense;

       return (
              <div className="page-container space-y-8 lg:space-y-12 text-white">

                     {/* Header */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 pb-6 border-b border-white/5">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                                          </div>
                                          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Caja Diaria</h1>
                                   </div>
                                   <p className="text-muted-foreground text-sm">
                                          Supervisión en tiempo real de flujos de efectivo y arqueo.
                                   </p>
                            </div>
                            <div className="flex items-center gap-3">
                                   <CierreDiario totals={totals} movementsCount={movements.length} />
                                   <NewCashMovementButton />
                            </div>
                     </header>

                     {/* Balance del día — destacado */}
                     <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border ${balance >= 0 ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                            <div>
                                   <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30 mb-1">Balance Neto del Día</p>
                                   <div className={`text-4xl sm:text-5xl font-black tracking-tighter tabular-nums ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                          {balance >= 0 ? "+" : ""}${balance.toLocaleString()}
                                   </div>
                            </div>
                            <div className="text-right">
                                   <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{movements.length} operaciones hoy</p>
                            </div>
                     </div>

                     {/* Financial Summary Grid - 2x2 on mobile, 4 on lg */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <BalanceCard label="Ingresos" value={totals.income} icon={<ArrowUpRight className="w-4 h-4" />} color="emerald" />
                            <BalanceCard label="Egresos" value={totals.expense} icon={<ArrowDownLeft className="w-4 h-4" />} color="rose" />
                            <BalanceCard label="Efectivo" value={totals.cash} icon={<Wallet className="w-4 h-4" />} color="primary" />
                            <BalanceCard label="Digital" value={totals.digital} icon={<Landmark className="w-4 h-4" />} color="blue" />
                     </div>

                     {/* Movements List */}
                     <section className="pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 mb-5">
                                   <h2 className="text-sm font-black uppercase tracking-widest text-white/40">Movimientos</h2>
                                   <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/30">{movements.length} ops</span>
                            </div>
                            <CashMovementList initialMovements={movements} />
                     </section>
              </div>
       );
}

function BalanceCard({ label, value, icon, color }: any) {
       const colors: any = {
              emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
              rose: "text-rose-400 bg-rose-500/5 border-rose-500/10",
              primary: "text-white bg-white/5 border-white/10",
              blue: "text-blue-400 bg-blue-500/5 border-blue-500/10",
       }

       return (
              <div className={`p-4 sm:p-5 border rounded-xl sm:rounded-2xl flex flex-col ${colors[color]}`}>
                     <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] opacity-50 leading-tight">{label}</p>
                            <div className={`p-1.5 rounded-lg ${colors[color]}`}>{icon}</div>
                     </div>
                     <h3 className="text-lg sm:text-xl font-black tracking-tight tabular-nums">
                            ${value.toLocaleString()}
                     </h3>
              </div>
       )
}
