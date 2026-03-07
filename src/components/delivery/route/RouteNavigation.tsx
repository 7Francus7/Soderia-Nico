import { ChevronLeft, ChevronRight } from "lucide-react";

interface RouteNavigationProps {
       currentIdx: number;
       totalStops: number;
       onPrev: () => void;
       onNext: () => void;
}

export function RouteNavigation({ currentIdx, totalStops, onPrev, onNext }: RouteNavigationProps) {
       return (
              <div className="sticky bottom-0 -mx-6 px-10 pt-10 pb-12 bg-white/70 backdrop-blur-2xl border-t border-slate-100 z-50 flex items-center justify-between">
                     <button
                            onClick={onPrev}
                            disabled={currentIdx === 0}
                            className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 active:scale-90 disabled:opacity-20 transition-all shadow-sm"
                     >
                            <ChevronLeft className="w-7 h-7 stroke-[3px]" />
                     </button>

                     <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mb-1">POSICIÓN</span>
                            <div className="flex items-baseline gap-1">
                                   <span className="text-lg font-black text-foreground">{currentIdx + 1}</span>
                                   <span className="text-xs font-bold text-muted-foreground/40">/ {totalStops}</span>
                            </div>
                     </div>

                     <button
                            onClick={onNext}
                            disabled={currentIdx === totalStops - 1}
                            className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white active:scale-90 disabled:opacity-20 transition-all shadow-lg"
                     >
                            <ChevronRight className="w-7 h-7 stroke-[3px]" />
                     </button>
              </div>
       );
}
