# 💡 Dicas e Melhores Práticas

## 🎯 Para Começar a Desenvolver

### 1. Primeiro Passo: Testar o Sistema Base
```powershell
# Setup do banco
.\setup-database.ps1

# Iniciar o sistema
.\start-system.ps1

# Ou manualmente:
npm run dev
```

### 2. Fazer Login e Explorar
- Login: `>[USUARIO_REMOVIDO]<<` / `>[SENHA_REMOVIDA]<<`
- Explore o Dashboard
- Veja a listagem de clientes
- Teste a navegação

### 3. Implementar Funcionalidades Gradualmente

#### Ordem Recomendada:
1. **Formulário de Cliente** (mais simples)
2. **Modal de Visualização de Cliente**
3. **Edição de Cliente**
4. **Formulário de Proposta** (mais complexo)
5. **Auto-fill de Proposta**
6. **Relatórios**
7. **Gestão de Usuários**

## 🔨 Implementando um Formulário Completo

### Exemplo: Formulário de Cliente

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validateCPF } from '@/lib/utils';

// Schema de validação
const clientSchema = z.object({
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  full_name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  birth_date: z.string(),
  // ... outros campos
});

type ClientFormData = z.infer<typeof clientSchema>;

function ClientForm({ onSubmit, initialData }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  // Buscar CEP automaticamente
  const zipCode = watch('zip_code');
  useEffect(() => {
    if (zipCode?.length === 8) {
      cepService.fetchAddress(zipCode).then(data => {
        setValue('address', data.address);
        setValue('city', data.city);
        setValue('state', data.state);
        setValue('neighborhood', data.neighborhood);
      });
    }
  }, [zipCode]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos do formulário */}
    </form>
  );
}
```

## 🎨 Criando Componentes UI Faltantes

### Dialog (Modal)

```tsx
// components/ui/dialog.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function DialogComponent({ open, onOpenChange, title, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">
            {title}
          </Dialog.Title>
          {children}
          <Dialog.Close className="absolute top-4 right-4">
            <X className="w-5 h-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Select

```tsx
// components/ui/select.tsx
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

export function SelectComponent({ options, value, onChange, placeholder }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md">
        <Select.Value placeholder={placeholder} />
        <ChevronDown className="w-4 h-4" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white border rounded-md shadow-lg">
          <Select.Viewport className="p-1">
            {options.map(option => (
              <Select.Item key={option.value} value={option.value} className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
```

## 🔄 Auto-fill de Propostas

### Buscar Cliente por CPF

```tsx
function ProposalForm() {
  const [client, setClient] = useState(null);
  const [benefits, setBenefits] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  const handleCPFChange = async (cpf: string) => {
    if (cpf.length === 11) {
      try {
        const clientData = await clientService.getByCPF(cpf);
        setClient(clientData);
        setBenefits(clientData.benefits || []);
        
        // Se tem múltiplos benefícios, mostrar modal
        if (clientData.benefits?.length > 1) {
          showBenefitSelectionModal();
        } else if (clientData.benefits?.length === 1) {
          autofillWithBenefit(clientData.benefits[0]);
        }
      } catch (error) {
        alert('Cliente não encontrado');
      }
    }
  };

  const autofillWithBenefit = (benefit) => {
    setValue('client_name', client.full_name);
    setValue('birth_date', client.birth_date);
    setValue('age', client.age);
    setValue('phone_1', client.phone_1);
    setValue('benefit_organ', benefit.benefit_organ);
    setValue('benefit_number', benefit.benefit_number);
    setValue('benefit_species', benefit.benefit_species);
    // ... outros campos
  };

  return (
    <form>
      <Input
        label="CPF do Cliente"
        {...register('cpf')}
        onChange={(e) => handleCPFChange(e.target.value)}
      />
      {/* ... resto do formulário */}
    </form>
  );
}
```

## 📊 Implementando Relatórios com Gráficos

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ReportsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Buscar dados para o gráfico
    const fetchData = async () => {
      const proposals = await proposalService.getAll();
      // Processar dados para o gráfico
      const chartData = processDataForChart(proposals);
      setData(chartData);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Relatórios</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Propostas por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="approved" stroke="#22c55e" name="Aprovadas" />
              <Line type="monotone" dataKey="denied" stroke="#ef4444" name="Negadas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🔍 Implementando Busca e Filtros

```tsx
function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrgan, setFilterOrgan] = useState('all');

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cpf.includes(searchTerm);
      
      const matchesOrgan = filterOrgan === 'all' || 
        client.benefits?.some(b => b.benefit_organ === filterOrgan);
      
      return matchesSearch && matchesOrgan;
    });
  }, [clients, searchTerm, filterOrgan]);

  return (
    <div>
      {/* Filtros */}
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={filterOrgan}
          onChange={setFilterOrgan}
          options={[
            { value: 'all', label: 'Todos os Órgãos' },
            { value: 'INSS', label: 'INSS' },
            { value: 'SIAPE', label: 'SIAPE' },
            // ... outros
          ]}
        />
      </div>
      
      {/* Tabela */}
      <ClientTable clients={filteredClients} />
    </div>
  );
}
```

## 🎯 Boas Práticas

### 1. Validação de Dados
- ✅ Sempre valide no frontend E backend
- ✅ Use Zod para schemas consistentes
- ✅ Mostre erros claros ao usuário

### 2. Tratamento de Erros
```tsx
try {
  const data = await clientService.create(formData);
  toast.success('Cliente criado com sucesso!');
  onSuccess();
} catch (error) {
  console.error('Erro:', error);
  toast.error(error.response?.data?.error || 'Erro ao criar cliente');
}
```

### 3. Loading States
```tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  try {
    await clientService.create(data);
  } finally {
    setLoading(false);
  }
};

return (
  <Button disabled={loading}>
    {loading ? 'Salvando...' : 'Salvar'}
  </Button>
);
```

### 4. Confirmação de Exclusão
```tsx
const handleDelete = async (id) => {
  if (!confirm('Tem certeza que deseja excluir?')) return;
  
  try {
    await clientService.delete(id);
    toast.success('Cliente excluído com sucesso!');
    loadClients(); // Recarregar lista
  } catch (error) {
    toast.error('Erro ao excluir cliente');
  }
};
```

### 5. Otimização de Performance
```tsx
// Use useMemo para cálculos pesados
const filteredData = useMemo(() => {
  return data.filter(/* ... */);
}, [data, filters]);

// Use useCallback para funções em props
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Debounce para buscas
const debouncedSearch = useDebounce(searchTerm, 500);
```

## 🧪 Testando o Sistema

### Testar Validação de CPF
```
CPFs válidos para teste:
- 123.456.789-09
- 111.444.777-35
- 000.000.000-00 (inválido)
```

### Testar CEP
```
CEPs válidos para teste:
- 01310-100 (Av. Paulista, SP)
- 20040-020 (Centro, RJ)
- 70040-020 (Brasília, DF)
```

### Testar Códigos
```
Espécies INSS:
- 41 → Aposentadoria por idade
- 21 → Pensão por morte previdenciária
- 32 → Aposentadoria por invalidez

Bancos:
- 001 → Banco do Brasil
- 104 → Caixa Econômica Federal
- 237 → Bradesco
- 341 → Itaú
```

## 🚨 Problemas Comuns e Soluções

### 1. Erro de CORS
**Problema:** Requisições bloqueadas pelo CORS
**Solução:** Verificar `API_URL` em `frontend/src/config.ts`

### 2. Token Expirado
**Problema:** 401 Unauthorized após algum tempo
**Solução:** Token expira em 8h, faça login novamente

### 3. Banco de Dados
**Problema:** Erro ao conectar no PostgreSQL
**Solução:** 
- Verificar se o PostgreSQL está rodando
- Verificar credenciais no `.env`
- Verificar se o banco existe

### 4. Porta em Uso
**Problema:** Porta 3001 ou 5173 já está em uso
**Solução:**
```powershell
# Encontrar processo
netstat -ano | findstr :3001
# Matar processo
taskkill /PID <numero> /F
```

## 📚 Recursos Úteis

### Documentação
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Radix UI](https://www.radix-ui.com)

### Ferramentas
- [Postman](https://www.postman.com) - Testar API
- [pgAdmin](https://www.pgadmin.org) - Gerenciar PostgreSQL
- [VS Code](https://code.visualstudio.com) - Editor

---

**Boa sorte no desenvolvimento! 🚀**

Se precisar de ajuda, consulte:
- README.md - Visão geral
- INICIO-RAPIDO.md - Instalação
- COMPLEMENTAR.md - Desenvolvimento detalhado
- ESTRUTURA.md - Estrutura do projeto
- STATUS.md - Status atual
