import { prisma } from "@/lib/prisma";
import { CreditCard, Heart, MessageCircle, DollarSign, Search, Filter, TrendingDown, CheckCircle, Droplets, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import DebtorsList from "@/components/DebtorsList";

export default async function CuentasPage() {
       // Fetch clients with debt or bottle balance
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
              <div className="min-h-screen bg-background p-6 lg:p-10">
                     <div className="fixed top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                     <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                                                        <CreditCard className="w-6 h-6" />
                                                 </div>
                                                 <h1 className="text-4xl font-black tracking-tight">Cuentas Corrientes</h1>
                                          </div>
                                          <p className="text-muted-foreground font-medium text-lg">
                                                 Control de saldos pendientes y gestión de cobranzas.
                                          </p>
                                   </div>
                            </div>

                            {/* Global Debt Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <Card className="p-10 border-rose-500/20 bg-rose-500/5 overflow-hidden group relative">
                                          <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                                 <TrendingDown className="w-40 h-40 text-rose-500" />
                                          </div>
                                          <p className="text-sm font-black uppercase tracking-[0.3em] text-rose-500/60 mb-2">Total Deuda Global</p>
                                          <h3 className="text-6xl font-black tracking-tighter text-rose-500">${totalDebt.toLocaleString()}</h3>
                                          <div className="mt-4 flex items-center gap-2 text-rose-500/60 font-bold">
                                                 <AlertCircle className="w-4 h-4" />
                                                 Saldo a cobrar de {debtors.filter((c: any) => c.balance > 0).length} clientes
                                          </div>
                                   </Card>

                                   <Card className="p-10 border-amber-500/20 bg-amber-500/5 overflow-hidden group relative">
                                          <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                                 <Droplets className="w-40 h-40 text-amber-500" />
                                          </div>
                                          <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-500/60 mb-2">Envases en la Calle</p>
                                          <h3 className="text-6xl font-black tracking-tighter text-amber-500">{totalBottles.toLocaleString()} <span className="text-2xl">unid.</span></h3>
                                          <div className="mt-4 flex items-center gap-2 text-amber-500/60 font-bold">
                                                 <ArrowRight className="w-4 h-4" />
                                                 Valor estimado en circulación
                                          </div>
                                   </Card>
                            </div>

                            {/* Debtors List */}
                            <DebtorsList initialDebtors={debtors} />
                     </div>
              </div>
       );
}

function AlertCircle(props: any) {
       return (
              <svg
                     {...props}
                     xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
              >
                     <circle cx="12" cy="12" r="10" />
                     <line x1="12" y1="8" x2="12" y2="12" />
                     <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
       );
}
