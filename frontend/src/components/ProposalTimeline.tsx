import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface StatusHistory {
  id: number;
  proposal_id: number;
  old_status: string | null;
  new_status: string;
  changed_by: number;
  changed_by_name: string;
  notes: string;
  created_at: string;
}

interface ProposalTimelineProps {
  proposalId: number;
}

export default function ProposalTimeline({ proposalId }: ProposalTimelineProps) {
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [proposalId]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/history/proposal/${proposalId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Digitada': 'bg-blue-100 text-blue-800',
      'Aguardando Análise': 'bg-yellow-100 text-yellow-800',
      'Em Análise': 'bg-purple-100 text-purple-800',
      'Aprovada': 'bg-green-100 text-green-800',
      'Paga': 'bg-emerald-100 text-emerald-800',
      'Recusada': 'bg-red-100 text-red-800',
      'Cancelada': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Linha vertical */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Eventos */}
          <div className="space-y-6">
            {history.map((entry, index) => (
              <div key={entry.id} className="relative pl-10">
                {/* Bolinha */}
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-primary' : 'bg-gray-300'
                }`}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>

                {/* Conteúdo */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {entry.old_status && (
                        <>
                          <Badge className={getStatusColor(entry.old_status)}>
                            {entry.old_status}
                          </Badge>
                          <span className="text-gray-400">→</span>
                        </>
                      )}
                      <Badge className={getStatusColor(entry.new_status)}>
                        {entry.new_status}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.created_at)}
                    </span>
                  </div>

                  {entry.notes && (
                    <p className="text-sm text-gray-600 mb-2">{entry.notes}</p>
                  )}

                  {entry.changed_by_name && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      {entry.changed_by_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {history.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum histórico disponível
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
