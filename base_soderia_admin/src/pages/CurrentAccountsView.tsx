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
       Eye
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
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${Math.abs(balance).toFixed(2)} (A favor)
                     </span>
              );
       }
       return (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                     -${balance.toFixed(2)} (Deuda)
              </span>
       );
};

export default function CurrentAccountsView() {
       const [data, setData] = useState<Client[]>([]);
       const [loading, setLoading] = useState(true);

       // Table State
       const [sorting, setSorting] = useState<SortingState>([{ id: 'balance', desc: true }]);
       const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
       const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

       // Modal State
       const [ledgerClient, setLedgerClient] = useState<Client | null>(null);
       const [paymentClient, setPaymentClient] = useState<Client | null>(null);

       // Focus Search Shortcut
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

       useEffect(() => {
              fetchData();
       }, []);

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
                                   <div className="font-medium text-slate-900">{row.original.name}</div>
                                   {row.original.phone && <div className="text-xs text-slate-400">{row.original.phone}</div>}
                            </div>
                     )
              },
              {
                     accessorKey: "address",
                     header: "Dirección",
                     cell: ({ getValue }) => <div className="text-slate-500 text-sm">{getValue() as string}</div>
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
                                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                   >
                                          <Eye className="w-4 h-4" />
                                   </button>
                                   <button
                                          onClick={() => setPaymentClient(row.original)}
                                          title="Registrar Pago"
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
                                   >
                                          <DollarSign className="w-3.5 h-3.5" />
                                          Cobrar
                                   </button>
                                   <button
                                          onClick={() => handleWhatsApp(row.original)}
                                          title="Enviar Recordatorio"
                                          className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
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
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                   <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Cuentas Corrientes</h1>
                                   <p className="text-slate-500 text-sm mt-0.5">Gestión de morosos y registro de cobros.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                   <button
                                          onClick={() => fetchData()}
                                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                                   >
                                          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                   </button>
                            </div>
                     </div>

                     {/* Toolbar */}
                     <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="relative w-full sm:max-w-sm">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                   <input
                                          id="search-client-input"
                                          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                                          placeholder="Buscar cliente... (Ctrl+B)"
                                          className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                   />
                            </div>
                     </div>

                     {/* MOBILE CARDS */}
                     <div className="md:hidden space-y-3">
                            {loading && data.length === 0 ? (
                                   <div className="text-center py-12 text-slate-400 text-sm">Cargando cuentas...</div>
                            ) : table.getRowModel().rows.length === 0 ? (
                                   <div className="text-center py-12 text-slate-400 text-sm">No se encontraron deudores.</div>
                            ) : (
                                   table.getRowModel().rows.map(row => {
                                          const client = row.original;
                                          return (
                                                 <div key={client.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                               <div className="min-w-0 flex-1">
                                                                      <div className="font-semibold text-slate-800 truncate">{client.name}</div>
                                                                      <div className="text-xs text-slate-400 mt-0.5 truncate">{client.address}</div>
                                                                      {client.phone && <div className="text-xs text-slate-400 mt-0.5">{client.phone}</div>}
                                                               </div>
                                                               <div className="flex-shrink-0 ml-3">
                                                                      <BalanceBadge balance={client.balance} />
                                                               </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                                                               <button
                                                                      onClick={() => setLedgerClient(client)}
                                                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-medium transition active:scale-95"
                                                               >
                                                                      <Eye className="w-3.5 h-3.5" /> Ver
                                                               </button>
                                                               <button
                                                                      onClick={() => setPaymentClient(client)}
                                                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition shadow-sm active:scale-95"
                                                               >
                                                                      <DollarSign className="w-3.5 h-3.5" /> Cobrar
                                                               </button>
                                                               <button
                                                                      onClick={() => handleWhatsApp(client)}
                                                                      className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition active:scale-95"
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
                                                        <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">Cargando cuentas...</td></tr>
                                                 ) : table.getRowModel().rows.length === 0 ? (
                                                        <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">No se encontraron deudores.</td></tr>
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
                                          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                                          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
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
                            onSuccess={() => {
                                   fetchData();
                            }}
                     />
              </div>
       );
}
