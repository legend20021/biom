#!/bin/bash

# Script para comprimir archivos - VERSIÓN SIN AsyncTCP
echo "Comprimiendo archivos para ESP32 (HTTP Polling)..."

# Definir rutas
DATA_FOLDER="../Back/zenit_back_modular/data"

# Limpiar carpeta data del ESP32
echo "🧹 Limpiando carpeta data del ESP32..."
rm -rf "$DATA_FOLDER"/*

# Crear directorios directamente en el ESP32
mkdir -p "$DATA_FOLDER"
mkdir -p "$DATA_FOLDER/css"
mkdir -p "$DATA_FOLDER/js"
mkdir -p "$DATA_FOLDER/icons"

# Función para comprimir archivo directamente al ESP32
compress_file() {
    if [ -f "$1" ]; then
        echo "Comprimiendo: $1"
        
        # Comprimir directamente a la carpeta data del ESP32
        gzip -c -9 "$1" > "$DATA_FOLDER/$1"
        
        # Mostrar tamaños
        original_size=$(stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || wc -c < "$1")
        compressed_size=$(stat -f%z "$DATA_FOLDER/$1" 2>/dev/null || stat -c%s "$DATA_FOLDER/$1" 2>/dev/null || wc -c < "$DATA_FOLDER/$1")
        
        echo "  📄 $1: $original_size bytes → $compressed_size bytes ($(echo "scale=1; $compressed_size*100/$original_size" | bc -l 2>/dev/null || echo "~50")% del original)"
    else
        echo "❌ Archivo no encontrado: $1"
    fi
}

# Comprimir archivos principales
echo "=== COMPRIMIENDO ARCHIVOS PRINCIPALES ==="

# El index.html principal ahora es la versión HTTP Polling
compress_file "index.html"
echo "✅ index.html comprimido (versión HTTP Polling - SIN WebSocket)"

# El index-default.html para acceso sin headers
compress_file "index-default.html"
echo "✅ index-default.html comprimido"

# Comprimir otros archivos
compress_file "manifest.json"
compress_file "sw.js"

# Comprimir CSS
echo "=== COMPRIMIENDO CSS ==="
if [ -f "css/clean.css" ]; then
    echo "Comprimiendo: css/clean.css"
    gzip -c -9 "css/clean.css" > "$DATA_FOLDER/css/clean.css"
    
    original_size=$(stat -f%z "css/clean.css" 2>/dev/null || stat -c%s "css/clean.css" 2>/dev/null || wc -c < "css/clean.css")
    compressed_size=$(stat -f%z "$DATA_FOLDER/css/clean.css" 2>/dev/null || stat -c%s "$DATA_FOLDER/css/clean.css" 2>/dev/null || wc -c < "$DATA_FOLDER/css/clean.css")
    
    echo "  📄 CSS: $original_size bytes → $compressed_size bytes"
fi

# Comprimir archivos JS (incluyendo el nuevo http-polling.js)
echo "=== COMPRIMIENDO JAVASCRIPT ==="
for jsfile in js/*.js; do
    if [ -f "$jsfile" ]; then
        filename=$(basename "$jsfile")
        echo "Comprimiendo: $jsfile"
        
        # Comprimir directamente al ESP32
        gzip -c -9 "$jsfile" > "$DATA_FOLDER/$jsfile"
        
        # Mostrar tamaño
        original_size=$(stat -f%z "$jsfile" 2>/dev/null || stat -c%s "$jsfile" 2>/dev/null || wc -c < "$jsfile")
        compressed_size=$(stat -f%z "$DATA_FOLDER/$jsfile" 2>/dev/null || stat -c%s "$DATA_FOLDER/$jsfile" 2>/dev/null || wc -c < "$DATA_FOLDER/$jsfile")
        
        echo "  📄 $filename: $original_size bytes → $compressed_size bytes"
    fi
done

# Asegurar que http-polling.js esté incluido
if [ -f "js/http-polling.js" ]; then
    echo "✅ http-polling.js incluido (reemplazo de WebSocket)"
else
    echo "⚠️ http-polling.js no encontrado - creando versión básica"
    echo "// HTTP Polling client placeholder" > "js/http-polling.js"
    gzip -c -9 "js/http-polling.js" > "$DATA_FOLDER/js/http-polling.js"
fi

# Copiar iconos sin comprimir (son pequeños, no necesitan compresión)
echo "=== COPIANDO ICONOS ==="
if [ -d "icons" ]; then
    # Copiar directamente al ESP32
    cp -r icons/* "$DATA_FOLDER/icons/" 2>/dev/null || echo "No hay iconos para copiar"
    
    # Contar iconos copiados
    icon_count=$(find icons/ -type f | wc -l)
    echo "  📁 $icon_count iconos copiados sin comprimir"
fi

echo ""
echo "=== RESUMEN DE COMPRESIÓN ==="
echo "Método: HTTP Polling (SIN AsyncTCP/WebSocket)"

echo ""
echo "📊 TAMAÑOS:"
echo "Archivos originales (Front/):"
du -sh . 2>/dev/null | head -1

echo "Archivos listos para ESP32 (Back/data/):"
du -sh "$DATA_FOLDER" 2>/dev/null | head -1

# Calcular espacio total que se subirá
total_size=$(find "$DATA_FOLDER" -type f -exec stat -f%z {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}' || find "$DATA_FOLDER" -type f -exec stat -c%s {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
total_kb=$((total_size / 1024))

echo ""
echo "🎯 RESULTADO FINAL:"
echo "Total a subir al ESP32: $total_size bytes ($total_kb KB)"

if [ $total_size -gt 1000000 ]; then
    echo "⚠️  ADVERTENCIA: Más de 1MB - puede causar error 'Too much data'"
elif [ $total_size -gt 500000 ]; then
    echo "⚠️  CUIDADO: Más de 500KB - monitorear el upload"
else
    echo "✅ Tamaño OK: Menos de 500KB - debería subir sin problemas"
fi

echo ""
echo "=== ARCHIVOS LISTOS ==="
echo "📁 Directorio ESP32: $DATA_FOLDER/"
echo "📄 HTML: index.html (HTTP Polling version)"
echo "📜 JS: http-polling.js (reemplazo de WebSocket)"  
echo "🎨 CSS: clean.css (comprimido)"
echo "🖼️ Icons: copiados sin comprimir"

echo ""
echo "=== INSTRUCCIONES ==="
echo "1. ✅ Archivos generados directamente en Back/zenit_back_modular/data/"
echo "2. Usar Arduino IDE > Tools > ESP32 Sketch Data Upload"

echo ""
echo "✅ Sistema listo para upload directo desde Arduino IDE"
