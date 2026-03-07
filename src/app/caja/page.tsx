import { prisma } from "@/lib/prisma";
import { Banknote, ArrowUpRight, ArrowDownLeft, Wallet, Landmark, Activity, Calendar, ShieldCheck, TrendingUp } from "lucide-react";
import CashMovementList from "@/components/finance/CashMovementList";
import NewCashMovementButton from "@/components/finance/NewCashMovementButton";
import CierreDiario from "@/components/finance/CierreDiario";
import { cn } from "@/lib/utils";
import { BalanceCard } from "@/components/finance/BalanceCard";
import { getARStartOfDay, getAREndOfDay, getARRelativeDate } from "@/lib/date-utils";

export default async function CajaPage() {
       // SOLUCIÓN TIMEZONE: Obtenemos el rango exacto de hoy en Argentina (UTC-3)
       const start = getARStartOfDay();
       const end = getAREndOfDay();

       const movements = await prisma.cashMovement.findMany({
              where: {
                     createdAt: {
                            gte: start,
                            lte: end
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
       const currentDateLabel = getARRelativeDate();

       return (
              <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in pb-32">

                     {/* GOOGLE PROFESSIONAL HEADER AREA */}
                     <header className="px-6 pt-12 pb-10 sm:px-10 lg:px-16">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                   <div className="space-y-2">
                                          <div className="flex items-center gap-2 mb-1">
                                                 <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                                        <Activity className="w-4 h-4" />
                                                 </div>
                                                 <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Monitor Financiero</span>
                                          </div>
                                          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                                 Caja Diaria
                                          </h1>
                                          <div className="flex items-center gap-2 mt-1">
                                                 <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                                 <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{currentDateLabel}</span>
                                          </div>
                                   </div>

                                   <div className="w-full sm:w-auto flex items-center gap-3">
                                          <CierreDiario totals={totals} movementsCount={movements.length} />
                                          <NewCashMovementButton />
                                   </div>
                            </div>
                     </header>

                     <main className="px-6 sm:px-10 lg:px-16 space-y-12">

                            {/* MAIN ARQUEO SECTION */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-1">
                                          <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                 <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Arqueo Neto</h3>
                                          </div>
                                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Balance de Sesión</div>
                                   </div>

                                   <div className="p-8 sm:p-12 rounded-[1.5rem] bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                          {/* Subtle Background Decoration */}
                                          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />

                                          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-8">
                                                 <div className="space-y-4 text-center sm:text-left">
                                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total en Tiempo Real (Argentina)</p>
                                                        <h2 className={cn(
                                                               "text-6xl sm:text-7xl font-bold tracking-tight tabular-nums leading-none",
                                                               balance >= 0 ? "text-emerald-500" : "text-rose-500"
                                                        )}>
                                                               {balance >= 0 ? "+" : ""}${balance.toLocaleString()}
                                                        </h2>
                                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                                               <div className="px-3 py-1 bg-secondary border border-border rounded-lg flex items-center gap-2 shadow-sm shrink-0">
                                                                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                                                                      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">{movements.length} Operaciones</span>
                                                               </div>
                                                               <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic tracking-tight opacity-70">Log Localizado UTC-3</span>
                                                        </div>
                                                 </div>

                                                 <div className="hidden lg:flex flex-col items-end gap-2 p-6 rounded-2xl bg-secondary/50 border border-border">
                                                        <div className="flex items-center gap-2 mb-2">
                                                               <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                               <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Auditoría Activa</span>
                                                        </div>
                                                        <div className="h-2 w-32 bg-border rounded-full overflow-hidden">
                                                               <div className="h-full bg-primary/40 w-2/3" />
                                                        </div>
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Integridad de Fechas OK</span>
                                                 </div>
                                          </div>
                                   </div>
                            </section>

                            {/* SMALL CARDS GRID */}
                            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                   <BalanceCard label="Ingresos" value={totals.income} icon={<ArrowUpRight className="w-5 h-5" />} color="emerald" />
                                   <BalanceCard label="Egresos" value={totals.expense} icon={<ArrowDownLeft className="w-5 h-5" />} color="rose" />
                                   <BalanceCard label="Caja Física" value={totals.cash} icon={<Wallet className="w-5 h-5" />} color="amber" />
                                   <BalanceCard label="Banco Digital" value={totals.digital} icon={<Landmark className="w-5 h-5" />} color="blue" />
                            </section>

                            {/* HISTORY SECTION */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                                        <Banknote className="w-5 h-5 stroke-[2px]" />
                                                 </div>
                                                 <div className="flex flex-col">
                                                        <h3 className="text-xl font-bold text-foreground tracking-tight">Historial de Movimientos</h3>
                                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Flujo de Caja</p>
                                                 </div>
                                          </div>
                                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{movements.length} REGISTROS HOY</div>
                                   </div>

                                   <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                          <CashMovementList initialMovements={movements} />
                                   </div>
                            </section>
                     </main>

                     {/* REFINED FOOTER */}
                     <footer className="mt-auto px-10 py-12 flex flex-col items-center gap-4 text-[10px] font-bold text-muted-foreground border-t border-border bg-secondary/30 relative overflow-hidden">
                            <div className="flex items-center gap-6">
                                   <span>Sodería Nico App</span>
                                   <div className="w-1 h-1 rounded-full bg-border" />
                                   <span>Financial Audit v2.5.0</span>
                                   <div className="w-1 h-1 rounded-full bg-border" />
                                   <span>Buenos Aires</span>
                            </div>
                            <p className="opacity-60">Google Professional Interface Upgrade</p>
                     </footer>
              </div>
       );
}
