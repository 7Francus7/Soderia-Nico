import { useState, useCallback } from "react";
import { toast } from "sonner";
import { DeliveryStop } from "@/types/delivery";
import { deliverOrder, registerOrderIncident, registerCollection } from "@/actions/deliveries";
import { DeliverOrderInput, RegisterOrderIncidentInput, RegisterCollectionInput } from "@/schemas/delivery";

// Utility for UUID (Simple for now, production could use a real lib)
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export function useDeliveryRoute(initialStops: DeliveryStop[]) {
       const [currentIdx, setCurrentIdx] = useState(() => {
              const firstPending = initialStops.findIndex(s => s.status === "pending" || s.status === "confirmed");
              return firstPending >= 0 ? firstPending : 0;
       });
       const [localStops, setLocalStops] = useState(initialStops);
       const [showItems, setShowItems] = useState(false);
       const [isMutating, setIsMutating] = useState(false);

       const current = localStops[currentIdx];
       const deliveredCount = localStops.filter(s => s.status === "delivered").length;
       const progress = initialStops.length > 0 ? (deliveredCount / initialStops.length) * 100 : 0;

       const confirmDelivery = useCallback(async (data: Omit<DeliverOrderInput, 'orderId' | 'idempotencyKey'>) => {
              if (isMutating) return;
              setIsMutating(true);

              const idempotencyKey = `deliver-${current.orderId}-${generateId()}`;

              try {
                     const result = await deliverOrder({
                            ...data,
                            orderId: current.orderId,
                            idempotencyKey
                     });

                     if (result.success) {
                            setLocalStops(prev => prev.map((s, i) =>
                                   i === currentIdx ? { ...s, status: "delivered" } : s
                            ));

                            toast.success("✅ Entrega registrada correctamente");

                            const nextPending = localStops.findIndex((s, i) => i > currentIdx && (s.status === "pending" || s.status === "confirmed"));
                            if (nextPending >= 0) {
                                   setTimeout(() => {
                                          setCurrentIdx(nextPending);
                                          setShowItems(false);
                                   }, 600);
                            }
                     } else {
                            toast.error(result.error || "Error al registrar entrega");
                     }
              } catch (e) {
                     toast.error("Error de conexión");
              } finally {
                     setIsMutating(false);
              }
       }, [current, currentIdx, isMutating, localStops]);

       const reportIncident = useCallback(async (data: Omit<RegisterOrderIncidentInput, 'orderId' | 'idempotencyKey'>) => {
              if (isMutating) return;
              setIsMutating(true);

              const idempotencyKey = `incident-${current.orderId}-${generateId()}`;

              try {
                     const result = await registerOrderIncident({
                            ...data,
                            orderId: current.orderId,
                            idempotencyKey
                     });

                     if (result.success) {
                            const displayStatus = data.type === "ABSENT" ? "absent" : "rejected";

                            setLocalStops(prev => prev.map((s, i) =>
                                   i === currentIdx ? { ...s, status: displayStatus as any } : s
                            ));

                            toast.success(`Incidencia registrada: ${data.type}`);

                            const nextPending = localStops.findIndex((s, i) => i > currentIdx && (s.status === "pending" || s.status === "confirmed"));
                            if (nextPending >= 0) {
                                   setTimeout(() => {
                                          setCurrentIdx(nextPending);
                                          setShowItems(false);
                                   }, 600);
                            }
                     } else {
                            toast.error(result.error || "Error al registrar incidencia");
                     }
              } catch (e) {
                     toast.error("Error de conexión");
              } finally {
                     setIsMutating(false);
              }
       }, [current, currentIdx, isMutating, localStops]);

       const collectPayment = useCallback(async (data: Omit<RegisterCollectionInput, 'clientId' | 'orderId' | 'idempotencyKey'>) => {
              if (isMutating) return;
              setIsMutating(true);

              const idempotencyKey = `collect-${current.clientId}-${generateId()}`;

              try {
                     const result = await registerCollection({
                            ...data,
                            clientId: current.clientId,
                            orderId: current.orderId,
                            idempotencyKey
                     });

                     if (result.success) {
                            setLocalStops(prev => prev.map((s, i) =>
                                   i === currentIdx ? { ...s, clientBalance: s.clientBalance - data.amount } : s
                            ));

                            toast.success(`✅ Cobranza de $${data.amount} registrada`);
                     } else {
                            toast.error(result.error || "Error al registrar cobranza");
                     }
              } catch (e) {
                     toast.error("Error de conexión");
              } finally {
                     setIsMutating(false);
              }
       }, [current, currentIdx, isMutating]);

       const goToNext = useCallback(() => {
              setCurrentIdx(prev => Math.min(localStops.length - 1, prev + 1));
              setShowItems(false);
       }, [localStops.length]);

       const goToPrev = useCallback(() => {
              setCurrentIdx(prev => Math.max(0, prev - 1));
              setShowItems(false);
       }, []);

       const jumpTo = useCallback((index: number) => {
              setCurrentIdx(index);
              setShowItems(false);
       }, []);

       return {
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
       };
}
