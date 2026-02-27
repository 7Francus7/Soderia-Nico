---
description: Protocolo de Calidad y Depuración (Challenge)
---

# 🔍 Antigravity Challenge

Protocolo para enfrentar bugs complejos o realizar revisiones de calidad profundas.

## 1. Reproducción del Problema
Antes de intentar arreglar algo:
- [ ] Documentar el error exacto (Logs, capturas de pantalla si es posible).
- [ ] Identificar el flujo que causa el fallo.
- [ ] Localizar los archivos involucrados en la traza del error.

## 2. Análisis de Causa Raíz (Root Cause)
Usa **Sequential Thinking** para desglosar el problema:
1. ¿Es un fallo de lógica en el cliente o en el servidor?
2. ¿Los datos provienen de la base de datos como se espera?
3. ¿Hay algún cambio reciente que haya roto esta funcionalidad?

## 3. Resolución y Verificación
- Implementa la solución mínima necesaria.
- Verifica que el arreglo no rompa funcionalidades adyacentes (Regresión).
- Añade comentarios o logs si la solución es compleja para evitar que se repita.

---
> [!CAUTION]
> **No asumas**: Si no puedes reproducir el error o los logs no son claros, pide al usuario más información o añade logs temporales de depuración.
