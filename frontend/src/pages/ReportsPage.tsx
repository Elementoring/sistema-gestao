import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { proposalService, clientService } from '@/services/dataService';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, FileText, Download, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const STATUS_COLORS: Record<string, string> = {
  'Aprovada': '#10b981',
  'Paga': '#059669',
  'Em Análise': '#3b82f6',
  'Aguardando Análise': '#f59e0b',
  'Digitada': '#6366f1',
  'Recusada': '#ef4444',
  'Cancelada': '#9ca3af',
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [period, setPeriod] = useState('30'); // dias

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [proposalsData, clientsData] = await Promise.all([
        proposalService.getAll(),
        clientService.getAll(),
      ]);
      setProposals(proposalsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar propostas por período
  const filterByPeriod = (items: any[]) => {
    if (period === 'all') return items;
    
    const days = parseInt(period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return items.filter((item) => {
      const itemDate = new Date(item.proposal_date || item.created_at);
      return itemDate >= cutoffDate;
    });
  };

  const filteredProposals = filterByPeriod(proposals);

  // Estatísticas principais
  const totalProposals = filteredProposals.length;
  const approvedProposals = filteredProposals.filter(p => p.status === 'Aprovada' || p.status === 'Paga').length;
  const totalValue = filteredProposals.reduce((sum, p) => sum + parseFloat(p.contract_value || 0), 0);
  const avgValue = totalProposals > 0 ? totalValue / totalProposals : 0;
  const approvalRate = totalProposals > 0 ? (approvedProposals / totalProposals) * 100 : 0;

  // Dados para gráfico de status
  const statusData = Object.entries(
    filteredProposals.reduce((acc: Record<string, number>, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#9ca3af' }));

  // Dados para gráfico de propostas por mês
  const monthlyData = filteredProposals.reduce((acc: Record<string, any>, p) => {
    const date = new Date(p.proposal_date);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, quantidade: 0, valor: 0 };
    }
    
    acc[monthYear].quantidade += 1;
    acc[monthYear].valor += parseFloat(p.contract_value || 0);
    
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData).sort((a: any, b: any) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });

  // Dados para gráfico de bancos
  const bankData = Object.entries(
    filteredProposals.reduce((acc: Record<string, number>, p) => {
      const bank = p.contract_bank || 'Não informado';
      acc[bank] = (acc[bank] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Dados para gráfico de órgãos de benefício
  const organData = Object.entries(
    clients.reduce((acc: Record<string, number>, c) => {
      if (c.benefits && c.benefits.length > 0) {
        c.benefits.forEach((b: any) => {
          const organ = b.benefit_organ || 'Não informado';
          acc[organ] = (acc[organ] || 0) + 1;
        });
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando relatórios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios Avançados</h1>
          <p className="text-gray-500 mt-1">
            Visualize análises completas e métricas do sistema
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="180">Últimos 6 meses</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
                <SelectItem value="all">Todo período</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Propostas
              </CardTitle>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProposals}</div>
            <p className="text-sm text-gray-500 mt-1">propostas no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor Total
              </CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-sm text-gray-500 mt-1">em contratos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ticket Médio
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(avgValue)}
            </div>
            <p className="text-sm text-gray-500 mt-1">por proposta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Aprovação
              </CardTitle>
              <Users className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {approvalRate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500 mt-1">{approvedProposals} aprovadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Status */}
        <Card>
          <CardHeader>
            <CardTitle>Propostas por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Órgãos de Benefício */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes por Órgão de Benefício</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={organData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Propostas por Mês */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução Mensal de Propostas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === 'valor') return formatCurrency(value);
                    return value;
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="quantidade"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Quantidade"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="valor"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Valor (R$)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Top Bancos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top 10 Bancos por Quantidade de Propostas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bankData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6">
                  {bankData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
