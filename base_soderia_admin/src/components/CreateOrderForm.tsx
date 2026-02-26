import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';

interface Product {
       id: number;
       name: string;
       price: number;
       code: string;
}

interface Client {
       id: number;
       name: string;
       address: string;
}

interface CreateOrderFormProps {
       onSuccess: () => void;
       onCancel: () => void;
}

export default function CreateOrderForm({ onSuccess, onCancel }: CreateOrderFormProps) {
       const [clients, setClients] = useState<Client[]>([]);
       const [products, setProducts] = useState<Product[]>([]);
       const [loadingData, setLoadingData] = useState(true);
       const [submitting, setSubmitting] = useState(false);

       const [selectedClient, setSelectedClient] = useState<Client | null>(null);
       const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
       const [searchClient, setSearchClient] = useState("");

       useEffect(() => {
              const fetchData = async () => {
                     try {
                            const [clientsRes, productsRes] = await Promise.all([
                                   api.get('/clients/'),
                                   api.get('/products/')
                            ]);
                            setClients(clientsRes.data);
                            setProducts(productsRes.data);
                     } catch (error) {
                            console.error("Error fetching data", error);
                     } finally {
                            setLoadingData(false);
                     }
              };
              fetchData();
       }, []);

       const addToCart = (product: Product) => {
              setCart(prev => {
                     const existing = prev.find(item => item.product.id === product.id);
                     if (existing) {
                            return prev.map(item =>
                                   item.product.id === product.id
                                          ? { ...item, quantity: item.quantity + 1 }
                                          : item
                            );
                     }
                     return [...prev, { product, quantity: 1 }];
              });
       };

       const removeFromCart = (productId: number) => {
              setCart(prev => prev.reduce((acc, item) => {
                     if (item.product.id === productId) {
                            if (item.quantity > 1) {
                                   acc.push({ ...item, quantity: item.quantity - 1 });
                            }
                            // If 1, remove (don't push)
                     } else {
                            acc.push(item);
                     }
                     return acc;
              }, [] as { product: Product; quantity: number }[]));
       };

       const getQuantity = (productId: number) => {
              return cart.find(item => item.product.id === productId)?.quantity || 0;
       };

       const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

       const handleSubmit = async () => {
              if (!selectedClient || cart.length === 0) return;
              setSubmitting(true);
              try {
                     // 1. Create Order (Draft)
                     const orderPayload = {
                            client_id: selectedClient.id,
                            items: cart.map(item => ({
                                   product_id: item.product.id,
                                   quantity: item.quantity,
                                   unit_price: item.product.price
                            })),
                            notes: "Creado desde Panel Admin"
                     };

                     const response = await api.post('/orders/', orderPayload);
                     const newOrder = response.data;

                     // 2. Confirm Order immediately (Business Logic: Admin creates = Confirmed generally??)
                     // Let's ask user or just confirm for smooth flow.
                     // For now, let's auto-confirm to show it in deliveries list ready for assignment.
                     await api.put(`/orders/${newOrder.id}/confirm`);

                     onSuccess();
              } catch (error) {
                     console.error("Error creating order", error);
                     alert("Error al crear el pedido");
              } finally {
                     setSubmitting(false);
              }
       };

       const filteredClients = clients.filter(c =>
              c.name.toLowerCase().includes(searchClient.toLowerCase()) ||
              c.address.toLowerCase().includes(searchClient.toLowerCase())
       );

       if (loadingData) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;

       return (
              <div className="space-y-6">
                     {/* Step 1: Select Client */}
                     <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">1. Seleccionar Cliente</label>
                            {!selectedClient ? (
                                   <div className="relative">
                                          <input
                                                 type="text"
                                                 placeholder="Buscar cliente..."
                                                 className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                 value={searchClient}
                                                 onChange={(e) => setSearchClient(e.target.value)}
                                          />
                                          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />

                                          {searchClient && (
                                                 <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10">
                                                        {filteredClients.map(client => (
                                                               <button
                                                                      key={client.id}
                                                                      onClick={() => { setSelectedClient(client); setSearchClient(""); }}
                                                                      className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                                                               >
                                                                      <div className="font-medium text-slate-800">{client.name}</div>
                                                                      <div className="text-xs text-slate-500">{client.address}</div>
                                                               </button>
                                                        ))}
                                                        {filteredClients.length === 0 && <div className="p-4 text-center text-slate-400 text-sm">No encontrado</div>}
                                                 </div>
                                          )}
                                   </div>
                            ) : (
                                   <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                                          <div>
                                                 <div className="font-bold text-blue-900">{selectedClient.name}</div>
                                                 <div className="text-xs text-blue-600">{selectedClient.address}</div>
                                          </div>
                                          <button onClick={() => setSelectedClient(null)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                                                 Cambiar
                                          </button>
                                   </div>
                            )}
                     </div>

                     {/* Step 2: Add Products */}
                     {selectedClient && (
                            <div className="space-y-3">
                                   <label className="text-sm font-semibold text-slate-700">2. Agregar Productos</label>
                                   <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                                          {products.map(product => {
                                                 const qty = getQuantity(product.id);
                                                 return (
                                                        <div key={product.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                               <div>
                                                                      <div className="font-medium text-slate-800">{product.name}</div>
                                                                      <div className="text-xs text-slate-500">${product.price}</div>
                                                               </div>
                                                               <div className="flex items-center gap-3">
                                                                      <button
                                                                             onClick={() => removeFromCart(product.id)}
                                                                             disabled={qty === 0}
                                                                             className="p-1 bg-white border border-slate-200 rounded-md hover:bg-slate-100 disabled:opacity-50"
                                                                      >
                                                                             <Minus className="w-3 h-3" />
                                                                      </button>
                                                                      <span className="w-6 text-center font-medium text-sm">{qty}</span>
                                                                      <button
                                                                             onClick={() => addToCart(product)}
                                                                             className="p-1 bg-blue-600 text-white border border-blue-600 rounded-md hover:bg-blue-700"
                                                                      >
                                                                             <Plus className="w-3 h-3" />
                                                                      </button>
                                                               </div>
                                                        </div>
                                                 );
                                          })}
                                   </div>
                            </div>
                     )}

                     {/* Summary & Actions */}
                     <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                   <div className="text-xs text-slate-500 uppercase font-semibold">Total Estimado</div>
                                   <div className="text-2xl font-bold text-slate-800">${totalAmount.toLocaleString()}</div>
                            </div>
                            <div className="flex gap-2">
                                   <button
                                          onClick={onCancel}
                                          className="px-4 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition"
                                   >
                                          Cancelar
                                   </button>
                                   <button
                                          onClick={handleSubmit}
                                          disabled={submitting || !selectedClient || cart.length === 0}
                                          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                                   >
                                          {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                                          Confirmar Pedido
                                   </button>
                            </div>
                     </div>
              </div>
       );
}
