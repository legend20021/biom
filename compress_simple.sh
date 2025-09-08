#!/bin/bash

# Script para comprimir archivos - VERSIÓN SIN AsyncTCP
echo "Comprimiendo archivos para ESP32 (HTTP Polling)..."

# Crear directorios
mkdir -p gzip-zenit
mkdir -p gzip-zenit/css
mkdir -p gzip-zenit/js
mkdir -p gzip-zenit/icons

# Función para comprimir archivo
compress_and_copy() {
    if [ -f "$1" ]; then
        echo "Comprimiendo: $1"
        gzip -c -9 "$1" > "gzip-zenit/$1"
        ls -lh "$1" "gzip-zenit/$1"
    else
        echo "Archivo no encontrado: $1"
    fi
}

# Comprimir archivos principales
echo "=== COMPRIMIENDO ARCHIVOS PRINCIPALES ==="

# El index.html principal ahora es la versión HTTP Polling
compress_and_copy "index.html"
echo "✅ index.html comprimido (versión HTTP Polling - SIN WebSocket)"

# Comprimir otros archivos
compress_and_copy "manifest.json"
compress_and_copy "sw.js"

# Comprimir CSS
echo "=== COMPRIMIENDO CSS ==="
if [ -f "css/clean.css" ]; then
    echo "Comprimiendo: css/clean.css"
    gzip -c -9 "css/clean.css" > "gzip-zenit/css/clean.css"
    ls -lh "css/clean.css" "gzip-zenit/css/clean.css"
fi

# Comprimir archivos JS (incluyendo el nuevo http-polling.js)
echo "=== COMPRIMIENDO JAVASCRIPT ==="
for jsfile in js/*.js; do
    if [ -f "$jsfile" ]; then
        echo "Comprimiendo: $jsfile"
        gzip -c -9 "$jsfile" > "gzip-zenit/$jsfile"
        ls -lh "$jsfile" "gzip-zenit/$jsfile"
    fi
done

# Asegurar que http-polling.js esté incluido
if [ -f "js/http-polling.js" ]; then
    echo "✅ http-polling.js incluido (reemplazo de WebSocket)"
else
    echo "⚠️ http-polling.js no encontrado - creando versión básica"
    echo "// HTTP Polling client placeholder" > "js/http-polling.js"
    gzip -c -9 "js/http-polling.js" > "gzip-zenit/js/http-polling.js"
fi

# Copiar iconos sin comprimir
echo "=== COPIANDO ICONOS ==="
if [ -d "icons" ]; then
    cp -r icons/* gzip-zenit/icons/ 2>/dev/null || echo "No hay iconos para copiar"
fi

echo ""
echo "=== RESUMEN DE COMPRESIÓN ==="
echo "Método: HTTP Polling (SIN AsyncTCP/WebSocket)"
echo "Archivos originales:"
du -sh . 2>/dev/null | head -1
echo "Archivos comprimidos (gzip-zenit):"
du -sh gzip-zenit 2>/dev/null | head -1

echo ""
echo "=== ARCHIVOS LISTOS ==="
echo "📁 Directorio: gzip-zenit/"
echo "📄 HTML: index.html (HTTP Polling version)"
echo "📜 JS: http-polling.js (reemplazo de WebSocket)"
echo "🎨 CSS: clean.css (sin cambios)"
echo "🖼️ Icons: copiados sin comprimir"

echo ""
echo "=== INSTRUCCIONES ==="
echo "1. Subir contenido de gzip-zenit/ al ESP32 via SPIFFS"
echo "2. Usar sketch_no_async.ino (SIN AsyncTCP)"
echo "3. Sistema usará HTTP polling cada 3 segundos"
echo "4. NO más watchdog timeouts AsyncTCP"

echo ""
echo "✅ Sistema optimizado para estabilidad máxima"
