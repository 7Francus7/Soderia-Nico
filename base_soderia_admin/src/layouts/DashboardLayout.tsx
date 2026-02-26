import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
       LogOut, LayoutDashboard, ShoppingCart, Truck,
       Package, Users, CreditCard, Wifi, Menu, X, Settings, ChevronRight
} from "lucide-react";

const navItems = [
       { name: "Resumen", icon: LayoutDashboard, path: "/", color: "from-blue-500 to-blue-600" },
       { name: "Pedidos", icon: ShoppingCart, path: "/orders", color: "from-amber-500 to-orange-500" },
       { name: "Repartos", icon: Truck, path: "/deliveries", color: "from-emerald-500 to-teal-500" },
       { name: "Cta. Cte.", icon: CreditCard, path: "/current-accounts", color: "from-violet-500 to-purple-500" },
       { name: "Productos", icon: Package, path: "/products", color: "from-cyan-500 to-blue-500" },
       { name: "Clientes", icon: Users, path: "/clients", color: "from-rose-500 to-pink-500" },
       { name: "Configuración", icon: Settings, path: "/settings", color: "from-slate-400 to-slate-500" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
       const { logout, username, userRole } = useAuth();
       const navigate = useNavigate();
       const location = useLocation();
       const [sidebarOpen, setSidebarOpen] = useState(false);

       useEffect(() => {
              setSidebarOpen(false);
       }, [location.pathname]);

       useEffect(() => {
              const handleEsc = (e: KeyboardEvent) => {
                     if (e.key === "Escape") setSidebarOpen(false);
              };
              window.addEventListener("keydown", handleEsc);
              return () => window.removeEventListener("keydown", handleEsc);
       }, []);

       const handleLogout = () => {
              logout();
              navigate("/login");
       };

       const getRoleLabel = () => {
              switch (userRole) {
                     case "ADMIN": return "Administrador";
                     case "CHOFER": return "Chofer";
                     case "SECRETARIA": return "Secretaria";
                     default: return "Usuario";
              }
       };

       return (
              <div className="min-h-screen bg-[#f0f4f8] flex">

                     {/* OVERLAY (mobile) */}
                     {sidebarOpen && (
                            <div
                                   className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
                                   onClick={() => setSidebarOpen(false)}
                            />
                     )}

                     {/* SIDEBAR */}
                     <aside
                            className={`
                                   fixed top-0 left-0 h-full w-[272px] bg-[#0c1222] text-white
                                   flex flex-col z-40
                                   transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                                   ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                                   lg:translate-x-0
                            `}
                     >
                            {/* Logo area */}
                            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                                   <div className="flex items-center gap-3.5">
                                          <div className="relative">
                                                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 flex-shrink-0">
                                                        <span className="text-lg">🧃</span>
                                                 </div>
                                                 <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl opacity-20 blur-md -z-10" />
                                          </div>
                                          <div>
                                                 <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">SODERÍA NICO</h1>
                                                 <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Panel Administrativo</p>
                                          </div>
                                   </div>
                                   <button
                                          className="lg:hidden text-slate-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition"
                                          onClick={() => setSidebarOpen(false)}
                                   >
                                          <X className="w-5 h-5" />
                                   </button>
                            </div>

                            {/* Online badge */}
                            <div className="px-5 py-3">
                                   <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/8 border border-emerald-500/15 rounded-lg">
                                          <span className="relative flex h-2 w-2">
                                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                          </span>
                                          <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">Sistema en línea</span>
                                   </div>
                            </div>

                            {/* Nav */}
                            <nav className="flex-1 px-3 pb-3 space-y-0.5 overflow-y-auto">
                                   {navItems.map((item) => {
                                          const isActive = location.pathname === item.path;
                                          return (
                                                 <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className={`
                                                               flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                                                               transition-all duration-200 group relative
                                                               ${isActive
                                                                      ? "bg-white/[0.08] text-white"
                                                                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                                                               }
                                                        `}
                                                 >
                                                        {/* Active indicator line */}
                                                        {isActive && (
                                                               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full" />
                                                        )}
                                                        <div className={`
                                                               w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                                                               ${isActive
                                                                      ? `bg-gradient-to-br ${item.color} shadow-lg shadow-blue-500/15`
                                                                      : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                                                               }
                                                        `}>
                                                               <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"} transition-colors`} />
                                                        </div>
                                                        <span className={`text-[13px] font-medium flex-1 ${isActive ? "font-semibold" : ""}`}>{item.name}</span>
                                                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                                                 </Link>
                                          );
                                   })}
                            </nav>

                            {/* User + Logout */}
                            <div className="p-3 border-t border-white/[0.06]">
                                   <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl mb-2">
                                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-lg shadow-blue-500/20">
                                                 {username?.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="overflow-hidden flex-1">
                                                 <p className="text-sm font-semibold truncate text-white">{username}</p>
                                                 <p className="text-[11px] text-slate-500 font-medium">{getRoleLabel()}</p>
                                          </div>
                                   </div>
                                   <button
                                          onClick={handleLogout}
                                          className="flex items-center gap-2.5 text-slate-500 hover:text-red-400 px-3.5 py-2.5 hover:bg-red-500/8 rounded-xl w-full transition group"
                                   >
                                          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                          <span className="text-[13px] font-medium">Cerrar Sesión</span>
                                   </button>
                            </div>
                     </aside>

                     {/* MAIN CONTENT */}
                     <div className="flex-1 flex flex-col min-h-screen lg:ml-[272px]">

                            {/* Top bar mobile */}
                            <header className="sticky top-0 z-20 lg:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 flex items-center gap-3 shadow-sm">
                                   <button
                                          onClick={() => setSidebarOpen(true)}
                                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
                                   >
                                          <Menu className="w-5 h-5" />
                                   </button>
                                   <div className="flex items-center gap-2.5">
                                          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                 <span className="text-xs">🧃</span>
                                          </div>
                                          <span className="text-sm font-bold text-slate-800">
                                                 {navItems.find(n => n.path === location.pathname)?.name ?? "Dashboard"}
                                          </span>
                                   </div>
                                   <div className="ml-auto flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full">
                                          <span className="relative flex h-1.5 w-1.5">
                                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                 <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                          </span>
                                          <span className="text-[10px] text-emerald-700 font-semibold">Online</span>
                                   </div>
                            </header>

                            {/* Page content */}
                            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
                                   <div className="max-w-7xl mx-auto page-enter">
                                          {children}
                                   </div>
                            </main>

                            {/* BOTTOM NAV (mobile only) */}
                            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                                   <div className="grid grid-cols-6 h-[68px] px-1">
                                          {navItems.filter(item => item.name !== "Configuración").map((item) => {
                                                 const isActive = location.pathname === item.path;
                                                 return (
                                                        <Link
                                                               key={item.path}
                                                               to={item.path}
                                                               className={`
                                                                      flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all
                                                                      ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}
                                                               `}
                                                        >
                                                               <div className={`
                                                                      p-1.5 rounded-xl transition-all
                                                                      ${isActive ? "bg-blue-50 shadow-sm shadow-blue-100" : ""}
                                                               `}>
                                                                      <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""} transition-colors`} />
                                                               </div>
                                                               <span className={`leading-none ${isActive ? "font-semibold" : ""}`}>{item.name}</span>
                                                        </Link>
                                                 );
                                          })}
                                   </div>
                            </nav>
                     </div>
              </div>
       );
}
