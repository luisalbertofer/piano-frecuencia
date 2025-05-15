#!/bin/bash

# Nombre del repositorio
REPO="piano-frecuencia"
USERNAME="luisalbertofer" # ← reemplaza por tu usuario real de GitHub

# Mensaje
echo "🚀 Iniciando despliegue de $REPO a GitHub Pages..."

# Asegurar que estás en la raíz del proyecto
if [ ! -f package.json ]; then
  echo "❌ Este script debe ejecutarse desde la raíz del proyecto (donde está package.json)"
  exit 1
fi

# Ejecutar build
echo "🔧 Compilando proyecto..."
npm run build

# Publicar con gh-pages
echo "🌐 Publicando en https://$USERNAME.github.io/$REPO ..."
npx gh-pages -d dist

echo "✅ ¡Despliegue completado con éxito!"
