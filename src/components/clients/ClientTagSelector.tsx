"use client";

import { useState, useTransition } from "react";
import { Star, AlertTriangle, Zap, X, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
import { updateClientTag } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TAGS = [
       { value: "VIP", label: "VIP", icon: Star, color: "text-amber-500 bg-amber-50 border-amber-100 hover:bg-amber-100/50 shadow-amber-500/5" },
       { value: "FRECUENTE", label: "Frecuente", icon: Zap, color: "text-primary bg-primary/5 border-primary/10 hover:bg-primary/10 shadow-primary/5" },
       { value: "MOROSO", label: "Moroso", icon: AlertCircle, color: "text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100/50 shadow-rose-500/5" },
];

export function ClientTagBadge({ tag, size = "sm" }: { tag: string | null; size?: "sm" | "lg" }) {
       if (!tag) return null;
       const config = TAGS.find(t => t.value === tag);
       if (!config) return null;

       return (
              <div className={cn(
                     "inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-[0.1em] shadow-sm",
                     config.color,
                     size === "sm" ? "px-3 py-1 text-[8px]" : "px-4 py-2 text-[10px]"
              )}>
                     <config.icon className={cn("stroke-[3px]", size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5")} />
                     {config.label}
              </div>
       );
}

export default function ClientTagSelector({ clientId, currentTag }: {
       clientId: number;
       currentTag: string | null;
}) {
       const [activeTag, setActiveTag] = useState(currentTag);
       const [isPending, startTransition] = useTransition();

       const handleTag = (value: string) => {
              const newTag = activeTag === value ? null : value;
              startTransition(async () => {
                     setActiveTag(newTag);
                     const result = await updateClientTag(clientId, newTag);
                     if (result.success) {
                            toast.success(newTag ? `Etiqueta "${newTag}" aplicada` : "Etiqueta removida", {
                                   style: { borderRadius: '1rem', fontWeight: '800' }
                            });
                     } else {
                            toast.error("Error al guardar etiqueta", {
                                   style: { borderRadius: '1rem', fontWeight: '800' }
                            });
                            setActiveTag(activeTag); // revert
                     }
              });
       };

       return (
              <div className="space-y-6">
                     <div className="flex items-center gap-3 px-1">
                            <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Clasificación Estratégica</h3>
                            {isPending && <div className="w-3.5 h-3.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />}
                     </div>

                     <div className="flex flex-wrap gap-3">
                            {TAGS.map((tag) => {
                                   const isActive = activeTag === tag.value;
                                   return (
                                          <motion.button
                                                 key={tag.value}
                                                 onClick={() => handleTag(tag.value)}
                                                 whileTap={{ scale: 0.95 }}
                                                 className={cn(
                                                        "flex items-center gap-3 px-6 py-4 rounded-2xl border font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm",
                                                        tag.color,
                                                        isActive ? "ring-2 ring-current shadow-xl scale-[1.05] border-transparent" : "opacity-40 hover:opacity-100 hover:scale-[1.02]"
                                                 )}
                                          >
                                                 <tag.icon className="w-4 h-4 stroke-[2.5px]" />
                                                 {tag.label}
                                                 {isActive && <X className="w-4 h-4 ml-1 opacity-40 hover:opacity-100 transition-opacity" />}
                                          </motion.button>
                                   );
                            })}
                     </div>
              </div>
       );
}
