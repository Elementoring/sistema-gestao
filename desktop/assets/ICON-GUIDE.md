# Gerando Ícones para o Aplicativo

Para o aplicativo funcionar corretamente, você precisa de ícones. Siga uma destas opções:

## Opção 1: Usar um ícone existente

Se você já tem um logo da empresa:

1. Converta para `.ico` (Windows) usando um site como https://convertio.co/png-ico/
2. Crie um ícone de 256x256 pixels ou maior
3. Salve como `icon.ico` na pasta `desktop/assets/`
4. Também salve uma versão PNG como `icon.png` na mesma pasta

## Opção 2: Usar um ícone padrão temporário

Baixe um ícone grátis de:
- https://iconarchive.com/
- https://icons8.com/
- https://www.flaticon.com/

Procure por: "business", "management", "finance", "credit card"

## Opção 3: Criar um ícone simples

Use o Canva ou Figma para criar:
- Tamanho: 512x512 pixels
- Formato: PNG
- Elementos: Iniciais "CM+" ou símbolo relacionado a crédito

Depois converta para `.ico` usando: https://icoconvert.com/

## Estrutura necessária:

```
desktop/assets/
  ├── icon.ico   (para Windows - obrigatório)
  └── icon.png   (para visualização - opcional)
```

## ⚠️ IMPORTANTE

Sem os ícones, o build vai **falhar**. Você precisa ter pelo menos `icon.ico` antes de executar `npm run dist:win`.

## Dica Rápida

Se quiser apenas testar, use qualquer `.ico` e renomeie para `icon.ico`. 
Você pode substituir depois e fazer o build novamente.
