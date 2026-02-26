import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Key, UserPlus, Users, Trash2, ShieldCheck, UserCheck } from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

interface User {
       id: number;
       username: string;
       full_name: string | null;
       role: string;
       is_active: boolean;
}

export default function SettingsView() {
       const { isAdmin } = useAuth();
       const [users, setUsers] = useState<User[]>([]);
       const [loading, setLoading] = useState(false);

       const [currentPassword, setCurrentPassword] = useState("");
       const [newPassword, setNewPassword] = useState("");
       const [confirmPassword, setConfirmPassword] = useState("");

       const [isUserModalOpen, setIsUserModalOpen] = useState(false);
       const [selectedUser, setSelectedUser] = useState<User | null>(null);
       const [username, setUsername] = useState("");
       const [password, setPassword] = useState("");
       const [fullName, setFullName] = useState("");
       const [role, setRole] = useState("CHOFER");

       const [isConfirmOpen, setIsConfirmOpen] = useState(false);
       const [userToDelete, setUserToDelete] = useState<User | null>(null);

       useEffect(() => { fetchUsers(); }, []);

       const fetchUsers = async () => {
              try {
                     const res = await api.get("/users/");
                     setUsers(res.data);
              } catch (error) {
                     console.error("Error fetching users", error);
              }
       };

       const handleChangePassword = async (e: React.FormEvent) => {
              e.preventDefault();
              if (newPassword !== confirmPassword) { toast.error("Las contraseñas no coinciden"); return; }
              if (newPassword.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres"); return; }
              try {
                     setLoading(true);
                     await api.put("/users/me/password", { current_password: currentPassword, new_password: newPassword });
                     toast.success("Contraseña actualizada correctamente");
                     setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
              } catch (error) {
                     console.error(error);
              } finally {
                     setLoading(false);
              }
       };

       const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
              e.preventDefault();
              try {
                     setLoading(true);
                     if (selectedUser) {
                            await api.put(`/users/${selectedUser.id}`, { full_name: fullName, role });
                            if (password) {
                                   await api.put(`/users/${selectedUser.id}/password`, { current_password: "", new_password: password });
                            }
                            toast.success("Usuario actualizado correctamente");
                     } else {
                            await api.post("/users/", { username, password, full_name: fullName, role });
                            toast.success("Usuario creado correctamente");
                     }
                     setIsUserModalOpen(false);
                     fetchUsers();
                     resetUserForm();
              } catch (error) {
                     console.error(error);
              } finally {
                     setLoading(false);
              }
       };

       const resetUserForm = () => {
              setSelectedUser(null); setUsername(""); setPassword(""); setFullName(""); setRole("CHOFER");
       };

       const openEditModal = (user: User) => {
              setSelectedUser(user); setUsername(user.username); setFullName(user.full_name || ""); setRole(user.role); setPassword(""); setIsUserModalOpen(true);
       };

       const handleDeleteUser = async () => {
              if (!userToDelete) return;
              try {
                     await api.delete(`/users/${userToDelete.id}`);
                     toast.success(`Usuario ${userToDelete.username} eliminado`);
                     fetchUsers();
                     setIsConfirmOpen(false);
              } catch (error) {
                     console.error(error);
              }
       };

       return (
              <div className="space-y-5 md:space-y-8">
                     <div className="animate-fade-in-up">
                            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">⚙️ Configuración</h1>
                            <p className="text-slate-500 text-sm mt-0.5 font-medium">Gestiona tus credenciales y usuarios del sistema.</p>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            {/* CHANGE PASSWORD */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                                   <div className="p-5 md:p-6 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-r from-slate-50 to-blue-50/30">
                                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                                 <Key className="w-5 h-5 text-white" />
                                          </div>
                                          <div>
                                                 <h2 className="font-extrabold text-slate-900 text-sm md:text-base">Cambiar Contraseña</h2>
                                                 <p className="text-xs text-slate-500 font-medium">Actualiza tu acceso personal</p>
                                          </div>
                                   </div>
                                   <form onSubmit={handleChangePassword} className="p-5 md:p-6 space-y-4">
                                          <div className="space-y-1.5">
                                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Contraseña Actual</label>
                                                 <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                        required
                                                        placeholder="••••••••"
                                                 />
                                          </div>
                                          <div className="space-y-1.5">
                                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nueva Contraseña</label>
                                                 <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                        required
                                                        placeholder="Mínimo 6 caracteres"
                                                 />
                                          </div>
                                          <div className="space-y-1.5">
                                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirmar</label>
                                                 <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                        required
                                                        placeholder="Repite la contraseña"
                                                 />
                                          </div>
                                          <Button
                                                 type="submit"
                                                 className="w-full h-12 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold transition-all mt-2 shadow-lg shadow-slate-900/15"
                                                 disabled={loading}
                                          >
                                                 {loading ? "Actualizando..." : "Actualizar Contraseña"}
                                          </Button>
                                   </form>
                            </div>

                            {/* USER MANAGEMENT */}
                            {isAdmin && (
                                   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                          <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-purple-50/30">
                                                 <div className="flex items-center gap-3.5">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                                                               <Users className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                               <h2 className="font-extrabold text-slate-900 text-sm md:text-base">Usuarios</h2>
                                                               <p className="text-xs text-slate-500 font-medium">Gestión de accesos de empleados</p>
                                                        </div>
                                                 </div>
                                                 <Button
                                                        onClick={() => { resetUserForm(); setIsUserModalOpen(true); }}
                                                        className="h-10 px-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-slate-900/15"
                                                 >
                                                        <UserPlus className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Nuevo</span>
                                                 </Button>
                                          </div>
                                          <div className="flex-1 overflow-y-auto max-h-[400px]">
                                                 {users.length === 0 ? (
                                                        <div className="empty-state p-12">
                                                               <div className="empty-state-icon"><Users className="w-6 h-6 text-slate-400" /></div>
                                                               <p className="text-slate-400 text-sm font-medium mt-2">No hay otros usuarios registrados</p>
                                                        </div>
                                                 ) : (
                                                        <div className="divide-y divide-slate-50">
                                                               {users.map((user, idx) => (
                                                                      <div key={user.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between group animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                                                                             <div className="flex items-center gap-3.5">
                                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md transition-transform group-hover:scale-105 ${user.role === 'ADMIN' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
                                                                                           {user.username.charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="flex items-center gap-2">
                                                                                                  <h3 className="font-bold text-slate-900 text-sm">{user.username}</h3>
                                                                                                  {user.role === 'ADMIN' && (
                                                                                                         <span className="chip chip-confirmed text-[10px]">Admin</span>
                                                                                                  )}
                                                                                           </div>
                                                                                           <p className="text-xs text-slate-400 font-medium">{user.full_name || 'Sin nombre completo'}</p>
                                                                                    </div>
                                                                             </div>
                                                                             <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                                                    <button onClick={() => openEditModal(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Editar">
                                                                                           <SettingsIcon className="w-4 h-4" />
                                                                                    </button>
                                                                                    <button onClick={() => { setUserToDelete(user); setIsConfirmOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Eliminar">
                                                                                           <Trash2 className="w-4 h-4" />
                                                                                    </button>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 )}
                                          </div>
                                   </div>
                            )}
                     </div>

                     {/* USER MODAL */}
                     <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title={selectedUser ? "Editar Usuario" : "Nuevo Usuario"}>
                            <form onSubmit={handleCreateOrUpdateUser} className="space-y-4">
                                   <div className="space-y-1.5">
                                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre de Usuario</label>
                                          <input
                                                 type="text"
                                                 value={username}
                                                 onChange={(e) => setUsername(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 disabled:opacity-50 text-sm"
                                                 required
                                                 disabled={!!selectedUser}
                                                 placeholder="Ej: nico_repartos"
                                          />
                                          {selectedUser && <p className="text-[10px] text-slate-400 italic font-medium">El nombre de usuario no se puede cambiar.</p>}
                                   </div>

                                   <div className="space-y-1.5">
                                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre Completo</label>
                                          <input
                                                 type="text"
                                                 value={fullName}
                                                 onChange={(e) => setFullName(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                 placeholder="Ej: Nicolás García"
                                          />
                                   </div>

                                   <div className="space-y-1.5">
                                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rol del Sistema</label>
                                          <select
                                                 value={role}
                                                 onChange={(e) => setRole(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm"
                                          >
                                                 <option value="ADMIN">Administrador (Acceso Total)</option>
                                                 <option value="CHOFER">Chofer (Solo Repartos y Ventas)</option>
                                                 <option value="SECRETARIA">Secretaria (Ventas y Administración)</option>
                                          </select>
                                   </div>

                                   <div className="space-y-1.5 pt-2">
                                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                 {selectedUser ? "Restablecer Contraseña (opcional)" : "Contraseña"}
                                          </label>
                                          <input
                                                 type="password"
                                                 value={password}
                                                 onChange={(e) => setPassword(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                 required={!selectedUser}
                                                 placeholder={selectedUser ? "Dejar vacío para no cambiar" : "Contraseña inicial"}
                                          />
                                   </div>

                                   <div className="flex gap-3 pt-4">
                                          <Button type="button" onClick={() => setIsUserModalOpen(false)} variant="secondary" className="flex-1 h-12 rounded-xl font-bold">
                                                 Cancelar
                                          </Button>
                                          <Button
                                                 type="submit"
                                                 className="flex-2 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/20"
                                                 disabled={loading}
                                          >
                                                 {loading ? "Guardando..." : selectedUser ? "Guardar Cambios" : "Crear Usuario"}
                                          </Button>
                                   </div>
                            </form>
                     </Modal>

                     <ConfirmDialog
                            isOpen={isConfirmOpen}
                            onCancel={() => setIsConfirmOpen(false)}
                            onConfirm={handleDeleteUser}
                            title="Eliminar Usuario"
                            message={`¿Estás seguro que deseas eliminar al usuario ${userToDelete?.username}? Esta acción es permanente.`}
                     />
              </div>
       );
}
