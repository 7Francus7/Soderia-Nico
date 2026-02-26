import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api/axios";
import { DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Client {
       id: number;
       name: string;
       balance: number;
       address?: string;
       phone?: string;
}

interface Props {
       client: Client | null;
       isOpen: boolean;
       onClose: () => void;
       onSuccess: () => void;
}

export default function PaymentModal({ client, isOpen, onClose, onSuccess }: Props) {
       const [amount, setAmount] = useState("");
       const [description, setDescription] = useState("");
       const [submitting, setSubmitting] = useState(false);

       useEffect(() => {
              if (isOpen) {
                     setAmount("");
                     setDescription("");
              }
       }, [isOpen]);

       if (!client) return null;

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              const val = parseFloat(amount);
              if (!val || val <= 0) {
                     toast.error("Ingrese un monto válido");
                     return;
              }

              setSubmitting(true);
              try {
                     await api.post(`/clients/${client.id}/payment`, {
                            amount: val,
                            description: description || "Pago a cuenta"
                     });
                     toast.success("Pago registrado correctamente");
                     onSuccess();
                     onClose();
              } catch (error) {
                     console.error(error);
                     toast.error("Error al registrar el pago");
              } finally {
                     setSubmitting(false);
              }
       };

       return (
              <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
                     <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                                   <span className="text-slate-500">Deuda actual de {client.name}:</span>
                                   <div className="text-lg font-bold text-red-600">
                                          ${client.balance.toFixed(2)}
                                   </div>
                            </div>

                            <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Monto a Pagar ($)</label>
                                   <input
                                          type="number"
                                          step="0.01"
                                          value={amount}
                                          onChange={e => setAmount(e.target.value)}
                                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                          placeholder="0.00"
                                          autoFocus
                                   />
                            </div>

                            <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Notas / Concepto</label>
                                   <textarea
                                          value={description}
                                          onChange={e => setDescription(e.target.value)}
                                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none"
                                          placeholder="Ej: Pago parcial efectivo..."
                                   />
                            </div>

                            <div className="pt-2 flex gap-3">
                                   <button
                                          type="button"
                                          onClick={onClose}
                                          className="flex-1 px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                                   >
                                          Cancelar
                                   </button>
                                   <button
                                          type="submit"
                                          disabled={submitting}
                                          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                   >
                                          {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                                          Confirmar Pago
                                   </button>
                            </div>
                     </form>
              </Modal>
       );
}
