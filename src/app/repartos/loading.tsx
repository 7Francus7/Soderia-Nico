import { Truck } from "lucide-react";

export default function Loading() {
       return (
              <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                     <div className="relative">
                            <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center animate-pulse">
                                   <Truck className="w-10 h-10 text-primary animate-bounce" />
                            </div>
                            <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-[2rem] animate-spin" />
                     </div>
                     <p className="mt-8 text-lg font-black tracking-widest uppercase animate-pulse">
                            Cargando Logística...
                     </p>
              </div>
       );
}
