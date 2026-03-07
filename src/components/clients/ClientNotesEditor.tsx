"use client";

import { useState, useTransition } from "react";
import { StickyNote, Save, Loader2, CheckCircle } from "lucide-react";
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
                            toast.success("Notas guardadas");
                            setTimeout(() => setSaved(false), 2000);
                     } else {
                            toast.error("Error al guardar");
                     }
              });
       };

       return (
              <div className="space-y-3">
                     <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                   <StickyNote className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">Notas Internas</h3>
                     </div>

                     <div className="relative">
                            <textarea
                                   value={notes}
                                   onChange={(e) => setNotes(e.target.value)}
                                   placeholder='Ej: "No tocar timbre — llamar por celular", "Paga a fin de mes", "Vive en Dpto 3B"...'
                                   rows={3}
                                   className="w-full bg-amber-500/5 border border-amber-500/10 focus:border-amber-500/30 rounded-2xl p-4 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all resize-none font-medium leading-relaxed"
                            />
                     </div>

                     <div className="flex justify-end">
                            <button
                                   onClick={handleSave}
                                   disabled={isPending}
                                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50 active:scale-95"
                            >
                                   <AnimatePresence mode="wait">
                                          {isPending ? (
                                                 <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                                        <Loader2 className="w-3 h-3 animate-spin" /> Guardando...
                                                 </motion.span>
                                          ) : saved ? (
                                                 <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                                        <CheckCircle className="w-3 h-3" /> Guardado
                                                 </motion.span>
                                          ) : (
                                                 <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                                        <Save className="w-3 h-3" /> Guardar Nota
                                                 </motion.span>
                                          )}
                                   </AnimatePresence>
                            </button>
                     </div>
              </div>
       );
}
