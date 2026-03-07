import { prisma } from "@/lib/prisma";
import {
       ChevronLeft, CreditCard, Droplets, History, Phone, MapPin,
       ArrowUpCircle, ArrowDownCircle, Calendar, Printer, StickyNote, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ClientLedgerActions from "@/components/clients/ClientLedgerActions";
import ClientNotesEditor from "@/components/clients/ClientNotesEditor";
import ClientTagSelector, { ClientTagBadge } from "@/components/clients/ClientTagSelector";

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
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                     <h1 className="text-2xl font-bold mb-4 text-white">Cliente no encontrado</h1>
                     <Link href="/clientes">
                            <Button variant="outline">Volver a la lista</Button>
                     </Link>
              </div>
       );

       return (
              <div className="page-container space-y-8 lg:space-y-10 text-white">

                     {/* ── HEADER ─────────────────────────────────────────── */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                   <Link href="/clientes">
                                          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shrink-0">
                                                 <ChevronLeft className="w-4 h-4" />
                                          </button>
                                   </Link>
                                   <div>
                                          <div className="flex items-center gap-3 flex-wrap">
                                                 <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{client.name}</h1>
                                                 <ClientTagBadge tag={(client as any).tag} size="lg" />
                                          </div>
                                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/40 font-medium mt-1.5">
                                                 <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 opacity-50 text-primary" />
                                                        <span>{client.address}</span>
                                                 </div>
                                                 {client.phone && (
                                                        <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                                               <Phone className="w-3.5 h-3.5 opacity-50" />
                                                               <span>{client.phone}</span>
                                                        </a>
                                                 )}
                                                 {client.zone && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                                               Zona: {client.zone}
                                                        </span>
                                                 )}
                                          </div>
                                   </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                   <Link href={`/clientes/${client.id}/resumen`} className="flex-1 sm:flex-initial">
                                          <button className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest">
                                                 <Printer className="w-4 h-4" />
                                                 <span>Resumen</span>
                                          </button>
                                   </Link>
                                   <div className="flex-1 sm:flex-initial">
                                          <ClientLedgerActions client={client} />
                                   </div>
                            </div>
                     </header>

                     {/* ── KEY BALANCES ────────────────────────────────────── */}
                     <div className="grid grid-cols-2 gap-3 sm:gap-5">
                            {/* Saldo */}
                            <div className={cn(
                                   "p-5 sm:p-7 rounded-2xl sm:rounded-[2rem] border flex flex-col",
                                   client.balance > 0
                                          ? "bg-rose-500/5 border-rose-500/15"
                                          : "bg-emerald-500/5 border-emerald-500/15"
                            )}>
                                   <div className="flex justify-between items-center mb-4">
                                          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Cuenta Cte.</p>
                                          <CreditCard className={cn("w-4 h-4", client.balance > 0 ? "text-rose-400" : "text-emerald-400")} />
                                   </div>
                                   <h3 className={cn(
                                          "text-3xl sm:text-5xl font-black tracking-tighter tabular-nums",
                                          client.balance > 0 ? "text-rose-400" : "text-emerald-400"
                                   )}>
                                          ${client.balance.toLocaleString()}
                                   </h3>
                                   <p className="text-[8px] font-bold uppercase tracking-wider opacity-30 mt-3 truncate">
                                          {client.balance > 0 ? "Pendiente de cobro" : "Sin deuda"}
                                   </p>
                            </div>

                            {/* Envases */}
                            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-[2rem] border bg-amber-500/5 border-amber-500/15 flex flex-col">
                                   <div className="flex justify-between items-center mb-4">
                                          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Envases</p>
                                          <Droplets className="w-4 h-4 text-amber-400" />
                                   </div>
                                   <h3 className="text-3xl sm:text-5xl font-black tracking-tighter tabular-nums text-amber-400">
                                          {client.bottlesBalance}
                                          <span className="text-base sm:text-xl font-medium opacity-40 ml-1">ud.</span>
                                   </h3>
                                   <p className="text-[8px] font-bold uppercase tracking-wider opacity-30 mt-3">
                                          En circulación
                                   </p>
                            </div>
                     </div>

                     {/* ── CLASIFICACIÓN + NOTAS ───────────────────────────── */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="p-5 sm:p-6 border border-white/5 bg-white/[0.02] rounded-2xl sm:rounded-[2rem]">
                                   <ClientTagSelector clientId={client.id} currentTag={(client as any).tag} />
                            </div>
                            <div className="p-5 sm:p-6 border border-white/5 bg-white/[0.02] rounded-2xl sm:rounded-[2rem]">
                                   <ClientNotesEditor clientId={client.id} initialNotes={(client as any).notes} />
                            </div>
                     </div>

                     {/* ── ÚLTIMOS PEDIDOS ─────────────────────────────────── */}
                     {client.orders.length > 0 && (
                            <section className="space-y-4">
                                   <div className="flex items-center gap-3">
                                          <h2 className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20">Últimos Pedidos</h2>
                                          <div className="h-px flex-1 bg-white/5" />
                                   </div>
                                   <div className="flex flex-col gap-2">
                                          {client.orders.map((order: any) => (
                                                 <div key={order.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                                                        <div className="flex items-center gap-3">
                                                               <div className={cn(
                                                                      "w-2 h-2 rounded-full shrink-0",
                                                                      order.paymentStatus === "PAID" ? "bg-emerald-500" : order.paymentStatus === "ON_ACCOUNT" ? "bg-amber-500" : "bg-white/20"
                                                               )} />
                                                               <div>
                                                                      <p className="text-xs font-bold text-white">
                                                                             {order.items.map((i: any) => `${i.quantity}× ${i.product.name}`).join(", ")}
                                                                      </p>
                                                                      <p className="text-[9px] font-bold text-white/30 mt-0.5">
                                                                             {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                                                      </p>
                                                               </div>
                                                        </div>
                                                        <div className="text-sm font-black tracking-tighter text-white tabular-nums">
                                                               ${order.totalAmount.toLocaleString()}
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            </section>
                     )}

                     {/* ── HISTORIAL DE MOVIMIENTOS ────────────────────────── */}
                     <section className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/30">
                                          <History className="w-4 h-4" />
                                   </div>
                                   <h2 className="text-sm font-black uppercase tracking-wide text-white/50">Historial de Movimientos</h2>
                                   <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/30">
                                          {client.transactions.length} op.
                                   </span>
                            </div>

                            <div className="space-y-2">
                                   {client.transactions.length === 0 ? (
                                          <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl text-white/20 text-sm italic">
                                                 Sin operaciones registradas.
                                          </div>
                                   ) : (
                                          client.transactions.map((tx: any) => (
                                                 <div key={tx.id} className="flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all group">
                                                        <div className={cn(
                                                               "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                                               tx.type === "DEBIT" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                                                        )}>
                                                               {tx.type === "DEBIT" ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                               <div className="font-bold text-sm text-white truncate">{tx.concept}</div>
                                                               <div className="text-[9px] font-bold text-white/30 mt-0.5 truncate">{tx.description || "Transacción procesada"}</div>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                               <div className={cn(
                                                                      "text-base font-black tracking-tighter tabular-nums",
                                                                      tx.type === "DEBIT" ? "text-rose-400" : "text-emerald-400"
                                                               )}>
                                                                      {tx.type === "DEBIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                                                               </div>
                                                               <div className="text-[8px] font-bold text-white/20 mt-0.5">
                                                                      {new Date(tx.createdAt).toLocaleDateString('es-AR')}
                                                               </div>
                                                        </div>
                                                 </div>
                                          ))
                                   )}
                            </div>
                     </section>
              </div>
       );
}
