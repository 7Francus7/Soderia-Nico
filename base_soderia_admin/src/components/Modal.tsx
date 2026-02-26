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
              if (isOpen) {
                     window.addEventListener('keydown', handleEsc);
                     // Prevent body scroll on mobile when modal is open
                     document.body.style.overflow = 'hidden';
              }
              return () => {
                     window.removeEventListener('keydown', handleEsc);
                     document.body.style.overflow = '';
              };
       }, [isOpen, onClose]);

       if (!isOpen) return null;

       return (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                     <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                                   <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate pr-2">{title}</h3>
                                   <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition text-slate-500 flex-shrink-0">
                                          <X className="w-5 h-5" />
                                   </button>
                            </div>
                            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                                   {children}
                            </div>
                     </div>
              </div>
       );
}
