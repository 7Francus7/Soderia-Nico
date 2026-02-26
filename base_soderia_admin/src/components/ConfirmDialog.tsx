import { AlertTriangle } from "lucide-react";
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

       const variantStyles = {
              danger: {
                     icon: "bg-red-100 text-red-600",
                     btn: "bg-red-600 hover:bg-red-700 text-white shadow-red-200",
              },
              warning: {
                     icon: "bg-amber-100 text-amber-600",
                     btn: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200",
              },
              info: {
                     icon: "bg-blue-100 text-blue-600",
                     btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
              },
       };

       const styles = variantStyles[variant];

       return (
              <div
                     className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                     onClick={onCancel}
              >
                     <div
                            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150"
                            onClick={(e) => e.stopPropagation()}
                     >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}>
                                   <AlertTriangle className="w-6 h-6" />
                            </div>

                            {/* Text */}
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">{message}</p>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                   <Button variant="ghost" onClick={onCancel}>
                                          {cancelLabel}
                                   </Button>
                                   <button
                                          onClick={onConfirm}
                                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg ${styles.btn}`}
                                   >
                                          {confirmLabel}
                                   </button>
                            </div>
                     </div>
              </div>
       );
}
