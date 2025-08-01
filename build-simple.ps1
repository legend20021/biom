#ejecutar con: powershell -ExecutionPolicy Bypass -File "build-simple.ps1"

# BIOMASTER Build Script Simple
Write-Host "Iniciando optimizacion de archivos..." -ForegroundColor Green

# Verificar si existe 7-Zip
$7zipPath = Get-Command "7z" -ErrorAction SilentlyContinue

if (-not $7zipPath) {
    Write-Host "7-Zip no encontrado. Instalando compresi n nativa..." -ForegroundColor Yellow
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
}

# Crear directorios
New-Item -ItemType Directory -Path "dist" -Force | Out-Null
New-Item -ItemType Directory -Path "dist/css" -Force | Out-Null
New-Item -ItemType Directory -Path "dist/js" -Force | Out-Null
New-Item -ItemType Directory -Path "dist/icons" -Force | Out-Null

Write-Host "Copiando archivos..." -ForegroundColor Yellow

# Copiar archivos principales
if (Test-Path "index.html") { Copy-Item "index.html" "dist/" }
if (Test-Path "manifest.json") { Copy-Item "manifest.json" "dist/" }
if (Test-Path "sw.js") { Copy-Item "sw.js" "dist/" }

# Función para minimizar CSS
function Minify-CSS {
    param([string]$inputFile, [string]$outputFile)
    
    Write-Host "Minimizando CSS: $inputFile" -ForegroundColor Yellow
    
    $content = Get-Content $inputFile -Raw -Encoding UTF8
    
    # Eliminar comentarios CSS (/* ... */)
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    
    # Eliminar espacios en blanco múltiples
    $content = $content -replace '\s+', ' '
    
    # Eliminar espacios alrededor de caracteres especiales
    $content = $content -replace '\s*{\s*', '{'
    $content = $content -replace '\s*}\s*', '}'
    $content = $content -replace '\s*;\s*', ';'
    $content = $content -replace '\s*:\s*', ':'
    $content = $content -replace '\s*,\s*', ','
    $content = $content -replace '\s*>\s*', '>'
    $content = $content -replace '\s*\+\s*', '+'
    $content = $content -replace '\s*~\s*', '~'
    
    # Eliminar espacios al inicio y final de líneas
    $content = $content -replace '^\s+', '' -replace '\s+$', ''
    
    # Eliminar líneas vacías
    $content = $content -replace '\r?\n\s*\r?\n', "`n"
    
    # Eliminar espacios innecesarios en valores
    $content = $content -replace ':\s+', ':'
    $content = $content -replace ';\s+', ';'
    
    # Eliminar último punto y coma antes de }
    $content = $content -replace ';}', '}'
    
    # Guardar archivo minimizado
    $content | Out-File -FilePath $outputFile -Encoding UTF8 -NoNewline
    
    $originalSize = (Get-Item $inputFile).Length
    $minifiedSize = (Get-Item $outputFile).Length
    $reduction = [math]::Round((($originalSize - $minifiedSize) / $originalSize) * 100, 2)
    
    Write-Host "CSS minimizado: $originalSize bytes → $minifiedSize bytes (reducción: $reduction%)" -ForegroundColor Green
}

# Copiar CSS
if (Test-Path "css/styles.css") { 
    Minify-CSS "css/styles.css" "dist/css/styles.css"
}

# Copiar JavaScript
$jsFiles = @(
    "js/performance.js", "js/theme.js", "js/state.js", "js/initialization.js",
    "js/chartLibrary.js", "js/chart-plugin.min.js", "js/progressManager.js", 
    "js/buttonLogic.js", "js/websocket.js", "js/notification.js", 
    "js/calibration.js", "js/eventListeners.js", "js/chartsLogic.js", 
    "js/telegram.js", "js/wifi.js"
)

foreach ($jsFile in $jsFiles) {
    if (Test-Path $jsFile) {
        Copy-Item $jsFile "dist/js/"
        Write-Host "Copiado: $jsFile" -ForegroundColor Cyan
    }
}

# Copiar iconos
if (Test-Path "icons") {
    Copy-Item "icons/*" "dist/icons/" -Recurse -Force
    Write-Host "Iconos copiados" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "COMPLETADO!" -ForegroundColor Green
Write-Host "Archivos listos en carpeta 'dist/'" -ForegroundColor White
Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "1. Copia todo el contenido de 'dist/' a la carpeta 'data/' de tu proyecto Arduino" -ForegroundColor White
Write-Host "2. En Arduino IDE: Herramientas -> Microcontrolador Sketch Data Upload" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para continuar"
