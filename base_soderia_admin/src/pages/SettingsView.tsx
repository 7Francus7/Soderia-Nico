import { useState, useEffect } from "react";
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
       const [users, setUsers] = useState<User[]>([]);
       const [loading, setLoading] = useState(false);
       const [isAdmin, setIsAdmin] = useState(false);

       // Change password state
       const [currentPassword, setCurrentPassword] = useState("");
       const [newPassword, setNewPassword] = useState("");
       const [confirmPassword, setConfirmPassword] = useState("");

       // Create/Edit user modal state
       const [isUserModalOpen, setIsUserModalOpen] = useState(false);
       const [selectedUser, setSelectedUser] = useState<User | null>(null);
       const [username, setUsername] = useState("");
       const [password, setPassword] = useState(""); // Only for new users or password reset
       const [fullName, setFullName] = useState("");
       const [role, setRole] = useState("CHOFER");

       // Confirm dialog
       const [isConfirmOpen, setIsConfirmOpen] = useState(false);
       const [userToDelete, setUserToDelete] = useState<User | null>(null);

       useEffect(() => {
              fetchCurrentUser();
              fetchUsers();
       }, []);

       const fetchCurrentUser = async () => {
              try {
                     const res = await api.get("/users/me");
                     setIsAdmin(res.data.role === "ADMIN");
              } catch (error) {
                     console.error("Error fetching current user", error);
              }
       };

       const fetchUsers = async () => {
              try {
                     const res = await api.get("/users/");
                     setUsers(res.data);
              } catch (error) {
                     // Probably not an admin or error
                     console.error("Error fetching users", error);
              }
       };

       const handleChangePassword = async (e: React.FormEvent) => {
              e.preventDefault();
              if (newPassword !== confirmPassword) {
                     toast.error("Las contraseñas no coinciden");
                     return;
              }
              if (newPassword.length < 6) {
                     toast.error("La contraseña debe tener al menos 6 caracteres");
                     return;
              }

              try {
                     setLoading(true);
                     await api.put("/users/me/password", {
                            current_password: currentPassword,
                            new_password: newPassword
                     });
                     toast.success("Contraseña actualizada correctamente");
                     setCurrentPassword("");
                     setNewPassword("");
                     setConfirmPassword("");
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
                            // Update basic info
                            await api.put(`/users/${selectedUser.id}`, {
                                   full_name: fullName,
                                   role: role
                            });

                            // If password was provided, reset it
                            if (password) {
                                   await api.put(`/users/${selectedUser.id}/password`, {
                                          current_password: "", // Ignored by backend for admin reset
                                          new_password: password
                                   });
                            }
                            toast.success("Usuario actualizado correctamente");
                     } else {
                            // Create new
                            await api.post("/users/", {
                                   username,
                                   password,
                                   full_name: fullName,
                                   role
                            });
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
              setSelectedUser(null);
              setUsername("");
              setPassword("");
              setFullName("");
              setRole("CHOFER");
       };

       const openEditModal = (user: User) => {
              setSelectedUser(user);
              setUsername(user.username);
              setFullName(user.full_name || "");
              setRole(user.role);
              setPassword(""); // Reset password field for security
              setIsUserModalOpen(true);
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
              <div className="space-y-8">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                   <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
                                   <p className="text-slate-500">Gestiona tus credenciales y usuarios del sistema.</p>
                            </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* ── CHANGE PASSWORD ─────────────────────────── */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                   <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                                 <Key className="w-5 h-5" />
                                          </div>
                                          <div>
                                                 <h2 className="font-bold text-slate-800">Cambiar Contraseña</h2>
                                                 <p className="text-xs text-slate-500">Actualiza tu acceso personal</p>
                                          </div>
                                   </div>
                                   <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                                          <div className="space-y-1.5">
                                                 <label className="text-sm font-semibold text-slate-700">Contraseña Actual</label>
                                                 <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        required
                                                        placeholder="••••••••"
                                                 />
                                          </div>
                                          <div className="space-y-1.5">
                                                 <label className="text-sm font-semibold text-slate-700">Nueva Contraseña</label>
                                                 <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        required
                                                        placeholder="Mínimo 6 caracteres"
                                                 />
                                          </div>
                                          <div className="space-y-1.5">
                                                 <label className="text-sm font-semibold text-slate-700">Confirmar Nueva Contraseña</label>
                                                 <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        required
                                                        placeholder="Repite la contraseña"
                                                 />
                                          </div>
                                          <Button
                                                 type="submit"
                                                 className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition-all mt-4"
                                                 disabled={loading}
                                          >
                                                 {loading ? "Actualizando..." : "Actualizar Contraseña"}
                                          </Button>
                                   </form>
                            </div>

                            {/* ── USER MANAGEMENT (ADMIN ONLY) ────────────── */}
                            {isAdmin && (
                                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                                          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                                               <Users className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                               <h2 className="font-bold text-slate-800">Usuarios</h2>
                                                               <p className="text-xs text-slate-500">Gestión de accesos de empleados</p>
                                                        </div>
                                                 </div>
                                                 <Button
                                                        onClick={() => { resetUserForm(); setIsUserModalOpen(true); }}
                                                        className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-sm flex items-center gap-2"
                                                 >
                                                        <UserPlus className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Nuevo Usuario</span>
                                                 </Button>
                                          </div>
                                          <div className="flex-1 overflow-y-auto max-h-[400px]">
                                                 {users.length === 0 ? (
                                                        <div className="p-12 text-center">
                                                               <p className="text-slate-400 italic">No hay otros usuarios registrados.</p>
                                                        </div>
                                                 ) : (
                                                        <div className="divide-y divide-slate-100">
                                                               {users.map((user) => (
                                                                      <div key={user.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                                                             <div className="flex items-center gap-3">
                                                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105 ${user.role === 'ADMIN' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-600'
                                                                                           }`}>
                                                                                           {user.username.charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                    <div>
                                                                                           <div className="flex items-center gap-2">
                                                                                                  <h3 className="font-bold text-slate-900 text-sm">{user.username}</h3>
                                                                                                  {user.role === 'ADMIN' && (
                                                                                                         <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin</span>
                                                                                                  )}
                                                                                           </div>
                                                                                           <p className="text-xs text-slate-500">{user.full_name || 'Sin nombre completo'}</p>
                                                                                    </div>
                                                                             </div>
                                                                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                    <button
                                                                                           onClick={() => openEditModal(user)}
                                                                                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                                                           title="Editar"
                                                                                    >
                                                                                           <SettingsIcon className="w-4 h-4" />
                                                                                    </button>
                                                                                    <button
                                                                                           onClick={() => { setUserToDelete(user); setIsConfirmOpen(true); }}
                                                                                           className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                                           title="Eliminar"
                                                                                    >
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

                     {/* ── USER MODAL ────────────────────────────────── */}
                     <Modal
                            isOpen={isUserModalOpen}
                            onClose={() => setIsUserModalOpen(false)}
                            title={selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
                     >
                            <form onSubmit={handleCreateOrUpdateUser} className="space-y-4">
                                   <div className="space-y-1.5">
                                          <label className="text-sm font-semibold text-slate-700">Nombre de Usuario</label>
                                          <input
                                                 type="text"
                                                 value={username}
                                                 onChange={(e) => setUsername(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 disabled:opacity-50"
                                                 required
                                                 disabled={!!selectedUser}
                                                 placeholder="Ej: nico_repartos"
                                          />
                                          {selectedUser && <p className="text-[10px] text-slate-400 italic">El nombre de usuario no se puede cambiar.</p>}
                                   </div>

                                   <div className="space-y-1.5">
                                          <label className="text-sm font-semibold text-slate-700">Nombre Completo</label>
                                          <input
                                                 type="text"
                                                 value={fullName}
                                                 onChange={(e) => setFullName(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                 placeholder="Ej: Nicolás García"
                                          />
                                   </div>

                                   <div className="space-y-1.5">
                                          <label className="text-sm font-semibold text-slate-700">Rol del Sistema</label>
                                          <select
                                                 value={role}
                                                 onChange={(e) => setRole(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                          >
                                                 <option value="ADMIN">Administrador (Acceso Total)</option>
                                                 <option value="CHOFER">Chofer (Solo Repartos y Ventas)</option>
                                                 <option value="SECRETARIA">Secretaria (Ventas y Administración)</option>
                                          </select>
                                   </div>

                                   <div className="space-y-1.5 pt-2">
                                          <label className="text-sm font-semibold text-slate-700">
                                                 {selectedUser ? "Restablecer Contraseña (opcional)" : "Contraseña"}
                                          </label>
                                          <input
                                                 type="password"
                                                 value={password}
                                                 onChange={(e) => setPassword(e.target.value)}
                                                 className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                 required={!selectedUser}
                                                 placeholder={selectedUser ? "Dejar vacío para no cambiar" : "Contraseña inicial"}
                                          />
                                   </div>

                                   <div className="flex gap-3 pt-4">
                                          <Button
                                                 type="button"
                                                 onClick={() => setIsUserModalOpen(false)}
                                                 variant="secondary"
                                                 className="flex-1 h-12 rounded-xl font-bold"
                                          >
                                                 Cancelar
                                          </Button>
                                          <Button
                                                 type="submit"
                                                 className="flex-2 h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-bold"
                                                 disabled={loading}
                                          >
                                                 {loading ? "Guardando..." : selectedUser ? "Guardar Cambios" : "Crear Usuario"}
                                          </Button>
                                   </div>
                            </form>
                     </Modal>

                     {/* ── CONFIRM DELETE ────────────────────────────── */}
                     <ConfirmDialog
                            isOpen={isConfirmOpen}
                            onClose={() => setIsConfirmOpen(false)}
                            onConfirm={handleDeleteUser}
                            title="Eliminar Usuario"
                            description={`¿Estás seguro que deseas eliminar al usuario ${userToDelete?.username}? Esta acción es permanente y no se puede deshacer.`}
                     />
              </div>
       );
}
