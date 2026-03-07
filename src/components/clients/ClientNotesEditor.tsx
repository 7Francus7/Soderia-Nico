"use client";

import { useState, useTransition } from "react";
import { StickyNote, Save, Loader2, CheckCircle, FileText, ClipboardList } from "lucide-react";
import { updateClientNotes } from "@/actions/clients";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientNotesEditor({ clientId, initialNotes }: {
       clientId: number;
       initialNotes: string | null;
}) {
       const [notes, setNotes] = useState(initialNotes || "");
       const [isPending, startTransition] = useTransition();
       const [saved, setSaved] = useState(false);

       const handleSave = () => {
              startTransition(async () => {
                     const result = await updateClientNotes(clientId, notes);
                     if (result.success) {
                            setSaved(true);
                            toast.success("Notas actualizadas", {
                                   style: { borderRadius: '1rem', fontWeight: '800' }
                            });
                            setTimeout(() => setSaved(false), 2000);
                     } else {
                            toast.error("Error al guardar", {
                                   style: { borderRadius: '1rem', fontWeight: '800' }
                            });
                     }
              });
       };

       return (
              <div className="space-y-6">
                     <div className="flex items-center gap-3 px-1">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary/40 shrink-0">
                                   <ClipboardList className="w-5 h-5 stroke-[2.5px]" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Instrucciones de Reparto</h3>
                     </div>

                     <div className="relative group">
                            <textarea
                                   value={notes}
                                   onChange={(e) => setNotes(e.target.value)}
                                   placeholder='Ej: "No tocar timbre — llamar por celular", "Cobrar solo en efectivo los lunes"...'
                                   rows={4}
                                   className="w-full bg-slate-50/50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white rounded-[2rem] p-8 text-base font-bold text-foreground placeholder-slate-200 focus:outline-none transition-all resize-none leading-relaxed shadow-inner"
                            />
                     </div>

                     <div className="flex justify-end gap-3 px-1">
                            {notes !== (initialNotes || "") && !saved && (
                                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center mr-auto">
                                          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse flex items-center gap-2">
                                                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Cambios sin guardar
                                          </span>
                                   </motion.div>
                            )}

                            <button
                                   onClick={handleSave}
                                   disabled={isPending}
                                   className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all text-[11px] font-black uppercase tracking-widest disabled:opacity-50 active:scale-95 group overflow-hidden"
                            >
                                   <AnimatePresence mode="wait">
                                          {isPending ? (
                                                 <motion.span key="loading" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin stroke-[3px]" /> Procesando
                                                 </motion.span>
                                          ) : saved ? (
                                                 <motion.span key="saved" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 stroke-[3px]" /> Sincronizado
                                                 </motion.span>
                                          ) : (
                                                 <motion.span key="save" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                                                        <Save className="w-4 h-4 stroke-[3px] group-hover:rotate-12 transition-transform" /> Aplicar Cambios
                                                 </motion.span>
                                          )}
                                   </AnimatePresence>
                            </button>
                     </div>
              </div>
       );
}
