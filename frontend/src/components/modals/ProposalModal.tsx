import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { validateCPF, formatCPF } from '@/lib/utils';
import { clientService } from '@/services/dataService';
import { Loader2, AlertCircle } from 'lucide-react';

// Função para converter data ISO para formato yyyy-MM-dd
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

const CONTRACT_TYPES = [
  'Novo',
  'Refinanciamento',
  'Portabilidade',
  'Margem Livre',
  'Cartão Consignado',
  'Cartão Benefício',
];

const STATUS_OPTIONS = [
  'AGUARDA AUMENTO',
  'PAGO',
  'CANCELADA',
  'PORT PAGA (NÃO COMISSIONADA)',
  'FAZER DESBLOQUEIO',
  'PORT EM AVERBAÇÃO',
  'EM FORMALIZAÇÃO',
  'PENDENTE',
  'AGUARDANDO SALDO',
];

interface ProposalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  proposal?: any;
  currentUser: string;
}

export default function ProposalModal({
  open,
  onClose,
  onSave,
  proposal,
  currentUser,
}: ProposalModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [cpfError, setCpfError] = useState('');
  
  // Dados da proposta
  const [proposalDate, setProposalDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [clientName, setClientName] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [balanceDue, setBalanceDue] = useState('');
  const [changeAmount, setChangeAmount] = useState('');
  const [installmentValue, setInstallmentValue] = useState('');
  const [installmentCount, setInstallmentCount] = useState('');
  const [contractBank, setContractBank] = useState('');
  const [bankLogin, setBankLogin] = useState('');
  const [contractType, setContractType] = useState('');
  const [status, setStatus] = useState('PENDENTE');
  const [benefitOrgan, setBenefitOrgan] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [digitizerEmployee, setDigitizerEmployee] = useState(currentUser);
  const [attendantEmployee, setAttendantEmployee] = useState('');
  const [clientCellphone, setClientCellphone] = useState('');
  const [benefitSpecies, setBenefitSpecies] = useState('');
  const [benefitNumber, setBenefitNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [clientBirthDate, setClientBirthDate] = useState('');
  const [clientAge, setClientAge] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Auto-fill states
  const [clientData, setClientData] = useState<any>(null);
  // @ts-expect-error - showBenefitSelector usado em código futuro
  const [showBenefitSelector, setShowBenefitSelector] = useState(false);
  const [selectedBenefitId, setSelectedBenefitId] = useState<number | null>(null);

  useEffect(() => {
    if (proposal) {
      // Preencher formulário para edição
      setProposalDate(formatDateForInput(proposal.proposal_date));
      setCpf(formatCPF(proposal.client_cpf || ''));
      setClientName(proposal.client_name || '');
      setContractValue(proposal.contract_value || '');
      setBalanceDue(proposal.balance_due || '');
      setChangeAmount(proposal.change_amount || '');
      setInstallmentValue(proposal.installment_value || '');
      setInstallmentCount(proposal.installment_count || '');
      setContractBank(proposal.contract_bank || '');
      setBankLogin(proposal.bank_login || '');
      setContractType(proposal.contract_type || '');
      setStatus(proposal.status || 'Digitada');
      setBenefitOrgan(proposal.benefit_organ || '');
      setInterestRate(proposal.interest_rate || '');
      setDigitizerEmployee(proposal.digitizer_employee || currentUser);
      setAttendantEmployee(proposal.attendant_employee || '');
      setClientCellphone(proposal.client_cellphone || '');
      setBenefitSpecies(proposal.benefit_species || '');
      setBenefitNumber(proposal.benefit_number || '');
      setAccountNumber(proposal.account_number || '');
      setAccountType(proposal.account_type || '');
      setClientBirthDate(proposal.client_birth_date || '');
      setClientAge(proposal.client_age || null);
      setNotes(proposal.notes || '');
      setSelectedBenefitId(proposal.benefit_id || null);
    } else {
      resetForm();
      setProposalDate(new Date().toISOString().split('T')[0]);
      setDigitizerEmployee(currentUser);
    }
  }, [proposal, open, currentUser]);

  const resetForm = () => {
    setProposalDate(new Date().toISOString().split('T')[0]);
    setCpf('');
    setClientName('');
    setContractValue('');
    setBalanceDue('');
    setChangeAmount('');
    setInstallmentValue('');
    setInstallmentCount('');
    setContractBank('');
    setBankLogin('');
    setContractType('');
    setStatus('Digitada');
    setBenefitOrgan('');
    setInterestRate('');
    setDigitizerEmployee(currentUser);
    setAttendantEmployee('');
    setClientCellphone('');
    setBenefitSpecies('');
    setBenefitNumber('');
    setAccountNumber('');
    setAccountType('');
    setClientBirthDate('');
    setClientAge(null);
    setNotes('');
    setCpfError('');
    setClientData(null);
    setSelectedBenefitId(null);
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

  const handleSearchClient = async () => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!validateCPF(cleanCpf)) {
      setCpfError('CPF inválido');
      return;
    }

    setLoadingClient(true);
    try {
      const clients = await clientService.getAll();
      const client = clients.find((c: any) => c.cpf === cleanCpf);
      
      if (!client) {
        alert('Cliente não encontrado. Cadastre o cliente primeiro.');
        setClientData(null);
        return;
      }

      setClientData(client);
      
      // Auto-fill dados básicos do cliente
      setClientName(client.full_name);
      setClientBirthDate(client.birth_date);
      setClientAge(client.age);
      setClientCellphone(client.phone_1 || client.phone_2 || '');

      // Se o cliente tem benefícios, verificar se tem múltiplos
      if (client.benefits && client.benefits.length > 0) {
        if (client.benefits.length === 1) {
          // Auto-fill com o único benefício
          fillBenefitData(client.benefits[0]);
        } else {
          // Mostrar modal para escolher
          setShowBenefitSelector(true);
        }
      } else {
        alert('Cliente não possui benefícios cadastrados');
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      alert('Erro ao buscar cliente');
    } finally {
      setLoadingClient(false);
    }
  };

  const fillBenefitData = (benefit: any) => {
    setBenefitOrgan(benefit.benefit_organ);
    setBenefitSpecies(benefit.benefit_species);
    setBenefitNumber(benefit.benefit_number);
    setAccountNumber(benefit.account_number || '');
    setAccountType(benefit.account_type || '');
    setSelectedBenefitId(benefit.id);
  };

  // @ts-expect-error - handleBenefitSelect usado em código futuro
  const handleBenefitSelect = (benefit: any) => {
    fillBenefitData(benefit);
    setShowBenefitSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!validateCPF(cleanCpf)) {
      setCpfError('CPF inválido');
      return;
    }

    if (!clientData) {
      alert('Busque um cliente válido primeiro');
      return;
    }

    setLoading(true);
    try {
      const data = {
        client_id: clientData.id,
        benefit_id: selectedBenefitId,
        proposal_date: proposalDate,
        client_cpf: cleanCpf,
        client_name: clientName,
        contract_value: parseFloat(contractValue),
        balance_due: balanceDue ? parseFloat(balanceDue) : null,
        change_amount: changeAmount ? parseFloat(changeAmount) : null,
        installment_value: parseFloat(installmentValue),
        installment_count: parseInt(installmentCount),
        contract_bank: contractBank,
        bank_login: bankLogin,
        contract_type: contractType,
        status,
        benefit_organ: benefitOrgan,
        interest_rate: interestRate ? parseFloat(interestRate) : null,
        digitizer_employee: digitizerEmployee,
        attendant_employee: attendantEmployee,
        client_cellphone: clientCellphone,
        benefit_species: benefitSpecies,
        benefit_number: benefitNumber,
        account_number: accountNumber,
        account_type: accountType,
        client_birth_date: clientBirthDate,
        client_age: clientAge,
        notes,
      };

      await onSave(data);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar proposta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" aria-describedby="proposal-modal-description">
          <DialogHeader>
            <DialogTitle>{proposal ? 'Editar Proposta' : 'Nova Proposta'}</DialogTitle>
            <DialogDescription id="proposal-modal-description">
              {proposal ? 'Edite os dados da proposta de crédito abaixo' : 'Preencha os dados para criar uma nova proposta de crédito'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dados do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cpf">CPF do Cliente *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cpf"
                      value={cpf}
                      onChange={(e) => handleCpfChange(e.target.value)}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                    />
                    <Button
                      type="button"
                      onClick={handleSearchClient}
                      disabled={loadingClient || cpf.length !== 14}
                    >
                      {loadingClient ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Buscar'
                      )}
                    </Button>
                  </div>
                  {cpfError && <p className="text-sm text-red-600 mt-1">{cpfError}</p>}
                  {!clientData && cpf.length === 14 && !cpfError && (
                    <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Clique em "Buscar" para carregar os dados</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="proposalDate">Data da Proposta *</Label>
                  <Input
                    id="proposalDate"
                    type="date"
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {clientData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome Completo</Label>
                      <Input value={clientName} readOnly className="bg-white" />
                    </div>

                    <div>
                      <Label>Data de Nascimento / Idade</Label>
                      <Input
                        value={`${clientBirthDate} (${clientAge} anos)`}
                        readOnly
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label>Celular</Label>
                      <Input value={clientCellphone} readOnly className="bg-white" />
                    </div>

                    {selectedBenefitId && (
                      <>
                        <div>
                          <Label>Órgão do Benefício</Label>
                          <Input value={benefitOrgan} readOnly className="bg-white" />
                        </div>

                        <div>
                          <Label>Espécie do Benefício</Label>
                          <Input value={benefitSpecies} readOnly className="bg-white" />
                        </div>

                        <div>
                          <Label>Nº do Benefício</Label>
                          <Input value={benefitNumber} readOnly className="bg-white" />
                        </div>

                        <div>
                          <Label>Tipo de Conta</Label>
                          <Input value={accountType} readOnly className="bg-white" />
                        </div>

                        <div>
                          <Label>Número da Conta</Label>
                          <Input value={accountNumber} readOnly className="bg-white" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dados do Contrato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dados do Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contractBank">Banco do Contrato *</Label>
                  <Input
                    id="contractBank"
                    value={contractBank}
                    onChange={(e) => setContractBank(e.target.value)}
                    placeholder="Digite o nome do banco"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bankLogin">Login do Banco</Label>
                  <Input
                    id="bankLogin"
                    value={bankLogin}
                    onChange={(e) => setBankLogin(e.target.value)}
                    placeholder="Usuário no sistema do banco"
                  />
                </div>

                <div>
                  <Label htmlFor="contractType">Tipo de Contrato *</Label>
                  <Select value={contractType} onValueChange={setContractType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTRACT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contractValue">Valor do Contrato *</Label>
                  <Input
                    id="contractValue"
                    type="number"
                    step="0.01"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="balanceDue">Saldo Devedor</Label>
                  <Input
                    id="balanceDue"
                    type="number"
                    step="0.01"
                    value={balanceDue}
                    onChange={(e) => setBalanceDue(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="changeAmount">Troco Gerado</Label>
                  <Input
                    id="changeAmount"
                    type="number"
                    step="0.01"
                    value={changeAmount}
                    onChange={(e) => setChangeAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="installmentValue">Valor da Parcela *</Label>
                  <Input
                    id="installmentValue"
                    type="number"
                    step="0.01"
                    value={installmentValue}
                    onChange={(e) => setInstallmentValue(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="installmentCount">Quantidade de Parcelas *</Label>
                  <Input
                    id="installmentCount"
                    type="number"
                    value={installmentCount}
                    onChange={(e) => setInstallmentCount(e.target.value)}
                    placeholder="Ex: 12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="interestRate">Taxa de Juros (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Funcionários */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Funcionários Responsáveis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="digitizerEmployee">Funcionário Digitador *</Label>
                  <Input
                    id="digitizerEmployee"
                    value={digitizerEmployee}
                    onChange={(e) => setDigitizerEmployee(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="attendantEmployee">Funcionário Atendente</Label>
                  <Input
                    id="attendantEmployee"
                    value={attendantEmployee}
                    onChange={(e) => setAttendantEmployee(e.target.value)}
                    placeholder="Quem fez o atendimento"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Observações</h3>
              <div>
                <Label htmlFor="notes">Anotações Adicionais</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Digite observações sobre a proposta..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !!cpfError || !clientData}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Proposta'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
