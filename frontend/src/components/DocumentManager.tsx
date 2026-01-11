import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Trash2, File, Image, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Document {
  id: number;
  entity_type: string;
  entity_id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  uploaded_by_name: string;
  created_at: string;
}

interface DocumentManagerProps {
  entityType: 'CLIENT' | 'PROPOSAL';
  entityId: number;
}

const DOCUMENT_TYPES = [
  { value: 'rg', label: 'RG' },
  { value: 'cpf', label: 'CPF' },
  { value: 'comprovante_residencia', label: 'Comprovante de Residência' },
  { value: 'comprovante_renda', label: 'Comprovante de Renda' },
  { value: 'extrato_bancario', label: 'Extrato Bancário' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'procuracao', label: 'Procuração' },
  { value: 'outros', label: 'Outros' },
];

export default function DocumentManager({ entityType, entityId }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [documentType, setDocumentType] = useState('rg');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, [entityType, entityId]);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/uploads/documents/${entityType}/${entityId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDocuments(response.data);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId.toString());
      formData.append('document_type', documentType);

      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/uploads/document`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Documento enviado com sucesso!');
      setShowForm(false);
      setDocumentType('rg');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      loadDocuments();
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      alert(error.response?.data?.error || 'Erro ao fazer upload do documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/uploads/document/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Documento excluído com sucesso!');
      loadDocuments();
    } catch (error: any) {
      console.error('Erro ao excluir documento:', error);
      alert(error.response?.data?.error || 'Erro ao excluir documento');
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const url = `${API_URL.replace('/api', '')}${filePath}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) 
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
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
        <CardTitle>Documentos</CardTitle>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Upload className="w-4 h-4 mr-2" />
          Adicionar Documento
        </Button>
      </CardHeader>
      <CardContent>
        {/* Form */}
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
            <div>
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="file">Arquivo</Label>
              <Input
                id="file"
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF, Imagens, Word, Excel ou TXT. Máximo 10MB
              </p>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Enviando documento...
              </div>
            )}

            <Button 
              variant="outline" 
              onClick={() => {
                setShowForm(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              disabled={uploading}
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* Lista de documentos */}
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(doc.mime_type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{doc.file_name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {getDocumentTypeLabel(doc.document_type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.file_size)} • {formatDate(doc.created_at)} • {doc.uploaded_by_name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(doc.file_path, doc.file_name)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          {documents.length === 0 && !showForm && (
            <div className="text-center py-8 text-gray-500">
              Nenhum documento anexado ainda
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
