"use client";

import { useState } from "react";
import { Printer, Download, X, Truck, MapPin, Package, DollarSign, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeliveryRoutePrintModal({ delivery, orders }: {
       delivery: any;
       orders: any[];
}) {
       const [open, setOpen] = useState(false);

       const handlePrint = () => {
              window.print();
       };

       const today = new Date().toLocaleDateString('es-AR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
       });

       const totalAmount = orders.reduce((acc, o) => acc + o.totalAmount, 0);

       return (
              <>
                     <button
                            onClick={() => setOpen(true)}
                            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest"
                     >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">Hoja de Ruta</span>
                     </button>

                     <AnimatePresence>
                            {open && (
                                   <>
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl print:hidden"
                                                 onClick={() => setOpen(false)}
                                          />
                                          <motion.div
                                                 initial={{ opacity: 0, y: "100%" }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="fixed inset-x-0 bottom-0 z-[210] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full bg-black/95 backdrop-blur-3xl border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[90vh] flex flex-col"
                                          >
                                                 {/* Header */}
                                                 <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                                                      <Printer className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-sm font-black uppercase tracking-tight text-white">Hoja de Ruta</h3>
                                                                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Reparto #{delivery.id}</p>
                                                               </div>
                                                        </div>
                                                        <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white">
                                                               <X className="w-4 h-4" />
                                                        </button>
                                                 </div>

                                                 {/* Printable Content */}
                                                 <div id="route-print" className="flex-1 overflow-y-auto p-5 space-y-4">
                                                        {/* Print Header */}
                                                        <div className="text-center py-4 border-b border-white/10">
                                                               <h1 className="text-2xl font-black uppercase tracking-tight text-white">🚚 Sodería Nico</h1>
                                                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">Hoja de Ruta — {today}</p>
                                                               <div className="flex justify-center gap-4 mt-3 text-xs font-bold text-white/60">
                                                                      <span>{orders.length} paradas</span>
                                                                      <span>·</span>
                                                                      <span>Total: ${totalAmount.toLocaleString()}</span>
                                                               </div>
                                                        </div>

                                                        {/* Stops List */}
                                                        <div className="space-y-3">
                                                               {orders.map((order, i) => (
                                                                      <div key={order.id} className="border border-white/10 rounded-xl p-4 space-y-2">
                                                                             <div className="flex items-start justify-between gap-4">
                                                                                    <div className="flex items-start gap-3">
                                                                                           <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black text-white shrink-0">
                                                                                                  {i + 1}
                                                                                           </div>
                                                                                           <div>
                                                                                                  <p className="font-black text-white tracking-tight">{order.client.name}</p>
                                                                                                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-medium mt-0.5">
                                                                                                         <MapPin className="w-3 h-3 shrink-0" />
                                                                                                         {order.client.address}
                                                                                                  </div>
                                                                                                  {order.client.phone && (
                                                                                                         <p className="text-[10px] text-primary font-bold mt-0.5">{order.client.phone}</p>
                                                                                                  )}
                                                                                           </div>
                                                                                    </div>
                                                                                    <div className="text-right shrink-0">
                                                                                           <p className="text-[8px] font-black uppercase tracking-wide text-white/30">Total</p>
                                                                                           <p className="text-lg font-black text-white tracking-tighter">${order.totalAmount.toLocaleString()}</p>
                                                                                           {order.client.balance > 0 && (
                                                                                                  <p className="text-[9px] font-black text-rose-400">Debe: ${order.client.balance.toLocaleString()}</p>
                                                                                           )}
                                                                                    </div>
                                                                             </div>

                                                                             {/* Items */}
                                                                             <div className="flex flex-wrap gap-1.5 mt-1">
                                                                                    {order.items.map((item: any) => (
                                                                                           <div key={item.id} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-[9px] font-black text-white/60">
                                                                                                  <Package className="w-2.5 h-2.5" />
                                                                                                  {item.quantity}× {item.product.name}
                                                                                           </div>
                                                                                    ))}
                                                                             </div>

                                                                             {/* Firma (for print) */}
                                                                             <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                                                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                                                           Estado: {order.status === "DELIVERED" ? "✅ Entregado" : "⏳ Pendiente"}
                                                                                    </span>
                                                                                    <div className="text-[9px] text-white/20 font-bold">Firma: __________</div>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>

                                                        {/* Totals */}
                                                        <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                                                               <div className="flex justify-between items-center">
                                                                      <span className="text-sm font-black uppercase tracking-wider text-white/60">Total del Reparto</span>
                                                                      <span className="text-2xl font-black text-white tracking-tighter">${totalAmount.toLocaleString()}</span>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 {/* Print Button */}
                                                 <div className="p-4 border-t border-white/5 shrink-0">
                                                        <button
                                                               onClick={handlePrint}
                                                               className="w-full h-12 rounded-xl bg-white text-black font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95"
                                                        >
                                                               <Printer className="w-4 h-4" />
                                                               Imprimir / Guardar PDF
                                                        </button>
                                                 </div>
                                          </motion.div>
                                   </>
                            )}
                     </AnimatePresence>
              </>
       );
}
