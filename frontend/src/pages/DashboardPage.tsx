import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { proposalService } from '@/services/dataService';
import { ProposalStats } from '@/types';
import { Users, FileText, DollarSign, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<ProposalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await proposalService.getStats();
      setStats(data);
      setError('');
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
      setError('Erro ao carregar estatísticas. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Erro ao carregar dados</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={loadStats}
                  className="mt-3 text-sm text-red-700 underline hover:no-underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total de Clientes',
      value: stats?.total_clients || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total de Propostas',
      value: stats?.total_proposals || 0,
      icon: FileText,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Valor Total Contratado',
      value: formatCurrency(stats?.total_contract_value || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(stats?.avg_contract_value || 0),
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema de gestão de crédito</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-3 rounded-xl shadow-md`}>
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

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status das Propostas */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Status das Propostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">✅ Aprovadas</span>
                <span className="font-bold text-green-600 text-lg">
                  {stats?.approved_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">⏳ Pendentes</span>
                <span className="font-bold text-yellow-600 text-lg">
                  {stats?.pending_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">🔍 Em Análise</span>
                <span className="font-bold text-blue-600 text-lg">
                  {stats?.analyzing_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">❌ Negadas</span>
                <span className="font-bold text-red-600 text-lg">
                  {stats?.denied_count || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Bem-vindo ao Cred Management +</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🎯 Funcionalidades</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Gestão completa de clientes</li>
                  <li>• Controle de propostas de crédito</li>
                  <li>• Relatórios avançados</li>
                  <li>• Sistema multi-usuário</li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">💡 Dica</h3>
                <p className="text-sm text-purple-800">
                  Use o menu lateral para navegar entre as seções do sistema. 
                  Comece cadastrando clientes e depois crie propostas vinculadas a eles.
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">🔒 Segurança</h3>
                <p className="text-sm text-green-800">
                  Seus dados estão seguros. O sistema utiliza criptografia e 
                  autenticação JWT para proteger as informações.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
              onClick={() => window.location.href = '/clients'}
            >
              <Users className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Novo Cliente</h3>
              <p className="text-sm text-blue-100 mt-1">Cadastrar novo cliente</p>
            </button>

            <button
              className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all"
              onClick={() => window.location.href = '/proposals'}
            >
              <FileText className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Nova Proposta</h3>
              <p className="text-sm text-green-100 mt-1">Criar proposta de crédito</p>
            </button>

            <button
              className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              onClick={() => window.location.href = '/reports'}
            >
              <BarChart3 className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Ver Relatórios</h3>
              <p className="text-sm text-purple-100 mt-1">Análises e gráficos</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
