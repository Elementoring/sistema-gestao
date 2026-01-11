import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Mail, MessageSquare, Calendar, User } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Interaction {
  id: number;
  client_id: number;
  user_id: number;
  user_name: string;
  interaction_type: string;
  description: string;
  created_at: string;
}

interface ClientInteractionsProps {
  clientId: number;
}

const INTERACTION_TYPES = [
  { value: 'call', label: 'Ligação', icon: Phone },
  { value: 'email', label: 'E-mail', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { value: 'meeting', label: 'Reunião', icon: Calendar },
  { value: 'visit', label: 'Visita', icon: User },
  { value: 'other', label: 'Outro', icon: MessageSquare },
];

export default function ClientInteractions({ clientId }: ClientInteractionsProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [interactionType, setInteractionType] = useState('call');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInteractions();
  }, [clientId]);

  const loadInteractions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/history/interactions/${clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setInteractions(response.data);
    } catch (error) {
      console.error('Erro ao carregar interações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!description.trim()) {
      alert('Por favor, descreva a interação');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/history/interactions`,
        {
          client_id: clientId,
          interaction_type: interactionType,
          description: description.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setDescription('');
      setInteractionType('call');
      setShowForm(false);
      loadInteractions();
    } catch (error) {
      console.error('Erro ao salvar interação:', error);
      alert('Erro ao salvar interação');
    } finally {
      setSaving(false);
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

  const getInteractionIcon = (type: string) => {
    const found = INTERACTION_TYPES.find(t => t.value === type);
    const Icon = found?.icon || MessageSquare;
    return <Icon className="w-4 h-4" />;
  };

  const getInteractionLabel = (type: string) => {
    const found = INTERACTION_TYPES.find(t => t.value === type);
    return found?.label || type;
  };

  const getInteractionColor = (type: string) => {
    const colors: Record<string, string> = {
      call: 'bg-blue-100 text-blue-800',
      email: 'bg-purple-100 text-purple-800',
      whatsapp: 'bg-green-100 text-green-800',
      meeting: 'bg-orange-100 text-orange-800',
      visit: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.other;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Interações</CardTitle>
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Histórico de Interações</CardTitle>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Interação
        </Button>
      </CardHeader>
      <CardContent>
        {/* Form */}
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
            <div>
              <Label htmlFor="interactionType">Tipo de Interação</Label>
              <Select value={interactionType} onValueChange={setInteractionType}>
                <SelectTrigger id="interactionType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERACTION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a interação com o cliente..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de interações */}
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <div key={interaction.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge className={`${getInteractionColor(interaction.interaction_type)} flex items-center gap-1`}>
                  {getInteractionIcon(interaction.interaction_type)}
                  {getInteractionLabel(interaction.interaction_type)}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatDate(interaction.created_at)}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                {interaction.description}
              </p>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <User className="w-3 h-3" />
                {interaction.user_name}
              </div>
            </div>
          ))}

          {interactions.length === 0 && !showForm && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma interação registrada ainda
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
