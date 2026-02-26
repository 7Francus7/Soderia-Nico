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
       DollarSign,
       ShoppingCart
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

const STATUS_CHIP: Record<string, string> = {
       DRAFT: 'chip chip-draft',
       CONFIRMED: 'chip chip-confirmed',
       DELIVERED: 'chip chip-delivered',
       CANCELLED: 'chip chip-cancelled',
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

       // Quick Client Creation State
       const [isCreatingClient, setIsCreatingClient] = useState(false);
       const [newClientAddress, setNewClientAddress] = useState("");
       const [newClientPhone, setNewClientPhone] = useState("");

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

                     try {
                            await api.put(`/orders/${res.data.id}/confirm`);
                     } catch (_) { }

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

       const handleQuickCreateClient = async () => {
              if (!searchClient.trim()) {
                     toast.error("Ingresá el nombre del cliente");
                     return;
              }
              try {
                     const res = await api.post('/clients/', {
                            name: searchClient,
                            address: newClientAddress || "Sin especificar",
                            phone: newClientPhone || ""
                     });
                     toast.success("Cliente creado correctamente");
                     const newClient = res.data;
                     setClients(prev => [...prev, newClient]);
                     setSelectedClient(newClient);
                     setSearchClient("");
                     setIsCreatingClient(false);
                     setNewClientAddress("");
                     setNewClientPhone("");
              } catch (error) {
                     toast.error("Error al crear cliente rápido");
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
              if (statusFilter !== "ALL") {
                     result = result.filter(order => order.status === statusFilter);
              }
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
                     cell: ({ getValue }) => <span className="font-mono text-xs font-semibold text-slate-400">#{getValue() as number}</span>
              },
              {
                     accessorKey: "client_id",
                     header: "Cliente",
                     cell: ({ row }) => {
                            const client = clients.find(c => c.id === row.original.client_id);
                            return (
                                   <div className="font-semibold text-slate-900">
                                          {client ? client.name : `Cliente #${row.original.client_id}`}
                                   </div>
                            );
                     }
              },
              {
                     accessorKey: "created_at",
                     header: "Fecha",
                     cell: ({ getValue }) => (
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                   <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                   {new Date(getValue() as string).toLocaleDateString('es-AR')}
                            </div>
                     )
              },
              {
                     accessorKey: "status",
                     header: "Estado",
                     cell: ({ getValue }) => {
                            const status = getValue() as string;
                            return (
                                   <span className={STATUS_CHIP[status] || 'chip chip-draft'}>
                                          {STATUS_LABELS[status] || status}
                                   </span>
                            );
                     }
              },
              {
                     accessorKey: "total_amount",
                     header: "Total",
                     cell: ({ getValue }) => <span className="font-bold text-slate-800">${(getValue() as number).toLocaleString('es-AR')}</span>
              },
              {
                     id: "actions",
                     header: "Acciones",
                     cell: ({ row }) => (
                            <div className="flex items-center justify-end gap-2">
                                   {row.original.status !== 'DELIVERED' && row.original.status !== 'CANCELLED' && (
                                          <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-md" onClick={() => { setDeliveryOrder(row.original); setIsDeliverModalOpen(true); }}>
                                                 <Truck className="w-3 h-3 mr-1.5" /> Entregar
                                          </Button>
                                   )}
                                   <Button size="sm" variant="ghost" className="hover:text-red-600 hover:bg-red-50" onClick={() => { setDeleteOrderId(row.original.id); setIsConfirmOpen(true); }}>
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
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in-up">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">📦 Pedidos</h1>
                                   <p className="text-slate-500 text-sm mt-0.5 font-medium">Gestión y seguimiento de pedidos.</p>
                            </div>
                            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-blue-600/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">
                                   <Plus className="w-4 h-4 mr-2" /> Nuevo Pedido
                            </Button>
                     </div>

                     {/* Toolbar */}
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                            <div className="relative flex-1">
                                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <input
                                          value={globalFilter}
                                          onChange={(e) => { setGlobalFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }}
                                          placeholder="Buscar por cliente..."
                                          className="input-premium"
                                   />
                            </div>
                            <span className="text-sm text-slate-400 font-medium text-center sm:text-left whitespace-nowrap">{filteredData.length} pedido{filteredData.length !== 1 ? 's' : ''}</span>
                     </div>

                     {/* Status Filter Tabs */}
                     <div className="flex gap-1.5 overflow-x-auto pb-0.5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            {[{ key: 'ALL', label: 'Todos' }, { key: 'CONFIRMED', label: 'Confirmados' }, { key: 'DELIVERED', label: 'Entregados' }, { key: 'CANCELLED', label: 'Cancelados' }, { key: 'DRAFT', label: 'Borradores' }].map(tab => (
                                   <button key={tab.key} onClick={() => { setStatusFilter(tab.key); setPagination(p => ({ ...p, pageIndex: 0 })); }} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${statusFilter === tab.key ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'}`}>
                                          {tab.label}
                                   </button>
                            ))}
                     </div>

                     {/* MOBILE CARDS */}
                     <div className="md:hidden space-y-3">
                            {loading ? (
                                   <div className="empty-state"><div className="skeleton-shimmer w-8 h-8 rounded-xl" /><p className="text-slate-400 text-sm mt-3">Cargando pedidos...</p></div>
                            ) : filteredData.length === 0 ? (
                                   <div className="empty-state">
                                          <div className="empty-state-icon"><ShoppingCart className="w-7 h-7 text-slate-400" /></div>
                                          <p className="text-slate-500 text-sm font-medium">No hay pedidos</p>
                                          <p className="text-slate-400 text-xs mt-1">Creá un nuevo pedido para empezar</p>
                                   </div>
                            ) : (
                                   table.getRowModel().rows.map((row, idx) => {
                                          const order = row.original;
                                          const client = clients.find(c => c.id === order.client_id);
                                          return (
                                                 <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-slate-200 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                                                        <div className="flex items-start justify-between mb-3">
                                                               <div className="min-w-0 flex-1">
                                                                      <div className="flex items-center gap-2 mb-1">
                                                                             <span className="font-mono text-xs text-slate-400 font-semibold">#{order.id}</span>
                                                                             <span className={STATUS_CHIP[order.status] || 'chip chip-draft'} style={{ fontSize: '10px' }}>
                                                                                    {STATUS_LABELS[order.status] || order.status}
                                                                             </span>
                                                                      </div>
                                                                      <div className="font-bold text-slate-800 truncate">{client?.name || `Cliente #${order.client_id}`}</div>
                                                                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                                                             <Calendar className="w-3 h-3" />
                                                                             {new Date(order.created_at).toLocaleDateString('es-AR')}
                                                                      </div>
                                                               </div>
                                                               <div className="text-right flex-shrink-0 ml-3">
                                                                      <div className="text-lg font-extrabold text-slate-900">${order.total_amount.toLocaleString('es-AR')}</div>
                                                               </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-3 border-t border-slate-50">
                                                               {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                                                      <Button size="sm" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" onClick={() => { setDeliveryOrder(order); setIsDeliverModalOpen(true); }}>
                                                                             <Truck className="w-3.5 h-3.5 mr-1.5" /> Entregar
                                                                      </Button>
                                                               )}
                                                               <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => { setDeleteOrderId(order.id); setIsConfirmOpen(true); }}>
                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                               </Button>
                                                        </div>
                                                 </div>
                                          );
                                   })
                            )}
                     </div>

                     {/* DESKTOP TABLE */}
                     <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse table-premium">
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
                                                 {loading ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-16 text-center">
                                                               <div className="flex flex-col items-center gap-3">
                                                                      <div className="w-8 h-8 skeleton-shimmer rounded-xl" />
                                                                      <span className="text-slate-400 text-sm">Cargando pedidos...</span>
                                                               </div>
                                                        </td></tr>
                                                 ) : table.getRowModel().rows.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-16 text-center">
                                                               <div className="empty-state py-8">
                                                                      <div className="empty-state-icon"><ShoppingCart className="w-7 h-7 text-slate-400" /></div>
                                                                      <p className="text-slate-500 text-sm font-medium">No hay pedidos</p>
                                                                      <p className="text-slate-400 text-xs mt-1">Creá un nuevo pedido para empezar</p>
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

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                                   <span className="text-sm text-slate-500 font-medium">
                                          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                                   </span>
                                   <div className="flex gap-2">
                                          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 hover:border-slate-300 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                                          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 hover:border-slate-300 transition-all"><ChevronRight className="w-4 h-4" /></button>
                                   </div>
                            </div>
                     </div>

                     {/* Mobile Pagination */}
                     <div className="md:hidden flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                                   Pág. {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                            </span>
                            <div className="flex gap-2">
                                   <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 active:scale-95 transition hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                                   <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 active:scale-95 transition hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                     </div>

                     {/* Create Order Modal */}
                     {isModalOpen && (
                            <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
                                   <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-slide-in-up">
                                          <div className="flex justify-between items-center mb-5 sm:mb-6">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                               <ShoppingCart className="w-5 h-5 text-white" />
                                                        </div>
                                                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Nuevo Pedido</h2>
                                                 </div>
                                                 <button onClick={() => { setIsModalOpen(false); setIsCreatingClient(false); }} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition"><X className="w-5 h-5" /></button>
                                          </div>

                                          <div className="flex-1 overflow-y-auto space-y-5 sm:space-y-6 pr-1">
                                                 {/* 1. Select Client */}
                                                 <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cliente</label>
                                                        {!selectedClient ? (
                                                               <div className="relative">
                                                                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                                                      <input
                                                                             type="text"
                                                                             placeholder="Buscar cliente..."
                                                                             className="input-premium"
                                                                             value={searchClient}
                                                                             onChange={e => setSearchClient(e.target.value)}
                                                                      />
                                                                      {searchClient && (
                                                                             <div className="absolute top-[80px] left-0 right-0 bg-white border border-slate-200 mt-1 rounded-xl shadow-xl max-h-60 overflow-y-auto z-10 flex flex-col">
                                                                                    {filteredClients.map(c => (
                                                                                           <button key={c.id} onClick={() => { setSelectedClient(c); setSearchClient(""); setIsCreatingClient(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm active:bg-slate-100 transition border-b border-slate-50 last:border-0">
                                                                                                  <div className="font-semibold text-slate-800">{c.name}</div>
                                                                                                  <div className="text-xs text-slate-400">{c.address}</div>
                                                                                           </button>
                                                                                    ))}
                                                                                    {filteredClients.length === 0 && !isCreatingClient && (
                                                                                           <div className="p-4 text-center">
                                                                                                  <p className="text-sm text-slate-500 mb-3">No se encontraron clientes.</p>
                                                                                                  <Button size="sm" onClick={() => setIsCreatingClient(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                                                                                                         Crear "{searchClient}"
                                                                                                  </Button>
                                                                                           </div>
                                                                                    )}
                                                                                    {isCreatingClient && (
                                                                                           <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 flex flex-col gap-3">
                                                                                                  <div className="text-sm font-bold text-emerald-800">Crear Nuevo Cliente</div>
                                                                                                  <input
                                                                                                         type="text"
                                                                                                         placeholder="Dirección (opcional)"
                                                                                                         className="input-premium !py-2 !text-sm"
                                                                                                         value={newClientAddress}
                                                                                                         onChange={(e) => setNewClientAddress(e.target.value)}
                                                                                                         autoFocus
                                                                                                  />
                                                                                                  <input
                                                                                                         type="text"
                                                                                                         placeholder="Teléfono (opcional)"
                                                                                                         className="input-premium !py-2 !text-sm"
                                                                                                         value={newClientPhone}
                                                                                                         onChange={(e) => setNewClientPhone(e.target.value)}
                                                                                                  />
                                                                                                  <div className="flex gap-2">
                                                                                                         <Button size="sm" variant="ghost" onClick={() => setIsCreatingClient(false)} className="flex-1 text-slate-500 hover:bg-slate-200">Cancelar</Button>
                                                                                                         <Button size="sm" onClick={handleQuickCreateClient} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">Guardar</Button>
                                                                                                  </div>
                                                                                           </div>
                                                                                    )}
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        ) : (
                                                               <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                                                                      <div className="min-w-0 flex-1">
                                                                             <div className="font-bold text-blue-900 truncate">{selectedClient.name}</div>
                                                                             <div className="text-xs text-blue-600 truncate">{selectedClient.address}</div>
                                                                      </div>
                                                                      <Button size="sm" variant="ghost" onClick={() => { setSelectedClient(null); setIsCreatingClient(false); }} className="flex-shrink-0 ml-2 text-blue-600 hover:bg-blue-100">Cambiar</Button>
                                                               </div>
                                                        )}
                                                 </div>

                                                 {/* 2. Select Products */}
                                                 {selectedClient && (
                                                        <div className="space-y-2">
                                                               <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Productos</label>
                                                               <div className="border border-slate-200 rounded-xl overflow-hidden">
                                                                      <div className="max-h-60 overflow-y-auto bg-slate-50/50 p-2.5 space-y-2">
                                                                             {products.map(p => {
                                                                                    const qty = getQuantity(p.id);
                                                                                    return (
                                                                                           <div key={p.id} className={`flex items-center justify-between bg-white p-3.5 rounded-xl border transition-all ${qty > 0 ? 'border-blue-200 bg-blue-50/30 shadow-sm' : 'border-slate-100'}`}>
                                                                                                  <div className="min-w-0 flex-1">
                                                                                                         <div className="font-semibold text-slate-800 text-sm truncate">{p.name}</div>
                                                                                                         <div className="text-xs text-slate-500 font-medium">${p.price.toLocaleString('es-AR')}</div>
                                                                                                  </div>
                                                                                                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
                                                                                                         <button onClick={() => removeFromCart(p.id)} disabled={qty === 0} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 active:scale-95 transition flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                                                                                                         <span className={`w-7 text-center font-bold text-sm ${qty > 0 ? 'text-blue-600' : 'text-slate-300'}`}>{qty}</span>
                                                                                                         <button onClick={() => addToCart(p)} className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition flex items-center justify-center shadow-md shadow-blue-600/20"><Plus className="w-3 h-3" /></button>
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
                                          <div className="pt-5 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                 <div className="flex justify-between w-full sm:w-auto sm:block">
                                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total del Pedido</div>
                                                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">${cartTotal.toLocaleString('es-AR')}</div>
                                                 </div>
                                                 <div className="flex gap-3 w-full sm:w-auto">
                                                        <Button variant="ghost" onClick={() => { setIsModalOpen(false); setIsCreatingClient(false); }} className="flex-1 sm:flex-none">Cancelar</Button>
                                                        <Button onClick={handleCreateOrder} disabled={!selectedClient || cart.length === 0} className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20">
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
