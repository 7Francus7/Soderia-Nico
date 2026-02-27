import { prisma } from "@/lib/prisma";
import { Banknote, ArrowUpRight, ArrowDownLeft, Plus, Calendar, CreditCard, Wallet, Landmark, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CashMovementList from "@/components/CashMovementList";
import NewCashMovementButton from "@/components/NewCashMovementButton";
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

       return (
              <div className="min-h-screen bg-background p-6 lg:p-10">
                     <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                     <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                                                        <Banknote className="w-6 h-6" />
                                                 </div>
                                                 <h1 className="text-4xl font-black tracking-tight">Caja Diaria</h1>
                                          </div>
                                          <p className="text-muted-foreground font-medium text-lg">
                                                 Control de ingresos, egresos y arqueo de caja.
                                          </p>
                                   </div>

                                   <NewCashMovementButton />
                            </div>

                            {/* Totals Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                   <Card className="bg-emerald-500/5 border-emerald-500/20 p-8 hover:scale-[1.02] transition-transform">
                                          <div className="flex justify-between items-center mb-2">
                                                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Ingresos Hoy</span>
                                                 <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                          </div>
                                          <h3 className="text-4xl font-black text-emerald-500 tracking-tighter">${totals.income.toLocaleString()}</h3>
                                   </Card>

                                   <Card className="bg-rose-500/5 border-rose-500/20 p-8 hover:scale-[1.02] transition-transform">
                                          <div className="flex justify-between items-center mb-2">
                                                 <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">Egresos Hoy</span>
                                                 <ArrowDownLeft className="w-4 h-4 text-rose-500" />
                                          </div>
                                          <h3 className="text-4xl font-black text-rose-500 tracking-tighter">${totals.expense.toLocaleString()}</h3>
                                   </Card>

                                   <Card className="bg-primary/10 border-primary/20 p-8 hover:scale-[1.05] transition-transform shadow-2xl shadow-primary/10">
                                          <div className="flex justify-between items-center mb-2">
                                                 <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Efectivo en Caja</span>
                                                 <Wallet className="w-4 h-4 text-primary" />
                                          </div>
                                          <h3 className="text-4xl font-black text-primary tracking-tighter">${totals.cash.toLocaleString()}</h3>
                                   </Card>

                                   <Card className="bg-blue-500/5 border-blue-500/20 p-8 hover:scale-[1.02] transition-transform">
                                          <div className="flex justify-between items-center mb-2">
                                                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Banco / Digital</span>
                                                 <Landmark className="w-4 h-4 text-blue-500" />
                                          </div>
                                          <h3 className="text-4xl font-black text-blue-500 tracking-tighter">${totals.digital.toLocaleString()}</h3>
                                   </Card>
                            </div>

                            {/* History */}
                            <div className="space-y-6">
                                   <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center">
                                                 <History className="w-5 h-5 opacity-40" />
                                          </div>
                                          <h2 className="text-2xl font-black tracking-tight uppercase italic">Movimientos del Día</h2>
                                   </div>

                                   <CashMovementList initialMovements={movements} />
                            </div>
                     </div>
              </div>
       );
}
