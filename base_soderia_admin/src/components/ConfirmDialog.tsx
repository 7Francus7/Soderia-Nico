import { AlertTriangle, Info, AlertCircle, X } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
       isOpen: boolean;
       title: string;
       message: string;
       confirmLabel?: string;
       cancelLabel?: string;
       variant?: "danger" | "warning" | "info";
       onConfirm: () => void;
       onCancel: () => void;
}

export default function ConfirmDialog({
       isOpen,
       title,
       message,
       confirmLabel = "Confirmar",
       cancelLabel = "Cancelar",
       variant = "danger",
       onConfirm,
       onCancel,
}: ConfirmDialogProps) {
       if (!isOpen) return null;

       const variants = {
              danger: {
                     icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
                     iconBg: "bg-red-50",
                     btn: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-600/20",
                     title: "text-red-900"
              },
              warning: {
                     icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
                     iconBg: "bg-amber-50",
                     btn: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/20",
                     title: "text-amber-900"
              },
              info: {
                     icon: <Info className="w-6 h-6 text-blue-600" />,
                     iconBg: "bg-blue-50",
                     btn: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20",
                     title: "text-blue-900"
              },
       };

       const current = variants[variant];

       return (
              <div
                     className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
                     onClick={onCancel}
              >
                     <div
                            className="bg-white rounded-[2rem] w-full max-w-sm p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-slate-100 animate-scale-in relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                     >
                            {/* Decorative Background */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${current.iconBg} rounded-bl-full opacity-30 -mr-10 -mt-10`} />

                            {/* Close Button */}
                            <button
                                   onClick={onCancel}
                                   className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
                            >
                                   <X className="w-4 h-4" />
                            </button>

                            {/* Content */}
                            <div className="relative z-10">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${current.iconBg} shadow-inner`}>
                                          {current.icon}
                                   </div>

                                   <h3 className={`text-xl font-extrabold mb-2 tracking-tight ${current.title}`}>{title}</h3>
                                   <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{message}</p>

                                   <div className="grid grid-cols-2 gap-3">
                                          <Button
                                                 variant="ghost"
                                                 onClick={onCancel}
                                                 className="h-12 rounded-xl text-slate-500 hover:bg-slate-50 font-bold"
                                          >
                                                 {cancelLabel}
                                          </Button>
                                          <button
                                                 onClick={onConfirm}
                                                 className={`h-12 rounded-xl text-sm font-extrabold text-white transition shadow-lg active:scale-95 ${current.btn}`}
                                          >
                                                 {confirmLabel}
                                          </button>
                                   </div>
                            </div>
                     </div>
              </div>
       );
}
