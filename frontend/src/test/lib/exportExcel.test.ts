import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as XLSX from 'xlsx';
import { 
  exportToExcel, 
  exportClientsToExcel, 
  exportProposalsToExcel,
  exportStatusHistoryToExcel,
  exportInteractionsToExcel
} from '@/lib/exportExcel';

// Mock do XLSX
vi.mock('xlsx', () => ({
  utils: {
    book_new: vi.fn(() => ({})),
    json_to_sheet: vi.fn(() => ({ '!cols': [] })),
    book_append_sheet: vi.fn()
  },
  writeFile: vi.fn()
}));

describe('ExportExcel Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToExcel', () => {
    it('deve criar workbook e worksheet', () => {
      const data = [
        { name: 'João', age: 30 },
        { name: 'Maria', age: 25 }
      ];

      exportToExcel(data, 'test-file', 'Test Sheet');

      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(data);
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        'test-file.xlsx'
      );
    });

    it('deve usar nome padrão "Dados" para a planilha', () => {
      const data = [{ test: 'value' }];

      exportToExcel(data, 'file');

      expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'Dados'
      );
    });
  });

  describe('exportClientsToExcel', () => {
    it('deve formatar dados de clientes corretamente', () => {
      const clients = [
        {
          cpf: '12345678909',
          full_name: 'João Silva',
          birth_date: '1990-01-15',
          age: 34,
          email: 'joao@email.com',
          phone_1: '11987654321',
          phone_2: '1133334444',
          zip_code: '12345-678',
          address: 'Rua A',
          address_number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          benefits: [{
            benefit_organ: 'INSS',
            benefit_number: '1234567890',
            benefit_species: 'Aposentadoria',
            gross_salary: 5000
          }],
          created_at: '2024-01-15T10:00:00Z'
        }
      ];

      exportClientsToExcel(clients);

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      const callArgs = (XLSX.utils.json_to_sheet as any).mock.calls[0][0];
      
      expect(callArgs[0]).toHaveProperty('CPF', '12345678909');
      expect(callArgs[0]).toHaveProperty('Nome Completo', 'João Silva');
      expect(callArgs[0]).toHaveProperty('Órgão Benefício', 'INSS');
    });

    it('deve gerar nome de arquivo com data atual', () => {
      const clients = [{
        cpf: '12345678909',
        full_name: 'João Silva',
        birth_date: '1990-01-15',
        age: 34,
        created_at: '2024-01-15T10:00:00Z'
      }];

      exportClientsToExcel(clients);

      const today = new Date().toISOString().split('T')[0];
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        `clientes_${today}.xlsx`
      );
    });
  });

  describe('exportProposalsToExcel', () => {
    it('deve formatar dados de propostas corretamente', () => {
      const proposals = [
        {
          id: 1,
          proposal_date: '2024-01-15',
          client_name: 'João Silva',
          cpf: '12345678909',
          contract_value: 50000.00,
          installment_value: 1500.00,
          installment_count: 36,
          contract_bank: 'Banco Pan',
          contract_type: 'Novo',
          status: 'Em análise',
          interest_rate: 2.5,
          digitized_by_name: 'Maria',
          attended_by_name: 'Pedro',
          notes: 'Observação teste',
          created_at: '2024-01-15T10:00:00Z'
        }
      ];

      exportProposalsToExcel(proposals);

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      const callArgs = (XLSX.utils.json_to_sheet as any).mock.calls[0][0];
      
      expect(callArgs[0]).toHaveProperty('ID', 1);
      expect(callArgs[0]).toHaveProperty('Cliente', 'João Silva');
      expect(callArgs[0]).toHaveProperty('Status', 'Em análise');
      expect(callArgs[0]['Valor Contrato']).toContain('50000.00');
    });
  });

  describe('exportStatusHistoryToExcel', () => {
    it('deve formatar histórico de status corretamente', () => {
      const history = [
        {
          created_at: '2024-01-15T10:00:00Z',
          old_status: 'Em análise',
          new_status: 'Aprovada',
          changed_by_name: 'Admin',
          notes: 'Aprovado pelo gerente'
        }
      ];

      exportStatusHistoryToExcel(history);

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      const callArgs = (XLSX.utils.json_to_sheet as any).mock.calls[0][0];
      
      expect(callArgs[0]).toHaveProperty('Status Anterior', 'Em análise');
      expect(callArgs[0]).toHaveProperty('Novo Status', 'Aprovada');
      expect(callArgs[0]).toHaveProperty('Alterado por', 'Admin');
    });

    it('deve mostrar "Novo" quando não houver status anterior', () => {
      const history = [
        {
          created_at: '2024-01-15T10:00:00Z',
          old_status: null,
          new_status: 'Em análise',
          changed_by_name: 'Admin',
          notes: ''
        }
      ];

      exportStatusHistoryToExcel(history);

      const callArgs = (XLSX.utils.json_to_sheet as any).mock.calls[0][0];
      expect(callArgs[0]).toHaveProperty('Status Anterior', 'Novo');
    });
  });

  describe('exportInteractionsToExcel', () => {
    it('deve formatar interações corretamente', () => {
      const interactions = [
        {
          created_at: '2024-01-15T10:00:00Z',
          interaction_type: 'Ligação',
          description: 'Cliente solicitou informações',
          user_name: 'Atendente 1'
        }
      ];

      exportInteractionsToExcel(interactions);

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      const callArgs = (XLSX.utils.json_to_sheet as any).mock.calls[0][0];
      
      expect(callArgs[0]).toHaveProperty('Tipo', 'Ligação');
      expect(callArgs[0]).toHaveProperty('Descrição', 'Cliente solicitou informações');
      expect(callArgs[0]).toHaveProperty('Usuário', 'Atendente 1');
    });
  });
});
