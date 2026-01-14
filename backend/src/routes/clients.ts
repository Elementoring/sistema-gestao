import { Router, Response } from 'express';
import { query } from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { auditLog } from '../middleware/audit';
import { z } from 'zod';

const router = Router();

// Validação de CPF
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

const clientSchema = z.object({
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  full_name: z.string().min(3, 'Nome completo é obrigatório'),
  birth_date: z.string(),
  rg: z.string().optional(),
  document_type: z.string().optional(),
  rg_issuer: z.string().optional(),
  rg_issuer_state: z.string().optional(),
  rg_issue_date: z.string().optional(),
  mother_name: z.string().optional(),
  father_name: z.string().optional(),
  birthplace_city: z.string().optional(),
  birthplace_state: z.string().optional(),
  zip_code: z.string().optional(),
  address: z.string().optional(),
  address_number: z.string().optional(),
  address_complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone_1: z.string().optional(),
  phone_2: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const benefitSchema = z.object({
  benefit_organ: z.string(),
  benefit_number: z.string(),
  benefit_species: z.string().optional(),
  benefit_species_description: z.string().optional(),
  bank_code: z.string().optional(),
  bank_name: z.string().optional(),
  account_type: z.enum(['corrente', 'poupanca']).optional(),
  agency: z.string().optional(),
  account_number: z.string().optional(),
  account_digit: z.string().optional(),
  concession_date: z.string().optional(),
  gross_salary: z.number().optional(),
});

// Listar todos os clientes
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        c.*,
        json_agg(
          json_build_object(
            'id', cb.id,
            'benefit_organ', cb.benefit_organ,
            'benefit_number', cb.benefit_number,
            'benefit_species', cb.benefit_species,
            'benefit_species_description', cb.benefit_species_description,
            'bank_code', cb.bank_code,
            'bank_name', cb.bank_name,
            'account_type', cb.account_type,
            'agency', cb.agency,
            'account_number', cb.account_number,
            'account_digit', cb.account_digit,
            'concession_date', cb.concession_date,
            'gross_salary', cb.gross_salary
          )
        ) FILTER (WHERE cb.id IS NOT NULL) as benefits
      FROM clients c
      LEFT JOIN client_benefits cb ON c.id = cb.client_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

// Buscar cliente por ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        c.*,
        json_agg(
          json_build_object(
            'id', cb.id,
            'benefit_organ', cb.benefit_organ,
            'benefit_number', cb.benefit_number,
            'benefit_species', cb.benefit_species,
            'benefit_species_description', cb.benefit_species_description,
            'bank_code', cb.bank_code,
            'bank_name', cb.bank_name,
            'account_type', cb.account_type,
            'agency', cb.agency,
            'account_number', cb.account_number,
            'account_digit', cb.account_digit,
            'concession_date', cb.concession_date,
            'gross_salary', cb.gross_salary
          )
        ) FILTER (WHERE cb.id IS NOT NULL) as benefits
      FROM clients c
      LEFT JOIN client_benefits cb ON c.id = cb.client_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// Buscar cliente por CPF
router.get('/cpf/:cpf', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cpf = req.params.cpf.replace(/\D/g, '');

    const result = await query(`
      SELECT 
        c.*,
        json_agg(
          json_build_object(
            'id', cb.id,
            'benefit_organ', cb.benefit_organ,
            'benefit_number', cb.benefit_number,
            'benefit_species', cb.benefit_species,
            'benefit_species_description', cb.benefit_species_description,
            'bank_code', cb.bank_code,
            'bank_name', cb.bank_name,
            'account_type', cb.account_type,
            'agency', cb.agency,
            'account_number', cb.account_number,
            'account_digit', cb.account_digit,
            'concession_date', cb.concession_date,
            'gross_salary', cb.gross_salary
          )
        ) FILTER (WHERE cb.id IS NOT NULL) as benefits
      FROM clients c
      LEFT JOIN client_benefits cb ON c.id = cb.client_id
      WHERE c.cpf = $1
      GROUP BY c.id
    `, [cpf]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// Criar cliente
router.post('/', authenticate, auditLog('CREATE', 'CLIENT'), async (req: AuthRequest, res: Response) => {
  try {
    await query('BEGIN');
    
    const data = clientSchema.parse(req.body);
    const benefits = req.body.benefits || [];

    // Calcular idade
    const birthDate = new Date(data.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Remover formatação do CPF
    const cpf = data.cpf.replace(/\D/g, '');

    const result = await query(
      `INSERT INTO clients (
        cpf, full_name, birth_date, age, rg, document_type, rg_issuer, rg_issuer_state, 
        rg_issue_date, mother_name, father_name, birthplace_city, birthplace_state,
        zip_code, address, address_number, address_complement, neighborhood, 
        city, state, phone_1, phone_2, email, tags, notes, photo_url, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      RETURNING *`,
      [
        cpf, data.full_name, data.birth_date, age, data.rg, data.document_type, data.rg_issuer,
        data.rg_issuer_state, data.rg_issue_date, data.mother_name, data.father_name,
        data.birthplace_city, data.birthplace_state, data.zip_code, data.address,
        data.address_number, data.address_complement, data.neighborhood, data.city,
        data.state, data.phone_1, data.phone_2, data.email, data.tags || [], data.notes, 
        req.body.photo_url || null, req.user!.id
      ]
    );

    const clientId = result.rows[0].id;

    // Inserir benefícios
    for (const benefit of benefits) {
      await query(
        `INSERT INTO client_benefits (
          client_id, benefit_organ, benefit_number, benefit_species,
          benefit_species_description, bank_code, bank_name, account_type,
          agency, account_number, account_digit, concession_date, gross_salary
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          clientId, benefit.benefit_organ, benefit.benefit_number,
          benefit.benefit_species, benefit.benefit_species_description,
          benefit.bank_code, benefit.bank_name, benefit.account_type,
          benefit.agency, benefit.account_number, benefit.account_digit,
          benefit.concession_date, benefit.gross_salary
        ]
      );
    }

    await query('COMMIT');

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    await query('ROLLBACK');
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação ao criar cliente:', error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('❌ Erro ao criar cliente:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    console.error('❌ Dados recebidos:', JSON.stringify(req.body, null, 2));
    return res.status(500).json({ 
      error: 'Erro ao criar cliente',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Atualizar cliente
router.put('/:id', authenticate, auditLog('UPDATE', 'CLIENT'), async (req: AuthRequest, res: Response) => {
  try {
    await query('BEGIN');
    
    const { id } = req.params;
    const data = clientSchema.parse(req.body);
    const benefits = req.body.benefits || [];

    // Calcular idade
    const birthDate = new Date(data.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const cpf = data.cpf.replace(/\D/g, '');

    const result = await query(
      `UPDATE clients SET
        cpf = $1, full_name = $2, birth_date = $3, age = $4, rg = $5,
        document_type = $6, rg_issuer = $7, rg_issuer_state = $8, rg_issue_date = $9,
        mother_name = $10, father_name = $11, birthplace_city = $12,
        birthplace_state = $13, zip_code = $14, address = $15,
        address_number = $16, address_complement = $17, neighborhood = $18,
        city = $19, state = $20, phone_1 = $21, phone_2 = $22, email = $23,
        tags = $24, notes = $25, 
        photo_url = COALESCE($26, photo_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $27
      RETURNING *`,
      [
        cpf, data.full_name, data.birth_date, age, data.rg, data.document_type, data.rg_issuer,
        data.rg_issuer_state, data.rg_issue_date, data.mother_name, data.father_name,
        data.birthplace_city, data.birthplace_state, data.zip_code, data.address,
        data.address_number, data.address_complement, data.neighborhood, data.city,
        data.state, data.phone_1, data.phone_2, data.email, data.tags || [], data.notes, 
        req.body.photo_url || null, id
      ]
    );

    if (result.rows.length === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Remover benefícios antigos
    await query('DELETE FROM client_benefits WHERE client_id = $1', [id]);

    // Inserir novos benefícios
    for (const benefit of benefits) {
      await query(
        `INSERT INTO client_benefits (
          client_id, benefit_organ, benefit_number, benefit_species,
          benefit_species_description, bank_code, bank_name, account_type,
          agency, account_number, account_digit, concession_date, gross_salary
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          id, benefit.benefit_organ, benefit.benefit_number,
          benefit.benefit_species, benefit.benefit_species_description,
          benefit.bank_code, benefit.bank_name, benefit.account_type,
          benefit.agency, benefit.account_number, benefit.account_digit,
          benefit.concession_date, benefit.gross_salary
        ]
      );
    }

    await query('COMMIT');

    return res.json(result.rows[0]);
  } catch (error) {
    await query('ROLLBACK');
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação ao atualizar cliente:', error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('❌ Erro ao atualizar cliente:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return res.status(500).json({ 
      error: 'Erro ao atualizar cliente',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Excluir cliente (somente admin)
router.delete('/:id', authenticate, authorize('admin'), auditLog('DELETE', 'CLIENT'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

export default router;
