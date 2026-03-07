"use client";

import { useState } from "react";
import { X, Droplets, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerReturn } from "@/actions/clients";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickReturnModal({ client, onClose }: { client: any; onClose: () => void }) {
       const [quantity, setQuantity] = useState<number>(0);
       const [loading, setLoading] = useState(false);

       if (!client) return null;

       const handleReturn = async () => {
              if (quantity <= 0) return;
              setLoading(true);
              const result = await registerReturn(client.id, quantity);
              if (result.success) {
                     toast.success("Devolución registrada");
                     onClose();
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <AnimatePresence>
                     {client && (
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                   <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          onClick={onClose}
                                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                   />

                                   <motion.div
                                          initial={{ y: "100%" }}
                                          animate={{ y: 0 }}
                                          exit={{ y: "100%" }}
                                          className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                   >
                                          <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-100">
                                                               <Droplets className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-base font-bold text-foreground leading-none">Retorno de Envases</h3>
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">{client.name}</p>
                                                        </div>
                                                 </div>
                                                 <button onClick={onClose} className="rounded-full w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                                                        <X className="w-4 h-4" />
                                                 </button>
                                          </div>

                                          <div className="p-6 space-y-6">
                                                 <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-2xl text-center shadow-inner">
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-amber-600/50 mb-1">Cantidad de Envases</p>
                                                        <div className="flex items-center justify-center text-5xl font-black tracking-tighter text-amber-600">
                                                               <input
                                                                      type="number"
                                                                      autoFocus
                                                                      value={quantity || ''}
                                                                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                                                      className="bg-transparent border-none focus:outline-none w-32 text-center tabular-nums placeholder:text-amber-200"
                                                                      placeholder="0"
                                                               />
                                                        </div>
                                                        <div className="mt-3 flex justify-center gap-2">
                                                               {[1, 2, 6, 10].map(n => (
                                                                      <button
                                                                             key={n}
                                                                             onClick={() => setQuantity(n)}
                                                                             className="px-3 py-1 rounded-lg bg-white border border-amber-200 text-amber-600 text-[10px] font-bold hover:bg-amber-100 transition-all"
                                                                      >
                                                                             {n}
                                                                      </button>
                                                               ))}
                                                        </div>
                                                 </div>

                                                 <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
                                                        <div className="space-y-0.5">
                                                               <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Balance Actual</p>
                                                               <p className="text-xl font-black tabular-nums tracking-tighter">{client.bottlesBalance} unid.</p>
                                                        </div>
                                                        <div className="text-right">
                                                               <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Restante</p>
                                                               <p className="text-xl font-black tabular-nums tracking-tighter text-amber-400">{client.bottlesBalance - quantity}</p>
                                                        </div>
                                                 </div>

                                                 <Button
                                                        disabled={loading || quantity <= 0}
                                                        onClick={handleReturn}
                                                        className="w-full h-14 bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-500/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-95 group transition-all"
                                                 >
                                                        {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : (
                                                               <span className="flex items-center gap-2 text-white">
                                                                      Confirmar Devolución
                                                                      <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                                                               </span>
                                                        )}
                                                 </Button>
                                          </div>
                                   </motion.div>
                            </div>
                     )}
              </AnimatePresence>
       );
}
