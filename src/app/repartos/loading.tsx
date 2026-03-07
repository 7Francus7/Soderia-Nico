import { Truck, Droplets } from "lucide-react";

export default function Loading() {
       return (
              <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background">
                     <div className="relative mb-8">
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                                   <Truck className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                            <div className="absolute -inset-1 border-2 border-primary/20 border-t-primary rounded-2xl animate-spin" />
                     </div>
                     <div className="flex flex-col items-center gap-2">
                            <h2 className="text-sm font-bold tracking-widest uppercase text-foreground">Sodería <span className="text-primary">NICO</span></h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">Sincronizando Logística</p>
                     </div>
              </div>
       );
}
