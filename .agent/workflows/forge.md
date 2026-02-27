---
description: Protocolo de Implementación y Codificación (Forge)
---

# 🔨 Antigravity Forge

Este protocolo rige la fase de codificación para garantizar implementaciones limpias, seguras y alineadas con el plan Blueprint.

## 1. Preparación del Contexto
Carga los archivos relevantes definidos en el Blueprint. No intentes editar archivos a ciegas.
- [ ] Leer componentes base de `src/components/ui`.
- [ ] Verificar tipos en `src/types`.
- [ ] Consultar el esquema de Prisma si hay cambios en DB.

## 2. Ciclo de Implementación (Loop)
Por cada tarea del plan:
1. **Analizar**: Revisa el archivo actual y busca patrones existentes.
2. **Implementar**: Escribe el código siguiendo los estándares de Next.js.
   - Usa `use server` para acciones.
   - Usa componentes funcionales y Hooks de React.
   - Aplica estilos con Tailwind 4 (usando variables CSS de ser posible).
3. **Verificar**: 
   - Linting y errores de TypeScript.
   - Funcionamiento básico.

## 3. Límites de Seguridad (Guardrails)
- **No Refactorización Invisible**: No aproveches para limpiar código que no está relacionado con la tarea actual sin avisar.
- **Manejo de Errores**: Todo proceso crítico debe tener bloques `try/catch` y feedback al usuario (ej. `sonner`).
- **Seguridad**: Valida siempre los datos de entrada con Zod.

---
> [!IMPORTANT]
> **Aestethics**: Como se indica en las instrucciones del sistema, el diseño debe ser premium. No uses placeholders, genera imágenes reales o usa iconos de `lucide-react`.
