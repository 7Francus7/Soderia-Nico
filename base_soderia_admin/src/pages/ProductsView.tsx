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
       ChevronLeft,
       ChevronRight,
       Package,
       Pencil,
       Trash2,
       X,
       DollarSign,
       Barcode,
       Plus,
       AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

interface Product {
       id: number;
       name: string;
       code: string;
       description?: string;
       price: number;
       stock?: number;
       is_returnable: boolean;
}

export default function ProductsView() {
       const [data, setData] = useState<Product[]>([]);
       const [loading, setLoading] = useState(true);

       const [sorting, setSorting] = useState<SortingState>([]);
       const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
       const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

       const [isModalOpen, setIsModalOpen] = useState(false);
       const [editingId, setEditingId] = useState<number | null>(null);
       const [formData, setFormData] = useState({
              name: "", code: "", price: "", description: "", is_returnable: false
       });

       const fetchData = async () => {
              setLoading(true);
              try {
                     const response = await api.get('/products/');
                     setData(response.data);
              } catch (error) {
                     console.error("Error fetching products:", error);
              } finally {
                     setLoading(false);
              }
       };

       useEffect(() => { fetchData(); }, []);

       const openCreateModal = () => {
              setEditingId(null);
              setFormData({ name: "", code: "", price: "", description: "", is_returnable: false });
              setIsModalOpen(true);
       };

       const openEditModal = (product: Product) => {
              setEditingId(product.id);
              setFormData({
                     name: product.name,
                     code: product.code,
                     price: product.price.toString(),
                     description: product.description || "",
                     is_returnable: product.is_returnable
              });
              setIsModalOpen(true);
       };

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              try {
                     const payload = { ...formData, price: parseFloat(formData.price) };
                     if (editingId) {
                            await api.put(`/products/${editingId}`, payload);
                            toast.success("Producto actualizado correctamente");
                     } else {
                            await api.post("/products/", payload);
                            toast.success("Producto creado correctamente");
                     }
                     setIsModalOpen(false);
                     fetchData();
              } catch (error) {
                     console.error(error);
              }
       };

       const handleDelete = async (product: Product) => {
              if (confirm(`¿Estás seguro de eliminar el producto ${product.name}?`)) {
                     try {
                            await api.delete(`/products/${product.id}`);
                            toast.success("Producto eliminado correctamente");
                            fetchData();
                     } catch (error) {
                            console.error(error);
                     }
              }
       };

       const columns = useMemo<ColumnDef<Product>[]>(() => [
              {
                     accessorKey: "name",
                     header: "Producto",
                     cell: ({ row }) => (
                            <div>
                                   <div className="font-semibold text-slate-900">{row.original.name}</div>
                                   {row.original.is_returnable && (
                                          <span className="chip chip-confirmed text-[10px] mt-1">RETORNABLE</span>
                                   )}
                            </div>
                     )
              },
              {
                     accessorKey: "code",
                     header: "Código",
                     cell: ({ getValue }) => <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{getValue() as string}</span>
              },
              {
                     accessorKey: "price",
                     header: "Precio",
                     cell: ({ getValue }) => <span className="font-bold text-slate-800">${(getValue() as number)?.toLocaleString('es-AR')}</span>
              },
              {
                     accessorKey: "stock",
                     header: "Stock",
                     cell: ({ row }) => {
                            const stock = row.original.stock;
                            if (stock === undefined) return <span className="text-slate-300">—</span>;
                            return (
                                   <span className={`font-semibold flex items-center gap-1 ${stock < 10 ? 'text-red-600' : 'text-slate-600'}`}>
                                          {stock < 10 && <AlertTriangle className="w-3 h-3" />}
                                          {stock}
                                   </span>
                            );
                     }
              },
              {
                     id: "actions",
                     header: "Acciones",
                     cell: ({ row }) => (
                            <div className="flex items-center gap-2 justify-end">
                                   <Button size="sm" variant="ghost" onClick={() => openEditModal(row.original)} title="Editar" className="hover:bg-blue-50 hover:text-blue-600">
                                          <Pencil className="w-4 h-4 text-slate-400" />
                                   </Button>
                                   <Button size="sm" variant="ghost" className="hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(row.original)} title="Eliminar">
                                          <Trash2 className="w-4 h-4 text-slate-400" />
                                   </Button>
                            </div>
                     )
              }
       ], []);

       const table = useReactTable({
              data,
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
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">📦 Productos</h1>
                                   <p className="text-slate-500 text-sm mt-0.5 font-medium">Gestión del catálogo de productos y precios.</p>
                            </div>
                            <Button onClick={openCreateModal} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20">
                                   <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
                            </Button>
                     </div>

                     <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                            <div className="relative flex-1">
                                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <input
                                          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                                          placeholder="Buscar producto..."
                                          className="input-premium"
                                   />
                            </div>
                     </div>

                     {/* MOBILE CARDS */}
                     <div className="md:hidden space-y-3">
                            {loading && data.length === 0 ? (
                                   <div className="empty-state"><div className="skeleton-shimmer w-8 h-8 rounded-xl" /><p className="text-slate-400 text-sm mt-3">Cargando productos...</p></div>
                            ) : table.getRowModel().rows.length === 0 ? (
                                   <div className="empty-state">
                                          <div className="empty-state-icon"><Package className="w-7 h-7 text-slate-400" /></div>
                                          <p className="text-slate-500 text-sm font-medium">No hay productos</p>
                                          <p className="text-slate-400 text-xs mt-1">Creá un producto para empezar</p>
                                   </div>
                            ) : (
                                   table.getRowModel().rows.map((row, idx) => {
                                          const product = row.original;
                                          return (
                                                 <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-slate-200 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                                                        <div className="flex items-start justify-between mb-2">
                                                               <div className="min-w-0 flex-1">
                                                                      <div className="font-bold text-slate-800 truncate">{product.name}</div>
                                                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                             <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{product.code}</span>
                                                                             {product.is_returnable && (
                                                                                    <span className="chip chip-confirmed text-[10px]">RETORNABLE</span>
                                                                             )}
                                                                      </div>
                                                               </div>
                                                               <div className="text-right flex-shrink-0 ml-3">
                                                                      <div className="text-lg font-extrabold text-slate-900">${product.price?.toLocaleString('es-AR')}</div>
                                                                      {product.stock !== undefined && (
                                                                             <div className={`text-xs mt-0.5 font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                                                                                    Stock: {product.stock}
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-3 border-t border-slate-50">
                                                               <Button size="sm" variant="outline" onClick={() => openEditModal(product)} className="flex-1 border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                                                                      <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                                                               </Button>
                                                               <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(product)}>
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
                                   <table className="w-full text-left table-premium">
                                          <thead>
                                                 {table.getHeaderGroups().map(headerGroup => (
                                                        <tr key={headerGroup.id}>
                                                               {headerGroup.headers.map(header => (
                                                                      <th key={header.id}>
                                                                             {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                                      </th>
                                                               ))}
                                                        </tr>
                                                 ))}
                                          </thead>
                                          <tbody>
                                                 {loading && data.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-16 text-center">
                                                               <div className="flex flex-col items-center gap-3">
                                                                      <div className="w-8 h-8 skeleton-shimmer rounded-xl" />
                                                                      <span className="text-slate-400 text-sm">Cargando productos...</span>
                                                               </div>
                                                        </td></tr>
                                                 ) : table.getRowModel().rows.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-16 text-center">
                                                               <div className="empty-state py-8">
                                                                      <div className="empty-state-icon"><Package className="w-7 h-7 text-slate-400" /></div>
                                                                      <p className="text-slate-500 text-sm font-medium">No hay productos registrados</p>
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

                     {/* Create/Edit Modal */}
                     {isModalOpen && (
                            <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
                                   <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-5 sm:p-7 shadow-2xl animate-slide-in-up max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                                          <div className="flex justify-between items-center mb-5">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                                               <Package className="w-5 h-5 text-white" />
                                                        </div>
                                                        <h3 className="text-lg font-extrabold text-slate-900">
                                                               {editingId ? "Editar Producto" : "Nuevo Producto"}
                                                        </h3>
                                                 </div>
                                                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition"><X className="w-5 h-5" /></button>
                                          </div>

                                          <p className="text-slate-500 mb-5 text-sm font-medium">
                                                 {editingId ? "Modificá los detalles del producto." : "Completá los datos para crear un nuevo producto."}
                                          </p>

                                          <form onSubmit={handleSubmit} className="space-y-4">
                                                 <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre del Producto</label>
                                                        <div className="relative">
                                                               <Package className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                                               <input type="text" className="input-premium" placeholder="Ej: Soda Sifón 1L" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                                        </div>
                                                 </div>

                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                               <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Código</label>
                                                               <div className="relative">
                                                                      <Barcode className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                                                      <input type="text" className="input-premium uppercase" placeholder="Ej: S1L" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                                                               </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                               <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Precio</label>
                                                               <div className="relative">
                                                                      <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                                                      <input type="number" step="0.01" className="input-premium" placeholder="0.00" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/80">
                                                        <input
                                                               type="checkbox"
                                                               id="is_returnable"
                                                               className="w-5 h-5 text-blue-600 rounded-lg accent-blue-600"
                                                               checked={formData.is_returnable}
                                                               onChange={e => setFormData({ ...formData, is_returnable: e.target.checked })}
                                                        />
                                                        <label htmlFor="is_returnable" className="text-sm text-slate-700 font-medium select-none cursor-pointer">
                                                               ¿Es un envase retornable?
                                                        </label>
                                                 </div>

                                                 <div className="flex gap-3 pt-2">
                                                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                                                        <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20">
                                                               {editingId ? "Guardar Cambios" : "Crear Producto"}
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}
              </div>
       );
}
