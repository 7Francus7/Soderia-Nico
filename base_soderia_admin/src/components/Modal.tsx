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
                     document.body.style.overflow = 'hidden';
              }
              return () => {
                     window.removeEventListener('keydown', handleEsc);
                     document.body.style.overflow = '';
              };
       }, [isOpen, onClose]);

       if (!isOpen) return null;

       return (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                     <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full sm:max-w-lg overflow-hidden border border-slate-100 animate-slide-in-up md:animate-scale-in max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white/50 flex-shrink-0">
                                   <h3 className="text-lg font-extrabold text-slate-800 tracking-tight truncate pr-4">{title}</h3>
                                   <button
                                          onClick={onClose}
                                          className="p-2 hover:bg-slate-200/60 rounded-xl transition-all text-slate-400 hover:text-slate-600 flex-shrink-0 active:scale-90"
                                   >
                                          <X className="w-5 h-5" />
                                   </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                   {children}
                            </div>
                     </div>
              </div>
       );
}
