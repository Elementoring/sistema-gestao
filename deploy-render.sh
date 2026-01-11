#!/bin/bash

# Script de deploy para Render.com
# Este script configura tudo automaticamente

echo "🚀 Iniciando configuração para deploy no Render.com..."

# 1. Verificar se estamos no diretório correto
if [ ! -f "render.yaml" ]; then
    echo "❌ Erro: Arquivo render.yaml não encontrado!"
    echo "Execute este script na raiz do projeto."
    exit 1
fi

# 2. Verificar se o código está commitado
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Existem mudanças não commitadas."
    echo "Fazendo commit automático..."
    git add .
    git commit -m "chore: Configuração para deploy no Render.com"
fi

# 3. Push para o GitHub
echo "📤 Enviando código para o GitHub..."
git push origin main

echo ""
echo "✅ Código enviado para o GitHub com sucesso!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Acesse: https://dashboard.render.com"
echo "2. Clique em 'New +' > 'Blueprint'"
echo "3. Selecione o repositório: Elementoring/sistema-gestao"
echo "4. Clique em 'Apply'"
echo ""
echo "O Render criará automaticamente:"
echo "  ✅ PostgreSQL Database"
echo "  ✅ Backend API"
echo "  ✅ Frontend"
echo ""
echo "Após o deploy:"
echo "  1. Vá no backend > Environment"
echo "  2. Configure ALLOWED_ORIGINS com a URL do frontend"
echo "  3. No frontend > Environment, configure VITE_API_URL com a URL do backend"
echo "  4. No backend > Shell, execute: npm run db:setup"
echo ""
echo "🎉 Deploy completo!"
