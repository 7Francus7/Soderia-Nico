"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, XCircle, MessageCircle, Wallet, History, Loader2, X, Info, AlertTriangle, Calendar, Ban, Banknote, Landmark, User } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActionPanelProps {
       clientName: string;
       clientAddress: string;
       clientPhone?: string;
       onConfirm: (data: { paymentMethod: "CASH" | "TRANSFER" | "CURRENT_ACCOUNT"; returnedBottles: number; notes?: string }) => Promise<void>;
       onIncident: (data: { type: "ABSENT" | "REJECTED" | "RESCHEDULE" | "OTHER"; reason: string }) => Promise<void>;
       onCollect: (data: { paymentMethod: "CASH" | "TRANSFER"; amount: number; notes?: string }) => Promise<void>;
       isMutating: boolean;
       currentBalance: number;
}

export function ActionPanel({ clientName, clientAddress, clientPhone, onConfirm, onIncident, onCollect, isMutating, currentBalance }: ActionPanelProps) {
       const [showConfirmModal, setShowConfirmModal] = useState(false);
       const [showIncidentModal, setShowIncidentModal] = useState(false);
       const [showCollectModal, setShowCollectModal] = useState(false);

       // Confirm States
       const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER" | "CURRENT_ACCOUNT">("CASH");
       const [returnedBottles, setReturnedBottles] = useState(0);
       const [notes, setNotes] = useState("");

       // Incident States
       const [incidentType, setIncidentType] = useState<"ABSENT" | "REJECTED" | "RESCHEDULE" | "OTHER">("ABSENT");
       const [incidentReason, setIncidentReason] = useState("");

       // Collection States
       const [collectAmount, setCollectAmount] = useState<string>("");
       const [collectMethod, setCollectMethod] = useState<"CASH" | "TRANSFER">("CASH");
       const [collectNotes, setCollectNotes] = useState("");

       const handleWhatsApp = () => {
              if (!clientPhone) {
                     toast.error("Este cliente no tiene teléfono registrado");
                     return;
              }
              const msg = `Hola ${clientName}! Soy del reparto de Sodería Nico. Paso en unos minutos por ${clientAddress}.`;
              window.open(`https://wa.me/${clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
       };

       const handleConfirmFinal = async () => {
              await onConfirm({ paymentMethod, returnedBottles, notes: notes || undefined });
              setShowConfirmModal(false);
       };

       const handleIncidentFinal = async () => {
              if (!incidentReason || incidentReason.length < 3) {
                     toast.error("Por favor ingresa un motivo válido");
                     return;
              }
              await onIncident({ type: incidentType, reason: incidentReason });
              setShowIncidentModal(false);
              setIncidentReason("");
       };

       const handleCollectFinal = async () => {
              const amount = parseFloat(collectAmount);
              if (isNaN(amount) || amount <= 0) {
                     toast.error("Ingresa un monto válido");
                     return;
              }
              await onCollect({ paymentMethod: collectMethod, amount, notes: collectNotes || undefined });
              setShowCollectModal(false);
              setCollectAmount("");
       };

       return (
              <div className="space-y-4 pt-6">
                     <Button
                            onClick={() => setShowConfirmModal(true)}
                            disabled={isMutating}
                            className="w-full h-18 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 font-bold text-lg uppercase tracking-wider gap-4 transition-all"
                     >
                            <Check className="w-6 h-6 stroke-[3px]" />
                            Confirmar Entrega
                     </Button>

                     <div className="grid grid-cols-3 gap-3">
                            <Button
                                   onClick={() => setShowCollectModal(true)}
                                   disabled={isMutating}
                                   variant="outline"
                                   className="h-16 rounded-xl flex flex-col gap-1.5 py-2 border-warning/20 bg-warning/5 text-warning hover:bg-warning/10 hover:border-warning/30"
                            >
                                   <Banknote className="w-5 h-5" />
                                   <span className="text-[10px] font-bold uppercase tracking-widest">Cobrar</span>
                            </Button>
                            <Button
                                   onClick={() => setShowIncidentModal(true)}
                                   disabled={isMutating}
                                   variant="outline"
                                   className="h-16 rounded-xl flex flex-col gap-1.5 py-2 border-danger/20 bg-danger/5 text-danger hover:bg-danger/10 hover:border-danger/30"
                            >
                                   <XCircle className="w-5 h-5" />
                                   <span className="text-[10px] font-bold uppercase tracking-widest">Incidencia</span>
                            </Button>
                            <Button
                                   onClick={handleWhatsApp}
                                   variant="outline"
                                   className="h-16 rounded-xl flex flex-col gap-1.5 py-2 border-success/20 bg-success/5 text-success hover:bg-success/10 hover:border-success/30"
                            >
                                   <MessageCircle className="w-5 h-5" />
                                   <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
                            </Button>
                     </div>

                     {/* MODALS */}
                     <AnimatePresence>
                            {(showConfirmModal || showIncidentModal || showCollectModal) && (
                                   <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-0 lg:p-10">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => { setShowConfirmModal(false); setShowIncidentModal(false); setShowCollectModal(false); }}
                                                 className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-xl border border-border flex flex-col overflow-hidden max-h-[95vh]"
                                          >
                                                 {/* Modal Header */}
                                                 <div className="p-6 border-b border-border bg-white flex items-center justify-between sticky top-0 z-10">
                                                        <div className="flex flex-col">
                                                               <h3 className="text-xl font-bold tracking-tight text-foreground">
                                                                      {showConfirmModal ? "Finalizar Entrega" : showCollectModal ? "Registrar Cobranza" : "Registrar Incidencia"}
                                                               </h3>
                                                               <span className="text-xs font-medium text-muted-foreground">{clientName}</span>
                                                        </div>
                                                        <button
                                                               onClick={() => { setShowConfirmModal(false); setShowIncidentModal(false); setShowCollectModal(false); }}
                                                               className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                                        >
                                                               <X className="w-5 h-5" />
                                                        </button>
                                                 </div>

                                                 <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                                                        {showConfirmModal && (
                                                               <>
                                                                      <div className="space-y-4">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Forma de Pago</label>
                                                                             <div className="grid grid-cols-1 gap-2">
                                                                                    {["CASH", "TRANSFER", "CURRENT_ACCOUNT"].map((m) => (
                                                                                           <button
                                                                                                  key={m}
                                                                                                  onClick={() => setPaymentMethod(m as any)}
                                                                                                  className={cn(
                                                                                                         "h-14 rounded-xl border px-5 flex items-center justify-between transition-all",
                                                                                                         paymentMethod === m ? "border-primary bg-primary/5 text-primary" : "border-border bg-white text-muted-foreground hover:bg-secondary"
                                                                                                  )}
                                                                                           >
                                                                                                  <span className="font-semibold text-sm">{m === "CASH" ? "Efectivo" : m === "TRANSFER" ? "Transferencia" : "Cuenta Corriente"}</span>
                                                                                                  {paymentMethod === m && <Check className="w-5 h-5" />}
                                                                                           </button>
                                                                                    ))}
                                                                             </div>
                                                                      </div>
                                                                      <div className="space-y-4">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Envases Retornados</label>
                                                                             <div className="flex items-center justify-between p-4 bg-secondary rounded-2xl border border-border/50">
                                                                                    <button onClick={() => setReturnedBottles(Math.max(0, returnedBottles - 1))} className="w-12 h-12 bg-white border border-border rounded-xl flex items-center justify-center text-foreground font-bold text-xl transition-all active:scale-90">-</button>
                                                                                    <span className="text-3xl font-extrabold tracking-tighter">{returnedBottles}</span>
                                                                                    <button onClick={() => setReturnedBottles(returnedBottles + 1)} className="w-12 h-12 bg-white border border-border rounded-xl flex items-center justify-center text-primary font-bold text-xl transition-all active:scale-90">+</button>
                                                                             </div>
                                                                      </div>
                                                                      <div className="space-y-2">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Observaciones</label>
                                                                             <input type="text" placeholder="Notas internas..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm font-medium focus:border-primary focus:bg-white transition-all outline-none" />
                                                                      </div>
                                                               </>
                                                        )}

                                                        {showCollectModal && (
                                                               <>
                                                                      <div className="space-y-4">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monto a Cobrar</label>
                                                                             <div className="relative">
                                                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">$</span>
                                                                                    <input
                                                                                           type="number"
                                                                                           placeholder="0.00"
                                                                                           value={collectAmount}
                                                                                           onChange={(e) => setCollectAmount(e.target.value)}
                                                                                           className="w-full h-20 bg-white border border-border rounded-2xl pl-12 pr-6 text-4xl font-extrabold tracking-tighter text-foreground placeholder:text-muted/20 outline-none focus:border-warning"
                                                                                    />
                                                                             </div>
                                                                             <div className="flex flex-wrap gap-2">
                                                                                    {[1000, 2000, 5000].map(m => (
                                                                                           <button key={m} onClick={() => setCollectAmount(m.toString())} className="px-3 py-1.5 bg-secondary hover:bg-warning/10 hover:text-warning border border-border rounded-full text-[10px] font-bold text-muted-foreground transition-all">+${m}</button>
                                                                                    ))}
                                                                                    <button onClick={() => setCollectAmount(currentBalance.toString())} className="px-3 py-1.5 bg-warning text-white rounded-full text-[10px] font-bold shadow-sm">Saldo Total</button>
                                                                             </div>
                                                                      </div>
                                                                      <div className="space-y-2">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Método</label>
                                                                             <div className="grid grid-cols-2 gap-2">
                                                                                    <button onClick={() => setCollectMethod("CASH")} className={cn("h-14 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all", collectMethod === "CASH" ? "border-warning bg-warning/5 text-warning" : "border-border bg-white text-muted-foreground")}>
                                                                                           <Banknote className="w-4 h-4" /> Efectivo
                                                                                    </button>
                                                                                    <button onClick={() => setCollectMethod("TRANSFER")} className={cn("h-14 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all", collectMethod === "TRANSFER" ? "border-warning bg-warning/5 text-warning" : "border-border bg-white text-muted-foreground")}>
                                                                                           <Landmark className="w-4 h-4" /> Transf.
                                                                                    </button>
                                                                             </div>
                                                                      </div>
                                                               </>
                                                        )}

                                                        {showIncidentModal && (
                                                               <>
                                                                      <div className="grid grid-cols-2 gap-2">
                                                                             {[
                                                                                    { id: "ABSENT", label: "Ausente", icon: User },
                                                                                    { id: "REJECTED", label: "Rechazado", icon: Ban },
                                                                                    { id: "RESCHEDULE", label: "Volver", icon: Calendar },
                                                                                    { id: "OTHER", label: "Otro", icon: Info }
                                                                             ].map((t) => (
                                                                                    <button
                                                                                           key={t.id}
                                                                                           onClick={() => setIncidentType(t.id as any)}
                                                                                           className={cn(
                                                                                                  "h-16 rounded-xl border p-3 flex flex-col items-center justify-center gap-1 transition-all",
                                                                                                  incidentType === t.id ? "border-danger bg-danger/5 text-danger font-bold" : "border-border bg-white text-muted-foreground"
                                                                                           )}
                                                                                    >
                                                                                           <t.icon className="w-4 h-4" />
                                                                                           <span className="text-[10px] uppercase tracking-widest">{t.label}</span>
                                                                                    </button>
                                                                             ))}
                                                                      </div>
                                                                      <div className="space-y-2">
                                                                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detalle del motivo</label>
                                                                             <textarea
                                                                                    placeholder="¿Qué sucedió?"
                                                                                    value={incidentReason}
                                                                                    onChange={(e) => setIncidentReason(e.target.value)}
                                                                                    className="w-full h-32 bg-secondary/30 border border-border rounded-xl p-4 text-sm font-medium resize-none focus:bg-white focus:border-danger outline-none"
                                                                             />
                                                                      </div>
                                                               </>
                                                        )}
                                                 </div>

                                                 {/* Modal Footer */}
                                                 <div className="p-6 border-t border-border bg-white sticky bottom-0">
                                                        <Button
                                                               onClick={showConfirmModal ? handleConfirmFinal : showCollectModal ? handleCollectFinal : handleIncidentFinal}
                                                               disabled={isMutating}
                                                               className={cn(
                                                                      "w-full h-14 rounded-xl text-white font-bold text-base transition-all",
                                                                      showConfirmModal ? "bg-success hover:bg-success/90" : showCollectModal ? "bg-warning hover:bg-warning/90" : "bg-danger hover:bg-danger/90"
                                                               )}
                                                        >
                                                               {isMutating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                                      <span className="flex items-center gap-2">
                                                                             <Check className="w-5 h-5 stroke-[3px]" />
                                                                             {showConfirmModal ? "Confirmar Todo" : showCollectModal ? "Registrar Pago" : "Guardar Incidencia"}
                                                                      </span>
                                                               )}
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </div>
       );
}
