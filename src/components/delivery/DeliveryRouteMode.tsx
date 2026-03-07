"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DeliveryStop } from "@/types/delivery";
import { useDeliveryRoute } from "@/hooks/use-delivery-route";
import { RouteHeader } from "./route/RouteHeader";
import { StopSelector } from "./route/StopSelector";
import { StopDetail } from "./route/StopDetail";
import { RouteNavigation } from "./route/RouteNavigation";

/**
 * Módulo de Repartos Completo (Entregas + Incidencias + Cobranzas)
 * 
 * Implementa el flujo operativo final:
 * 1. Entrega con stock y finanzas automáticas.
 * 2. Registro de incidencias (Ausente, etc) con auditoría.
 * 3. Cobranzas en el momento para pedidos o deuda antigua.
 */

interface DeliveryRouteModeProps {
       delivery: any;
       stops: DeliveryStop[];
}

export default function DeliveryRouteMode({ delivery, stops }: DeliveryRouteModeProps) {
       const {
              currentIdx,
              current,
              localStops,
              progress,
              deliveredCount,
              showItems,
              setShowItems,
              isMutating,
              confirmDelivery,
              reportIncident,
              collectPayment,
              goToNext,
              goToPrev,
              jumpTo
       } = useDeliveryRoute(stops);

       if (!localStops || localStops.length === 0) {
              return (
                     <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay paradas en esta ruta</p>
                     </div>
              );
       }

       return (
              <div className="flex flex-col min-h-full animate-fade-in-up">

                     {/* Encabezado con progreso */}
                     <RouteHeader
                            deliveredCount={deliveredCount}
                            totalStops={stops.length}
                            progress={progress}
                     />

                     {/* Selector de paradas */}
                     <StopSelector
                            stops={localStops}
                            currentIdx={currentIdx}
                            onSelect={jumpTo}
                     />

                     {/* Detalle de parada con transiciones visuales */}
                     <div className="flex-1 relative">
                            <AnimatePresence mode="wait">
                                   <motion.div
                                          key={currentIdx}
                                          initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                          className="w-full"
                                   >
                                          <StopDetail
                                                 stop={current}
                                                 showItems={showItems}
                                                 onToggleItems={() => setShowItems(!showItems)}
                                                 onConfirm={confirmDelivery}
                                                 onIncident={reportIncident}
                                                 onCollect={collectPayment}
                                                 isMutating={isMutating}
                                          />
                                   </motion.div>
                            </AnimatePresence>
                     </div>

                     {/* Navegación inferior */}
                     <RouteNavigation
                            currentIdx={currentIdx}
                            totalStops={stops.length}
                            onPrev={goToPrev}
                            onNext={goToNext}
                     />
              </div>
       );
}
