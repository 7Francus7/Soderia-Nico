import { prisma } from "@/lib/prisma";
import { Droplets, Mail, Phone, MapPin, Printer, ChevronLeft, Calendar, User, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ClientStatementPage({ params }: { params: { id: string } }) {
       const clientId = parseInt(params.id);

       const client = await prisma.client.findUnique({
              where: { id: clientId },
              include: {
                     transactions: {
                            orderBy: { createdAt: "desc" },
                            take: 50
                     }
              }
       });

       if (!client) return <div>Cliente no encontrado</div>;

       return (
              <div className="min-h-screen bg-white text-zinc-900 p-8 sm:p-20">
                     {/* Action Buttons (Hidden on Print) */}
                     <div className="max-w-4xl mx-auto mb-12 flex justify-between items-center print:hidden">
                            <Link href={`/clientes/${client.id}`}>
                                   <Button variant="ghost" className="gap-2">
                                          <ChevronLeft className="w-4 h-4" /> Volver
                                   </Button>
                            </Link>
                            <div className="flex gap-4">
                                   <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                                          <Printer className="w-4 h-4" /> Imprimir / PDF
                                   </Button>
                            </div>
                     </div>

                     {/* Document Header */}
                     <div className="max-w-4xl mx-auto border border-zinc-200 rounded-[2rem] overflow-hidden shadow-2xl print:shadow-none print:border-zinc-300">
                            <div className="bg-zinc-950 text-white p-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                                   <div className="space-y-2">
                                          <div className="flex items-center gap-3 mb-4">
                                                 <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                                                        <Droplets className="w-7 h-7 text-white" />
                                                 </div>
                                                 <h1 className="text-3xl font-black tracking-tightest">SODERÍA <span className="text-blue-500 italic">NICO</span></h1>
                                          </div>
                                          <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em]">Resumen de Cuenta Corriente</p>
                                   </div>
                                   <div className="text-right space-y-1">
                                          <p className="text-xl font-black">Nro. Ref: #ST-{client.id}-{new Date().getTime().toString().slice(-4)}</p>
                                          <p className="text-zinc-400 font-bold">{new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                   </div>
                            </div>

                            <div className="p-12 space-y-12">
                                   {/* Client Info Grid */}
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-b border-zinc-100 pb-12">
                                          <div className="space-y-4">
                                                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Datos del Cliente</p>
                                                 <div className="space-y-2">
                                                        <h2 className="text-3xl font-black tracking-tight">{client.name}</h2>
                                                        <p className="flex items-center gap-2 text-zinc-500 font-bold"><MapPin className="w-4 h-4" /> {client.address}</p>
                                                        {client.phone && <p className="flex items-center gap-2 text-zinc-500 font-bold"><Phone className="w-4 h-4" /> {client.phone}</p>}
                                                 </div>
                                          </div>
                                          <div className="bg-zinc-50 p-8 rounded-3xl space-y-4 border border-zinc-100">
                                                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Estado Financiero</p>
                                                 <div className="flex justify-between items-end">
                                                        <div>
                                                               <p className="text-xs font-bold text-zinc-500">Saldo Pendiente</p>
                                                               <h3 className="text-4xl font-black tracking-tighter text-blue-600">${client.balance.toLocaleString()}</h3>
                                                        </div>
                                                        <div className="text-right">
                                                               <p className="text-xs font-bold text-zinc-500">Envases en Calle</p>
                                                               <h3 className="text-2xl font-black tracking-tighter text-zinc-900">{client.bottlesBalance} unid.</h3>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>

                                   {/* Transactions Table */}
                                   <div className="space-y-6">
                                          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                                 <FileText className="w-4 h-4" /> Últimos Movimientos
                                          </h4>
                                          <div className="border border-zinc-100 rounded-3xl overflow-hidden">
                                                 <table className="w-full text-left border-collapse">
                                                        <thead>
                                                               <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                                      <th className="px-6 py-4">Fecha</th>
                                                                      <th className="px-6 py-4">Concepto</th>
                                                                      <th className="px-6 py-4 text-right">Debe / Haber</th>
                                                                      <th className="px-6 py-4 text-right">Monto</th>
                                                               </tr>
                                                        </thead>
                                                        <tbody className="text-sm font-bold">
                                                               {client.transactions.map((t) => (
                                                                      <tr key={t.id} className="border-b border-zinc-50 last:border-0">
                                                                             <td className="px-6 py-4 text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                                                                             <td className="px-6 py-4 truncate max-w-[200px]">{t.concept}</td>
                                                                             <td className="px-6 py-4 text-right">
                                                                                    <span className={t.type === 'DEBIT' ? 'text-rose-500' : 'text-emerald-500'}>
                                                                                           {t.type === 'DEBIT' ? 'Cargo (+)' : 'Pago (-)'}
                                                                                    </span>
                                                                             </td>
                                                                             <td className="px-6 py-4 text-right font-black">${t.amount.toLocaleString()}</td>
                                                                      </tr>
                                                               ))}
                                                               {client.transactions.length === 0 && (
                                                                      <tr>
                                                                             <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">No hay movimientos registrados recientemente.</td>
                                                                      </tr>
                                                               )}
                                                        </tbody>
                                                 </table>
                                          </div>
                                   </div>

                                   {/* Footer */}
                                   <div className="pt-12 text-center space-y-4 border-t border-zinc-100">
                                          <p className="text-xs font-bold text-zinc-400">Este documento sirve como comprobante de estado de cuenta a la fecha indicada.</p>
                                          <div className="flex justify-center gap-8">
                                                 <div className="text-center">
                                                        <div className="w-32 h-0.5 bg-zinc-200 mb-2"></div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Firma Sodería</p>
                                                 </div>
                                                 <div className="text-center">
                                                        <div className="w-32 h-0.5 bg-zinc-200 mb-2"></div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Firma Cliente</p>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                @media print {
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:shadow-none { shadow: none !important; }
                    @page { margin: 2cm; }
                }
            `}} />
              </div>
       );
}
