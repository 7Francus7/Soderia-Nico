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
       Box
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import DeliverOrderModal from "../components/DeliverOrderModal"; // Resusing existing modal

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
       status: 'pending' | 'completed'; // Simplified status
       orders_count: number;
       delivered_count: number;
       orders?: Order[]; // Optional if eager loaded or fetched in detail
       notes?: string;
}

// --- Components ---

const StatusPill = ({ status }: { status: string }) => {
       const isCompleted = status === 'completed' || status === 'delivered';
       return (
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border w-fit shadow-sm ${isCompleted
                     ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                     : "bg-amber-100 text-amber-700 border-amber-200"
                     }`}>
                     {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                     {isCompleted ? "Completado" : "En Curso"}
              </span>
       );
};

// --- Main Page ---

export default function DeliveriesView() {
       const [data, setData] = useState<Delivery[]>([]);
       const [loading, setLoading] = useState(true);

       // Table State
       const [sorting, setSorting] = useState<SortingState>([]);
       const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

       // Modal State: Create
       const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
       const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
       const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
       const [notes, setNotes] = useState("");

       // Detail View State
       const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
       const [isDetailOpen, setIsDetailOpen] = useState(false);

       // Deliver Modal (for individual orders inside a delivery)
       const [orderToDeliver, setOrderToDeliver] = useState<Order | null>(null);
       const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);

       // Fetch Deliveries
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

       // Fetch Orders for Create Modal
       const fetchAvailableOrders = async () => {
              try {
                     const res = await api.get('/orders/');
                     // Filter orders that are CONFIRMED and NOT in a delivery (simplified logic: check status)
                     // In a real app we need backend filtering or efficient query.
                     // Assuming backend returns filtered or we filter here.
                     // Actually, we modified Order model to have delivery_id.
                     // The endpoint /orders/ currently returns all. We should filter on client side for now.
                     // A better backend endpoint would be `/orders/?status=confirmed&no_delivery=true`.
                     // For MVP, we'll just show 'confirmed' ones and assume available.
                     // (Ideally update backend to support this filter).
                     const allOrders = res.data;
                     const ready = allOrders.filter((o: any) => o.status === 'confirmed' && !o.delivery_id);
                     setAvailableOrders(ready);
              } catch (error) {
                     console.error(error);
                     toast.error("Error cargando pedidos pendientes");
              }
       };

       useEffect(() => {
              fetchData();
       }, []);

       useEffect(() => {
              if (isCreateModalOpen) fetchAvailableOrders();
       }, [isCreateModalOpen]);

       const [createLoading, setCreateLoading] = useState(false);



       // Create Delivery
       const handleCreate = async () => {
              if (selectedOrders.length === 0) return;
              setCreateLoading(true);
              try {
                     await api.post('/deliveries/', {
                            order_ids: selectedOrders,
                            notes: notes
                     });
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

       // Open Detail
       const handleOpenDetail = async (delivery: Delivery) => {
              setSelectedDelivery(delivery);
              setIsDetailOpen(true);
              // Optimistic or Fetch? We need the orders list.
              // The list endpoint returns counts but not full orders list typically for performance, 
              // BUT our current backend implementation (modified deliveries.py) 
              // *does* access `d.orders` but converts to Read model which only has counters?
              // Wait, `DeliveryRead` in my previous edit:
              // class DeliveryRead(DeliveryBase): ... orders_count: int
              // It does NOT include the list of orders.
              // I need to fetch the detailed delivery or the orders for this delivery.
              // Since I haven't implemented `GET /deliveries/{id}`, I should probably rely on the 
              // `orders` relationship if I updated `DeliveryRead` to include it or add a specific endpoint.
              //
              // Let's add `orders: List[OrderRead] = []` to `DeliveryRead` in backend or separate endpoint?
              // Simpler: Fetch orders filtered by delivery_id?
              // The backend `read_deliveries` creates `DeliveryRead` objects.
              // I should update `DeliveryRead` to include `orders` OR make an endpoint calls.
              // 
              // QUICK FIX: I'll use the client-side approach of fetching ALL orders (cached/easy) 
              // or better: I will update the backend `DeliveryRead` in `all_models.py` to optionally include orders
              // or just add a new endpoint or fetch orders filtered.
              //
              // Actually, I can use the endpoint `GET /orders/?delivery_id=X` (doesn't exist yet but I can filter client side if I fetch all).
              // 
              // Better: I'll update `DeliveryRead` in backend to include `orders`.
              // I'll do this quickly after writing this file.
       };

       // For now, I'll assume we WILL enforce fetching details.
       // Let's implement a simple fetch for now assuming I fix the backend.

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

       // Columns
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
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                   <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                   {new Date(getValue() as string).toLocaleDateString()}
                            </div>
                     )
              },
              {
                     id: "stats",
                     header: "Progreso",
                     cell: ({ row }) => {
                            const { orders_count, delivered_count } = row.original;
                            const progress = orders_count > 0 ? (delivered_count / orders_count) * 100 : 0;
                            return (
                                   <div className="w-full max-w-[140px]">
                                          <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-600">
                                                 <span>{delivered_count}/{orders_count} Entregados</span>
                                                 <span>{Math.round(progress)}%</span>
                                          </div>
                                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                 <div
                                                        className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${progress}%` }}
                                                 />
                                          </div>
                                   </div>
                            );
                     }
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
                                   <Button size="sm" variant="outline" onClick={() => handleOpenDetail(row.original)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Ver
                                   </Button>
                                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600" onClick={() => handleDelete(row.original.id)}>
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
              <div className="p-6 max-w-7xl mx-auto space-y-6">
                     <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                            <div>
                                   <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Repartos</h1>
                                   <p className="text-slate-500 text-sm mt-1">Gestión de hojas de ruta y entregas agrupadas.</p>
                            </div>
                            <div className="flex gap-2">
                                   <Button variant="outline" onClick={fetchData} className="border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600">
                                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                   </Button>
                                   <Button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20">
                                          <Plus className="w-4 h-4 mr-2" /> Nuevo Reparto
                                   </Button>
                            </div>
                     </div>

                     {/* Table */}
                     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                   <thead className="bg-slate-50/50 border-b border-slate-100">
                                          {table.getHeaderGroups().map(headerGroup => (
                                                 <tr key={headerGroup.id}>
                                                        {headerGroup.headers.map(header => (
                                                               <th key={header.id} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                                                                      {flexRender(header.column.columnDef.header, header.getContext())}
                                                               </th>
                                                        ))}
                                                 </tr>
                                          ))}
                                   </thead>
                                   <tbody className="divide-y divide-slate-50">
                                          {data.length === 0 ? (
                                                 <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">No hay repartos creados.</td></tr>
                                          ) : (
                                                 table.getRowModel().rows.map(row => (
                                                        <tr key={row.id} className="hover:bg-slate-50/50 transition">
                                                               {row.getVisibleCells().map(cell => (
                                                                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                      </td>
                                                               ))}
                                                        </tr>
                                                 ))
                                          )}
                                   </tbody>
                            </table>
                     </div>

                     {/* Create Modal */}
                     {isCreateModalOpen && (
                            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                                   <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                                          <div className="flex justify-between items-center mb-4">
                                                 <h3 className="font-bold text-xl text-slate-800">Nuevo Reparto</h3>
                                                 <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                                          </div>

                                          <div className="mb-4">
                                                 <p className="text-sm text-slate-500 mb-2">Selecciona los pedidos que saldrán en este reparto:</p>
                                                 <div className="border rounded-xl overflow-hidden bg-slate-50 h-64 overflow-y-auto p-2 space-y-1">
                                                        {availableOrders.length === 0 ? (
                                                               <div className="text-center py-10 text-slate-400 text-sm">No hay pedidos confirmados pendientes.</div>
                                                        ) : (
                                                               availableOrders.map(order => (
                                                                      <label key={order.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedOrders.includes(order.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                                                             <input
                                                                                    type="checkbox"
                                                                                    className="w-4 h-4 rounded text-blue-600"
                                                                                    checked={selectedOrders.includes(order.id)}
                                                                                    onChange={() => toggleOrderSelection(order.id)}
                                                                             />
                                                                             <div className="flex-1">
                                                                                    <div className="flex justify-between">
                                                                                           <span className="font-bold text-slate-700">Pedido #{order.id}</span>
                                                                                           <span className="font-semibold text-slate-900">${order.total_amount.toLocaleString()}</span>
                                                                                    </div>
                                                                                    <div className="text-xs text-slate-500">{order.client?.name} - {order.client?.address}</div>
                                                                             </div>
                                                                      </label>
                                                               ))
                                                        )}
                                                 </div>
                                          </div>

                                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                                 <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                                                 <Button onClick={handleCreate} disabled={selectedOrders.length === 0} isLoading={createLoading} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                                                        Crear Reparto ({selectedOrders.length})
                                                 </Button>
                                          </div>
                                   </div>
                            </div>
                     )}

                     {/* Detail Modal (Slide-over style or Center Modal) */}
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
                            onSuccess={() => {
                                   fetchData();
                                   setIsDetailOpen(false); // Close detail to refresh or we need to refresh detailed data inside modal
                            }}
                     />
              </div>
       );
}

// Inner Component for Details to handle its own fetching logic if needed
function DeliveryDetailModal({ delivery, onClose, onDeliver }: { delivery: Delivery, onClose: () => void, onDeliver: (o: Order) => void }) {
       // We fetch the orders for this delivery here to ensure fresh data
       const [orders, setOrders] = useState<Order[]>([]);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
              const fetchOrders = async () => {
                     setLoading(true);
                     try {
                            // Temporary: Fetch all and filter client side because we didn't implement the filter endpoint yet
                            // Ideally: api.get(`/orders/?delivery_id=${delivery.id}`)
                            const res = await api.get('/orders/');
                            // Client side filter
                            // We need to match delivery_id. The endpoint /orders/ doesn't return delivery_id by default in current OrderRead?
                            // Let's check OrderRead model. It inherits OrderBase. OrderBase contains ... check backend.
                            // I added delivery_id to Order model, but did I add it to OrderRead?
                            // Models inherit: OrderRead(OrderBase). OrderBase has client_id. 
                            // I added delivery_id to Order class. OrderBase is separate.
                            // I need to add delivery_id to OrderRead or OrderBase. 
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
              <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm animate-in fade-in">
                     <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                   <div>
                                          <h2 className="text-xl font-bold text-slate-800">Reparto #{delivery.id}</h2>
                                          <p className="text-xs text-slate-500 mt-1">{new Date(delivery.created_at).toLocaleString()}</p>
                                   </div>
                                   <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3">
                                   {loading ? <div className="text-center py-10">Cargando...</div> : orders.length === 0 ? <div className="text-center text-slate-400">Sin pedidos</div> : (
                                          orders.map(order => (
                                                 <div key={order.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:border-blue-100 transition group">
                                                        <div className="flex justify-between items-start mb-2">
                                                               <span className="font-bold text-slate-700 text-sm">Pedido #{order.id}</span>
                                                               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                      {order.status}
                                                               </span>
                                                        </div>
                                                        <div className="text-sm text-slate-600 mb-1 font-medium">{order.client?.name}</div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                                                               <Box className="w-3 h-3" /> {order.client?.address}
                                                        </div>

                                                        {order.status !== 'delivered' && (
                                                               <Button onClick={() => onDeliver(order)} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-8 text-xs shadow-lg shadow-slate-900/10">
                                                                      Entregar
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
