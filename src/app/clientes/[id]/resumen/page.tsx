import { prisma } from "@/lib/prisma";
import { Droplets, Phone, MapPin, Printer, ChevronLeft, FileText } from "lucide-react";
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

       if (!client) return (
              <div className="flex flex-col items-center justify-center min-h-screen">
                     <p className="font-bold">Cliente no encontrado</p>
                     <Link href="/clientes">
                            <Button variant="outline" className="mt-4">Volver</Button>
                     </Link>
              </div>
       );

       return (
              <div className="min-h-screen bg-white text-zinc-900 p-6 sm:p-20 font-sans">
                     {/* Action Buttons (Hidden on Print) */}
                     <div className="max-w-4xl mx-auto mb-12 flex justify-between items-center print:hidden">
                            <Link href={`/clientes/${client.id}`}>
                                   <Button variant="ghost" size="sm" className="gap-2 rounded-xl border border-zinc-100">
                                          <ChevronLeft className="w-4 h-4" /> Volver
                                   </Button>
                            </Link>
                            <Button variant="default" size="sm" className="gap-2 rounded-xl px-6" onClick={() => window.print()}>
                                   <Printer className="w-4 h-4" /> Imprimir / Exportar PDF
                            </Button>
                     </div>

                     {/* Document Layout */}
                     <div className="max-w-4xl mx-auto border border-zinc-100 rounded-3xl overflow-hidden shadow-sm shadow-zinc-200/50 print:shadow-none print:border-zinc-300">
                            {/* Company Branding */}
                            <div className="bg-zinc-900 text-white p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                                   <div className="flex items-center gap-5">
                                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                                                 <Droplets className="w-7 h-7 text-zinc-900" />
                                          </div>
                                          <div>
                                                 <h1 className="text-2xl font-bold tracking-tight">SODERÍA NICO</h1>
                                                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Rosario, Santa Fe</p>
                                          </div>
                                   </div>
                                   <div className="text-right">
                                          <p className="text-sm font-bold tracking-tight text-white/90">Resumen de Cuenta Corriente</p>
                                          <p className="text-xs font-medium text-zinc-400 mt-1">{new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                   </div>
                            </div>

                            <div className="p-10 space-y-12">
                                   {/* Client Header Info */}
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-b border-zinc-100 pb-12">
                                          <div className="space-y-4">
                                                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Información del Cliente</p>
                                                 <div className="space-y-1">
                                                        <h2 className="text-2xl font-bold tracking-tight">{client.name}</h2>
                                                        <p className="flex items-center gap-2 text-zinc-500 text-sm font-medium"><MapPin className="w-3.5 h-3.5 opacity-40" /> {client.address}</p>
                                                        {client.phone && <p className="flex items-center gap-2 text-zinc-500 text-sm font-medium"><Phone className="w-3.5 h-3.5 opacity-40" /> {client.phone}</p>}
                                                 </div>
                                          </div>
                                          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 flex flex-col justify-center">
                                                 <div className="flex justify-between items-center mb-4">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Balance Actual</p>
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase border border-blue-500/10">ID: {client.id}</span>
                                                 </div>
                                                 <div className="flex justify-between items-end">
                                                        <div>
                                                               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Saldo a Pagar</p>
                                                               <h3 className="text-4xl font-bold tracking-tighter text-zinc-900">${client.balance.toLocaleString()}</h3>
                                                        </div>
                                                        <div className="text-right">
                                                               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Envases</p>
                                                               <h3 className="text-xl font-bold tracking-tighter text-zinc-900">{client.bottlesBalance} unid.</h3>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>

                                   {/* Detailed History */}
                                   <div className="space-y-6">
                                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                                 <FileText className="w-4 h-4 opacity-40" /> Últimos 50 Movimientos Registrados
                                          </h4>
                                          <div className="border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                                                 <table className="w-full text-left border-collapse">
                                                        <thead>
                                                               <tr className="bg-zinc-50 border-b border-zinc-100 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                                                                      <th className="px-6 py-4">Fecha</th>
                                                                      <th className="px-6 py-4">Concepto</th>
                                                                      <th className="px-6 py-4 text-center">Tipo</th>
                                                                      <th className="px-6 py-4 text-right">Monto</th>
                                                               </tr>
                                                        </thead>
                                                        <tbody className="text-xs font-medium text-zinc-700">
                                                               {client.transactions.map((t) => (
                                                                      <tr key={t.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                                                                             <td className="px-6 py-4 text-zinc-400 tabular-nums">{new Date(t.createdAt).toLocaleDateString()}</td>
                                                                             <td className="px-6 py-4 font-bold">{t.concept}</td>
                                                                             <td className="px-6 py-4 text-center">
                                                                                    <span className={t.type === 'DEBIT' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                                                                                           {t.type === 'DEBIT' ? '(+) CARGO' : '(-) PAGO'}
                                                                                    </span>
                                                                             </td>
                                                                             <td className="px-6 py-4 text-right font-bold text-zinc-900 tabular-nums">${t.amount.toLocaleString()}</td>
                                                                      </tr>
                                                               ))}
                                                               {client.transactions.length === 0 && (
                                                                      <tr>
                                                                             <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">No se registran movimientos para este periodo.</td>
                                                                      </tr>
                                                               )}
                                                        </tbody>
                                                 </table>
                                          </div>
                                   </div>

                                   {/* Document Footer Signature */}
                                   <div className="pt-20 grid grid-cols-2 gap-20">
                                          <div className="flex flex-col items-center">
                                                 <div className="w-full h-px bg-zinc-200 mb-2"></div>
                                                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Responsable Sodería</p>
                                          </div>
                                          <div className="flex flex-col items-center">
                                                 <div className="w-full h-px bg-zinc-200 mb-2"></div>
                                                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Conformidad del Cliente</p>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                                   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                                   body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
                                   @media print {
                                          body { background: white !important; margin: 0; padding: 0.5cm; }
                                          .print\\:hidden { display: none !important; }
                                          .print\\:shadow-none { box-shadow: none !important; }
                                          @page { margin: 1cm; size: auto; }
                                   }
                            `}} />
              </div>
       );
}
