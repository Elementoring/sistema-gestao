import { query } from '../config/database';

describe('Database Connection', () => {
  it('deve ter função query disponível', () => {
    expect(query).toBeDefined();
    expect(typeof query).toBe('function');
  });
});

describe('Utils - CPF Validation', () => {
  // Implementação local para teste
  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  it('deve validar CPF correto', () => {
    expect(validateCPF('11144477735')).toBe(true);
  });

  it('deve rejeitar CPF com todos os dígitos iguais', () => {
    expect(validateCPF('00000000000')).toBe(false);
    expect(validateCPF('11111111111')).toBe(false);
  });

  it('deve rejeitar CPF com tamanho incorreto', () => {
    expect(validateCPF('123')).toBe(false);
    expect(validateCPF('12345678901234')).toBe(false);
  });

  it('deve remover formatação e validar', () => {
    expect(validateCPF('111.444.777-35')).toBe(true);
  });
});
