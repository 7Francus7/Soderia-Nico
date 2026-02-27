import { prisma } from "@/lib/prisma";
import { ChevronLeft, CreditCard, Droplets, History, Phone, MapPin, ArrowUpCircle, ArrowDownCircle, Calendar, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ClientLedgerActions from "@/components/clients/ClientLedgerActions";

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
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                     <h1 className="text-2xl font-bold mb-4">Cliente no encontrado</h1>
                     <Link href="/clientes">
                            <Button variant="outline">Volver a la lista</Button>
                     </Link>
              </div>
       );

       return (
              <div className="space-y-12 animate-fade-in-up">
                     {/* Back Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="flex items-center gap-6">
                                   <Link href="/clientes">
                                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-border">
                                                 <ChevronLeft className="w-5 h-5" />
                                          </Button>
                                   </Link>
                                   <div>
                                          <div className="flex items-center gap-3">
                                                 <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                                                 <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/10">ID: {client.id}</span>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground font-medium mt-1">
                                                 <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 opacity-40" /> {client.address}</div>
                                                 {client.phone && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4 opacity-40" /> {client.phone}</div>}
                                          </div>
                                   </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                   <Link href={`/clientes/${client.id}/resumen`} className="flex-1 md:flex-initial">
                                          <Button variant="outline" className="w-full gap-2 rounded-xl">
                                                 <Printer className="w-4 h-4" />
                                                 <span className="text-xs uppercase font-bold tracking-wider">Resumen</span>
                                          </Button>
                                   </Link>
                                   <div className="flex-1 md:flex-initial">
                                          <ClientLedgerActions client={client} />
                                   </div>
                            </div>
                     </header>

                     {/* Key Balances Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className={cn(
                                   "p-8 border-border bg-card shadow-sm rounded-2xl",
                                   client.balance > 0 ? "border-rose-500/10" : "border-emerald-500/10"
                            )}>
                                   <div className="flex justify-between items-center mb-6">
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Saldo Cuenta Corriente</p>
                                          <CreditCard className={cn("w-4 h-4", client.balance > 0 ? "text-rose-500" : "text-emerald-500")} />
                                   </div>
                                   <h3 className={cn("text-5xl font-bold tracking-tighter", client.balance > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")}>
                                          ${client.balance.toLocaleString()}
                                   </h3>
                                   <p className="mt-4 text-xs font-semibold text-muted-foreground opacity-60">
                                          {client.balance > 0 ? "Pendiente de regularización" : "Sin deuda / Saldo a favor"}
                                   </p>
                            </Card>

                            <Card className="p-8 border-border bg-card shadow-sm rounded-2xl">
                                   <div className="flex justify-between items-center mb-6">
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Envases en la Calle</p>
                                          <Droplets className="w-4 h-4 text-amber-500" />
                                   </div>
                                   <h3 className="text-5xl font-bold tracking-tighter text-amber-600 dark:text-amber-400">
                                          {client.bottlesBalance} <span className="text-2xl font-medium opacity-40">unid.</span>
                                   </h3>
                                   <p className="mt-4 text-xs font-semibold text-muted-foreground opacity-60">Sifones y bidones bajo custodia del cliente</p>
                            </Card>
                     </div>

                     {/* Ledger / History */}
                     <section className="pt-12 border-t border-border">
                            <div className="flex items-center gap-3 mb-8">
                                   <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                                          <History className="w-4 h-4" />
                                   </div>
                                   <h2 className="text-xl font-bold tracking-tight">Historial de Movimientos</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                   {client.transactions.length === 0 ? (
                                          <div className="p-12 text-center border border-dashed border-border rounded-2xl text-muted-foreground text-sm italic">
                                                 No se registran operaciones históricas.
                                          </div>
                                   ) : (
                                          client.transactions.map((tx: any) => (
                                                 <Card key={tx.id} className="p-6 bg-card border-border shadow-sm rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-primary/20 transition-all duration-300">
                                                        <div className="flex items-center gap-5 w-full md:w-auto">
                                                               <div className={cn(
                                                                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                                                      tx.type === "DEBIT" ? "bg-rose-500/5 text-rose-500 border-rose-500/10" : "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                                                               )}>
                                                                      {tx.type === "DEBIT" ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                                                               </div>
                                                               <div>
                                                                      <div className="font-bold text-base leading-tight tracking-tight">{tx.concept}</div>
                                                                      <div className="text-xs font-medium text-muted-foreground mt-0.5">{tx.description || "Transacción procesada"}</div>
                                                               </div>
                                                        </div>
                                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                                               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                                      <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                                      {new Date(tx.createdAt).toLocaleDateString()}
                                                               </div>
                                                               <div className={cn(
                                                                      "text-xl font-bold tracking-tighter",
                                                                      tx.type === "DEBIT" ? "text-rose-600" : "text-emerald-600"
                                                               )}>
                                                                      {tx.type === "DEBIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                               </div>
                                                        </div>
                                                 </Card>
                                          ))
                                   )}
                            </div>
                     </section>
              </div>
       );
}
