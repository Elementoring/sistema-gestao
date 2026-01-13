# ⚠️ ÍCONE NECESSÁRIO

Para gerar o executável, você precisa colocar um arquivo `icon.ico` nesta pasta.

## 🎨 Onde conseguir um ícone:

### Opção 1: Criar Online (Grátis)
1. Acesse: https://www.canva.com/
2. Crie um design 512x512 pixels
3. Use as iniciais "CM+" ou um símbolo de crédito
4. Baixe como PNG
5. Converta para ICO em: https://convertio.co/png-ico/
6. Salve aqui como `icon.ico`

### Opção 2: Baixar Pronto
1. Acesse: https://icons8.com/icons/set/business
2. Escolha um ícone de negócios/finanças
3. Baixe em tamanho 512x512
4. Converta para ICO em: https://icoconvert.com/
5. Salve aqui como `icon.ico`

### Opção 3: Usar Logo da Empresa
Se você já tem o logo:
1. Abra em um editor de imagens
2. Redimensione para 256x256 ou 512x512
3. Salve como PNG
4. Converta para ICO
5. Salve aqui como `icon.ico`

## 📝 Especificações do Ícone

- **Formato**: .ico (Windows Icon)
- **Tamanho**: Mínimo 256x256 (recomendado 512x512)
- **Nome do arquivo**: `icon.ico` (exatamente assim)
- **Localização**: Esta pasta (`desktop/assets/`)

## ✅ Verificação

Após adicionar o ícone, você deve ter:
```
desktop/assets/
  ├── icon.ico          ← OBRIGATÓRIO
  └── ICON-GUIDE.md     ← Este arquivo
```

## 🚀 Próximo Passo

Depois de adicionar o ícone, execute:

```powershell
# Da raiz do projeto
.\build-desktop.ps1
```

Ou:

```powershell
# Da pasta desktop
npm run dist:win
```

---

**Sem o ícone, o build VAI FALHAR!** 🚫
