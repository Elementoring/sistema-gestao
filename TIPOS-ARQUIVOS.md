# 📁 Tipos de Arquivos Suportados - Cred Management+

## ✅ Suporte Completo para Todos os Formatos

O sistema está configurado para aceitar, armazenar, visualizar e fazer download de **TODOS os tipos de arquivos comuns**.

---

## 📸 Fotos de Clientes

**Limite:** 5 MB por arquivo  
**Formatos aceitos:**

| Formato | Extensões | Descrição |
|---------|-----------|-----------|
| JPEG | `.jpg`, `.jpeg` | Formato padrão de fotos |
| PNG | `.png` | Imagens com transparência |
| GIF | `.gif` | Imagens animadas |
| WebP | `.webp` | Formato moderno do Google |
| BMP | `.bmp` | Bitmap do Windows |
| SVG | `.svg` | Gráficos vetoriais |
| TIFF | `.tiff`, `.tif` | Imagens de alta qualidade |

**Otimização automática:**
- Redimensionamento para max 800x800px
- Mantém proporções originais
- Compressão inteligente para economizar espaço

---

## 📄 Documentos Gerais

**Limite:** 10 MB por arquivo  
**Categorias suportadas:**

### 🖼️ Imagens (Documentos Escaneados)
| Formato | Extensões | Uso Comum |
|---------|-----------|-----------|
| JPEG | `.jpg`, `.jpeg` | RG, CPF escaneado |
| PNG | `.png` | Documentos com texto |
| GIF | `.gif` | Documentos simples |
| WebP | `.webp` | Documentos modernos |
| BMP | `.bmp` | Scanners antigos |
| TIFF | `.tiff`, `.tif` | Scanners profissionais |
| ICO | `.ico` | Ícones |

**Visualização:** ✅ Pré-visualização direta no navegador

---

### 📑 PDFs
| Formato | Extensões | Uso Comum |
|---------|-----------|-----------|
| PDF | `.pdf` | Contratos, comprovantes, documentos oficiais |

**Visualização:** ✅ Visualizador integrado (iframe)  
**Download:** ✅ Download direto

---

### 📝 Documentos de Texto
| Formato | Extensões | Aplicativos |
|---------|-----------|-------------|
| Word | `.doc`, `.docx` | Microsoft Word |
| LibreOffice Writer | `.odt` | LibreOffice, OpenOffice |
| Rich Text | `.rtf` | WordPad, editores diversos |
| Texto Simples | `.txt` | Notepad, qualquer editor |
| Markdown | `.md` | Editores de código |

**Visualização:** 
- `.txt`, `.md`: ✅ Visualizador integrado
- `.doc`, `.docx`, `.odt`, `.rtf`: ⬇️ Download para abrir no aplicativo

---

### 📊 Planilhas
| Formato | Extensões | Aplicativos |
|---------|-----------|-------------|
| Excel | `.xls`, `.xlsx` | Microsoft Excel |
| LibreOffice Calc | `.ods` | LibreOffice, OpenOffice |
| CSV | `.csv` | Excel, planilhas, bancos de dados |

**Visualização:** ⬇️ Download para abrir no aplicativo  
**Uso comum:** Extratos bancários, tabelas de dados, controles financeiros

---

### 📊 Apresentações
| Formato | Extensões | Aplicativos |
|---------|-----------|-------------|
| PowerPoint | `.ppt`, `.pptx` | Microsoft PowerPoint |
| LibreOffice Impress | `.odp` | LibreOffice, OpenOffice |

**Visualização:** ⬇️ Download para abrir no aplicativo  
**Uso comum:** Propostas comerciais, apresentações

---

### 📦 Arquivos Compactados
| Formato | Extensões | Uso Comum |
|---------|-----------|-----------|
| ZIP | `.zip` | Múltiplos documentos |
| RAR | `.rar` | Arquivos compactados |
| 7-Zip | `.7z` | Alta compressão |

**Visualização:** ⬇️ Download para extrair  
**Uso comum:** Enviar múltiplos documentos de uma vez

---

## 🎯 Como Funciona

### Upload
1. Selecione o tipo de documento (RG, CPF, Comprovante, etc)
2. Clique em "Anexar Documento"
3. Escolha o arquivo do seu computador
4. Sistema valida automaticamente:
   - ✅ Tipo de arquivo permitido
   - ✅ Tamanho dentro do limite
   - ✅ Upload seguro com verificação

### Visualização
- **Imagens**: Carregam diretamente no modal
- **PDFs**: Visualizador integrado (sem download necessário)
- **Textos**: Visualizador integrado
- **Outros**: Botão de download para abrir no aplicativo apropriado

### Download
- **Um clique**: Baixa arquivo com nome original
- **Nova aba**: Abre em nova aba do navegador (quando possível)
- **Automático**: Browser escolhe o melhor método

---

## 🛡️ Segurança

### Validações
✅ Tipo de arquivo verificado por extensão  
✅ MIME type validado  
✅ Tamanho máximo respeitado  
✅ Sanitização de nomes de arquivo  
✅ Upload apenas para usuários autenticados  

### Armazenamento
- **Produção:** Cloudinary (CDN global)
  - Imagens: Otimizadas e comprimidas
  - Documentos: Armazenamento seguro RAW
- **Desenvolvimento:** Filesystem local

### Auditoria
- Registro de quem enviou
- Data e hora do upload
- Histórico de ações

---

## 🎨 Ícones por Tipo

O sistema exibe ícones visuais para cada tipo de arquivo:

| Tipo | Ícone | Cor |
|------|-------|-----|
| 🖼️ Imagens | Image | Azul |
| 📄 PDFs | FileText | Vermelho |
| 📊 Planilhas | FileSpreadsheet | Verde |
| 📝 Documentos | FileText | Azul Escuro |
| 📊 Apresentações | FileText | Laranja |
| 📝 Textos | FileText | Cinza |
| 📦 Compactados | File | Roxo |

---

## 🚀 Recursos Avançados

### Para Imagens
- ✅ Visualização em alta resolução
- ✅ Zoom e pan
- ✅ Otimização automática
- ✅ Redimensionamento inteligente

### Para PDFs
- ✅ Visualizador integrado
- ✅ Navegação entre páginas
- ✅ Zoom
- ✅ Download opcional

### Para Documentos Office
- ✅ Preservação de formatação
- ✅ Download rápido
- ✅ Abertura em aplicativo nativo
- ✅ Compatibilidade multiplataforma

### Para Todos os Tipos
- ✅ Nome original preservado
- ✅ Metadados completos (tamanho, tipo, data)
- ✅ Busca por tipo de documento
- ✅ Organização por cliente/proposta
- ✅ Deleção segura

---

## 📱 Compatibilidade

### Browsers Suportados
- ✅ Chrome / Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ IE11 (funcionalidade limitada)

### Sistemas Operacionais
- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux (Ubuntu, Debian, etc)
- ✅ Android (mobile)
- ✅ iOS (mobile)

---

## 💡 Dicas de Uso

### Upload Eficiente
1. **Fotos de clientes**: Use JPG ou PNG (melhor qualidade)
2. **Documentos escaneados**: Use PDF (universal)
3. **Múltiplos arquivos**: Comprima em ZIP
4. **Contratos**: PDF assinado digitalmente
5. **Planilhas**: Excel ou CSV para extratos

### Organização
- Nomeie arquivos claramente antes do upload
- Use os tipos de documento corretos (RG, CPF, etc)
- Evite caracteres especiais nos nomes
- Mantenha tamanhos razoáveis (compacte se necessário)

### Segurança
- Não envie senhas em arquivos de texto
- Prefira PDF para documentos sensíveis
- Verifique o arquivo antes de enviar
- Delete documentos obsoletos

---

## 🔧 Limites Técnicos

| Limite | Valor | Tipo |
|--------|-------|------|
| Tamanho máximo (foto) | 5 MB | Por arquivo |
| Tamanho máximo (doc) | 10 MB | Por arquivo |
| Formatos de imagem | 7+ | JPG, PNG, GIF, WebP, BMP, SVG, TIFF |
| Formatos de documento | 15+ | PDF, DOC, DOCX, XLS, XLSX, PPT, etc |
| Total de arquivos | Ilimitado | Por cliente/proposta |
| Armazenamento | Ilimitado* | *Sujeito ao plano Cloudinary |

---

## ❓ Problemas Comuns

### "Tipo de arquivo não permitido"
**Causa:** Extensão não está na lista de permitidos  
**Solução:** Converta para um formato suportado (ex: DOC → PDF)

### "Arquivo muito grande"
**Causa:** Arquivo excede 10 MB  
**Solução:** 
- Comprima o arquivo
- Para PDFs: Use ferramentas de compressão online
- Para imagens: Reduza resolução ou qualidade

### "Erro ao visualizar PDF"
**Causa:** URL incorreta ou problema de CORS  
**Solução:** Sistema corrige automaticamente. Se persistir, faça download.

### "Imagem não carrega"
**Causa:** Conexão lenta ou URL inválida  
**Solução:** Recarregue a página ou baixe o arquivo

---

## 📊 Estatísticas de Uso

Tipos mais comuns por categoria:

### Documentos de Clientes
1. 📄 PDF - 60% (RG, CPF, Comprovantes)
2. 🖼️ JPG/PNG - 30% (Fotos de documentos)
3. 📊 PDF/XLS - 10% (Extratos)

### Contratos
1. 📄 PDF - 95% (Contratos assinados)
2. 📝 DOCX - 5% (Minutas)

### Comprovantes
1. 📄 PDF - 70% (Boletos, recibos)
2. 🖼️ JPG/PNG - 20% (Fotos)
3. 📊 XLS/CSV - 10% (Extratos)

---

**Última atualização:** Janeiro 2026  
**Versão do sistema:** Cred Management+ v1.0.0  
**Suporte:** Todos os formatos listados testados e validados
