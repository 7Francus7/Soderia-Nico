# ARQUITECTURA DEL SISTEMA - SODERÍA LOS DOS HERMANOS

## 1. Diseño General

El sistema utiliza una arquitectura **Cliente-Servidor Híbrida** con enfoque **Offline-First** para los clientes móviles.

*   **Backend Central (API):** Fuente de verdad. Maneja persistencia, reglas de negocio complejas, autenticación y sincronización.
*   **Base de Datos Central:** Relacional (SQL). Almacena toda la historia y estado global.
*   **Admin PC (Web Client):** Interfaz para gestión administrativa. Se conecta online a la API.
*   **Mobile App (Offline Client):** Interfaz operativa para repartidores. Mantiene una DB local (SQLite) y sincroniza con el Backend ('Store & Forward').

### Diagrama Textual de Módulos

```text
[ CLIENTE MÓVIL (Flutter) ]             [ ADMIN PC (Web SPA) ]
        |                                       |
    [ DB Local (SQLite) ]                   [ Browser ]
        |                                       |
        | (Sync / REST)                         | (REST JSON)
        +-------------------+-------------------+
                            |
                            v
                  [ API GATEWAY / LOAD BALANCER ] (Opcional, Nginx/Traefik)
                            |
                            v
                  [ BACKEND (Python FastAPI) ]
             +--------------+---------------+
             |              |               |
        [ Auth/Sec ]   [ Reglas Negocio ] [ Sync Engine ]
             |              |               |
             +--------------+---------------+
                            |
                            v
                  [ DB CENTRAL (PostgreSQL/SQLite) ]
```

## 2. Stack Tecnológico

*   **Backend:** Python 3.10+ con **FastAPI**.
    *   *Justificación:* Alto rendimiento (asíncrono), generación automática de documentación (Swagger), tipeado fuerte con Pydantic (reduce bugs), ecosistema maduro.
*   **Base de Datos:** **SQLite** (archivo local) para MVP.
    *   *Migración:* Preparado con **SQLModel** (ORM que combina Pydantic+SQLAlchemy) para cambiar connection string a PostgreSQL en producción sin reescribir queries.
*   **Admin PC:** **HTML5/JS Simple + Vue.js (CDN) o React**.
    *   *Propuesto:* **React Admin** o **Vuexy** (Templates de dashboard). Para este MVP usaremos endpoints que sirven JSON y un frontend desacoplado.
    *   *Pros:* Acceso desde cualquier PC en la red, sin instalación. Actualizaciones centralizadas.
*   **Mobile:** **Flutter**.
    *   *Justificación:* Un codebase para Android/iOS. Excelente rendimiento. Librerías maduras para SQLite local (`sqflite` o `drift`) y manejo de estado offline.

## 3. Estrategia de Sincronización (Offline-First)

El desafío principal es manejar la desconexión.

### Modelo de Datos Móvil
El móvil descarga una "foto" de los datos necesarios (Clientes de su ruta, Productos, Precios) al inicio del día (`GET /sync/initial_load`).

### Cola de Operaciones (Outbox Pattern)
Cuando el repartidor realiza una acción (Venta, Cobro, Movimiento Envase):
1.  Se guarda en la tabla `operations_queue` local en SQLite.
    *   Estuctura: `{uuid, action, payload, timestamp, status='pending'}`.
2.  Se actualiza el estado localmente ("Optimistic UI").

### Sincronización (`POST /sync/push`)
Cuando hay red:
1.  El móvil envía su cola de operaciones pendientes.
2.  El servidor procesa en orden.
3.  **Conflictos:**
    *   *Last-Write-Wins* para datos simples (dirección cliente).
    *   *Fusión/Additivo* para cuentas corrientes y stock (si el cliente pagó $100 en el server y $50 en el móvil, el saldo baja $150).
4.  El servidor responde con `ACK` de los UUIDs procesados.
5.  El móvil elimina esos items de la cola.

### Idempotencia
Cada operación tiene un `client_generated_id` (UUID v4). Si el servidor recibe el mismo UUID dos veces, ignora el segundo pero responde OK.

## 4. Auditoría
Todas las tablas críticas tendrán `created_at`, `updated_at`, `created_by`. Además, una tabla `audit_logs` registrará eventos sensibles (cambios de precio manuales, anulaciones).
