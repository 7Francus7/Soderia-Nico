import React, { useEffect } from 'react';
import { X } from 'lucide-react';


interface ModalProps {
       isOpen: boolean;
       onClose: () => void;
       title: string;
       children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
       useEffect(() => {
              const handleEsc = (e: KeyboardEvent) => {
                     if (e.key === 'Escape') onClose();
              };
              if (isOpen) window.addEventListener('keydown', handleEsc);
              return () => window.removeEventListener('keydown', handleEsc);
       }, [isOpen, onClose]);

       if (!isOpen) return null;

       return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                   <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                                   <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition text-slate-500">
                                          <X className="w-5 h-5" />
                                   </button>
                            </div>
                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                   {children}
                            </div>
                     </div>
              </div>
       );
}
