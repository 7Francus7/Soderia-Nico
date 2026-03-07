import { prisma } from "@/lib/prisma";
import {
       ChevronLeft, CreditCard, Droplets, History, Phone, MapPin,
       ArrowUpCircle, ArrowDownCircle, Calendar, Printer, StickyNote, Tag,
       Activity, TrendingUp, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ClientLedgerActions from "@/components/clients/ClientLedgerActions";
import ClientNotesEditor from "@/components/clients/ClientNotesEditor";
import ClientTagSelector, { ClientTagBadge } from "@/components/clients/ClientTagSelector";
import { formatAR } from "@/lib/date-utils";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
       const { id } = await params;
       const clientId = parseInt(id);

       const client = await prisma.client.findUnique({
              where: { id: clientId },
              include: {
                     transactions: {
                            orderBy: { createdAt: "desc" },
                            take: 30
                     },
                     orders: {
                            where: { status: { not: "CANCELLED" } },
                            orderBy: { createdAt: "desc" },
                            take: 5,
                            include: { items: { include: { product: true } } }
                     }
              }
       });

       if (!client) return (
              <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 bg-white animate-fade-in">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 opacity-40">
                            <ChevronLeft className="w-12 h-12 text-slate-200" />
                     </div>
                     <h1 className="text-3xl font-black mb-4 text-foreground tracking-tighter">Cliente no encontrado</h1>
                     <Link href="/clientes">
                            <Button className="h-14 bg-primary text-white rounded-2xl px-10 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95">
                                   Volver a la lista
                            </Button>
                     </Link>
              </div>
       );

       return (
              <div className="flex flex-col min-h-screen bg-white animate-fade-in-up">

                     {/* iOS PREMIUM HEADER */}
                     <header className="px-6 pt-10 pb-8 sm:px-10 lg:px-16 flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                                   <div className="flex items-start gap-5">
                                          <Link href="/clientes">
                                                 <button className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary/20 transition-all shrink-0 shadow-sm active:scale-90">
                                                        <ChevronLeft className="w-7 h-7 stroke-[2.5px]" />
                                                 </button>
                                          </Link>
                                          <div className="space-y-1">
                                                 <div className="flex items-center gap-1.5 opacity-40 mb-1 px-1">
                                                        <UserCheck className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Perfil de Cliente</span>
                                                 </div>
                                                 <div className="flex items-center gap-4 flex-wrap">
                                                        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-tight">{client.name}</h1>
                                                        <ClientTagBadge tag={(client as any).tag} size="lg" />
                                                 </div>
                                                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1 opacity-60">
                                                        <div className="flex items-center gap-2">
                                                               <MapPin className="w-4 h-4 text-primary" />
                                                               <span>{client.address}</span>
                                                        </div>
                                                        {client.phone && (
                                                               <a href={`tel:${client.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                                                      <Phone className="w-4 h-4" />
                                                                      <span>{client.phone}</span>
                                                               </a>
                                                        )}
                                                        {client.zone && (
                                                               <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                                                                      Zona: {client.zone}
                                                               </span>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>

                                   <div className="flex items-center gap-3 w-full sm:w-auto">
                                          <Link href={`/clientes/${client.id}/resumen`} className="flex-1 sm:flex-initial">
                                                 <button className="w-full h-14 px-8 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95">
                                                        <Printer className="w-5 h-5 opacity-40" />
                                                        Imprimir Cta. Cte.
                                                 </button>
                                          </Link>
                                          <div className="flex-1 sm:flex-initial">
                                                 <ClientLedgerActions client={client} />
                                          </div>
                                   </div>
                            </div>
                     </header>

                     <main className="px-6 sm:px-10 lg:px-16 pb-32 space-y-12">

                            {/* BALANCES - METRIC CARDS iOS STYLE */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                   <div className={cn(
                                          "group p-10 rounded-[3rem] border-2 flex flex-col transition-all duration-300 shadow-2xl shadow-slate-200/40",
                                          client.balance > 0 ? "border-rose-50 bg-white" : "border-emerald-50 bg-white"
                                   )}>
                                          <div className="flex justify-between items-start mb-6">
                                                 <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">Deuda Corriente</p>
                                                 <div className={cn(
                                                        "w-14 h-14 rounded-[1.4rem] flex items-center justify-center transition-transform group-hover:scale-110",
                                                        client.balance > 0 ? "bg-rose-50 text-rose-500 shadow-lg shadow-rose-500/10" : "bg-emerald-50 text-emerald-500 shadow-lg shadow-emerald-500/10"
                                                 )}>
                                                        <CreditCard className="w-7 h-7 stroke-[2.5px]" />
                                                 </div>
                                          </div>
                                          <h3 className={cn(
                                                 "text-5xl sm:text-6xl font-black tracking-tighter tabular-nums leading-none",
                                                 client.balance > 0 ? "text-rose-500" : "text-emerald-500"
                                          )}>
                                                 ${client.balance.toLocaleString()}
                                          </h3>
                                          <div className="mt-6 flex items-center gap-2">
                                                 <div className={cn("w-2 h-2 rounded-full", client.balance > 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-400")} />
                                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                        {client.balance > 0 ? "Estado: Moroso con deudas" : "Estado: Cuenta al día"}
                                                 </span>
                                          </div>
                                   </div>

                                   <div className="group p-10 rounded-[3rem] border-2 border-slate-50 bg-white flex flex-col transition-all duration-300 shadow-2xl shadow-slate-200/40">
                                          <div className="flex justify-between items-start mb-6">
                                                 <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">Balance Envases</p>
                                                 <div className="w-14 h-14 rounded-[1.4rem] bg-indigo-50 text-indigo-500 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-indigo-500/10">
                                                        <Droplets className="w-7 h-7 stroke-[2.5px]" />
                                                 </div>
                                          </div>
                                          <h3 className="text-5xl sm:text-6xl font-black tracking-tighter tabular-nums leading-none text-indigo-600">
                                                 {client.bottlesBalance}
                                                 <span className="text-2xl font-black opacity-30 ml-2 tracking-widest">UN</span>
                                          </h3>
                                          <div className="mt-6 flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-indigo-300" />
                                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                        Envases en consignación
                                                 </span>
                                          </div>
                                   </div>
                            </section>

                            {/* CONFIGURATION & NOTES */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                   <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-[2.5rem] transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/20">
                                          <div className="flex items-center gap-3 mb-8">
                                                 <Tag className="w-5 h-5 text-primary opacity-40" />
                                                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Categoría</h4>
                                          </div>
                                          <ClientTagSelector clientId={client.id} currentTag={(client as any).tag} />
                                   </div>
                                   <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-[1.5rem] lg:rounded-[2.5rem] transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/20">
                                          <div className="flex items-center gap-3 mb-8">
                                                 <StickyNote className="w-5 h-5 text-primary opacity-40" />
                                                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Observaciones</h4>
                                          </div>
                                          <ClientNotesEditor clientId={client.id} initialNotes={(client as any).notes} />
                                   </div>
                            </section>

                            {/* RECENT ORDERS */}
                            {client.orders.length > 0 && (
                                   <section className="space-y-6">
                                          <div className="flex items-center justify-between px-2">
                                                 <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-primary" />
                                                        <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Últimas Compras</h3>
                                                 </div>
                                                 <div className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">{client.orders.length} pedidos</div>
                                          </div>
                                          <div className="flex flex-col gap-3">
                                                 {client.orders.map((order: any, idx) => (
                                                        <div key={order.id} className="group flex items-center justify-between p-6 lg:p-8 bg-white border border-slate-100 rounded-[2.2rem] hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-300">
                                                               <div className="flex items-center gap-6">
                                                                      <div className={cn(
                                                                             "w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                                                                             order.paymentStatus === "PAID" ? "bg-emerald-500" : order.paymentStatus === "ON_ACCOUNT" ? "bg-amber-400" : "bg-slate-200"
                                                                      )} />
                                                                      <div>
                                                                             <div className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                                                                                    {order.items.map((i: any) => `${i.quantity}× ${i.product.name}`).join(", ")}
                                                                             </div>
                                                                             <div className="text-[10px] font-black text-slate-300 mt-1 uppercase tracking-widest opacity-60">
                                                                                    <Calendar className="w-3 h-3 inline mr-1.5" />
                                                                                    {formatAR(order.createdAt, "dd 'de' MMMM, yyyy")}
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                               <div className="text-2xl font-black tracking-tighter text-foreground tabular-nums px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                                                      ${order.totalAmount.toLocaleString()}
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   </section>
                            )}

                            {/* LEDGER HISTORY */}
                            <section className="space-y-6 pt-12 border-t border-slate-50">
                                   <div className="flex items-center justify-between px-2">
                                          <div className="flex items-center gap-2">
                                                 <History className="w-5 h-5 text-primary opacity-40" />
                                                 <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Historial en Cuenta Corriente</h3>
                                          </div>
                                          <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                 {client.transactions.length} Registros
                                          </span>
                                   </div>

                                   <div className="space-y-4">
                                          {client.transactions.length === 0 ? (
                                                 <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-200 text-sm font-black uppercase tracking-widest bg-slate-50/30">
                                                        Sin actividad registrada
                                                 </div>
                                          ) : (
                                                 client.transactions.map((tx: any, idx) => (
                                                        <div key={tx.id} className="group flex items-center gap-6 p-6 lg:p-8 bg-white border border-slate-100 rounded-[2.2rem] hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-300">
                                                               <div className={cn(
                                                                      "w-12 h-12 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-sm border transition-transform group-hover:scale-110",
                                                                      tx.type === "DEBIT" ? "bg-rose-50 border-rose-100/50 text-rose-500 shadow-rose-500/5" : "bg-emerald-50 border-emerald-100/50 text-emerald-500 shadow-emerald-500/5"
                                                               )}>
                                                                      {tx.type === "DEBIT" ? <ArrowUpCircle className="w-6 h-6 stroke-[2.5px]" /> : <ArrowDownCircle className="w-6 h-6 stroke-[2.5px]" />}
                                                               </div>
                                                               <div className="flex-1 min-w-0 space-y-1">
                                                                      <div className="font-black text-lg lg:text-xl text-foreground tracking-tight group-hover:text-primary transition-colors leading-none">{tx.concept}</div>
                                                                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest opacity-60 truncate">{tx.description || "Asiento contable registrado"}</div>
                                                               </div>
                                                               <div className="shrink-0 text-right space-y-1">
                                                                      <div className={cn(
                                                                             "text-2xl lg:text-3xl font-black tracking-tighter tabular-nums px-4 py-1.5 rounded-xl",
                                                                             tx.type === "DEBIT" ? "text-rose-500 bg-rose-50/50" : "text-emerald-500 bg-emerald-50/50"
                                                                      )}>
                                                                             {tx.type === "DEBIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                                      </div>
                                                                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] opacity-40 px-4">
                                                                             {formatAR(tx.createdAt, "dd MMM")}
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 ))
                                          )}
                                   </div>
                            </section>
                     </main>
              </div>
       );
}
