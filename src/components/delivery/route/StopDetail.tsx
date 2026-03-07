import { User, MapPin, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeliveryStop } from "@/types/delivery";
import { ItemDisplay } from "./ItemDisplay";
import { ActionPanel } from "./ActionPanel";

interface StopDetailProps {
       stop: DeliveryStop;
       showItems: boolean;
       onToggleItems: () => void;
       onConfirm: (data: { paymentMethod: "CASH" | "TRANSFER" | "CURRENT_ACCOUNT"; returnedBottles: number; notes?: string }) => Promise<void>;
       onIncident: (data: { type: "ABSENT" | "REJECTED" | "RESCHEDULE" | "OTHER"; reason: string }) => Promise<void>;
       onCollect: (data: { paymentMethod: "CASH" | "TRANSFER"; amount: number; notes?: string }) => Promise<void>;
       isMutating: boolean;
}

const statusConfig = {
       delivered: { icon: CheckCircle2, label: "Completado", color: "text-emerald-500 bg-emerald-50 border-emerald-100 shadow-emerald-500/10" },
       absent: { icon: XCircle, label: "Ausente", color: "text-rose-500 bg-rose-50 border-rose-100 shadow-rose-500/10" },
       pending: { icon: Clock, label: "En Espera", color: "text-amber-500 bg-amber-50 border-amber-100 shadow-amber-500/10" },
       rejected: { icon: AlertCircle, label: "Rechazado", color: "text-slate-500 bg-slate-50 border-slate-100 shadow-slate-500/10" },
};

export function StopDetail({ stop, showItems, onToggleItems, onConfirm, onIncident, onCollect, isMutating }: StopDetailProps) {
       const currentStatus = (stop.status === "confirmed" ? "pending" : stop.status).toLowerCase() as keyof typeof statusConfig;
       const config = statusConfig[currentStatus] || statusConfig.pending;

       return (
              <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-border/40 space-y-8 relative overflow-hidden">
                     <div className="flex items-center justify-between">
                            <div className={cn(
                                   "px-4 py-1.5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2",
                                   config.color
                            )}>
                                   <config.icon className="w-3 h-3" />
                                   {config.label}
                            </div>
                            <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-300 shadow-inner">
                                   <User className="w-7 h-7" />
                            </div>
                     </div>

                     <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter text-foreground leading-[1.1]">{stop.clientName}</h2>
                            <div className="flex items-start gap-2.5 text-muted-foreground/60">
                                   <div className="w-6 h-6 bg-primary/5 rounded-lg flex items-center justify-center mt-1">
                                          <MapPin className="w-3.5 h-3.5 text-primary" />
                                   </div>
                                   <span className="text-sm font-bold leading-relaxed">{stop.clientAddress}</span>
                            </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                            <div className="bg-rose-50/50 border border-rose-100/50 rounded-[2rem] p-6 shadow-inner group">
                                   <p className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-500/40 mb-1 group-hover:text-rose-500 transition-colors">Deuda Antigua</p>
                                   <div className="text-2xl font-black text-rose-600 tracking-tight tabular-nums">${stop.clientBalance.toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-50/50 border border-slate-100/50 rounded-[2rem] p-6 shadow-inner group">
                                   <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500/30 mb-1 group-hover:text-slate-500 transition-colors">Gasto Actual</p>
                                   <div className="text-2xl font-black text-slate-800 tracking-tight tabular-nums">${stop.totalAmount.toLocaleString()}</div>
                            </div>
                     </div>

                     <ItemDisplay items={stop.items} showItems={showItems} onToggle={onToggleItems} />

                     {/* Actions - Allow collection even if delivered! */}
                     <ActionPanel
                            clientName={stop.clientName}
                            clientAddress={stop.clientAddress}
                            clientPhone={stop.clientPhone}
                            onConfirm={onConfirm}
                            onIncident={onIncident}
                            onCollect={onCollect}
                            isMutating={isMutating}
                            currentBalance={stop.clientBalance}
                     />
              </div>
       );
}
