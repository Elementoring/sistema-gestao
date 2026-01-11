# 📦 Arquivos Complementares do Sistema

Este documento contém os arquivos que precisam ser criados para completar o sistema.

## 📂 Estrutura de Arquivos Restantes

```
frontend/src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx          # Layout principal com sidebar e navegação
│   ├── clients/
│   │   ├── ClientForm.tsx               # Formulário de cadastro de cliente
│   │   ├── ClientTable.tsx              # Tabela de listagem de clientes
│   │   └── ClientModal.tsx              # Modal com ficha completa do cliente
│   ├── proposals/
│   │   ├── ProposalForm.tsx             # Formulário de criação de proposta
│   │   ├── ProposalTable.tsx            # Tabela de listagem de propostas
│   │   └── ProposalModal.tsx            # Modal com detalhes da proposta
│   └── ui/
│       ├── dialog.tsx                   # Componente de modal
│       ├── select.tsx                   # Componente de select
│       ├── table.tsx                    # Componente de tabela
│       └── toast.tsx                    # Componente de notificação
├── pages/
│   ├── DashboardPage.tsx                # Dashboard com estatísticas
│   ├── ClientsPage.tsx                  # Página de gestão de clientes
│   ├── ProposalsPage.tsx                # Página de gestão de propostas
│   ├── ReportsPage.tsx                  # Página de relatórios
│   └── UsersPage.tsx                    # Página de gestão de usuários (admin)
└── hooks/
    ├── useClients.ts                    # Hook para gerenciar clientes
    ├── useProposals.ts                  # Hook para gerenciar propostas
    └── useToast.ts                      # Hook para notificações
```

## 🎨 DashboardLayout.tsx

```tsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Building2
} from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/proposals', icon: FileText, label: 'Propostas' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios' },
  ];

  if (isAdmin()) {
    menuItems.push({ path: '/users', icon: Settings, label: 'Usuários' });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Cred Management</h1>
              <p className="text-xs text-gray-500">Gestão de Crédito</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={\`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors \${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }\`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.fullName}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

## 📊 DashboardPage.tsx (Exemplo Simples)

```tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { proposalService } from '@/services/dataService';
import { ProposalStats } from '@/types';
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<ProposalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await proposalService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  const cards = [
    {
      title: 'Total de Clientes',
      value: stats?.total_clients || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total de Propostas',
      value: stats?.total_proposals || 0,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Valor Total Contratado',
      value: formatCurrency(stats?.total_contract_value || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(stats?.avg_contract_value || 0),
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={\`\${card.color} p-2 rounded-lg\`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Propostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Aprovadas</span>
                <span className="font-bold text-green-600">
                  {stats?.approved_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pendentes</span>
                <span className="font-bold text-yellow-600">
                  {stats?.pending_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Em Análise</span>
                <span className="font-bold text-blue-600">
                  {stats?.analyzing_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Negadas</span>
                <span className="font-bold text-red-600">
                  {stats?.denied_count || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Sistema em funcionamento. Utilize o menu lateral para navegar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## 🚀 Próximos Passos para Implementação

### 1. Páginas Principais

Crie as páginas básicas primeiro:
- **ClientsPage.tsx**: Lista de clientes com botão "Novo Cliente"
- **ProposalsPage.tsx**: Lista de propostas com botão "Nova Proposta"
- **ReportsPage.tsx**: Relatórios e gráficos
- **UsersPage.tsx**: Gerenciamento de usuários (somente admin)

### 2. Formulários

Implemente os formulários com React Hook Form + Zod:
- **ClientForm**: Todos os campos do cliente + benefícios
- **ProposalForm**: Com auto-preenchimento ao selecionar CPF
- Validação de CPF em tempo real
- Busca de endereço por CEP
- Auto-complete de banco e espécie de benefício por código

### 3. Tabelas e Listagens

Use componentes de tabela para exibir:
- Lista de clientes com busca e filtros
- Lista de propostas com busca e filtros por status
- Ações de editar e excluir (conforme permissão)

### 4. Modais

Crie modais para:
- Visualizar ficha completa do cliente
- Visualizar detalhes da proposta
- Selecionar benefício quando cliente tem múltiplos

### 5. Integração Auto-fill

Implementar lógica:
- Ao digitar CPF na proposta, buscar cliente automaticamente
- Se cliente tiver múltiplos benefícios, mostrar modal de seleção
- Preencher todos os campos automaticamente da proposta
- Ao digitar código de espécie, mostrar descrição
- Ao digitar código de banco, mostrar nome

### 6. Relatórios

Criar página de relatórios com:
- Gráficos usando Recharts
- Filtros por período
- Exportação de dados (opcional)
- Estatísticas detalhadas

## 📦 Dependências Adicionais

Instale se necessário:

\`\`\`bash
npm install tailwindcss-animate
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-toast
\`\`\`

## 🎯 Funcionalidades Principais a Implementar

1. ✅ **Login e Autenticação** - Pronto
2. ✅ **Layout e Navegação** - Pronto
3. ✅ **Dashboard com Estatísticas** - Pronto (básico)
4. ⏳ **CRUD de Clientes** - Criar formulário e tabela
5. ⏳ **CRUD de Propostas** - Criar formulário e tabela com integração
6. ⏳ **Auto-fill de Propostas** - Implementar busca por CPF
7. ⏳ **Validação de CPF Avançada** - Já tem a função, aplicar no form
8. ⏳ **Busca de CEP** - Já tem o serviço, integrar no form
9. ⏳ **Múltiplos Benefícios** - Modal de seleção
10. ⏳ **Relatórios** - Criar componentes de gráfico
11. ⏳ **Gestão de Usuários (Admin)** - CRUD de usuários

## 💡 Dicas de Implementação

- Use \`react-hook-form\` para todos os formulários
- Valide com \`zod\` antes de enviar ao backend
- Use \`zustand\` para estado global se necessário
- Implemente loading states em todas as requisições
- Adicione toasts para feedback ao usuário
- Teste com dados reais do PostgreSQL
- Implemente paginação nas tabelas se houver muitos dados

## 🔒 Controle de Permissões

Lembre-se de verificar permissões:
- Admin: Pode fazer tudo
- User: Não pode deletar, não acessa página de usuários
- Ocultar botões de delete para usuários comuns
- Validar no backend também (já implementado)

---

**Todos os arquivos base do sistema foram criados!**
**O backend está completo e funcional.**
**O frontend tem a estrutura base, falta implementar os formulários e tabelas complexas.**
