import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api/axios";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Banknote } from "lucide-react";

interface Client {
       id: number;
       name: string;
       balance: number;
       bottles_balance: number;
       address?: string;
       phone?: string;
}

interface Transaction {
       id: number;
       type: "DEBIT" | "CREDIT";
       amount: number;
       concept: string;
       description?: string;
       created_at: string;
}

interface Props {
       client: Client | null;
       isOpen: boolean;
       onClose: () => void;
       onPaymentClick: (client: Client) => void;
}

export default function ClientLedgerModal({ client, isOpen, onClose, onPaymentClick }: Props) {
       const [lastTransactions, setTransactions] = useState<Transaction[]>([]);
       const [loading, setLoading] = useState(false);

       useEffect(() => {
              if (client && isOpen) {
                     setLoading(true);
                     api.get(`/clients/${client.id}/transactions`)
                            .then(res => setTransactions(res.data))
                            .catch(err => console.error(err))
                            .finally(() => setLoading(false));
              }
       }, [client, isOpen]);

       if (!client) return null;

       return (
              <Modal isOpen={isOpen} onClose={onClose} title={`Estado de Cuenta: ${client.name}`}>
                     <div className="space-y-4 sm:space-y-6">
                            {/* Header Balance */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                                   <div>
                                          <p className="text-sm text-slate-500 font-medium">Saldo Actual</p>
                                          <p className={`text-xl sm:text-2xl font-bold ${client.balance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                                                 {client.balance > 0 ? `-$${client.balance.toFixed(2)}` : `$${Math.abs(client.balance).toFixed(2)}`}
                                          </p>
                                          <p className="text-xs text-slate-400 mt-1">
                                                 {client.balance > 0 ? "Deuda Pendiente" : "Saldo a Favor"}
                                          </p>
                                   </div>
                                   <button
                                          onClick={() => { onClose(); onPaymentClick(client); }}
                                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-colors active:scale-95"
                                   >
                                          <Banknote className="w-4 h-4" />
                                          Registrar Pago
                                   </button>
                            </div>

                            {/* Transaction History */}
                            <div>
                                   <h4 className="text-sm font-semibold text-slate-800 mb-3">Últimos Movimientos</h4>

                                   {/* Mobile: Transaction Cards */}
                                   <div className="sm:hidden space-y-2">
                                          {loading ? (
                                                 <div className="p-8 text-center text-slate-500 text-sm">Cargando movimientos...</div>
                                          ) : lastTransactions.length === 0 ? (
                                                 <div className="p-8 text-center text-slate-500 text-sm">No hay movimientos registrados.</div>
                                          ) : (
                                                 lastTransactions.map((tx) => (
                                                        <div key={tx.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                               <span className={`p-1.5 rounded-full flex-shrink-0 ${tx.type === 'DEBIT' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                                      {tx.type === 'DEBIT' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                                                               </span>
                                                               <div className="flex-1 min-w-0">
                                                                      <div className="font-medium text-slate-700 text-sm truncate">{tx.concept}</div>
                                                                      <div className="text-[10px] text-slate-400">{format(new Date(tx.created_at), "dd/MM/yy HH:mm")}</div>
                                                               </div>
                                                               <span className={`font-bold text-sm flex-shrink-0 ${tx.type === 'DEBIT' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                                      {tx.type === 'DEBIT' ? '-' : '+'}${tx.amount.toFixed(2)}
                                                               </span>
                                                        </div>
                                                 ))
                                          )}
                                   </div>

                                   {/* Desktop: Transaction Table */}
                                   <div className="hidden sm:block border border-slate-200 rounded-lg overflow-hidden">
                                          {loading ? (
                                                 <div className="p-8 text-center text-slate-500 text-sm">Cargando movimientos...</div>
                                          ) : lastTransactions.length === 0 ? (
                                                 <div className="p-8 text-center text-slate-500 text-sm">No hay movimientos registrados.</div>
                                          ) : (
                                                 <table className="w-full text-sm">
                                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase">
                                                               <tr>
                                                                      <th className="px-4 py-3 text-left">Fecha</th>
                                                                      <th className="px-4 py-3 text-left">Concepto</th>
                                                                      <th className="px-4 py-3 text-right">Monto</th>
                                                               </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                               {lastTransactions.map((tx) => (
                                                                      <tr key={tx.id} className="hover:bg-slate-50/50">
                                                                             <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                                                                    {format(new Date(tx.created_at), "dd/MM/yy HH:mm")}
                                                                             </td>
                                                                             <td className="px-4 py-3">
                                                                                    <div className="flex items-center gap-2">
                                                                                           <span className={`p-1 rounded-full ${tx.type === 'DEBIT' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                                                                  {tx.type === 'DEBIT' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                                                                           </span>
                                                                                           <span className="font-medium text-slate-700">{tx.concept}</span>
                                                                                           {tx.description && <span className="text-slate-400 text-xs">- {tx.description}</span>}
                                                                                    </div>
                                                                             </td>
                                                                             <td className={`px-4 py-3 text-right font-medium ${tx.type === 'DEBIT' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                                                    {tx.type === 'DEBIT' ? '-' : '+'}${tx.amount.toFixed(2)}
                                                                             </td>
                                                                      </tr>
                                                               ))}
                                                        </tbody>
                                                 </table>
                                          )}
                                   </div>
                            </div>
                     </div>
              </Modal>
       );
}
