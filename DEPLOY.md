# 🚀 Guía de Deploy — Sodería Nico

## Arquitectura en Producción

```
┌─────────────────────┐        ┌──────────────────────────┐
│   VERCEL (gratis)   │  API   │   RAILWAY (gratis)       │
│                     │◄──────►│                          │
│  React / Vite       │        │  FastAPI + PostgreSQL     │
│  Panel Admin        │        │  Backend API              │
└─────────────────────┘        └──────────────────────────┘
         ↑                                ↑
  iPhone / Tablet               Base de datos en la nube
```

---

## PASO 1 — Inicializar Git (si no lo hiciste)

```bash
# En la carpeta raíz del proyecto
git init
git add .
git commit -m "Initial commit - Sistema Soderia Nico"
```

---

## PASO 2 — Deploy del Backend en Railway

### 2.1 Crear cuenta en Railway
1. Ir a **https://railway.app**
2. Registrarse con GitHub
3. Crear un nuevo proyecto

### 2.2 Subir el backend
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Desde la carpeta /backend:
cd backend
railway up
```

O más fácil: conectar el repositorio de GitHub directamente desde el panel de Railway.

### 2.3 Agregar PostgreSQL
1. En tu proyecto Railway → **"New Service" → "PostgreSQL"**
2. Railway crea la base de datos y agrega `DATABASE_URL` automáticamente ✅

### 2.4 Configurar Variables de Entorno en Railway
En tu servicio FastAPI → **"Variables"**, agregar:

| Variable | Valor |
|---|---|
| `SECRET_KEY` | (una clave larga y aleatoria, ver abajo) |
| `FRONTEND_URL` | `https://tu-app.vercel.app` (lo sabrás en el Paso 3) |

**Generar SECRET_KEY segura:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2.5 Obtener la URL del backend
Después del deploy, Railway te da una URL como:
```
https://soderia-backend-production.up.railway.app
```
**Guardá esta URL, la necesitás en el Paso 3.**

---

## PASO 3 — Deploy del Frontend en Vercel

### 3.1 Crear cuenta en Vercel
1. Ir a **https://vercel.com**
2. Registrarse con GitHub
3. Importar el repositorio

### 3.2 Configurar el proyecto
- **Root Directory:** `base_soderia_admin`
- **Framework Preset:** Vite (lo detecta automáticamente)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3.3 Variables de Entorno en Vercel
En **Settings → Environment Variables** de tu proyecto Vercel:

| Variable | Valor |
|---|---|
| `VITE_API_BASE_URL` | `https://tu-backend.up.railway.app/api/v1` |

### 3.4 Hacer el deploy
```bash
# Opción A: desde el panel de Vercel (recomendado)
# Importar el repo → Vercel hace todo automáticamente

# Opción B: CLI
npm install -g vercel
cd base_soderia_admin
vercel --prod
```

---

## PASO 4 — Actualizar CORS en Railway

Después de obtener la URL de Vercel (ej: `https://soderia-nico.vercel.app`):

1. Ir a tu servicio en Railway
2. Variables → Editar `FRONTEND_URL`
3. Poner la URL de Vercel
4. Railway reinicia el servidor automáticamente ✅

---

## PASO 5 — Crear usuario admin en producción

Una vez el backend esté corriendo, ejecutá:

```bash
# Desde Railway Console o localmente con DATABASE_URL de producción
# En tu backend local:
DATABASE_URL="postgresql://..." python initial_data.py
```

O conectarte a Railway CLI:
```bash
railway run python initial_data.py
```

---

## Credenciales por defecto
```
Usuario:    admin
Contraseña: adminpassword  ← CAMBIAR ESTO en producción
```

Para cambiar la contraseña, editá `initial_data.py` antes del deploy.

---

## Costos estimados (planes gratuitos)

| Servicio | Plan | Costo |
|---|---|---|
| Vercel | Hobby (gratuito) | $0/mes |
| Railway | Starter ($5 crédito gratis) | ~$0/mes si el uso es bajo |
| Railway PostgreSQL | Incluido | $0/mes |

> ⚠️ Railway Starter tiene 500 horas/mes gratis. Para uso 24/7 (720 hs/mes) necesitás el plan Developer ($5/mes).

---

## Checklist final ✅

- [ ] Git inicializado y código comiteado
- [ ] Backend deployado en Railway
- [ ] PostgreSQL creado en Railway
- [ ] Variables de entorno configuradas en Railway
- [ ] Frontend deployado en Vercel
- [ ] `VITE_API_BASE_URL` configurada en Vercel
- [ ] `FRONTEND_URL` actualizada en Railway con URL de Vercel
- [ ] Usuario admin creado en base de datos de producción
- [ ] Probado desde iPhone/tablet 📱
