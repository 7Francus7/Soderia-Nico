import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import {
       useReactTable,
       getCoreRowModel,
       getFilteredRowModel,
       getPaginationRowModel,
       getSortedRowModel,
       flexRender,
       type ColumnDef,
       type SortingState,
       type ColumnFiltersState,
       type PaginationState,
} from "@tanstack/react-table";
import {
       Search,
       Plus,
       Minus,
       ChevronLeft,
       Trash2,
       X,
       Calendar,
       Truck,
       ChevronRight,
       DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import DeliverOrderModal from "../components/DeliverOrderModal";
import ConfirmDialog from "../components/ConfirmDialog";

// --- Types ---

interface Order {
       id: number;
       client_id: number;
       status: string;
       total_amount: number;
       created_at: string;
       notes?: string;
}

interface Client {
       id: number;
       name: string;
       address: string;
}

interface Product {
       id: number;
       name: string;
       price: number;
       code: string;
}

// --- Main Component ---

const STATUS_LABELS: Record<string, string> = {
       DRAFT: 'Borrador',
       CONFIRMED: 'Confirmado',
       DELIVERED: 'Entregado',
       CANCELLED: 'Cancelado',
};

export default function OrdersView() {
       const [data, setData] = useState<Order[]>([]);
       const [clients, setClients] = useState<Client[]>([]);
       const [products, setProducts] = useState<Product[]>([]);
       const [loading, setLoading] = useState(true);
       const [globalFilter, setGlobalFilter] = useState("");

       // Table State
       const [sorting, setSorting] = useState<SortingState>([]);
       const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
       const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

       // Modal State
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
       const [selectedClient, setSelectedClient] = useState<Client | null>(null);
       const [deliveryOrder, setDeliveryOrder] = useState<Order | null>(null);
       const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
       const [searchClient, setSearchClient] = useState("");
       const [statusFilter, setStatusFilter] = useState<string>("ALL");

       // Delete confirmation
       const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
       const [isConfirmOpen, setIsConfirmOpen] = useState(false);

       // Fetch Data
       const fetchData = async () => {
              setLoading(true);
              try {
                     const [ordersRes, clientsRes, productsRes] = await Promise.all([
                            api.get('/orders/'),
                            api.get('/clients/'),
                            api.get('/products/')
                     ]);
                     setData(ordersRes.data);
                     setClients(clientsRes.data);
                     setProducts(productsRes.data);
              } catch (error) {
                     toast.error("Error al cargar datos", { description: "Verificá la conexión con el servidor" });
              } finally {
                     setLoading(false);
              }
       };

       useEffect(() => {
              fetchData();
       }, []);

       // --- Actions ---

       const handleCreateOrder = async () => {
              if (!selectedClient || cart.length === 0) return;

              try {
                     const orderPayload = {
                            client_id: selectedClient.id,
                            items: cart.map(item => ({
                                   product_id: item.product.id,
                                   quantity: item.quantity,
                                   unit_price: item.product.price
                            })),
                            notes: "Generado desde Panel Admin"
                     };

                     const res = await api.post('/orders/', orderPayload);

                     // Auto-confirm the order so it's ready for delivery
                     try {
                            await api.put(`/orders/${res.data.id}/confirm`);
                     } catch (_) { /* If confirm fails, order stays as DRAFT */ }

                     toast.success("Pedido creado y confirmado");
                     setIsModalOpen(false);
                     fetchData();

                     setSelectedClient(null);
                     setCart([]);
                     setSearchClient("");
              } catch (error) {
                     toast.error("No se pudo crear el pedido");
              }
       };

       const handleDeleteOrder = async (orderId: number) => {
              try {
                     await api.delete(`/orders/${orderId}`);
                     toast.success("Pedido eliminado");
                     fetchData();
              } catch (error) {
                     toast.error("No se pudo eliminar el pedido");
              } finally {
                     setIsConfirmOpen(false);
                     setDeleteOrderId(null);
              }
       };

       const handleCancelOrder = async (orderId: number) => {
              try {
                     await api.put(`/orders/${orderId}/cancel`);
                     toast.success("Pedido cancelado");
                     fetchData();
              } catch (error) {
                     toast.error("No se pudo cancelar el pedido");
              }
       };

       // --- Cart Logic ---
       const addToCart = (product: Product) => {
              setCart(prev => {
                     const existing = prev.find(item => item.product.id === product.id);
                     if (existing) {
                            return prev.map(item => item.product.id === product.id ? { ...item, quantity: existing.quantity + 1 } : item);
                     }
                     return [...prev, { product, quantity: 1 }];
              });
       };

       const removeFromCart = (productId: number) => {
              setCart(prev => prev.reduce((acc, item) => {
                     if (item.product.id === productId) {
                            if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 });
                     } else {
                            acc.push(item);
                     }
                     return acc;
              }, [] as { product: Product; quantity: number }[]));
       };

       const getQuantity = (productId: number) => cart.find(item => item.product.id === productId)?.quantity || 0;
       const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
       const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchClient.toLowerCase()));

       const filteredData = useMemo(() => {
              let result = data;
              // Filter by status
              if (statusFilter !== "ALL") {
                     result = result.filter(order => order.status === statusFilter);
              }
              // Filter by client name search
              if (globalFilter) {
                     result = result.filter(order => {
                            const clientName = clients.find(c => c.id === order.client_id)?.name?.toLowerCase() || '';
                            return clientName.includes(globalFilter.toLowerCase());
                     });
              }
              return result;
       }, [data, clients, globalFilter, statusFilter]);

       // --- Columns ---
       const columns = useMemo<ColumnDef<Order>[]>(() => [
              {
                     accessorKey: "id",
                     header: "ID",
                     cell: ({ getValue }) => <span className="font-mono text-slate-500">#{getValue() as number}</span>
              },
              {
                     accessorKey: "client_id",
                     header: "Cliente",
                     cell: ({ row }) => {
                            const client = clients.find(c => c.id === row.original.client_id);
                            return (
                                   <div className="font-medium text-slate-900">
                                          {client ? client.name : `Cliente #${row.original.client_id}`}
                                   </div>
                            );
                     }
              },
              {
                     accessorKey: "created_at",
                     header: "Fecha",
                     cell: ({ getValue }) => (
                            <div className="flex items-center gap-1 text-slate-500 text-sm">
                                   <Calendar className="w-3 h-3" />
                                   {new Date(getValue() as string).toLocaleDateString()}
                            </div>
                     )
              },
              {
                     accessorKey: "status",
                     header: "Estado",
                     cell: ({ getValue }) => {
                            const status = getValue() as string;
                            const colors: Record<string, string> = {
                                   DRAFT: "bg-gray-100 text-gray-600",
                                   CONFIRMED: "bg-blue-100 text-blue-700",
                                   DELIVERED: "bg-green-100 text-green-700",
                                   CANCELLED: "bg-red-100 text-red-700"
                            };
                            return (
                                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100"}`}>
                                          {STATUS_LABELS[status] || status}
                                   </span>
                            );
                     }
              },
              {
                     accessorKey: "total_amount",
                     header: "Total",
                     cell: ({ getValue }) => <span className="font-bold text-slate-700">${(getValue() as number).toLocaleString()}</span>
              },
              {
                     id: "actions",
                     header: "Acciones",
                     cell: ({ row }) => (
                            <div className="flex items-center justify-end gap-2">
                                   {row.original.status !== 'DELIVERED' && row.original.status !== 'CANCELLED' && (
                                          <Button size="sm" className="bg-slate-800 hover:bg-slate-900 text-white" onClick={() => { setDeliveryOrder(row.original); setIsDeliverModalOpen(true); }}>
                                                 <Truck className="w-3 h-3 mr-1.5" /> Entregar
                                          </Button>
                                   )}
                                   <Button size="sm" variant="ghost" className="hover:text-red-600" onClick={() => { setDeleteOrderId(row.original.id); setIsConfirmOpen(true); }}>
                                          <Trash2 className="w-4 h-4" />
                                   </Button>
                            </div>
                     )
              }
       ], [clients]);

       const table = useReactTable({
              data: filteredData,
              columns,
              state: { sorting, columnFilters, pagination },
              onSortingChange: setSorting,
              onColumnFiltersChange: setColumnFilters,
              onPaginationChange: setPagination,
              getCoreRowModel: getCoreRowModel(),
              getPaginationRowModel: getPaginationRowModel(),
              getSortedRowModel: getSortedRowModel(),
              getFilteredRowModel: getFilteredRowModel(),
       });

       return (
              <div className="space-y-4 md:space-y-6">
                     {/* Header */}
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Pedidos</h1>
                                   <p className="text-slate-500 text-sm mt-0.5">Gestión y seguimiento de pedidos.</p>
                            </div>
                            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-blue-600/20">
                                   <Plus className="w-4 h-4 mr-2" /> Nuevo Pedido
                            </Button>
                     </div>

                     {/* Toolbar */}
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <input
                                          value={globalFilter}
                                          onChange={(e) => { setGlobalFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }}
                                          placeholder="Buscar por cliente..."
                                          className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                   />
                            </div>
                            <span className="text-sm text-slate-400 text-center sm:text-left">{filteredData.length} pedido{filteredData.length !== 1 ? 's' : ''}</span>
                     </div>

                     {/* Status Filter Tabs */}
                     <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                            {[{ key: 'ALL', label: 'Todos' }, { key: 'CONFIRMED', label: 'Confirmados' }, { key: 'DELIVERED', label: 'Entregados' }, { key: 'CANCELLED', label: 'Cancelados' }, { key: 'DRAFT', label: 'Borradores' }].map(tab => (
                                   <button key={tab.key} onClick={() => { setStatusFilter(tab.key); setPagination(p => ({ ...p, pageIndex: 0 })); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${statusFilter === tab.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                          {tab.label}
                                   </button>
                            ))}
                     </div>

                     {/* MOBILE CARDS */}
                     <div className="md:hidden space-y-3">
                            {loading ? (
                                   <div className="text-center py-12 text-slate-400 text-sm">Cargando...</div>
                            ) : filteredData.length === 0 ? (
                                   <div className="text-center py-12 text-slate-400 text-sm">No hay pedidos.</div>
                            ) : (
                                   table.getRowModel().rows.map(row => {
                                          const order = row.original;
                                          const client = clients.find(c => c.id === order.client_id);
                                          const statusColors: Record<string, string> = {
                                                 DRAFT: "bg-gray-100 text-gray-600",
                                                 CONFIRMED: "bg-blue-100 text-blue-700",
                                                 DELIVERED: "bg-green-100 text-green-700",
                                                 CANCELLED: "bg-red-100 text-red-700"
                                          };
                                          return (
                                                 <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                               <div className="min-w-0 flex-1">
                                                                      <div className="flex items-center gap-2 mb-0.5">
                                                                             <span className="font-mono text-xs text-slate-400">#{order.id}</span>
                                                                             <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
                                                                                    {STATUS_LABELS[order.status] || order.status}
                                                                             </span>
                                                                      </div>
                                                                      <div className="font-semibold text-slate-800 truncate">{client?.name || `Cliente #${order.client_id}`}</div>
                                                                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                                             <Calendar className="w-3 h-3" />
                                                                             {new Date(order.created_at).toLocaleDateString()}
                                                                      </div>
                                                               </div>
                                                               <div className="text-right flex-shrink-0 ml-3">
                                                                      <div className="text-lg font-bold text-slate-800">${order.total_amount.toLocaleString()}</div>
                                                               </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                                                               {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                                                      <Button size="sm" className="flex-1 bg-slate-800 hover:bg-slate-900 text-white" onClick={() => { setDeliveryOrder(order); setIsDeliverModalOpen(true); }}>
                                                                             <Truck className="w-3.5 h-3.5 mr-1" /> Entregar
                                                                      </Button>
                                                               )}
                                                               <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-500" onClick={() => { setDeleteOrderId(order.id); setIsConfirmOpen(true); }}>
                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                               </Button>
                                                        </div>
                                                 </div>
                                          );
                                   })
                            )}
                     </div>

                     {/* DESKTOP TABLE */}
                     <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead className="bg-slate-50 border-b border-slate-200">
                                                 {table.getHeaderGroups().map(headerGroup => (
                                                        <tr key={headerGroup.id}>
                                                               {headerGroup.headers.map(header => (
                                                                      <th key={header.id} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                                             {flexRender(header.column.columnDef.header, header.getContext())}
                                                                      </th>
                                                               ))}
                                                        </tr>
                                                 ))}
                                          </thead>
                                          <tbody className="divide-y divide-slate-100">
                                                 {loading ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">Cargando...</td></tr>
                                                 ) : table.getRowModel().rows.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">No hay pedidos.</td></tr>
                                                 ) : (
                                                        table.getRowModel().rows.map(row => (
                                                               <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
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

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
                                   <span className="text-sm text-slate-500">
                                          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                                   </span>
                                   <div className="flex gap-2">
                                          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-lg border bg-white disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                                          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-lg border bg-white disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                                   </div>
                            </div>
                     </div>

                     {/* Mobile Pagination */}
                     <div className="md:hidden flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                   Pág. {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                            </span>
                            <div className="flex gap-2">
                                   <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-lg border bg-white disabled:opacity-50 active:scale-95 transition"><ChevronLeft className="w-4 h-4" /></button>
                                   <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-lg border bg-white disabled:opacity-50 active:scale-95 transition"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                     </div>

                     {/* Create Order Modal */}
                     {isModalOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
                                   <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                                          <div className="flex justify-between items-center mb-4 sm:mb-6">
                                                 <h2 className="text-lg sm:text-xl font-bold text-slate-800">Nuevo Pedido</h2>
                                                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
                                          </div>

                                          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-1">
                                                 {/* 1. Select Client */}
                                                 <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-slate-700">Cliente</label>
                                                        {!selectedClient ? (
                                                               <div className="relative">
                                                                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                                      <input
                                                                             type="text"
                                                                             placeholder="Buscar cliente..."
                                                                             className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                                             value={searchClient}
                                                                             onChange={e => setSearchClient(e.target.value)}
                                                                      />
                                                                      {searchClient && (
                                                                             <div className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-xl shadow-lg max-h-40 overflow-y-auto z-10">
                                                                                    {filteredClients.map(c => (
                                                                                           <button key={c.id} onClick={() => { setSelectedClient(c); setSearchClient(""); }} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm active:bg-slate-100">
                                                                                                  <div className="font-medium">{c.name}</div>
                                                                                                  <div className="text-xs text-slate-500">{c.address}</div>
                                                                                           </button>
                                                                                    ))}
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        ) : (
                                                               <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                                                      <div className="min-w-0 flex-1">
                                                                             <div className="font-bold text-blue-900 truncate">{selectedClient.name}</div>
                                                                             <div className="text-xs text-blue-600 truncate">{selectedClient.address}</div>
                                                                      </div>
                                                                      <Button size="sm" variant="ghost" onClick={() => setSelectedClient(null)} className="flex-shrink-0 ml-2">Cambiar</Button>
                                                               </div>
                                                        )}
                                                 </div>

                                                 {/* 2. Select Products */}
                                                 {selectedClient && (
                                                        <div className="space-y-2">
                                                               <label className="text-sm font-semibold text-slate-700">Productos</label>
                                                               <div className="border rounded-xl overflow-hidden">
                                                                      <div className="max-h-60 overflow-y-auto bg-slate-50 p-2 space-y-2">
                                                                             {products.map(p => {
                                                                                    const qty = getQuantity(p.id);
                                                                                    return (
                                                                                           <div key={p.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                                                                  <div className="min-w-0 flex-1">
                                                                                                         <div className="font-medium text-slate-800 text-sm truncate">{p.name}</div>
                                                                                                         <div className="text-xs text-slate-500">${p.price}</div>
                                                                                                  </div>
                                                                                                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                                                                                                         <button onClick={() => removeFromCart(p.id)} disabled={qty === 0} className="p-1.5 rounded-md border hover:bg-slate-50 disabled:opacity-50 active:scale-95 transition"><Minus className="w-3 h-3" /></button>
                                                                                                         <span className="w-6 text-center font-medium text-sm">{qty}</span>
                                                                                                         <button onClick={() => addToCart(p)} className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"><Plus className="w-3 h-3" /></button>
                                                                                                  </div>
                                                                                           </div>
                                                                                    )
                                                                             })}
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 )}
                                          </div>

                                          {/* Footer */}
                                          <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                 <div className="flex justify-between w-full sm:w-auto sm:block">
                                                        <div className="text-xs text-slate-500 uppercase font-bold">Total</div>
                                                        <div className="text-xl sm:text-2xl font-bold text-slate-800">${cartTotal.toLocaleString()}</div>
                                                 </div>
                                                 <div className="flex gap-3 w-full sm:w-auto">
                                                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none">Cancelar</Button>
                                                        <Button onClick={handleCreateOrder} disabled={!selectedClient || cart.length === 0} className="flex-1 sm:flex-none">
                                                               Confirmar Pedido
                                                        </Button>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     )}

                     {/* Delete Confirmation */}
                     <ConfirmDialog
                            isOpen={isConfirmOpen}
                            onCancel={() => { setIsConfirmOpen(false); setDeleteOrderId(null); }}
                            onConfirm={() => deleteOrderId && handleDeleteOrder(deleteOrderId)}
                            title="Eliminar Pedido"
                            message={`¿Estás seguro de eliminar el pedido #${deleteOrderId}? Esta acción no se puede deshacer.`}
                     />

                     {/* Deliver Order Modal */}
                     <DeliverOrderModal
                            isOpen={isDeliverModalOpen}
                            onClose={() => setIsDeliverModalOpen(false)}
                            order={deliveryOrder}
                            onSuccess={fetchData}
                     />
              </div>
       );
}
