# MODELO DE DATOS - SODERÍA

El modelo está diseñado para soportar SQLModel (SQLAlchemy). Las claves foráneas se indican con `FK`.

## Tablas Principales

### 1. Usuarios y Roles
*   **users**: `id`, `username`, `hashed_password`, `role_id` (FK), `is_active`, `full_name`.
*   **roles**: `id`, `name` (admin, chofer, secretaria), `permissions` (JSON).

### 2. Clientes
*   **clients**: `id`, `name`, `tax_id` (CUIT/DNI), `phone`, `email`, `is_active`, `created_at`.
*   **addresses**: `id`, `client_id` (FK), `street`, `number`, `city`, `lat`, `lng`, `zone_id` (FK), `notes`.

### 3. Productos y Precios
*   **products**: `id`, `code`, `name`, `category` (agua, soda, gas, dispenser), `is_returnable` (bool), `base_price`.
*   **product_prices**: `id`, `product_id` (FK), `price_list_id` (FK), `price`.
*   **price_lists**: `id`, `name` (Minorista, Mayorista).

### 4. Stock y Envases
*   **warehouses**: `id`, `name` (Depósito Central, Camión 1, Camión 2...).
*   **stock**: `warehouse_id` (FK), `product_id` (FK), `quantity` (saldo actual).
*   **bottles_ledger** (Cta Cte Envases): `id`, `client_id` (FK), `product_id` (FK), `quantity` (saldo: + debe envases, - tiene a favor), `updated_at`.

### 5. Pedidos y Entregas
*   **orders**: `id`, `client_id` (FK), `user_id` (FK Chofer), `status` (pending, delivered, cancelled), `total_amount`, `created_at`, `delivered_at`, `sync_id` (UUID).
*   **order_items**: `id`, `order_id` (FK), `product_id` (FK), `quantity`, `unit_price`, `subtotal`.
    *   *Nota:* Aquí se registra implícitamente el movimiento de envases (si `product.is_returnable`, suma 1 envase prestado y resta 1 envase lleno del stock).
*   **returned_items** (Devolución Envases): `id`, `order_id` (FK), `product_id` (FK), `quantity`.

### 6. Cuentas Corrientes y Pagos
*   **customer_accounts**: `id`, `client_id` (FK), `balance` (saldo actual).
*   **account_movements**: `id`, `account_id` (FK), `type` (debit/credit), `amount`, `reference_order_id` (FK nullable), `description`, `date`.
*   **payments**: `id`, `order_id` (FK nullable), `client_id` (FK), `amount`, `method` (cash, transfer, cc), `collected_by` (FK user).

### 7. Activos (Dispensers)
*   **machines**: `id`, `serial_number`, `model`, `status` (available, rented, maintenance).
*   **rentals**: `id`, `machine_id` (FK), `client_id` (FK), `start_date`, `end_date`, `monthly_fee`, `billing_day`.

## Relaciones Clave (Constraints)
*   Integridad referencial en todas las FK.
*   Índices en campos de búsqueda frecuente: `clients.name`, `products.code`, `orders.created_at`.
*   Unique constraint en `users.username`, `products.code`, `machines.serial_number`.

---

# API REST ENDPOINTS (Resumen)

Todos los endpoints bajo `/api/v1`. Autenticación vía Header `Authorization: Bearer <token>`.

### Auth
*   `POST /auth/token` (Login) -> `{access_token, token_type}`
*   `GET /auth/me` (Datos usuario actual)

### Clientes
*   `GET /clients/` (Listar con filtros)
*   `POST /clients/` (Crear)
*   `GET /clients/{id}`
*   `GET /clients/{id}/account` (Ver saldo y movimientos)

### Productos
*   `GET /products/`
*   `POST /products/`

### Pedidos (Operativo)
*   `POST /orders/` (Crear pedido - Venta)
*   `GET /orders/pending` (Pedidos asginados al chofer)

### Sincronización
*   `POST /sync/push`
    *   **Body:** `[{"entity": "order", "data": {...}, "uuid": "..."}]`
    *   Procesa lote de operaciones offline.
*   `GET /sync/pull`
    *   **Params:** `last_sync_timestamp`
    *   **Response:** `{ "clients": [...updated], "products": [...updated] }`

### Caja y Reportes
*   `GET /reports/daily-cash`
*   `GET /reports/stock-movements`
