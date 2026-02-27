import { prisma } from "@/lib/prisma";
import { ChevronLeft, CreditCard, Droplets, History, Phone, MapPin, User, ArrowUpCircle, ArrowDownCircle, Trash2, Calendar, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ClientLedgerActions from "@/components/ClientLedgerActions";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
       const clientId = parseInt(params.id);

       const client = await prisma.client.findUnique({
              where: { id: clientId },
              include: {
                     transactions: {
                            orderBy: { createdAt: "desc" },
                            take: 20
                     }
              }
       });

       if (!client) return (
              <div className="min-h-screen flex items-center justify-center p-6 text-center">
                     <h1 className="text-2xl font-black italic uppercase">Cliente no encontrado</h1>
                     <Link href="/clientes">
                            <Button variant="premium" className="mt-4">Volver a Clientes</Button>
                     </Link>
              </div>
       );

       return (
              <div className="min-h-screen bg-background pb-20 p-6 lg:p-10">
                     <div className="max-w-6xl mx-auto space-y-10">

                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div className="flex items-center gap-6">
                                          <Link href="/clientes">
                                                 <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl glass-card">
                                                        <ChevronLeft className="w-8 h-8" />
                                                 </Button>
                                          </Link>
                                          <div>
                                                 <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">{client.name}</h1>
                                                 <div className="flex items-center gap-4 text-muted-foreground font-medium mt-1">
                                                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {client.address}</div>
                                                        {client.phone && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {client.phone}</div>}
                                                 </div>
                                          </div>
                                   </div>

                                   <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                          <Link href={`/clientes/${client.id}/resumen`} className="flex-1 md:flex-initial">
                                                 <Button variant="outline" className="h-14 w-full gap-2 px-6 rounded-2xl glass-card font-black uppercase text-[10px] tracking-widest hover:border-blue-500/50 transition-colors">
                                                        <Printer className="w-5 h-5 text-blue-500" />
                                                        Resumen PDF
                                                 </Button>
                                          </Link>
                                          <div className="flex-1 md:flex-initial">
                                                 <ClientLedgerActions client={client} />
                                          </div>
                                   </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <Card className={cn(
                                          "p-10 border-2 transition-all hover:scale-[1.01]",
                                          client.balance > 0 ? "bg-rose-500/5 border-rose-500/20 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.1)]" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                                   )}>
                                          <div className="flex justify-between items-center mb-4">
                                                 <span className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Cuenta Corriente</span>
                                                 <CreditCard className="w-6 h-6" />
                                          </div>
                                          <div className="text-6xl font-black tracking-tighter">${client.balance.toLocaleString()}</div>
                                          <p className="mt-4 text-sm font-bold opacity-60">{client.balance > 0 ? "Saldo pendiente de pago" : "Cliente al día / Saldo a favor"}</p>
                                   </Card>

                                   <Card className="p-10 border-white/10 glass-card bg-amber-500/5 border-amber-500/20 text-amber-500 hover:scale-[1.01] transition-all">
                                          <div className="flex justify-between items-center mb-4">
                                                 <span className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Envases en Posesión</span>
                                                 <Droplets className="w-6 h-6" />
                                          </div>
                                          <div className="text-6xl font-black tracking-tighter">{client.bottlesBalance} <span className="text-2xl">unid.</span></div>
                                          <p className="mt-4 text-sm font-bold opacity-60">Sifones y bidones que tiene el cliente</p>
                                   </Card>
                            </div>

                            {/* Transaction History */}
                            <div className="space-y-6">
                                   <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                                 <History className="w-5 h-5" />
                                          </div>
                                          <h2 className="text-2xl font-black tracking-tight">Movimientos Recientes</h2>
                                   </div>

                                   <div className="space-y-4">
                                          {client.transactions.length === 0 ? (
                                                 <div className="p-10 text-center border border-white/5 rounded-3xl opacity-30 italic">No hay movimientos registrados.</div>
                                          ) : (
                                                 client.transactions.map((tx: any) => (
                                                        <div key={tx.id} className="p-6 bg-card border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-white/10 transition-colors">
                                                               <div className="flex items-center gap-6 w-full md:w-auto">
                                                                      <div className={cn(
                                                                             "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                                                             tx.type === "DEBIT" ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"
                                                                      )}>
                                                                             {tx.type === "DEBIT" ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                                                                      </div>
                                                                      <div>
                                                                             <div className="font-black text-lg leading-tight uppercase tracking-tight">{tx.concept}</div>
                                                                             <div className="text-sm font-medium text-muted-foreground">{tx.description || "Sin descripción"}</div>
                                                                      </div>
                                                               </div>
                                                               <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                                      <div className="text-sm font-black text-muted-foreground flex items-center gap-2">
                                                                             <Calendar className="w-4 h-4" />
                                                                             {new Date(tx.createdAt).toLocaleDateString()}
                                                                      </div>
                                                                      <div className={cn(
                                                                             "text-2xl font-black tracking-tighter",
                                                                             tx.type === "DEBIT" ? "text-rose-500" : "text-emerald-500 text-3xl"
                                                                      )}>
                                                                             {tx.type === "DEBIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 ))
                                          )}
                                   </div>
                            </div>
                     </div>
              </div>
       );
}
