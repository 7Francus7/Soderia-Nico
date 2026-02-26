import { useEffect, useState } from "react";
import api from "../api/axios";
import {
       Search, Plus, DollarSign, User, Users, MapPin, Phone, Pencil, Trash2, X
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

interface Client {
       id: number;
       name: string;
       address: string;
       phone: string;
       balance: number;
}

export default function ClientsView() {
       const [clients, setClients] = useState<Client[]>([]);
       const [search, setSearch] = useState("");
       const [loading, setLoading] = useState(false);

       const [selectedClientForPayment, setSelectedClientForPayment] = useState<Client | null>(null);
       const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
       const [paymentAmount, setPaymentAmount] = useState("");

       const [isFormModalOpen, setIsFormModalOpen] = useState(false);
       const [editingId, setEditingId] = useState<number | null>(null);
       const [clientForm, setClientForm] = useState({ name: "", address: "", phone: "" });

       const fetchClients = async () => {
              setLoading(true);
              try {
                     const res = await api.get(`/clients/?search=${search}&sort_by_debt=true`);
                     setClients(res.data);
              } catch (error) {
                     toast.error("Error al cargar clientes");
              } finally {
                     setLoading(false);
              }
       };

       useEffect(() => {
              const timer = setTimeout(fetchClients, 500);
              return () => clearTimeout(timer);
       }, [search]);

       const handlePayment = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!selectedClientForPayment) return;
              try {
                     await api.post(`/clients/${selectedClientForPayment.id}/payment`, {
                            amount: parseFloat(paymentAmount),
                            description: "Pago manual desde panel"
                     });
                     setIsPaymentModalOpen(false);
                     setPaymentAmount("");
                     toast.success("Pago registrado correctamente");
                     fetchClients();
              } catch (error) {
                     console.error(error);
              }
       };

       const openCreateModal = () => {
              setEditingId(null);
              setClientForm({ name: "", address: "", phone: "" });
              setIsFormModalOpen(true);
       };

       const openEditModal = (client: Client) => {
              setEditingId(client.id);
              setClientForm({ name: client.name, address: client.address, phone: client.phone || "" });
              setIsFormModalOpen(true);
       };

       const [formLoading, setFormLoading] = useState(false);

       const handleFormSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setFormLoading(true);
              const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              try {
                     if (editingId) {
                            await api.put(`/clients/${editingId}`, clientForm);
                            toast.success("Cliente actualizado exitosamente");
                     } else {
                            await api.post("/clients/", clientForm, {
                                   headers: { 'Idempotency-Key': idempotencyKey },
                                   timeout: 15000
                            });
                            toast.success("Cliente creado exitosamente");
                     }
                     setIsFormModalOpen(false);
                     fetchClients();
              } catch (error: any) {
                     if (error.code === 'ECONNABORTED') {
                            toast.error("El servidor tardó en responder. Intenta nuevamente.");
                     } else {
                            toast.error("Error al guardar cliente");
                     }
              } finally {
                     setFormLoading(false);
              }
       };

       const handleDelete = async (client: Client) => {
              if (!confirm(`¿Estás seguro de eliminar a ${client.name}?`)) return;
              try {
                     await api.delete(`/clients/${client.id}`);
                     toast.success("Cliente eliminado correctamente");
                     fetchClients();
              } catch (error) {
                     toast.error("No se pudo eliminar el cliente");
              }
       };

       return (
              <div className="space-y-4 md:space-y-6">
                     {/* Header */}
                     <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center animate-fade-in-up">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">👥 Clientes</h1>
                                   <p className="text-slate-500 text-sm mt-0.5 font-medium">Gestión de cuentas corrientes y pagos.</p>
                            </div>
                            <Button onClick={openCreateModal} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20">
                                   <Plus className="w-4 h-4 mr-2" /> Nuevo Cliente
                            </Button>
                     </div>

                     {/* Toolbar */}
                     <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                            <div className="relative flex-1">
                                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <input
                                          type="text"
                                          placeholder="Buscar cliente..."
                                          className="input-premium"
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                   />
                            </div>
                            <span className="text-sm text-slate-400 font-medium hidden sm:inline whitespace-nowrap">{clients.length} cliente{clients.length !== 1 ? 's' : ''}</span>
                     </div>

                     {/* Content */}
                     {loading ? (
                            <div className="empty-state">
                                   <div className="skeleton-shimmer w-8 h-8 rounded-xl" />
                                   <p className="text-slate-400 text-sm mt-3">Cargando clientes...</p>
                            </div>
                     ) : clients.length === 0 ? (
                            <div className="empty-state">
                                   <div className="empty-state-icon"><Users className="w-7 h-7 text-slate-400" /></div>
                                   <p className="text-slate-500 text-sm font-medium">No se encontraron clientes</p>
                                   <p className="text-slate-400 text-xs mt-1">Creá un nuevo cliente para empezar</p>
                            </div>
                     ) : (
                            <>
                                   {/* MOBILE CARDS */}
                                   <div className="md:hidden space-y-3">
                                          {clients.map((client, idx) => (
                                                 <div key={client.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-slate-200 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                                                        <div className="flex items-start justify-between mb-3">
                                                               <div className="min-w-0 flex-1">
                                                                      <div className="font-bold text-slate-800 truncate">{client.name}</div>
                                                                      <div className="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1">
                                                                             <MapPin className="w-3 h-3 flex-shrink-0" /> {client.address}
                                                                      </div>
                                                               </div>
                                                               <span className={`chip flex-shrink-0 ml-2 ${client.balance > 0 ? "chip-cancelled" : "chip-delivered"}`}>
                                                                      {client.balance > 0 ? `Debe $${Math.abs(client.balance).toLocaleString('es-AR')}` : `Al día`}
                                                               </span>
                                                        </div>
                                                        <div className="flex gap-2 pt-3 border-t border-slate-50">
                                                               <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/15" onClick={() => { setSelectedClientForPayment(client); setIsPaymentModalOpen(true); }}>
                                                                      <DollarSign className="w-3.5 h-3.5 mr-1" /> Cobrar
                                                               </Button>
                                                               <Button size="sm" variant="outline" onClick={() => openEditModal(client)} className="text-slate-400 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600">
                                                                      <Pencil className="w-3.5 h-3.5" />
                                                               </Button>
                                                               <Button size="sm" variant="ghost" onClick={() => handleDelete(client)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                               </Button>
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>

                                   {/* DESKTOP TABLE */}
                                   <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                          <table className="w-full text-left table-premium">
                                                 <thead>
                                                        <tr>
                                                               <th>Cliente</th>
                                                               <th>Dirección</th>
                                                               <th>Estado CC</th>
                                                               <th className="text-right">Acciones</th>
                                                        </tr>
                                                 </thead>
                                                 <tbody>
                                                        {clients.map((client) => (
                                                               <tr key={client.id}>
                                                                      <td>
                                                                             <div className="font-semibold text-slate-900">{client.name}</div>
                                                                             {client.phone && <div className="text-xs text-slate-400 mt-0.5">{client.phone}</div>}
                                                                      </td>
                                                                      <td className="text-slate-600 font-medium">{client.address}</td>
                                                                      <td>
                                                                             <span className={`chip ${client.balance > 0 ? "chip-cancelled" : "chip-delivered"}`}>
                                                                                    {client.balance > 0 ? `Debe $${Math.abs(client.balance).toLocaleString('es-AR')}` : `$${Math.abs(client.balance).toLocaleString('es-AR')} Favor`}
                                                                             </span>
                                                                      </td>
                                                                      <td className="text-right">
                                                                             <div className="flex justify-end gap-2">
                                                                                    <Button size="sm" variant="ghost" onClick={() => openEditModal(client)} title="Editar" className="hover:bg-blue-50 hover:text-blue-600">
                                                                                           <Pencil className="w-4 h-4 text-slate-400" />
                                                                                    </Button>
                                                                                    <Button size="sm" variant="ghost" className="hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(client)} title="Eliminar">
                                                                                           <Trash2 className="w-4 h-4 text-slate-400" />
                                                                                    </Button>
                                                                                    <div className="w-px h-6 bg-slate-200 mx-0.5 self-center" />
                                                                                    <Button size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200" onClick={() => { setSelectedClientForPayment(client); setIsPaymentModalOpen(true); }} title="Registrar Pago">
                                                                                           <DollarSign className="w-4 h-4 mr-1" /> Cobrar
                                                                                    </Button>
                                                                             </div>
                                                                      </td>
                                                               </tr>
                                                        ))}
                                                 </tbody>
                                          </table>
                                   </div>
                            </>
                     )}

                     {/* Payment Modal */}
                     {isPaymentModalOpen && selectedClientForPayment && (
                            <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
                                   <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 sm:p-7 shadow-2xl animate-slide-in-up">
                                          <div className="flex justify-between items-center mb-5">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                                               <DollarSign className="w-5 h-5 text-white" />
                                                        </div>
                                                        <h3 className="text-lg font-extrabold text-slate-900">Registrar Pago</h3>
                                                 </div>
                                                 <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition"><X className="w-5 h-5" /></button>
                                          </div>

                                          <p className="text-slate-500 mb-5 text-sm">
                                                 Ingresá el monto que pagó <strong className="text-slate-900">{selectedClientForPayment.name}</strong>.
                                          </p>

                                          <form onSubmit={handlePayment}>
                                                 <div className="mb-6">
                                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Monto ($)</label>
                                                        <div className="relative">
                                                               <DollarSign className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                                               <input
                                                                      type="number"
                                                                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 text-xl font-extrabold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                                      placeholder="0.00"
                                                                      autoFocus
                                                                      value={paymentAmount}
                                                                      onChange={e => setPaymentAmount(e.target.value)}
                                                                      required
                                                               />
                                                        </div>
                                                 </div>
                                                 <div className="flex gap-3">
                                                        <Button type="button" variant="ghost" onClick={() => setIsPaymentModalOpen(false)} className="flex-1">Cancelar</Button>
                                                        <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20">Confirmar Pago</Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}

                     {/* Client Form Modal */}
                     {isFormModalOpen && (
                            <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
                                   <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-5 sm:p-7 shadow-2xl animate-slide-in-up">
                                          <div className="flex justify-between items-center mb-5">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                               <User className="w-5 h-5 text-white" />
                                                        </div>
                                                        <h3 className="text-lg font-extrabold text-slate-900">
                                                               {editingId ? "Editar Cliente" : "Nuevo Cliente"}
                                                        </h3>
                                                 </div>
                                                 <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition"><X className="w-5 h-5" /></button>
                                          </div>

                                          <p className="text-slate-500 mb-5 text-sm font-medium">
                                                 {editingId ? "Modificá los datos del cliente." : "Ingresá los datos del nuevo cliente."}
                                          </p>

                                          <form onSubmit={handleFormSubmit} className="space-y-4">
                                                 <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre Completo</label>
                                                        <div className="relative">
                                                               <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                                               <input type="text" className="input-premium" placeholder="Ej: Juan Perez" required value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} />
                                                        </div>
                                                 </div>
                                                 <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Dirección</label>
                                                        <div className="relative">
                                                               <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                                               <input type="text" className="input-premium" placeholder="Ej: Av. San Martin 123" required value={clientForm.address} onChange={e => setClientForm({ ...clientForm, address: e.target.value })} />
                                                        </div>
                                                 </div>
                                                 <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Teléfono (Opcional)</label>
                                                        <div className="relative">
                                                               <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                                               <input type="text" className="input-premium" placeholder="Ej: 351..." value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} />
                                                        </div>
                                                 </div>
                                                 <div className="flex gap-3 pt-2">
                                                        <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)} className="flex-1">Cancelar</Button>
                                                        <Button type="submit" isLoading={formLoading} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20">
                                                               {editingId ? "Guardar Cambios" : "Crear Cliente"}
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}
              </div>
       );
}
