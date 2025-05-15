#!/bin/bash

# CONFIGURACIÓN PERSONALIZABLE
REPO="piano-frecuencia"
USERNAME="luisalbertofer" # ← REEMPLAZA esto por tu usuario real de GitHub
MAIN_BRANCH="main"   # o "master" si usas master

# 1. Confirmación
echo "🚀 Iniciando despliegue del proyecto '$REPO' a GitHub Pages..."

# 2. Verifica que estés en la raíz del proyecto
if [ ! -f package.json ]; then
  echo "❌ Este script debe ejecutarse desde la raíz del proyecto (donde está package.json)"
  exit 1
fi

# 3. Git commit (si hay cambios)
echo "📦 Guardando cambios locales (si los hay)..."
git add .

read -p "📝 Escribe un mensaje de commit para 'main': " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="🛠️ Actualización antes de deploy"
fi

git commit -m "$COMMIT_MSG"
git push origin $MAIN_BRANCH

# 4. Build del proyecto
echo "🔧 Ejecutando build de producción..."
npm run build

# 5. Deploy a gh-pages
echo "🌐 Desplegando en: https://$USERNAME.github.io/$REPO"
npx gh-pages -d dist

echo "✅ ¡Despliegue completo!"
