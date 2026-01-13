import { describe, it, expect } from 'vitest';
import { formatCPF, validateCPF, formatPhone, formatCurrency, formatDate, calculateAge, cn } from '@/lib/utils';

describe('Utils Functions', () => {
  describe('cn (className merger)', () => {
    it('deve mesclar classes corretamente', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('deve resolver conflitos de classes Tailwind', () => {
      const result = cn('p-4', 'p-8');
      expect(result).toBe('p-8'); // p-8 deve sobrescrever p-4
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPF corretamente', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
      expect(formatCPF('00000000000')).toBe('000.000.000-00');
    });

    it('deve remover caracteres não numéricos e formatar', () => {
      expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
    });
  });

  describe('validateCPF', () => {
    it('deve validar CPF correto', () => {
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('deve rejeitar CPF com todos dígitos iguais', () => {
      expect(validateCPF('00000000000')).toBe(false);
      expect(validateCPF('11111111111')).toBe(false);
    });

    it('deve rejeitar CPF com tamanho incorreto', () => {
      expect(validateCPF('')).toBe(false);
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('123456789012')).toBe(false);
    });

    it('deve rejeitar CPF com dígitos verificadores inválidos', () => {
      // Remover este teste porque '12345678909' na verdade é um CPF válido
      expect(validateCPF('00000000001')).toBe(false);
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefone celular corretamente', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('deve formatar telefone fixo corretamente', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    it('deve retornar telefone original se não tiver 10 ou 11 dígitos', () => {
      expect(formatPhone('123')).toBe('123');
      expect(formatPhone('123456789012')).toBe('123456789012');
    });

    it('deve remover caracteres não numéricos antes de formatar', () => {
      expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar valor em reais', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1.234');
      expect(result).toContain('56');
      
      const result2 = formatCurrency(1000);
      expect(result2).toContain('1.000');
      expect(result2).toContain('00');
      
      const result3 = formatCurrency(0.99);
      expect(result3).toContain('0');
      expect(result3).toContain('99');
    });

    it('deve formatar valores negativos', () => {
      const result = formatCurrency(-500);
      expect(result).toContain('500');
    });
  });

  describe('formatDate', () => {
    it('deve formatar data corretamente', () => {
      const result1 = formatDate('2024-01-15T00:00:00.000Z');
      expect(result1).toMatch(/\d{2}\/01\/2024/); // Pode variar com timezone
      
      const result2 = formatDate('2024-12-31T12:00:00.000Z');
      expect(result2).toMatch(/\d{2}\/12\/2024/);
    });

    it('deve retornar string vazia para data inválida', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate('invalid-date')).toBe('');
    });

    it('deve adicionar zero à esquerda para dia/mês', () => {
      const result = formatDate('2024-01-05T12:00:00.000Z');
      expect(result).toMatch(/\d{2}\/01\/2024/);
      expect(result.split('/')[1]).toBe('01'); // Mês deve ter zero à esquerda
    });
  });

  describe('calculateAge', () => {
    it('deve calcular idade corretamente', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
      const birthDateStr = birthDate.toISOString().split('T')[0];
      
      expect(calculateAge(birthDateStr)).toBe(30);
    });

    it('deve considerar aniversário ainda não completado no ano', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate());
      const birthDateStr = birthDate.toISOString().split('T')[0];
      
      expect(calculateAge(birthDateStr)).toBe(24); // Ainda não fez 25 anos
    });

    it('deve considerar aniversário já completado no ano', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth() - 1, today.getDate());
      const birthDateStr = birthDate.toISOString().split('T')[0];
      
      expect(calculateAge(birthDateStr)).toBe(25); // Já fez 25 anos
    });
  });
});
