import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { proposalService } from '@/services/dataService';
import { Proposal } from '@/types';
import { Plus, Search, Edit, Trash2, Eye, FileText, FileDown } from 'lucide-react';
import { formatCPF, formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import ProposalModal from '@/components/modals/ProposalModal';
import { exportProposalsToExcel } from '@/lib/exportExcel';

const STATUS_COLORS: Record<string, string> = {
  'AGUARDA AUMENTO': 'bg-yellow-100 text-yellow-800',
  'PAGO': 'bg-green-100 text-green-800',
  'CANCELADA': 'bg-gray-100 text-gray-800',
  'PORT PAGA (NÃO COMISSIONADA)': 'bg-emerald-100 text-emerald-800',
  'FAZER DESBLOQUEIO': 'bg-orange-100 text-orange-800',
  'PORT EM AVERBAÇÃO': 'bg-blue-100 text-blue-800',
  'EM FORMALIZAÇÃO': 'bg-purple-100 text-purple-800',
  'PENDENTE': 'bg-amber-100 text-amber-800',
  'AGUARDANDO SALDO': 'bg-cyan-100 text-cyan-800',
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>(undefined);
  const { isAdmin, user } = useAuthStore();

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await proposalService.getAll();
      setProposals(data);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      alert('Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (proposal?: Proposal) => {
    setSelectedProposal(proposal);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProposal(undefined);
  };

  const handleSaveProposal = async (data: any) => {
    try {
      if (selectedProposal) {
        await proposalService.update(selectedProposal.id, data);
        alert('Proposta atualizada com sucesso!');
      } else {
        await proposalService.create(data);
        alert('Proposta cadastrada com sucesso!');
      }
      handleCloseModal();
      loadProposals();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao salvar proposta');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta proposta?')) {
      return;
    }

    try {
      await proposalService.delete(id);
      alert('Proposta excluída com sucesso!');
      loadProposals();
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      alert('Erro ao excluir proposta');
    }
  };

  const filteredProposals = proposals.filter((proposal) => {
    const search = searchTerm.toLowerCase();
    
    // Filtro de texto
    const matchesSearch = 
      proposal.client_name?.toLowerCase().includes(search) ||
      proposal.cpf?.includes(search) ||
      proposal.status?.toLowerCase().includes(search) ||
      proposal.contract_bank?.toLowerCase().includes(search);
    
    // Filtro de status
    const matchesStatus = 
      filterStatus === 'all' || proposal.status === filterStatus;
    
    // Filtro de data
    const proposalDate = new Date(proposal.proposal_date);
    const matchesDateFrom = 
      !filterDateFrom || proposalDate >= new Date(filterDateFrom);
    const matchesDateTo = 
      !filterDateTo || proposalDate <= new Date(filterDateTo);
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  // Estatísticas
  const stats = {
    total: proposals.length,
    approved: proposals.filter((p) => p.status === 'PAGO' || p.status === 'PORT PAGA (NÃO COMISSIONADA)').length,
    pending: proposals.filter((p) => 
      p.status === 'PENDENTE' || p.status === 'EM FORMALIZAÇÃO' || p.status === 'PORT EM AVERBAÇÃO' || 
      p.status === 'AGUARDANDO SALDO' || p.status === 'AGUARDA AUMENTO' || p.status === 'FAZER DESBLOQUEIO'
    ).length,
    rejected: proposals.filter((p) => p.status === 'CANCELADA').length,
    totalValue: proposals.reduce((sum, p) => sum + (Number(p.contract_value || 0) || 0), 0),
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando propostas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Propostas</h1>
          <p className="text-gray-500 mt-1">
            Gerencie as propostas de crédito dos clientes
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            size="lg" 
            variant="outline" 
            className="shadow-lg"
            onClick={() => exportProposalsToExcel(filteredProposals)}
            disabled={filteredProposals.length === 0}
          >
            <FileDown className="w-5 h-5 mr-2" />
            Exportar Excel
          </Button>
          <Button size="lg" className="shadow-lg" onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Nova Proposta
          </Button>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por cliente, CPF, status ou banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
              </Button>
              {(filterStatus !== 'all' || filterDateFrom || filterDateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterDateFrom('');
                    setFilterDateTo('');
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="filterStatus">Status</Label>
                  <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
                    aria-label="Filtrar por status"
                  >
                    <option value="all">Todos</option>
                    <option value="AGUARDA AUMENTO">AGUARDA AUMENTO</option>
                    <option value="PAGO">PAGO</option>
                    <option value="CANCELADA">CANCELADA</option>
                    <option value="PORT PAGA (NÃO COMISSIONADA)">PORT PAGA (NÃO COMISSIONADA)</option>
                    <option value="FAZER DESBLOQUEIO">FAZER DESBLOQUEIO</option>
                    <option value="PORT EM AVERBAÇÃO">PORT EM AVERBAÇÃO</option>
                    <option value="EM FORMALIZAÇÃO">EM FORMALIZAÇÃO</option>
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="AGUARDANDO SALDO">AGUARDANDO SALDO</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="dateFrom">Data Inicial</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">Data Final</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aprovadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Recusadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Propostas Cadastradas</CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                {filteredProposals.length} proposta(s)
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banco
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcelas
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProposals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Nenhuma proposta encontrada
                    </td>
                  </tr>
                ) : (
                  filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(proposal.proposal_date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {proposal.client_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatCPF(proposal.client_cpf || proposal.cpf || '')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {proposal.contract_bank}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(Number(proposal.contract_value || 0))}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {proposal.installment_count}x de {formatCurrency(Number(proposal.installment_value || 0))}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            STATUS_COLORS[proposal.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Visualizar"
                            onClick={() => handleOpenModal(proposal)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Editar"
                            onClick={() => handleOpenModal(proposal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {isAdmin() && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Excluir"
                              onClick={() => handleDelete(proposal.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Proposta */}
      <ProposalModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProposal}
        proposal={selectedProposal}
        currentUser={user?.full_name || ''}
      />
    </div>
  );
}
