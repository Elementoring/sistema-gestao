import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { validateCPF, formatCPF, formatPhone, calculateAge } from '@/lib/utils';
import { cepService } from '@/services/dataService';
import { BENEFIT_ORGANS } from '@/data/benefitOrgans';
import { getBankName } from '@/data/banks';
import { getBenefitDescription } from '@/data/benefitSpecies';
import { Plus, X, Loader2, Tag } from 'lucide-react';

// Função para converter data ISO para formato yyyy-MM-dd
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

interface Benefit {
  benefit_organ: string;
  benefit_number: string;
  benefit_species: string;
  benefit_species_description: string;
  bank_code: string;
  bank_name: string;
  account_type: string;
  agency: string;
  account_number: string;
  account_digit: string;
  concession_date: string;
  gross_salary: string;
}

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  client?: any;
}

export default function ClientModal({ open, onClose, onSave, client }: ClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cpfError, setCpfError] = useState('');
  
  // Dados pessoais
  const [cpf, setCpf] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  
  // Documentos
  const [rg, setRg] = useState('');
  const [documentType, setDocumentType] = useState('RG');
  const [rgIssuer, setRgIssuer] = useState('');
  const [rgIssuerState, setRgIssuerState] = useState('');
  const [rgIssueDate, setRgIssueDate] = useState('');
  
  // Filiação
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');
  
  // Naturalidade
  const [birthplaceCity, setBirthplaceCity] = useState('');
  const [birthplaceState, setBirthplaceState] = useState('');
  
  // Endereço
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  
  // Contatos
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  
  // Tags e outros
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState('');
  
  // Benefícios
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  useEffect(() => {
    if (client) {
      // Preencher formulário com dados do cliente para edição
      setCpf(formatCPF(client.cpf));
      setFullName(client.full_name);
      setBirthDate(formatDateForInput(client.birth_date));
      setAge(client.age);
      setEmail(client.email || '');
      setRg(client.rg || '');
      setDocumentType(client.document_type || 'RG');
      setRgIssuer(client.rg_issuer || '');
      setRgIssuerState(client.rg_issuer_state || '');
      setRgIssueDate(formatDateForInput(client.rg_issue_date));
      setMotherName(client.mother_name || '');
      setFatherName(client.father_name || '');
      setBirthplaceCity(client.birthplace_city || '');
      setBirthplaceState(client.birthplace_state || '');
      setZipCode(client.zip_code || '');
      setAddress(client.address || '');
      setAddressNumber(client.address_number || '');
      setAddressComplement(client.address_complement || '');
      setNeighborhood(client.neighborhood || '');
      setCity(client.city || '');
      setState(client.state || '');
      setPhone1(client.phone_1 || '');
      setPhone2(client.phone_2 || '');
      setTags(client.tags || []);
      setNotes(client.notes || '');
      // Formatar datas nos benefícios
      const formattedBenefits = (client.benefits || []).map((benefit: any) => ({
        ...benefit,
        concession_date: formatDateForInput(benefit.concession_date)
      }));
      setBenefits(formattedBenefits);
    } else {
      resetForm();
    }
  }, [client, open]);

  const resetForm = () => {
    setCpf('');
    setFullName('');
    setBirthDate('');
    setAge(null);
    setEmail('');
    setRg('');
    setDocumentType('RG');
    setRgIssuer('');
    setRgIssuerState('');
    setRgIssueDate('');
    setMotherName('');
    setFatherName('');
    setBirthplaceCity('');
    setBirthplaceState('');
    setZipCode('');
    setAddress('');
    setAddressNumber('');
    setAddressComplement('');
    setNeighborhood('');
    setCity('');
    setState('');
    setPhone1('');
    setPhone2('');
    setTags([]);
    setNewTag('');
    setNotes('');
    setBenefits([]);
    setCpfError('');
  };

  const handleCpfChange = (value: string) => {
    const formatted = formatCPF(value);
    setCpf(formatted);
    
    const cleanCpf = formatted.replace(/\D/g, '');
    if (cleanCpf.length === 11) {
      if (!validateCPF(cleanCpf)) {
        setCpfError('CPF inválido');
      } else {
        setCpfError('');
      }
    } else {
      setCpfError('');
    }
  };

  const handleBirthDateChange = (value: string) => {
    setBirthDate(value);
    if (value) {
      const calculatedAge = calculateAge(value);
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  const handleCepSearch = async () => {
    if (zipCode.length === 8) {
      setLoadingCep(true);
      try {
        const data = await cepService.fetchAddress(zipCode);
        setAddress(data.address);
        setNeighborhood(data.neighborhood);
        setCity(data.city);
        setState(data.state);
      } catch (error) {
        alert('CEP não encontrado');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleBankCodeChange = (index: number, code: string) => {
    const newBenefits = [...benefits];
    newBenefits[index].bank_code = code;
    newBenefits[index].bank_name = getBankName(code);
    setBenefits(newBenefits);
  };

  const handleSpeciesCodeChange = (index: number, code: string) => {
    const newBenefits = [...benefits];
    newBenefits[index].benefit_species = code;
    newBenefits[index].benefit_species_description = getBenefitDescription(code);
    setBenefits(newBenefits);
  };

  const addBenefit = () => {
    setBenefits([
      ...benefits,
      {
        benefit_organ: '',
        benefit_number: '',
        benefit_species: '',
        benefit_species_description: '',
        bank_code: '',
        bank_name: '',
        account_type: '',
        agency: '',
        account_number: '',
        account_digit: '',
        concession_date: '',
        gross_salary: '',
      },
    ]);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!validateCPF(cleanCpf)) {
      setCpfError('CPF inválido');
      return;
    }

    setLoading(true);
    try {
      const data = {
        cpf: cleanCpf,
        full_name: fullName,
        birth_date: birthDate,
        age,
        email,
        rg,
        document_type: documentType,
        rg_issuer: rgIssuer,
        rg_issuer_state: rgIssuerState,
        rg_issue_date: rgIssueDate,
        mother_name: motherName,
        father_name: fatherName,
        birthplace_city: birthplaceCity,
        birthplace_state: birthplaceState,
        zip_code: zipCode,
        address,
        address_number: addressNumber,
        address_complement: addressComplement,
        neighborhood,
        city,
        state,
        phone_1: phone1,
        phone_2: phone2,
        tags,
        notes,
        benefits,
      };

      await onSave(data);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="client-modal-description">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription id="client-modal-description">
            {client ? 'Edite as informações do cliente abaixo' : 'Preencha os dados para cadastrar um novo cliente'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
                {cpfError && <p className="text-sm text-red-600 mt-1">{cpfError}</p>}
              </div>

              <div>
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  value={age || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Documentação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Documentação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RG">RG</SelectItem>
                    <SelectItem value="CNH">CNH</SelectItem>
                    <SelectItem value="RNE">RNE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rgIssuer">Órgão Expedidor</Label>
                <Input
                  id="rgIssuer"
                  value={rgIssuer}
                  onChange={(e) => setRgIssuer(e.target.value)}
                  placeholder="SSP, DETRAN, etc"
                />
              </div>

              <div>
                <Label htmlFor="rgIssuerState">UF Expedidor</Label>
                <Input
                  id="rgIssuerState"
                  value={rgIssuerState}
                  onChange={(e) => setRgIssuerState(e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="SP"
                />
              </div>

              <div>
                <Label htmlFor="rgIssueDate">Data de Expedição</Label>
                <Input
                  id="rgIssueDate"
                  type="date"
                  value={rgIssueDate}
                  onChange={(e) => setRgIssueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filiação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Filiação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="motherName">Nome da Mãe</Label>
                <Input
                  id="motherName"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="fatherName">Nome do Pai</Label>
                <Input
                  id="fatherName"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Naturalidade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Naturalidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthplaceCity">Cidade de Nascimento</Label>
                <Input
                  id="birthplaceCity"
                  value={birthplaceCity}
                  onChange={(e) => setBirthplaceCity(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="birthplaceState">Estado de Nascimento</Label>
                <Input
                  id="birthplaceState"
                  value={birthplaceState}
                  onChange={(e) => setBirthplaceState(e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="SP"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <div className="flex gap-2">
                  <Input
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    placeholder="00000000"
                  />
                  <Button
                    type="button"
                    onClick={handleCepSearch}
                    disabled={loadingCep || zipCode.length !== 8}
                  >
                    {loadingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Logradouro</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="addressNumber">Número</Label>
                <Input
                  id="addressNumber"
                  value={addressNumber}
                  onChange={(e) => setAddressNumber(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="addressComplement">Complemento</Label>
                <Input
                  id="addressComplement"
                  value={addressComplement}
                  onChange={(e) => setAddressComplement(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="SP"
                />
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contatos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone1">Telefone 1</Label>
                <Input
                  id="phone1"
                  value={phone1}
                  onChange={(e) => setPhone1(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <Label htmlFor="phone2">Telefone 2</Label>
                <Input
                  id="phone2"
                  value={phone2}
                  onChange={(e) => setPhone2(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>

          {/* Tags e Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tags e Observações</h3>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Digite uma tag e pressione Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Tag className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              
              {/* Lista de Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-red-600"
                        aria-label={`Remover tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Tags Sugeridas */}
              <div className="mt-2 flex flex-wrap gap-2">
                <p className="text-xs text-gray-500 w-full">Sugestões:</p>
                {['VIP', 'Inadimplente', 'Premium', 'Novo', 'Atenção'].map(suggestedTag => (
                  !tags.includes(suggestedTag) && (
                    <Button
                      key={suggestedTag}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => {
                        setTags([...tags, suggestedTag]);
                      }}
                    >
                      + {suggestedTag}
                    </Button>
                  )
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações gerais sobre o cliente..."
                rows={4}
              />
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Benefícios</h3>
              <Button type="button" onClick={addBenefit} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Benefício
              </Button>
            </div>

            {benefits.map((benefit, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeBenefit(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Órgão do Benefício *</Label>
                    <Select
                      value={benefit.benefit_organ}
                      onValueChange={(value) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].benefit_organ = value;
                        setBenefits(newBenefits);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {BENEFIT_ORGANS.map((organ) => (
                          <SelectItem key={organ} value={organ}>
                            {organ}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Matrícula do Benefício *</Label>
                    <Input
                      value={benefit.benefit_number}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].benefit_number = e.target.value;
                        setBenefits(newBenefits);
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label>Código da Espécie</Label>
                    <Input
                      value={benefit.benefit_species}
                      onChange={(e) => handleSpeciesCodeChange(index, e.target.value)}
                      placeholder="Ex: 41"
                      maxLength={3}
                    />
                  </div>

                  {benefit.benefit_species_description && (
                    <div className="md:col-span-3">
                      <Label>Descrição da Espécie</Label>
                      <Input
                        value={benefit.benefit_species_description}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Código do Banco</Label>
                    <Input
                      value={benefit.bank_code}
                      onChange={(e) => handleBankCodeChange(index, e.target.value)}
                      placeholder="Ex: 033"
                      maxLength={5}
                    />
                  </div>

                  {benefit.bank_name && (
                    <div className="md:col-span-2">
                      <Label>Nome do Banco</Label>
                      <Input
                        value={benefit.bank_name}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Tipo de Conta</Label>
                    <Select
                      value={benefit.account_type}
                      onValueChange={(value) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].account_type = value;
                        setBenefits(newBenefits);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Conta Corrente</SelectItem>
                        <SelectItem value="poupanca">Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Agência</Label>
                    <Input
                      value={benefit.agency}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].agency = e.target.value;
                        setBenefits(newBenefits);
                      }}
                    />
                  </div>

                  <div>
                    <Label>Número da Conta</Label>
                    <Input
                      value={benefit.account_number}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].account_number = e.target.value;
                        setBenefits(newBenefits);
                      }}
                    />
                  </div>

                  <div>
                    <Label>Dígito</Label>
                    <Input
                      value={benefit.account_digit}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].account_digit = e.target.value;
                        setBenefits(newBenefits);
                      }}
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <Label>Data de Concessão</Label>
                    <Input
                      type="date"
                      value={benefit.concession_date}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].concession_date = e.target.value;
                        setBenefits(newBenefits);
                      }}
                    />
                  </div>

                  <div>
                    <Label>Salário Bruto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={benefit.gross_salary}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[index].gross_salary = e.target.value;
                        setBenefits(newBenefits);
                      }}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !!cpfError}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Cliente'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
