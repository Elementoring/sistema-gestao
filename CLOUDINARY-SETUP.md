# Configuração do Cloudinary para Upload de Arquivos

## Por que Cloudinary?

O Render usa filesystem **efêmero**, o que significa que todos os arquivos salvos em disco são perdidos a cada deploy ou reinício do serviço. Por isso, precisamos usar um serviço externo de armazenamento como o **Cloudinary**.

## Vantagens do Cloudinary

✅ **Gratuito** até 25GB de armazenamento e 25GB de bandwidth/mês  
✅ **Otimização automática** de imagens  
✅ **CDN global** para entrega rápida  
✅ **Transformação de imagens** (resize, crop, etc)  
✅ **URLs permanentes** que não são perdidas em deploys

## Passo a Passo

### 1. Criar Conta no Cloudinary

1. Acesse: https://cloudinary.com/users/register_free
2. Cadastre-se (pode usar Google/GitHub)
3. Confirme seu email

### 2. Obter Credenciais

Após login, você verá no **Dashboard**:

```
Cloud name: seu_cloud_name
API Key: 123456789012345
API Secret: abc-XYZ123_secretKey
```

### 3. Configurar no Render

1. Acesse: https://dashboard.render.com
2. Vá para o serviço **cred-management-backend**
3. Clique na aba **Environment**
4. Adicione as 3 variáveis:

```
CLOUDINARY_CLOUD_NAME = seu_cloud_name
CLOUDINARY_API_KEY = 123456789012345
CLOUDINARY_API_SECRET = abc-XYZ123_secretKey
```

5. Clique em **Save Changes**
6. O Render vai fazer redeploy automaticamente

### 4. Testar

Após o deploy:

1. Acesse a aplicação
2. Tente fazer upload de uma foto de cliente
3. A foto deve ser armazenada no Cloudinary
4. No dashboard do Cloudinary, vá em **Media Library** para ver os arquivos

## Estrutura de Pastas no Cloudinary

O sistema organiza os uploads assim:

```
cred-management/
├── client-photos/     # Fotos dos clientes (limitadas a 800x800px)
└── documents/         # Documentos gerais (PDFs, Excel, etc)
```

## Fallback Local

Se as credenciais do Cloudinary **não** estiverem configuradas, o sistema usa o filesystem local automaticamente. Isso é útil para desenvolvimento, mas **NÃO funciona em produção no Render**.

## Verificar Status

Ao iniciar o servidor, você verá no log:

```
📦 Storage: Cloudinary    # ✅ Configurado
# OU
📦 Storage: Local filesystem    # ⚠️ Não configurado
```

## Solução de Problemas

### Erro 404 no upload

✅ **Solução**: Configure as credenciais do Cloudinary conforme acima

### Fotos são perdidas após deploy

✅ **Solução**: Configure o Cloudinary. O filesystem local é efêmero no Render.

### "Invalid API Key"

❌ Verifique se copiou corretamente as credenciais  
❌ Não use espaços antes/depois das variáveis  
❌ Use as credenciais do **Dashboard**, não do Settings

## Recursos

- 📚 Documentação: https://cloudinary.com/documentation
- 🎓 Tutorial: https://cloudinary.com/documentation/node_integration
- 💬 Suporte: https://support.cloudinary.com
