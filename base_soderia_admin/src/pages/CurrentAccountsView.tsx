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
       RefreshCw,
       ChevronLeft,
       ChevronRight,
       DollarSign,
       AlertCircle,
       FileText,
       MessageCircle,
       Eye,
       CreditCard,
       TrendingDown,
       CheckCircle
} from "lucide-react";
import ClientLedgerModal from "../components/ClientLedgerModal";
import PaymentModal from "../components/PaymentModal";
import { toast } from "sonner";

// --- Types ---
interface Client {
       id: number;
       name: string;
       address?: string;
       phone?: string;
       balance: number;
}

// --- Components ---
const BalanceBadge = ({ balance }: { balance: number }) => {
       if (balance <= 0) {
              return (
                     <span className="chip chip-delivered">
                            <CheckCircle className="w-3 h-3" />
                            ${Math.abs(balance).toFixed(2)} (A favor)
                     </span>
              );
       }
       return (
              <span className="chip chip-cancelled">
                     <TrendingDown className="w-3 h-3" />
                     -${balance.toFixed(2)} (Deuda)
              </span>
       );
};

export default function CurrentAccountsView() {
       const [data, setData] = useState<Client[]>([]);
       const [loading, setLoading] = useState(true);

       const [sorting, setSorting] = useState<SortingState>([{ id: 'balance', desc: true }]);
       const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
       const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

       const [ledgerClient, setLedgerClient] = useState<Client | null>(null);
       const [paymentClient, setPaymentClient] = useState<Client | null>(null);

       useEffect(() => {
              const handleKeyDown = (e: KeyboardEvent) => {
                     if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                            e.preventDefault();
                            document.getElementById('search-client-input')?.focus();
                     }
              };
              window.addEventListener('keydown', handleKeyDown);
              return () => window.removeEventListener('keydown', handleKeyDown);
       }, []);

       const fetchData = async () => {
              setLoading(true);
              try {
                     const response = await api.get('/clients/');
                     const debtors = response.data.filter((c: Client) => c.balance > 0);
                     setData(debtors);
              } catch (error) {
                     console.error("Error fetching clients:", error);
              } finally {
                     setLoading(false);
              }
       };

       useEffect(() => { fetchData(); }, []);

       const handleWhatsApp = (client: Client) => {
              const message = `Hola ${client.name}, te recordamos que tu saldo pendiente en Sodería Nico es de $${client.balance.toFixed(2)}. Por favor, regularizá tu situación a la brevedad. Gracias!`;
              const url = `https://wa.me/${client.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(message)}`;
              window.open(url, '_blank');
              toast.success("Enlace de WhatsApp generado");
       };

       const columns = useMemo<ColumnDef<Client>[]>(() => [
              {
                     accessorKey: "name",
                     header: "Cliente",
                     cell: ({ row }) => (
                            <div>
                                   <div className="font-semibold text-slate-900">{row.original.name}</div>
                                   {row.original.phone && <div className="text-xs text-slate-400 mt-0.5">{row.original.phone}</div>}
                            </div>
                     )
              },
              {
                     accessorKey: "address",
                     header: "Dirección",
                     cell: ({ getValue }) => <div className="text-slate-500 text-sm font-medium">{getValue() as string}</div>
              },
              {
                     accessorKey: "balance",
                     header: "Estado de Cuenta",
                     cell: ({ row }) => <BalanceBadge balance={row.original.balance} />
              },
              {
                     id: "actions",
                     header: "Acciones",
                     cell: ({ row }) => (
                            <div className="flex items-center gap-2">
                                   <button
                                          onClick={() => setLedgerClient(row.original)}
                                          title="Ver Cuenta"
                                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                   >
                                          <Eye className="w-4 h-4" />
                                   </button>
                                   <button
                                          onClick={() => setPaymentClient(row.original)}
                                          title="Registrar Pago"
                                          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                                   >
                                          <DollarSign className="w-3.5 h-3.5" />
                                          Cobrar
                                   </button>
                                   <button
                                          onClick={() => handleWhatsApp(row.original)}
                                          title="Enviar Recordatorio"
                                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                                   >
                                          <MessageCircle className="w-4 h-4" />
                                   </button>
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
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">💳 Cuentas Corrientes</h1>
                                   <p className="text-slate-500 text-sm mt-0.5 font-medium">Gestión de morosos y registro de cobros.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                   <button
                                          onClick={() => fetchData()}
                                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                   >
                                          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                   </button>
                            </div>
                     </div>

                     {/* Toolbar */}
                     <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                            <div className="relative w-full sm:max-w-sm">
                                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <input
                                          id="search-client-input"
                                          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                                          placeholder="Buscar cliente... (Ctrl+B)"
                                          className="input-premium"
                                   />
                            </div>
                     </div>

                     {/* MOBILE CARDS */}
                     <div className="md:hidden space-y-3">
                            {loading && data.length === 0 ? (
                                   <div className="empty-state"><div className="skeleton-shimmer w-8 h-8 rounded-xl" /><p className="text-slate-400 text-sm mt-3">Cargando cuentas...</p></div>
                            ) : table.getRowModel().rows.length === 0 ? (
                                   <div className="empty-state">
                                          <div className="empty-state-icon"><CreditCard className="w-7 h-7 text-slate-400" /></div>
                                          <p className="text-slate-500 text-sm font-medium">No se encontraron deudores</p>
                                          <p className="text-slate-400 text-xs mt-1">Todos los clientes están al día 🎉</p>
                                   </div>
                            ) : (
                                   table.getRowModel().rows.map((row, idx) => {
                                          const client = row.original;
                                          return (
                                                 <div key={client.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-slate-200 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                                                        <div className="flex items-start justify-between mb-3">
                                                               <div className="min-w-0 flex-1">
                                                                      <div className="font-bold text-slate-800 truncate">{client.name}</div>
                                                                      <div className="text-xs text-slate-400 mt-0.5 truncate">{client.address}</div>
                                                                      {client.phone && <div className="text-xs text-slate-400 mt-0.5">{client.phone}</div>}
                                                               </div>
                                                               <div className="flex-shrink-0 ml-3">
                                                                      <BalanceBadge balance={client.balance} />
                                                               </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-3 border-t border-slate-50">
                                                               <button
                                                                      onClick={() => setLedgerClient(client)}
                                                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-semibold transition active:scale-95"
                                                               >
                                                                      <Eye className="w-3.5 h-3.5" /> Ver
                                                               </button>
                                                               <button
                                                                      onClick={() => setPaymentClient(client)}
                                                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 active:scale-95"
                                                               >
                                                                      <DollarSign className="w-3.5 h-3.5" /> Cobrar
                                                               </button>
                                                               <button
                                                                      onClick={() => handleWhatsApp(client)}
                                                                      className="p-2.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition active:scale-95"
                                                               >
                                                                      <MessageCircle className="w-4 h-4" />
                                                               </button>
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
                                                                      <span className="text-slate-400 text-sm">Cargando cuentas...</span>
                                                               </div>
                                                        </td></tr>
                                                 ) : table.getRowModel().rows.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-16 text-center">
                                                               <div className="empty-state py-8">
                                                                      <div className="empty-state-icon"><CreditCard className="w-7 h-7 text-slate-400" /></div>
                                                                      <p className="text-slate-500 text-sm font-medium">No se encontraron deudores</p>
                                                                      <p className="text-slate-400 text-xs mt-1">Todos los clientes están al día 🎉</p>
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
                            <span className="text-xs text-slate-400 font-medium">Pág. {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}</span>
                            <div className="flex gap-2">
                                   <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 active:scale-95 transition hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                                   <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 active:scale-95 transition hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                     </div>

                     {/* Modals */}
                     <ClientLedgerModal
                            client={ledgerClient}
                            isOpen={!!ledgerClient}
                            onClose={() => setLedgerClient(null)}
                            onPaymentClick={(c) => setPaymentClient(c)}
                     />

                     <PaymentModal
                            client={paymentClient}
                            isOpen={!!paymentClient}
                            onClose={() => setPaymentClient(null)}
                            onSuccess={() => { fetchData(); }}
                     />
              </div>
       );
}
