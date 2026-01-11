import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clientService } from '@/services/dataService';
import { Client } from '@/types';
import { Plus, Search, Edit, Trash2, Eye, FileDown } from 'lucide-react';
import { formatCPF, formatPhone, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import ClientModal from '@/components/modals/ClientModal';
import { exportClientsToExcel } from '@/lib/exportExcel';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client?: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClient(undefined);
  };

  const handleSaveClient = async (data: any) => {
    try {
      if (selectedClient) {
        await clientService.update(selectedClient.id, data);
        alert('Cliente atualizado com sucesso!');
      } else {
        await clientService.create(data);
        alert('Cliente cadastrado com sucesso!');
      }
      handleCloseModal();
      loadClients();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      await clientService.delete(id);
      alert('Cliente excluído com sucesso!');
      loadClients();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente');
    }
  };

  const filteredClients = clients.filter((client) => {
    const search = searchTerm.toLowerCase();
    return (
      client.full_name.toLowerCase().includes(search) ||
      client.cpf.includes(search)
    );
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando clientes...</p>
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
          <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
          <p className="text-gray-500 mt-1">
            Gerencie a carteira de clientes do sistema
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            size="lg" 
            variant="outline" 
            className="shadow-lg"
            onClick={() => exportClientsToExcel(filteredClients)}
            disabled={filteredClients.length === 0}
          >
            <FileDown className="w-5 h-5 mr-2" />
            Exportar Excel
          </Button>
          <Button size="lg" className="shadow-lg" onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cadastros Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clients.filter(c => {
                const today = new Date().toDateString();
                return new Date(c.created_at).toDateString() === today;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resultado da Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredClients.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">CPF</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Nome Completo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Idade</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Cidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Benefícios</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Cadastro</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? 'Nenhum cliente encontrado'
                        : 'Nenhum cliente cadastrado'}
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">
                          {formatCPF(client.cpf)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{client.full_name}</span>
                      </td>
                      <td className="py-3 px-4">{client.age} anos</td>
                      <td className="py-3 px-4">
                        {client.phone_1 ? formatPhone(client.phone_1) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {client.city ? `${client.city}/${client.state}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {client.benefits?.length || 0} benefício(s)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Visualizar"
                            onClick={() => handleOpenModal(client)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Editar"
                            onClick={() => handleOpenModal(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {isAdmin() && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Excluir"
                              onClick={() => handleDelete(client.id)}
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

      {/* Modal de Cliente */}
      <ClientModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        client={selectedClient}
      />
    </div>
  );
}
