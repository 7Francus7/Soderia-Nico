# RELEVAMIENTO Y SUPUESTOS - SODERÍA LOS DOS HERMANOS

## 1. PREGUNTAS DE RELEVAMIENTO (15)

1.  **Precios:** ¿Existe diferenciación de precios por "Zona", "Tipo de Cliente" (Hogar/Comercio) o volumen de compra, o es lista única?
2.  **Envases:** ¿El stock de envases retornables se controla por saldo en el cliente (ej: "debe 2 cajones") o por activo fijo (número de serie del envase)?
3.  **Dispensers:** ¿Los equipos tienen número de serie único? ¿El alquiler se cobra mensual, por consumo, o es pago único?
4.  **Gas:** ¿Los productos de gas (garrafas/cilindros) requieren trazabilidad especial por seguridad (lote/matrícula)?
5.  **Caja Móvil:** ¿Los repartidores manejan su propia caja chica? ¿Hacen rendición diaria (cierre de caja por camión)?
6.  **Sincronización:** ¿Es aceptable que un pedido tomado offline tarde hasta el final del día en impactar en el central, o se busca sincronización periódica (ej: cada 1 hora si hay señal)?
7.  **Roles:** ¿El repartidor puede otorgar bonificaciones o descuentos en el momento, o solo aplica precios de lista?
8.  **Facturación:** ¿El sistema debe emitir factura electrónica (AFIP) en esta fase, o solo remito interno/comprobante "X"?
9.  **Geolocalización:** ¿Es obligatorio registrar la ubicación GPS exacta al momento de la entrega para auditoría?
10. **Pagos Mixtos:** ¿Un mismo pedido puede pagarse una parte en efectivo y otra en Cuenta Corriente?
11. **Stock Camión:** ¿Hay carga inicial de camión (hoja de ruta) y control de stock al regreso (sobrantes)?
12. **Promociones:** ¿Existen promociones complejas (ej: "llevando 3 sodas, 1 agua gratis") o packs cerrados?
13. **Clientes:** ¿Se requiere registrar datos fiscales (CUIT/DNI) obligatoriamente para todos, o se permiten consumidores finales anónimos?
14. **Notificaciones:** ¿El cliente recibe aviso (SMS/WhatsApp) de visita o comprobante digital?
15. **Seguridad:** ¿El acceso desde Admin PC será solo local (LAN) o requiere acceso remoto vía internet (necesidad de HTTPS/dominio)?

---

## 2. SUPUESTOS PARA MVP (Valores asumidos)

Con el fin de avanzar con el diseño y el MVP, asumiremos lo siguiente basándonos en prácticas comunes del rubro:

*   **ASUMIDO:** Precios diferenciados por Lista de Precios (Ej: Lista Hogar, Lista Comercio).
*   **ASUMIDO:** Control de Envases por Saldo (Cuenta Corriente de Envases). No por serie individual de botella.
*   **ASUMIDO:** Dispensers identificados por Número de Serie. Alquiler mensual fijo generado automáticamente.
*   **ASUMIDO:** Rendición de Caja por Repartidor al final del día.
*   **ASUMIDO:** Sincronización "lo antes posible" (al detectar red) o manual por el chofer.
*   **ASUMIDO:** Sin Factura Electrónica por ahora (solo comprobantes internos).
*   **ASUMIDO:** Pagos Mixtos permitidos.
*   **ASUMIDO:** Control de Stock de Carga (Salida) y Descarga (Retorno) del camión.
*   **ASUMIDO:** Acceso Admin PC vía Web Browser en red local (o VPN).
