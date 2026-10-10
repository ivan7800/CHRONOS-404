# 404 QA REPORT — CHRONOS 404 1.0.0

## Inventario
26 archivos de origen ZIP, más suite interactiva nueva `tests/browser_offline.py` y `.nojekyll`. Se preservan todos los módulos, datos, CSS y contenidos originales.

## Hallazgos demostrados
- QA-001 [ALTO, corregido]: `tests/browser_smoke.py` dependía de localhost, bloqueado por la política de Chromium (`ERR_BLOCKED_BY_ADMINISTRATOR`), y esperaba el catálogo obsoleto de 10 fichas. Se reemplazó su entrada por suite Chromium offline con catálogo de 30.
- QA-002 [ALTO, corregido para este entorno]: `tests/test_premium.py` dependía de localhost y no podía ejecutarse. Apunta ahora a la suite Chromium offline.
- QA-003 [MEDIO, corregido]: index.html aún indicaba `RC 0.8.6` y documentación de publicación desactualizada. Se unificó a 1.0.0 y documentó GitHub Pages en subruta.

## Evidencia ejecutada
- `node --check` para cada uno de los siete módulos: PASS (exit 0).
- `node tests/check_all_30.js`: PASS (exit 0).
- `python tests/check_data.py`, `check_atlas.py`, `check_cities.py`, `check_archive.py`, `check_editorial.py`, `check_editorial_v083.py`, `check_editorial_v085.py`: PASS (exit 0).
- `python tests/browser_offline.py`: PASS (exit 0) Chromium 1440×900 y 390×844: navegación de años, salto, atrás/adelante, salto variable, registro próximo, filtros, búsqueda, biblioteca→cronología con filtros previos, categorías, vacíos y restablecimiento, culturas, selección de ciudad/paradas/vista/reset, atlas, apertura/cierre/ESC diálogo, aleatorio, tres temas, reproducción/pausa; sin errores JS, sin overflow horizontal.
- `python tests/browser_smoke.py`, `python tests/test_premium.py`: PASS (exit 0), reutilizan suite offline.

## Seguridad
Inspección de JS/HTML: DOM creado con `textContent`/nodos, vínculos externos `noopener noreferrer`, ausencia de secretos o peticiones externas obligatorias en scripts. Persistencia solo del tema. Sin autenticación ni backend. No equivale a auditoría de penetración.

## Pendientes reales
- Prueba de despliegue en el dominio GitHub Pages: NO EJECUTADA (no se publicó).
- Chrome/Edge/Firefox/Safari en dispositivos reales: NO EJECUTADO.
- Auditoría de lector de pantalla y WCAG completa: NO EJECUTADA.
- Revisión historiográfica integral de las narraciones: NO COMPLETADA. Las fuentes/fechas están delimitadas, no completamente certificadas.
- El mapa es esquemático y las imágenes son conceptuales; limitación de producto explícita, no un bug.

## Release gate
**PASS para paquete estático candidato a publicación en GitHub Pages** tras pruebas Chromium offline; **verificación del sitio público pendiente**. No afirmar despliegue real probado ni 10/10 científico.
