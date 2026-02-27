"use client";

import { useState } from "react";
import { X, DollarSign, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerPayment } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function QuickPaymentModal({ client, onClose }: { client: any; onClose: () => void }) {
       const [amount, setAmount] = useState<number>(0);
       const [loading, setLoading] = useState(false);

       if (!client) return null;

       const handlePayment = async () => {
              if (amount <= 0) return;
              setLoading(true);
              const result = await registerPayment(client.id, amount, "Pago rápido desde lista de deudores");
              if (result.success) {
                     toast.success("Pago registrado con éxito");
                     onClose();
              } else {
                     toast.error("Error al registrar: " + result.error);
              }
              setLoading(false);
       };

       const setFullPayment = () => setAmount(client.balance);

       return (
              <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                     <div className="bg-card w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                            <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                   <div>
                                          <h3 className="text-2xl font-black italic uppercase tracking-tighter">Cobro Rápido</h3>
                                          <p className="text-sm font-bold opacity-50">{client.name}</p>
                                   </div>
                                   <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl">
                                          <X className="w-6 h-6" />
                                   </Button>
                            </div>

                            <div className="p-8 space-y-8">
                                   <div className="bg-muted/10 p-8 rounded-[2rem] border border-white/5 text-center relative overflow-hidden group">
                                          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Importe a Cobrar</p>
                                          <div className="flex items-center justify-center text-6xl font-black tracking-tighter">
                                                 <span className="text-2xl opacity-20 mt-2 mr-1">$</span>
                                                 <input
                                                        type="number"
                                                        autoFocus
                                                        value={amount || ''}
                                                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                                        className="bg-transparent border-none focus:outline-none w-40 text-center"
                                                        placeholder="0"
                                                 />
                                          </div>

                                          <button
                                                 onClick={setFullPayment}
                                                 className="mt-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-colors"
                                          >
                                                 Cargar Total: ${client.balance.toLocaleString()}
                                          </button>
                                   </div>

                                   <div className="flex gap-4">
                                          <Button
                                                 disabled={loading || amount <= 0}
                                                 onClick={handlePayment}
                                                 className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20"
                                          >
                                                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "CONFIRMAR COBRO"}
                                          </Button>
                                   </div>
                            </div>
                     </div>
              </div>
       );
}
