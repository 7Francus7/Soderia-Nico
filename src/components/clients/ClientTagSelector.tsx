"use client";

import { useState, useTransition } from "react";
import { Star, AlertTriangle, Zap, X } from "lucide-react";
import { updateClientTag } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TAGS = [
       { value: "VIP", label: "VIP", icon: Star, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20 hover:bg-yellow-400/20" },
       { value: "FRECUENTE", label: "Frecuente", icon: Zap, color: "text-blue-400 bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20" },
       { value: "MOROSO", label: "Moroso", icon: AlertTriangle, color: "text-rose-400 bg-rose-400/10 border-rose-400/20 hover:bg-rose-400/20" },
];

export function ClientTagBadge({ tag, size = "sm" }: { tag: string | null; size?: "sm" | "lg" }) {
       if (!tag) return null;
       const config = TAGS.find(t => t.value === tag);
       if (!config) return null;

       return (
              <div className={cn(
                     "inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-wider",
                     config.color,
                     size === "sm" ? "px-2 py-0.5 text-[8px]" : "px-3 py-1.5 text-[10px]"
              )}>
                     <config.icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
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
                            toast.success(newTag ? `Tag "${newTag}" aplicado` : "Tag removido");
                     } else {
                            toast.error("Error al guardar tag");
                            setActiveTag(activeTag); // revert
                     }
              });
       };

       return (
              <div className="space-y-3">
                     <div className="flex items-center gap-3">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">Clasificación</h3>
                            {isPending && <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />}
                     </div>

                     <div className="flex flex-wrap gap-2">
                            {TAGS.map((tag) => {
                                   const isActive = activeTag === tag.value;
                                   return (
                                          <motion.button
                                                 key={tag.value}
                                                 onClick={() => handleTag(tag.value)}
                                                 whileTap={{ scale: 0.95 }}
                                                 className={cn(
                                                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-200",
                                                        tag.color,
                                                        isActive ? "ring-1 ring-current shadow-lg scale-105" : "opacity-50 hover:opacity-100"
                                                 )}
                                          >
                                                 <tag.icon className="w-3.5 h-3.5" />
                                                 {tag.label}
                                                 {isActive && <X className="w-3 h-3 ml-1 opacity-60" />}
                                          </motion.button>
                                   );
                            })}
                     </div>
              </div>
       );
}
