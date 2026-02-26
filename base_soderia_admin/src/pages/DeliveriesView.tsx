import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import {
       useReactTable,
       getCoreRowModel,
       getPaginationRowModel,
       getSortedRowModel,
       flexRender,
       type ColumnDef,
       type SortingState,
       type PaginationState,
} from "@tanstack/react-table";
import {
       Truck,
       CheckCircle,
       RefreshCw,
       Plus,
       Trash2,
       X,
       Calendar,
       Eye,
       Box,
       ChevronLeft,
       ChevronRight,
       Clock,
       MapPin
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import DeliverOrderModal from "../components/DeliverOrderModal";

// --- Types ---

interface Order {
       id: number;
       client_id: number;
       status: string;
       total_amount: number;
       client?: { name: string; address: string };
}

interface Delivery {
       id: number;
       created_at: string;
       status: 'pending' | 'completed';
       orders_count: number;
       delivered_count: number;
       orders?: Order[];
       notes?: string;
}

// --- Components ---

const StatusPill = ({ status }: { status: string }) => {
       const isCompleted = status === 'DELIVERED' || status === 'completed';
       return (
              <span className={`chip ${isCompleted ? 'chip-delivered' : 'chip-pending'}`}>
                     {isCompleted ? <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                     {isCompleted ? "Completado" : "En Curso"}
              </span>
       );
};

const ProgressBar = ({ orders_count, delivered_count }: { orders_count: number, delivered_count: number }) => {
       const progress = orders_count > 0 ? (delivered_count / orders_count) * 100 : 0;
       return (
              <div className="w-full">
                     <div className="flex justify-between text-[10px] md:text-xs mb-1.5 font-semibold text-slate-600">
                            <span>{delivered_count}/{orders_count} pedidos</span>
                            <span className={progress === 100 ? 'text-emerald-600' : 'text-blue-600'}>{Math.round(progress)}%</span>
                     </div>
                     <div className="h-2 md:h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                   className={`h-full rounded-full transition-all duration-700 ease-out ${progress === 100
                                          ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                                          : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                                          }`}
                                   style={{ width: `${progress}%` }}
                            />
                     </div>
              </div>
       );
};

// --- Main Page ---

export default function DeliveriesView() {
       const [data, setData] = useState<Delivery[]>([]);
       const [loading, setLoading] = useState(true);

       const [sorting, setSorting] = useState<SortingState>([]);
       const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

       const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
       const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
       const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
       const [notes, setNotes] = useState("");

       const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
       const [isDetailOpen, setIsDetailOpen] = useState(false);

       const [orderToDeliver, setOrderToDeliver] = useState<Order | null>(null);
       const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);

       const fetchData = async () => {
              setLoading(true);
              try {
                     const response = await api.get('/deliveries/?limit=50');
                     setData(response.data);
              } catch (error) {
                     console.error(error);
                     toast.error("Error cargando repartos");
              } finally {
                     setLoading(false);
              }
       };

       const fetchAvailableOrders = async () => {
              try {
                     const res = await api.get('/orders/');
                     const allOrders = res.data;
                     const ready = allOrders.filter((o: any) => o.status === 'CONFIRMED' && !o.delivery_id);
                     setAvailableOrders(ready);
              } catch (error) {
                     console.error(error);
                     toast.error("Error cargando pedidos pendientes");
              }
       };

       useEffect(() => { fetchData(); }, []);
       useEffect(() => { if (isCreateModalOpen) fetchAvailableOrders(); }, [isCreateModalOpen]);

       const [createLoading, setCreateLoading] = useState(false);

       const handleCreate = async () => {
              if (selectedOrders.length === 0) return;
              setCreateLoading(true);
              try {
                     await api.post('/deliveries/', { order_ids: selectedOrders, notes });
                     toast.success("Reparto creado exitosamente");
                     setIsCreateModalOpen(false);
                     setSelectedOrders([]);
                     setNotes("");
                     fetchData();
              } catch (error) {
                     console.error(error);
                     toast.error("Error creando reparto");
              } finally {
                     setCreateLoading(false);
              }
       };

       const handleOpenDetail = async (delivery: Delivery) => {
              setSelectedDelivery(delivery);
              setIsDetailOpen(true);
       };

       const handleDelete = async (id: number) => {
              if (!confirm("¿Eliminar este reparto? Los pedidos volverán a estar pendientes.")) return;
              try {
                     await api.delete(`/deliveries/${id}`);
                     toast.success("Reparto eliminado");
                     fetchData();
              } catch (error) {
                     console.error(error);
                     toast.error("Error al eliminar");
              }
       };

       const toggleOrderSelection = (id: number) => {
              setSelectedOrders(prev =>
                     prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
              );
       };

       const columns = useMemo<ColumnDef<Delivery>[]>(() => [
              {
                     accessorKey: "id",
                     header: "ID",
                     cell: ({ getValue }) => <span className="font-mono text-xs font-bold text-slate-400">#{getValue() as number}</span>,
              },
              {
                     accessorKey: "created_at",
                     header: "Fecha",
                     cell: ({ getValue }) => (
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                   <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                   {new Date(getValue() as string).toLocaleDateString('es-AR')}
                            </div>
                     )
              },
              {
                     id: "stats",
                     header: "Progreso",
                     cell: ({ row }) => (
                            <div className="w-full max-w-[160px]">
                                   <ProgressBar orders_count={row.original.orders_count} delivered_count={row.original.delivered_count} />
                            </div>
                     )
              },
              {
                     accessorKey: "status",
                     header: "Estado",
                     cell: ({ row }) => <StatusPill status={row.original.delivered_count === row.original.orders_count && row.original.orders_count > 0 ? 'completed' : 'pending'} />
              },
              {
                     id: "actions",
                     header: "Acciones",
                     cell: ({ row }) => (
                            <div className="flex justify-end gap-2">
                                   <Button size="sm" variant="outline" onClick={() => handleOpenDetail(row.original)} className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Ver
                                   </Button>
                                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(row.original.id)}>
                                          <Trash2 className="w-4 h-4" />
                                   </Button>
                            </div>
                     )
              }
       ], []);

       const table = useReactTable({
              data,
              columns,
              state: { sorting, pagination },
              onSortingChange: setSorting,
              onPaginationChange: setPagination,
              getCoreRowModel: getCoreRowModel(),
              getPaginationRowModel: getPaginationRowModel(),
              getSortedRowModel: getSortedRowModel(),
       });

       return (
              <div className="space-y-4 md:space-y-6">
                     {/* Header */}
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in-up">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">🚚 Repartos</h1>
                                   <p className="text-slate-500 text-sm mt-0.5 font-medium">Gestión de hojas de ruta y entregas agrupadas.</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                   <Button variant="outline" onClick={fetchData} className="border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200">
                                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                   </Button>
                                   <Button onClick={() => setIsCreateModalOpen(true)} className="flex-1 sm:flex-none bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-xl shadow-slate-900/20">
                                          <Plus className="w-4 h-4 mr-2" /> Nuevo Reparto
                                   </Button>
                            </div>
                     </div>

                     {/* MOBILE CARDS */}
                     <div className="md:hidden space-y-3">
                            {loading ? (
                                   <div className="empty-state"><div className="skeleton-shimmer w-8 h-8 rounded-xl" /><p className="text-slate-400 text-sm mt-3">Cargando repartos...</p></div>
                            ) : data.length === 0 ? (
                                   <div className="empty-state">
                                          <div className="empty-state-icon"><Truck className="w-7 h-7 text-slate-400" /></div>
                                          <p className="text-slate-500 text-sm font-medium">No hay repartos creados</p>
                                          <p className="text-slate-400 text-xs mt-1">Creá un nuevo reparto para empezar</p>
                                   </div>
                            ) : (
                                   table.getRowModel().rows.map((row, idx) => {
                                          const delivery = row.original;
                                          const isCompleted = delivery.delivered_count === delivery.orders_count && delivery.orders_count > 0;
                                          return (
                                                 <div key={delivery.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-slate-200 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                                                        <div className="flex items-start justify-between mb-3">
                                                               <div>
                                                                      <div className="flex items-center gap-2 mb-1.5">
                                                                             <span className="font-mono text-xs text-slate-400 font-semibold">#{delivery.id}</span>
                                                                             <StatusPill status={isCompleted ? 'completed' : 'pending'} />
                                                                      </div>
                                                                      <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                                                             <Calendar className="w-3 h-3" />
                                                                             {new Date(delivery.created_at).toLocaleDateString('es-AR')}
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <div className="mb-4">
                                                               <ProgressBar orders_count={delivery.orders_count} delivered_count={delivery.delivered_count} />
                                                        </div>
                                                        <div className="flex gap-2 pt-3 border-t border-slate-50">
                                                               <Button size="sm" variant="outline" onClick={() => handleOpenDetail(delivery)} className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50">
                                                                      <Eye className="w-3.5 h-3.5 mr-1.5" /> Ver Detalle
                                                               </Button>
                                                               <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(delivery.id)}>
                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                               </Button>
                                                        </div>
                                                 </div>
                                          );
                                   })
                            )}
                     </div>

                     {/* DESKTOP TABLE */}
                     <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                            <div className="overflow-x-auto">
                                   <table className="w-full text-left table-premium">
                                          <thead>
                                                 {table.getHeaderGroups().map(headerGroup => (
                                                        <tr key={headerGroup.id}>
                                                               {headerGroup.headers.map(header => (
                                                                      <th key={header.id}>
                                                                             {flexRender(header.column.columnDef.header, header.getContext())}
                                                                      </th>
                                                               ))}
                                                        </tr>
                                                 ))}
                                          </thead>
                                          <tbody>
                                                 {data.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-16 text-center">
                                                               <div className="empty-state py-8">
                                                                      <div className="empty-state-icon"><Truck className="w-7 h-7 text-slate-400" /></div>
                                                                      <p className="text-slate-500 text-sm font-medium">No hay repartos creados</p>
                                                                      <p className="text-slate-400 text-xs mt-1">Creá un nuevo reparto para empezar</p>
                                                               </div>
                                                        </td></tr>
                                                 ) : (
                                                        table.getRowModel().rows.map(row => (
                                                               <tr key={row.id}>
                                                                      {row.getVisibleCells().map(cell => (
                                                                             <td key={cell.id}>
                                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                             </td>
                                                                      ))}
                                                               </tr>
                                                        ))
                                                 )}
                                          </tbody>
                                   </table>
                            </div>
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                                   <span className="text-sm text-slate-500 font-medium">Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</span>
                                   <div className="flex gap-2">
                                          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 hover:border-slate-300 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                                          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 hover:border-slate-300 transition-all"><ChevronRight className="w-4 h-4" /></button>
                                   </div>
                            </div>
                     </div>

                     {/* Mobile Pagination */}
                     <div className="md:hidden flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">Pág. {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}</span>
                            <div className="flex gap-2">
                                   <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 active:scale-95 transition hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                                   <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 active:scale-95 transition hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                     </div>

                     {/* Create Modal */}
                     {isCreateModalOpen && (
                            <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
                                   <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-slide-in-up">
                                          <div className="flex justify-between items-center mb-5">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                                                               <Truck className="w-5 h-5 text-white" />
                                                        </div>
                                                        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">Nuevo Reparto</h3>
                                                 </div>
                                                 <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition"><X className="w-5 h-5" /></button>
                                          </div>

                                          <div className="mb-4 flex-1 overflow-hidden flex flex-col">
                                                 <p className="text-sm text-slate-500 mb-3 font-medium">Seleccioná los pedidos que saldrán en este reparto:</p>
                                                 <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 flex-1 overflow-y-auto p-2.5 space-y-1.5">
                                                        {availableOrders.length === 0 ? (
                                                               <div className="empty-state py-10">
                                                                      <div className="empty-state-icon"><Box className="w-6 h-6 text-slate-400" /></div>
                                                                      <p className="text-slate-400 text-sm font-medium">No hay pedidos confirmados pendientes</p>
                                                               </div>
                                                        ) : (
                                                               availableOrders.map(order => (
                                                                      <label key={order.id} className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${selectedOrders.includes(order.id) ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                                                             <input
                                                                                    type="checkbox"
                                                                                    className="w-5 h-5 rounded-lg text-blue-600 flex-shrink-0 accent-blue-600"
                                                                                    checked={selectedOrders.includes(order.id)}
                                                                                    onChange={() => toggleOrderSelection(order.id)}
                                                                             />
                                                                             <div className="flex-1 min-w-0">
                                                                                    <div className="flex justify-between gap-2">
                                                                                           <span className="font-bold text-slate-700 text-sm truncate">Pedido #{order.id}</span>
                                                                                           <span className="font-extrabold text-slate-900 flex-shrink-0">${order.total_amount.toLocaleString('es-AR')}</span>
                                                                                    </div>
                                                                                    <div className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                                                                                           <MapPin className="w-3 h-3 flex-shrink-0" />
                                                                                           {order.client?.name} - {order.client?.address}
                                                                                    </div>
                                                                             </div>
                                                                      </label>
                                                               ))
                                                        )}
                                                 </div>
                                          </div>

                                          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100">
                                                 <span className="text-sm text-slate-500 font-medium">{selectedOrders.length} pedido{selectedOrders.length !== 1 ? 's' : ''} seleccionado{selectedOrders.length !== 1 ? 's' : ''}</span>
                                                 <div className="flex gap-3 w-full sm:w-auto">
                                                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1 sm:flex-none">Cancelar</Button>
                                                        <Button onClick={handleCreate} disabled={selectedOrders.length === 0} isLoading={createLoading} className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20">
                                                               Crear Reparto ({selectedOrders.length})
                                                        </Button>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     )}

                     {/* Detail Modal */}
                     {isDetailOpen && selectedDelivery && (
                            <DeliveryDetailModal
                                   delivery={selectedDelivery}
                                   onClose={() => setIsDetailOpen(false)}
                                   onDeliver={(order) => { setOrderToDeliver(order); setIsDeliverModalOpen(true); }}
                            />
                     )}

                     {/* Deliver Order Modal */}
                     <DeliverOrderModal
                            isOpen={isDeliverModalOpen}
                            onClose={() => setIsDeliverModalOpen(false)}
                            order={orderToDeliver}
                            onSuccess={() => { fetchData(); setIsDetailOpen(false); }}
                     />
              </div>
       );
}

// Inner Component for Details
function DeliveryDetailModal({ delivery, onClose, onDeliver }: { delivery: Delivery, onClose: () => void, onDeliver: (o: Order) => void }) {
       const [orders, setOrders] = useState<Order[]>([]);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
              const fetchOrders = async () => {
                     setLoading(true);
                     try {
                            const res = await api.get('/orders/');
                            setOrders(res.data.filter((o: any) => o.delivery_id === delivery.id));
                     } catch (e) {
                            console.error(e);
                     } finally {
                            setLoading(false);
                     }
              };
              fetchOrders();
       }, [delivery]);

       return (
              <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm animate-fade-in">
                     <div className="w-full max-w-md bg-white h-full shadow-2xl p-5 sm:p-6 flex flex-col animate-slide-in-right">
                            <div className="flex justify-between items-center mb-5 sm:mb-6 border-b border-slate-100 pb-5">
                                   <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                 <Truck className="w-5 h-5 text-white" />
                                          </div>
                                          <div>
                                                 <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Reparto #{delivery.id}</h2>
                                                 <p className="text-xs text-slate-500 mt-0.5 font-medium">{new Date(delivery.created_at).toLocaleString('es-AR')}</p>
                                          </div>
                                   </div>
                                   <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 -mx-1 px-1">
                                   {loading ? (
                                          <div className="text-center py-10 text-slate-400">Cargando...</div>
                                   ) : orders.length === 0 ? (
                                          <div className="empty-state py-10">
                                                 <div className="empty-state-icon"><Box className="w-6 h-6 text-slate-400" /></div>
                                                 <p className="text-slate-400 text-sm">Sin pedidos asignados</p>
                                          </div>
                                   ) : (
                                          orders.map(order => (
                                                 <div key={order.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:border-blue-100 transition-all group">
                                                        <div className="flex justify-between items-start mb-2.5">
                                                               <span className="font-bold text-slate-800 text-sm">Pedido #{order.id}</span>
                                                               <span className={`chip text-[10px] ${order.status === 'DELIVERED' ? 'chip-delivered' : 'chip-pending'}`}>
                                                                      {order.status === 'DELIVERED' ? 'Entregado' : 'Pendiente'}
                                                               </span>
                                                        </div>
                                                        <div className="text-sm text-slate-700 mb-1 font-semibold truncate">{order.client?.name}</div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-3 truncate">
                                                               <MapPin className="w-3 h-3 flex-shrink-0" /> {order.client?.address}
                                                        </div>

                                                        {order.status !== 'DELIVERED' && (
                                                               <Button onClick={() => onDeliver(order)} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-9 text-xs shadow-lg shadow-slate-900/10 active:scale-[0.98] transition">
                                                                      <Truck className="w-3.5 h-3.5 mr-1.5" /> Entregar
                                                               </Button>
                                                        )}
                                                 </div>
                                          ))
                                   )}
                            </div>
                     </div>
              </div>
       )
}
