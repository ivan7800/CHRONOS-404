# CHRONOS 404 — 1.0.0 · Edición web

Explorador histórico estático. Incluye todos los contenidos originales de la 0.8.6: 30 registros históricos, 14 perfiles culturales, atlas esquemático, máquina del tiempo, 3 recorridos/9 paradas y biblioteca de 12 fichas. Tres temas visuales. Ninguna cuenta ni servidor obligatorio.

## Ejecutar localmente

Descomprime y abre `index.html`, o ejecuta `ABRIR_CHRONOS.bat` en Windows. No descargues solo `index.html`: necesita los demás archivos JavaScript y CSS. Los enlaces a bibliografía sí requieren conexión.

## Publicar en GitHub Pages

1. Crea el repositorio `CHRONOS-404` y coloca **el contenido interior** del ZIP en la raíz, no la carpeta contenedora.
2. Abre Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.
3. La dirección esperada es `https://<usuario>.github.io/CHRONOS-404/`.
4. Comprueba la carga, filtros, todos los recorridos, enlaces y consola en la URL pública. No necesita build, tokens ni Actions. Usa rutas relativas, por lo que funciona en subdirectorios.

## Tests

Requiere Python 3, Node.js y, para las pruebas interactivas, Playwright Python y Chromium:

```bash
for f in *.js; do node --check "$f"; done
node tests/check_all_30.js
python tests/check_data.py
python tests/check_atlas.py
python tests/check_cities.py
python tests/check_archive.py
python tests/check_editorial.py
python tests/check_editorial_v083.py
python tests/check_editorial_v085.py
python tests/browser_offline.py
```

La suite Chromium inserta HTML, CSS y scripts del paquete en una página sin navegar a localhost, porque el entorno de auditoría bloquea conexiones locales. Prueba interacciones y responsive en 1440×900 y 390×844; **no es una prueba de despliegue HTTP real**. `browser_smoke.py` y `test_premium.py` apuntan ahora a la misma suite, para evitar el test heredado con datos de solo 10 registros y dependencia de servidor.

## Límites y seguridad

- El atlas usa ubicaciones geográficas y contornos **esquemáticos**, no fronteras históricas.
- LOST CITIES presenta **esquemas ilustrativos**, no reconstrucciones arqueológicas verificadas.
- Las 30 fichas disponen de referencias delimitadas; eso **no certifica cada afirmación**. Véase `EDITORIAL-REVIEW.md`.
- No incluye backend, credenciales, APIs externas obligatorias ni service worker. `localStorage` guarda únicamente el tema elegido.
- No ha sido verificado un despliegue público real ni una matriz completa de lectores de pantalla/navegadores.

Ver `QA-REPORT.md` para evidencias y límites de certificación.
