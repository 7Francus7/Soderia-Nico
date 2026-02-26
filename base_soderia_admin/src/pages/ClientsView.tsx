import { useEffect, useState } from "react";
import api from "../api/axios";
import {
       Search, Plus, DollarSign, User, Users, MapPin, Phone, Pencil, Trash2, X
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

// Interfaces
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

       // Estados para Modal de Pago
       const [selectedClientForPayment, setSelectedClientForPayment] = useState<Client | null>(null);
       const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
       const [paymentAmount, setPaymentAmount] = useState("");

       // Estados para Modal de Cliente (Crear/Editar)
       const [isFormModalOpen, setIsFormModalOpen] = useState(false);
       const [editingId, setEditingId] = useState<number | null>(null);
       const [clientForm, setClientForm] = useState({
              name: "",
              address: "",
              phone: ""
       });

       // Fetch Clientes
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

       // Debounce search
       useEffect(() => {
              const timer = setTimeout(fetchClients, 500);
              return () => clearTimeout(timer);
       }, [search]);

       // Handle Payment Submit
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

       // Open Create Modal
       const openCreateModal = () => {
              setEditingId(null);
              setClientForm({ name: "", address: "", phone: "" });
              setIsFormModalOpen(true);
       };

       // Open Edit Modal
       const openEditModal = (client: Client) => {
              setEditingId(client.id);
              setClientForm({
                     name: client.name,
                     address: client.address,
                     phone: client.phone || ""
              });
              setIsFormModalOpen(true);
       };

       const [formLoading, setFormLoading] = useState(false);

       // Handle Form Submit (Create or Edit)
       const handleFormSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setFormLoading(true);

              // Generate simple Idempotency Key (Timestamp + Random) for creating clients
              // In production use proper UUID library
              const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

              try {
                     if (editingId) {
                            // Edit Mode
                            await api.put(`/clients/${editingId}`, clientForm);
                            toast.success("Cliente actualizado exitosamente");
                     } else {
                            // Create Mode
                            await api.post("/clients/", clientForm, {
                                   headers: { 'Idempotency-Key': idempotencyKey },
                                   timeout: 15000 // Extended timeout for creation 15s
                            });
                            toast.success("Cliente creado exitosamente");
                     }
                     setIsFormModalOpen(false);
                     fetchClients();
              } catch (error: any) {
                     console.error(error);
                     if (error.code === 'ECONNABORTED') {
                            toast.error("El servidor tardó en responder. Intenta nuevamente (no se duplicará).");
                     } else {
                            toast.error("Error al guardar cliente");
                     }
              } finally {
                     setFormLoading(false);
              }
       };

       // Handle Delete
       const handleDelete = async (client: Client) => {
              if (!confirm(`¿Estás seguro de eliminar a ${client.name}? Esta acción no se puede deshacer.`)) return;

              try {
                     await api.delete(`/clients/${client.id}`);
                     toast.success("Cliente eliminado correctamente");
                     fetchClients();
              } catch (error) {
                     toast.error("No se pudo eliminar el cliente");
              }
       };

       return (
              <div className="space-y-4 p-4 md:p-6">
                     {/* Header */}
                     <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                            <div>
                                   <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Clientes</h2>
                                   <p className="text-slate-500 text-sm">Gestión de cuentas corrientes y pagos.</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                   <div className="relative flex-1 sm:flex-none">
                                          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                          <input
                                                 type="text"
                                                 placeholder="Buscar cliente..."
                                                 className="w-full sm:w-56 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                 value={search}
                                                 onChange={(e) => setSearch(e.target.value)}
                                          />
                                   </div>
                                   <Button onClick={openCreateModal} className="whitespace-nowrap">
                                          <Plus className="w-4 h-4 mr-1 md:mr-2" />
                                          <span className="hidden sm:inline">Nuevo</span>
                                          <span className="sm:hidden">+</span>
                                   </Button>
                            </div>
                     </div>

                     {/* Contador */}
                     {!loading && (
                            <p className="text-sm text-slate-400">{clients.length} cliente{clients.length !== 1 ? 's' : ''} encontrado{clients.length !== 1 ? 's' : ''}</p>
                     )}

                     {/* Mobile: Cards | Desktop: Table */}
                     {loading ? (
                            <div className="flex items-center justify-center py-20 text-slate-400">
                                   <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin mr-3" />
                                   Cargando...
                            </div>
                     ) : clients.length === 0 ? (
                            <div className="text-center py-16 text-slate-400">
                                   <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                   <p>No se encontraron clientes.</p>
                            </div>
                     ) : (
                            <>
                                   {/* MOBILE CARDS */}
                                   <div className="md:hidden space-y-3">
                                          {clients.map((client) => (
                                                 <div key={client.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                               <div>
                                                                      <div className="font-semibold text-slate-800 text-base">{client.name}</div>
                                                                      <div className="text-sm text-slate-400 mt-0.5">{client.address}</div>
                                                               </div>
                                                               <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${client.balance > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                                      }`}>
                                                                      {client.balance > 0
                                                                             ? `Debe $${Math.abs(client.balance).toLocaleString('es-AR')}`
                                                                             : `Al día`}
                                                               </span>
                                                        </div>
                                                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                                                               <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setSelectedClientForPayment(client); setIsPaymentModalOpen(true); }}>
                                                                      <DollarSign className="w-3.5 h-3.5 mr-1" /> Cobrar
                                                               </Button>
                                                               <Button size="sm" variant="ghost" onClick={() => openEditModal(client)} className="text-slate-500">
                                                                      <Pencil className="w-3.5 h-3.5" />
                                                               </Button>
                                                               <Button size="sm" variant="ghost" onClick={() => handleDelete(client)} className="text-slate-400 hover:text-red-500">
                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                               </Button>
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>

                                   {/* DESKTOP TABLE */}
                                   <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                          <table className="w-full text-left">
                                                 <thead className="bg-slate-50 border-b border-slate-100">
                                                        <tr>
                                                               <th className="p-4 font-semibold text-slate-600 text-sm">Cliente</th>
                                                               <th className="p-4 font-semibold text-slate-600 text-sm">Dirección</th>
                                                               <th className="p-4 font-semibold text-slate-600 text-sm">Estado CC</th>
                                                               <th className="p-4 font-semibold text-slate-600 text-sm text-right">Acciones</th>
                                                        </tr>
                                                 </thead>
                                                 <tbody className="divide-y divide-slate-100">
                                                        {clients.map((client) => (
                                                               <tr key={client.id} className="hover:bg-slate-50 transition group">
                                                                      <td className="p-4">
                                                                             <div className="font-medium text-slate-800">{client.name}</div>
                                                                      </td>
                                                                      <td className="p-4 text-slate-600">{client.address}</td>
                                                                      <td className="p-4">
                                                                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.balance > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                                                    }`}>
                                                                                    {client.balance > 0
                                                                                           ? `Debe $${Math.abs(client.balance).toLocaleString('es-AR')}`
                                                                                           : `$${Math.abs(client.balance).toLocaleString('es-AR')} Favor`}
                                                                             </span>
                                                                      </td>
                                                                      <td className="p-4 text-right">
                                                                             <div className="flex justify-end gap-2">
                                                                                    <Button size="sm" variant="ghost" onClick={() => openEditModal(client)} title="Editar">
                                                                                           <Pencil className="w-4 h-4 text-slate-500" />
                                                                                    </Button>
                                                                                    <Button size="sm" variant="ghost" className="hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(client)} title="Eliminar">
                                                                                           <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                                                                                    </Button>
                                                                                    <div className="w-px h-6 bg-slate-200 mx-1" />
                                                                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => { setSelectedClientForPayment(client); setIsPaymentModalOpen(true); }} title="Registrar Pago">
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

                     {/* Modal de Pago Simple */}
                     {isPaymentModalOpen && selectedClientForPayment && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                                   <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
                                          <div className="flex justify-between items-start mb-4">
                                                 <h3 className="text-xl font-bold text-slate-800">Registrar Pago</h3>
                                                 <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                                        <X className="w-5 h-5" />
                                                 </button>
                                          </div>

                                          <p className="text-slate-500 mb-6">
                                                 Ingresá el monto que pagó <strong>{selectedClientForPayment.name}</strong>.
                                          </p>

                                          <form onSubmit={handlePayment}>
                                                 <div className="mb-6">
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Monto ($)</label>
                                                        <div className="relative">
                                                               <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                               <input
                                                                      type="number"
                                                                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-lg font-semibold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                                                      placeholder="0.00"
                                                                      autoFocus
                                                                      value={paymentAmount}
                                                                      onChange={e => setPaymentAmount(e.target.value)}
                                                                      required
                                                               />
                                                        </div>
                                                 </div>

                                                 <div className="flex gap-3 justify-end">
                                                        <Button
                                                               type="button"
                                                               variant="ghost"
                                                               onClick={() => setIsPaymentModalOpen(false)}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        <Button
                                                               type="submit"
                                                               className="bg-green-600 hover:bg-green-700 shadow-green-200"
                                                        >
                                                               Confirmar Pago
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}

                     {/* Modal de Cliente (Crear / Editar) */}
                     {isFormModalOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                                   <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
                                          <div className="flex justify-between items-start mb-4">
                                                 <h3 className="text-xl font-bold text-slate-800">
                                                        {editingId ? "Editar Cliente" : "Nuevo Cliente"}
                                                 </h3>
                                                 <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                                        <X className="w-5 h-5" />
                                                 </button>
                                          </div>

                                          <p className="text-slate-500 mb-6">
                                                 {editingId ? "Modificá los datos del cliente." : "Ingresá los datos del nuevo cliente."}
                                          </p>

                                          <form onSubmit={handleFormSubmit} className="space-y-4">
                                                 <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                                        <div className="relative">
                                                               <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                               <input
                                                                      type="text"
                                                                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                                      placeholder="Ej: Juan Perez"
                                                                      required
                                                                      value={clientForm.name}
                                                                      onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                                                               />
                                                        </div>
                                                 </div>

                                                 <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                                                        <div className="relative">
                                                               <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                               <input
                                                                      type="text"
                                                                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                                      placeholder="Ej: Av. San Martin 123"
                                                                      required
                                                                      value={clientForm.address}
                                                                      onChange={e => setClientForm({ ...clientForm, address: e.target.value })}
                                                               />
                                                        </div>
                                                 </div>

                                                 <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (Opcional)</label>
                                                        <div className="relative">
                                                               <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                               <input
                                                                      type="text"
                                                                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                                      placeholder="Ej: 351..."
                                                                      value={clientForm.phone}
                                                                      onChange={e => setClientForm({ ...clientForm, phone: e.target.value })}
                                                               />
                                                        </div>
                                                 </div>

                                                 <div className="flex gap-3 justify-end mt-6">
                                                        <Button
                                                               type="button"
                                                               variant="ghost"
                                                               onClick={() => setIsFormModalOpen(false)}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        <Button type="submit" isLoading={formLoading}>
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
