import { prisma } from "@/lib/prisma";
import { Banknote, ArrowUpRight, ArrowDownLeft, Wallet, Landmark, Activity, Calendar } from "lucide-react";
import CashMovementList from "@/components/finance/CashMovementList";
import NewCashMovementButton from "@/components/finance/NewCashMovementButton";
import CierreDiario from "@/components/finance/CierreDiario";
import { cn } from "@/lib/utils";

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
       const currentDateLabel = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

       return (
              <div className="flex flex-col min-h-screen bg-white animate-fade-in-up">

                     {/* iOS HEADER AREA */}
                     <header className="px-6 pt-10 pb-8 sm:px-10 lg:px-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                            <div className="space-y-1">
                                   <div className="flex items-center gap-1.5 opacity-40 mb-1 px-1">
                                          <Activity className="w-3.5 h-3.5" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Monitor Financiero</span>
                                   </div>
                                   <h1 className="text-4xl font-black tracking-tight text-foreground leading-tight px-1">
                                          Caja Diaria
                                   </h1>
                                   <div className="flex items-center gap-1.5 mt-2 px-1">
                                          <Calendar className="w-3.5 h-3.5 text-primary/40" />
                                          <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.1em]">{currentDateLabel}</span>
                                   </div>
                            </div>
                            <div className="flex items-center gap-3">
                                   <CierreDiario totals={totals} movementsCount={movements.length} />
                                   <NewCashMovementButton />
                            </div>
                     </header>

                     {/* MAIN CONTENT GRID */}
                     <main className="px-6 sm:px-10 lg:px-16 pb-32 space-y-12">

                            {/* BALANCE DESTACADO - iOS CARD STYLE */}
                            <section className="space-y-6">
                                   <div className="flex items-center gap-2 px-2">
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                          <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Arqueo Neto</h3>
                                   </div>
                                   <div className={cn(
                                          "flex flex-col sm:flex-row items-center justify-between gap-8 p-10 sm:p-14 rounded-[3.5rem] border-2 transition-all shadow-2xl shadow-slate-200/40",
                                          balance >= 0 ? "bg-white border-emerald-50" : "bg-white border-rose-50"
                                   )}>
                                          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                                 <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 mb-4">Balance en Tiempo Real</p>
                                                 <div className={cn(
                                                        "text-6xl sm:text-8xl font-black tracking-tighter tabular-nums leading-none",
                                                        balance >= 0 ? "text-emerald-500" : "text-rose-500"
                                                 )}>
                                                        {balance >= 0 ? "+" : ""}${balance.toLocaleString()}
                                                 </div>
                                          </div>
                                          <div className="flex flex-col items-center sm:items-end gap-3">
                                                 <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-[1.2rem] flex items-center gap-2 shadow-sm">
                                                        <Activity className="w-4 h-4 text-primary" />
                                                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{movements.length} Operaciones</span>
                                                 </div>
                                                 <span className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.3em]">Sincronizado ahora</span>
                                          </div>
                                   </div>
                            </section>

                            {/* FINANCIAL SUMMARY GRID */}
                            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                   <BalanceCard label="Ingresos" value={totals.income} icon={<ArrowUpRight className="w-5 h-5" />} color="emerald" />
                                   <BalanceCard label="Egresos" value={totals.expense} icon={<ArrowDownLeft className="w-5 h-5" />} color="rose" />
                                   <BalanceCard label="Caja Física" value={totals.cash} icon={<Wallet className="w-5 h-5" />} color="amber" />
                                   <BalanceCard label="Banco Digital" value={totals.digital} icon={<Landmark className="w-5 h-5" />} color="blue" />
                            </section>

                            {/* MOVEMENTS LIST SECTION */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-2">
                                          <div className="flex items-center gap-2">
                                                 <Banknote className="w-4 h-4 text-primary" />
                                                 <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Historial de Movimientos</h3>
                                          </div>
                                          <div className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{movements.length} Registros hoy</div>
                                   </div>
                                   <CashMovementList initialMovements={movements} />
                            </section>
                     </main>

                     {/* iOS FOOTER DECORATION */}
                     <footer className="mt-auto px-10 py-12 flex flex-col items-center gap-4 text-[10px] font-bold text-muted-foreground/30 border-t border-border/20 uppercase tracking-[0.3em]">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center opacity-50">
                                   <Banknote className="w-4 h-4" />
                            </div>
                            <span>© 2026 Sodería Nico — Auditoría Avanzada</span>
                     </footer>
              </div>
       );
}

function BalanceCard({ label, value, icon, color }: any) {
       const colors: any = {
              emerald: "text-emerald-500 bg-emerald-50 border-emerald-100 shadow-emerald-500/5",
              rose: "text-rose-500 bg-rose-50 border-rose-100 shadow-rose-500/5",
              amber: "text-amber-500 bg-amber-50 border-amber-100 shadow-amber-500/5",
              blue: "text-primary bg-primary/5 border-primary/10 shadow-primary/5",
       }

       return (
              <motion.div
                     whileHover={{ y: -4 }}
                     className={cn(
                            "group p-8 border rounded-[2.5rem] flex flex-col justify-between transition-all duration-300",
                            colors[color]
                     )}
              >
                     <div className="flex justify-between items-start mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-tight group-hover:opacity-100 transition-opacity">{label}</p>
                            <div className={cn("w-12 h-12 rounded-[1.2rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", colors[color], "bg-white")}>{icon}</div>
                     </div>
                     <h3 className="text-3xl font-black tracking-tighter tabular-nums leading-none">
                            ${value.toLocaleString()}
                     </h3>
              </motion.div>
       )
}
