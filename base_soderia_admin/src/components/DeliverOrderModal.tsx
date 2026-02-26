import { useState } from "react";
import Modal from "./Modal";
import api from "../api/axios";
import { toast } from "sonner";
import { ArrowLeftRight, Banknote, CreditCard, Loader2 } from "lucide-react";

interface Order {
       id: number;
       total_amount: number;
}

interface Props {
       order: Order | null;
       isOpen: boolean;
       onClose: () => void;
       onSuccess: () => void;
}

type PaymentMethod = "CASH" | "CURRENT_ACCOUNT" | "TRANSFER"; // MIXED excluded for simplicity as per prompt

export default function DeliverOrderModal({ order, isOpen, onClose, onSuccess }: Props) {
       const [submitting, setSubmitting] = useState(false);

       if (!order) return null;

       const handleDeliver = async (method: PaymentMethod) => {
              if (!confirm(`¿Confirmar entrega con pago: ${method === 'CASH' ? 'EFECTIVO' : method === 'TRANSFER' ? 'TRANSFERENCIA' : 'CUENTA CORRIENTE'}?`)) {
                     return;
              }

              setSubmitting(true);
              try {
                     await api.post(`/orders/${order.id}/deliver`, {
                            payment_method: method
                     });
                     toast.success("Pedido entregado y pago registrado");
                     onSuccess();
                     onClose();
              } catch (error) {
                     console.error(error);
                     toast.error("Error al registrar entrega");
              } finally {
                     setSubmitting(false);
              }
       };

       return (
              <Modal isOpen={isOpen} onClose={onClose} title={`Entregar Pedido #${order.id}`}>
                     <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                   <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Total a Cobrar</p>
                                   <p className="text-3xl font-bold text-slate-800 mt-1">${order.total_amount.toLocaleString()}</p>
                            </div>

                            <div>
                                   <p className="text-sm text-slate-600 mb-3 font-medium">Seleccione Método de Pago:</p>
                                   <div className="grid grid-cols-1 gap-3">
                                          <button
                                                 onClick={() => handleDeliver("CASH")}
                                                 disabled={submitting}
                                                 className="flex items-center gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group text-left disabled:opacity-50"
                                          >
                                                 <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <Banknote className="w-5 h-5" />
                                                 </div>
                                                 <div>
                                                        <div className="font-bold text-emerald-900">Efectivo</div>
                                                        <div className="text-xs text-emerald-700">Ingreso a Caja</div>
                                                 </div>
                                          </button>

                                          <button
                                                 onClick={() => handleDeliver("CURRENT_ACCOUNT")}
                                                 disabled={submitting}
                                                 className="flex items-center gap-4 p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all group text-left disabled:opacity-50"
                                          >
                                                 <div className="w-10 h-10 rounded-full bg-red-200 text-red-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <ArrowLeftRight className="w-5 h-5" />
                                                 </div>
                                                 <div>
                                                        <div className="font-bold text-red-900">Cuenta Corriente</div>
                                                        <div className="text-xs text-red-700">Fiado / Deuda Cliente</div>
                                                 </div>
                                          </button>

                                          <button
                                                 onClick={() => handleDeliver("TRANSFER")}
                                                 disabled={submitting}
                                                 className="flex items-center gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all group text-left disabled:opacity-50"
                                          >
                                                 <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <CreditCard className="w-5 h-5" />
                                                 </div>
                                                 <div>
                                                        <div className="font-bold text-blue-900">Transferencia</div>
                                                        <div className="text-xs text-blue-700">Ingreso Digital</div>
                                                 </div>
                                          </button>
                                   </div>
                            </div>

                            {submitting && (
                                   <div className="flex items-center justify-center gap-2 text-slate-500 text-sm animate-pulse">
                                          <Loader2 className="w-4 h-4 animate-spin" /> Registrando transacción...
                                   </div>
                            )}
                     </div>
              </Modal>
       );
}
