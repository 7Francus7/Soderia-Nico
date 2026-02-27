---
description: Protocolo de Planificación y Arquitectura (Blueprint)
---

# 🏗️ Antigravity Blueprint

Este protocolo se activa al inicio de cualquier tarea compleja para asegurar que la arquitectura sea coherente y que los pasos estén bien definidos antes de escribir código.

## 1. Localizar la Verdad Única
Antes de planificar, verifica:
- [ ] `.agent/project_status.md` (Estado actual y stack)
- [ ] `prisma/schema.prisma` (Base de datos)
- [ ] `src/types/` (Modelos de datos)

## 2. Definición del Problema
Analiza el requerimiento del usuario y desglósalo:
- **Objetivo**: ¿Qué queremos lograr exactamente?
- **Restricciones**: ¿Hay limitaciones técnicas o de negocio?
- **Impacto**: ¿Qué partes del sistema se verán afectadas?

## 3. Especificación Técnica
Define los cambios necesarios siguiendo el stack actual (Next.js 16, Tailwind 4, Prisma):
- **Componentes**: Lista los nuevos componentes o modificaciones.
- **Acciones (Server Actions)**: Define la lógica del servidor necesaria.
- **Esquemas (Zod)**: Define las validaciones de entrada.
- **API/Endpoints**: Define si se necesitan nuevas rutas de API.

## 4. Plan de Ejecución (Sprints/Waves)
Divide la tarea en pasos granulares:
1. **Paso 1**: Preparación (Modelos de datos, tipos).
2. **Paso 2**: Lógica de Negocio (Server Actions, hooks).
3. **Paso 3**: Interfaz de Usuario (Componentes React).
4. **Paso 4**: Integración y Pruebas.

---
> [!TIP]
> **Think Before Code**: Siempre realiza un análisis de impacto antes de sugerir cambios en el esquema de la base de datos o en componentes compartidos.
