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
       Barcode
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

// --- Types ---

interface Product {
       id: number;
       name: string;
       code: string;
       description?: string;
       price: number;
       stock?: number;
       is_returnable: boolean;
}

// --- Main Page ---

export default function ProductsView() {
       const [data, setData] = useState<Product[]>([]);
       const [loading, setLoading] = useState(true);

       // Table State
       const [sorting, setSorting] = useState<SortingState>([]);
       const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
       const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

       // Modal State
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [editingId, setEditingId] = useState<number | null>(null);
       const [formData, setFormData] = useState({
              name: "",
              code: "",
              price: "",
              description: "",
              is_returnable: false
       });

       // Fetch Data
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

       useEffect(() => {
              fetchData();
       }, []);

       // Handlers
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
                     const payload = {
                            ...formData,
                            price: parseFloat(formData.price)
                     };

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

       // Columns
       const columns = useMemo<ColumnDef<Product>[]>(() => [
              {
                     accessorKey: "name",
                     header: "Producto",
                     cell: ({ row }) => (
                            <div>
                                   <div className="font-medium text-slate-900">{row.original.name}</div>
                                   {row.original.is_returnable && (
                                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">RETORNABLE</span>
                                   )}
                            </div>
                     )
              },
              {
                     accessorKey: "code",
                     header: "Código",
                     cell: ({ getValue }) => <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{getValue() as string}</span>
              },
              {
                     accessorKey: "price",
                     header: "Precio",
                     cell: ({ getValue }) => <span className="font-semibold text-slate-700">${(getValue() as number)?.toLocaleString('es-AR')}</span>
              },
              {
                     accessorKey: "stock",
                     header: "Stock",
                     cell: ({ row }) => (
                            <span className={`font-medium ${row.original.stock && row.original.stock < 10 ? 'text-red-600' : 'text-slate-600'}`}>
                                   {row.original.stock !== undefined ? row.original.stock : '-'}
                            </span>
                     )
              },
              {
                     id: "actions",
                     header: "Acciones",
                     cell: ({ row }) => (
                            <div className="flex items-center gap-2">
                                   <Button size="sm" variant="ghost" onClick={() => openEditModal(row.original)} title="Editar">
                                          <Pencil className="w-4 h-4 text-slate-500" />
                                   </Button>
                                   <Button size="sm" variant="ghost" className="hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(row.original)} title="Eliminar">
                                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
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
                     {/* Header */}
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Productos</h1>
                                   <p className="text-slate-500 text-sm mt-0.5">Gestión del catálogo de productos y precios.</p>
                            </div>
                            <Button onClick={openCreateModal} className="w-full sm:w-auto shadow-lg shadow-blue-600/20">
                                   <Package className="w-4 h-4 mr-2" /> Nuevo Producto
                            </Button>
                     </div>

                     {/* Toolbar */}
                     <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <input
                                          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                                          placeholder="Buscar producto..."
                                          className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                   />
                            </div>
                     </div>

                     {/* MOBILE CARDS */}
                     <div className="md:hidden space-y-3">
                            {loading && data.length === 0 ? (
                                   <div className="text-center py-12 text-slate-400 text-sm">Cargando productos...</div>
                            ) : table.getRowModel().rows.length === 0 ? (
                                   <div className="text-center py-12 text-slate-400 text-sm">No hay productos registrados.</div>
                            ) : (
                                   table.getRowModel().rows.map(row => {
                                          const product = row.original;
                                          return (
                                                 <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                                        <div className="flex items-start justify-between mb-2">
                                                               <div className="min-w-0 flex-1">
                                                                      <div className="font-semibold text-slate-800 truncate">{product.name}</div>
                                                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                             <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{product.code}</span>
                                                                             {product.is_returnable && (
                                                                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">RETORNABLE</span>
                                                                             )}
                                                                      </div>
                                                               </div>
                                                               <div className="text-right flex-shrink-0 ml-3">
                                                                      <div className="text-lg font-bold text-slate-800">${product.price?.toLocaleString('es-AR')}</div>
                                                                      {product.stock !== undefined && (
                                                                             <div className={`text-xs mt-0.5 ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                                                                    Stock: {product.stock}
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                                                               <Button size="sm" variant="outline" onClick={() => openEditModal(product)} className="flex-1">
                                                                      <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                                                               </Button>
                                                               <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-500" onClick={() => handleDelete(product)}>
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
                                                                             {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                                      </th>
                                                               ))}
                                                        </tr>
                                                 ))}
                                          </thead>
                                          <tbody className="divide-y divide-slate-100">
                                                 {loading && data.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">Cargando productos...</td></tr>
                                                 ) : table.getRowModel().rows.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">No hay productos registrados.</td></tr>
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
                                          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
                                   </div>
                            </div>
                     </div>

                     {/* Mobile Pagination */}
                     <div className="md:hidden flex items-center justify-between">
                            <span className="text-xs text-slate-400">Pág. {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}</span>
                            <div className="flex gap-2">
                                   <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-lg border bg-white disabled:opacity-50 active:scale-95 transition"><ChevronLeft className="w-4 h-4" /></button>
                                   <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-lg border bg-white disabled:opacity-50 active:scale-95 transition"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                     </div>

                     {/* Modal Create/Edit */}
                     {isModalOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
                                   <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                                          <div className="flex justify-between items-start mb-4">
                                                 <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                                        {editingId ? "Editar Producto" : "Nuevo Producto"}
                                                 </h3>
                                                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
                                          </div>

                                          <p className="text-slate-500 mb-4 sm:mb-6 text-sm">
                                                 {editingId ? "Modificá los detalles del producto." : "Completá los datos para crear un nuevo producto en el catálogo."}
                                          </p>

                                          <form onSubmit={handleSubmit} className="space-y-4">
                                                 <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
                                                        <div className="relative">
                                                               <Package className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                               <input
                                                                      type="text"
                                                                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                                      placeholder="Ej: Soda Sifón 1L"
                                                                      required
                                                                      value={formData.name}
                                                                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                               />
                                                        </div>
                                                 </div>

                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                               <label className="block text-sm font-medium text-slate-700 mb-1">Código</label>
                                                               <div className="relative">
                                                                      <Barcode className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                                      <input
                                                                             type="text"
                                                                             className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase"
                                                                             placeholder="Ej: S1L"
                                                                             required
                                                                             value={formData.code}
                                                                             onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                                      />
                                                               </div>
                                                        </div>
                                                        <div>
                                                               <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                                                               <div className="relative">
                                                                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                                      <input
                                                                             type="number"
                                                                             step="0.01"
                                                                             className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                                             placeholder="0.00"
                                                                             required
                                                                             value={formData.price}
                                                                             onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                                      />
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50">
                                                        <input
                                                               type="checkbox"
                                                               id="is_returnable"
                                                               className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                               checked={formData.is_returnable}
                                                               onChange={e => setFormData({ ...formData, is_returnable: e.target.checked })}
                                                        />
                                                        <label htmlFor="is_returnable" className="text-sm text-slate-700 font-medium select-none cursor-pointer">
                                                               ¿Es un envase retornable?
                                                        </label>
                                                 </div>

                                                 <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
                                                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
                                                               Cancelar
                                                        </Button>
                                                        <Button type="submit" className="w-full sm:w-auto">
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
