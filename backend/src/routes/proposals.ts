import { Router, Response } from 'express';
import { query, pool } from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { auditLog, logAudit } from '../middleware/audit';
import { z } from 'zod';

const router = Router();

const proposalSchema = z.object({
  client_id: z.number(),
  benefit_id: z.number().optional(),
  proposal_date: z.string(),
  contract_value: z.number(),
  balance_due: z.number().optional(),
  change_amount: z.number().optional(),
  installment_value: z.number(),
  installment_count: z.number(),
  contract_bank: z.string(),
  bank_login: z.string().optional(),
  contract_type: z.string(),
  status: z.string(),
  interest_rate: z.number().optional(),
  digitized_by: z.number().optional(),
  attended_by: z.number().optional(),
  notes: z.string().optional(),
});

// Listar todas as propostas
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        p.*,
        c.cpf, c.full_name as client_name, c.birth_date, c.age, c.phone_1,
        cb.benefit_organ, cb.benefit_number, cb.benefit_species, 
        cb.benefit_species_description, cb.account_type, cb.agency, 
        cb.account_number, cb.account_digit, cb.bank_name,
        u1.full_name as digitized_by_name,
        u2.full_name as attended_by_name
      FROM proposals p
      LEFT JOIN clients c ON p.client_id = c.id
      LEFT JOIN client_benefits cb ON p.benefit_id = cb.id
      LEFT JOIN users u1 ON p.digitized_by = u1.id
      LEFT JOIN users u2 ON p.attended_by = u2.id
      ORDER BY p.proposal_date DESC, p.created_at DESC
    `);

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar propostas:', error);
    return res.status(500).json({ error: 'Erro ao listar propostas' });
  }
});

// Buscar proposta por ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        p.*,
        c.cpf, c.full_name as client_name, c.birth_date, c.age, c.phone_1,
        cb.benefit_organ, cb.benefit_number, cb.benefit_species, 
        cb.benefit_species_description, cb.account_type, cb.agency, 
        cb.account_number, cb.account_digit, cb.bank_name,
        u1.full_name as digitized_by_name,
        u2.full_name as attended_by_name
      FROM proposals p
      LEFT JOIN clients c ON p.client_id = c.id
      LEFT JOIN client_benefits cb ON p.benefit_id = cb.id
      LEFT JOIN users u1 ON p.digitized_by = u1.id
      LEFT JOIN users u2 ON p.attended_by = u2.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposta não encontrada' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar proposta:', error);
    return res.status(500).json({ error: 'Erro ao buscar proposta' });
  }
});

// Buscar propostas por cliente
router.get('/client/:clientId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;

    const result = await query(`
      SELECT 
        p.*,
        c.cpf, c.full_name as client_name, c.birth_date, c.age, c.phone_1,
        cb.benefit_organ, cb.benefit_number, cb.benefit_species, 
        cb.benefit_species_description, cb.account_type, cb.agency, 
        cb.account_number, cb.account_digit, cb.bank_name,
        u1.full_name as digitized_by_name,
        u2.full_name as attended_by_name
      FROM proposals p
      LEFT JOIN clients c ON p.client_id = c.id
      LEFT JOIN client_benefits cb ON p.benefit_id = cb.id
      LEFT JOIN users u1 ON p.digitized_by = u1.id
      LEFT JOIN users u2 ON p.attended_by = u2.id
      WHERE p.client_id = $1
      ORDER BY p.proposal_date DESC, p.created_at DESC
    `, [clientId]);

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar propostas do cliente:', error);
    return res.status(500).json({ error: 'Erro ao buscar propostas do cliente' });
  }
});

// Criar proposta
router.post('/', authenticate, auditLog('CREATE', 'PROPOSAL'), async (req: AuthRequest, res: Response) => {
  try {
    const data = proposalSchema.parse(req.body);

    // Verificar duplicatas - propostas ativas para o mesmo cliente
    const duplicateCheck = await query(
      `SELECT p.id, p.status, p.proposal_date, c.full_name, c.cpf
       FROM proposals p
       JOIN clients c ON p.client_id = c.id
       WHERE p.client_id = $1 
       AND p.status IN ('Pendente', 'Em Análise', 'Aprovado')
       ORDER BY p.proposal_date DESC
       LIMIT 1`,
      [data.client_id]
    );

    if (duplicateCheck.rows.length > 0) {
      const existing = duplicateCheck.rows[0];
      return res.status(409).json({
        error: 'Proposta duplicada detectada',
        message: `Cliente ${existing.full_name} (CPF: ${existing.cpf}) já possui uma proposta ${existing.status} (ID: ${existing.id})`,
        existingProposal: existing
      });
    }

    const result = await query(
      `INSERT INTO proposals (
        client_id, benefit_id, proposal_date, contract_value, balance_due,
        change_amount, installment_value, installment_count, contract_bank,
        bank_login, contract_type, status, interest_rate, digitized_by,
        attended_by, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        data.client_id, data.benefit_id, data.proposal_date, data.contract_value,
        data.balance_due, data.change_amount, data.installment_value,
        data.installment_count, data.contract_bank, data.bank_login,
        data.contract_type, data.status, data.interest_rate, data.digitized_by,
        data.attended_by, data.notes, req.user!.id
      ]
    );

    // Criar entrada inicial no histórico de status
    await query(
      `INSERT INTO proposal_status_history 
       (proposal_id, old_status, new_status, changed_by, notes)
       VALUES ($1, NULL, $2, $3, 'Proposta criada')`,
      [result.rows[0].id, data.status, req.user!.id]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar proposta:', error);
    return res.status(500).json({ error: 'Erro ao criar proposta' });
  }
});

// Atualizar proposta
router.put('/:id', authenticate, auditLog('UPDATE', 'PROPOSAL'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = proposalSchema.parse(req.body);

    // Buscar status anterior
    const oldProposal = await query('SELECT status FROM proposals WHERE id = $1', [id]);
    
    if (oldProposal.rows.length === 0) {
      return res.status(404).json({ error: 'Proposta não encontrada' });
    }

    const oldStatus = oldProposal.rows[0].status;

    const result = await query(
      `UPDATE proposals SET
        client_id = $1, benefit_id = $2, proposal_date = $3, contract_value = $4,
        balance_due = $5, change_amount = $6, installment_value = $7,
        installment_count = $8, contract_bank = $9, bank_login = $10,
        contract_type = $11, status = $12, interest_rate = $13,
        digitized_by = $14, attended_by = $15, notes = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *`,
      [
        data.client_id, data.benefit_id, data.proposal_date, data.contract_value,
        data.balance_due, data.change_amount, data.installment_value,
        data.installment_count, data.contract_bank, data.bank_login,
        data.contract_type, data.status, data.interest_rate, data.digitized_by,
        data.attended_by, data.notes, id
      ]
    );

    // Salvar histórico de status se mudou
    if (oldStatus !== data.status) {
      await query(
        `INSERT INTO proposal_status_history 
         (proposal_id, old_status, new_status, changed_by, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, oldStatus, data.status, req.user!.id, `Status alterado de "${oldStatus}" para "${data.status}"`]
      );
    }

    return res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao atualizar proposta:', error);
    return res.status(500).json({ error: 'Erro ao atualizar proposta' });
  }
});

// Excluir proposta (somente admin)
router.delete('/:id', authenticate, authorize('admin'), auditLog('DELETE', 'PROPOSAL'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM proposals WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposta não encontrada' });
    }

    return res.json({ message: 'Proposta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir proposta:', error);
    return res.status(500).json({ error: 'Erro ao excluir proposta' });
  }
});

// Estatísticas de propostas
router.get('/stats/overview', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total_proposals,
        COUNT(DISTINCT client_id) as total_clients,
        SUM(contract_value) as total_contract_value,
        AVG(contract_value) as avg_contract_value,
        COUNT(CASE WHEN status = 'Aprovado' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'Pendente' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'Negado' THEN 1 END) as denied_count,
        COUNT(CASE WHEN status = 'Em Análise' THEN 1 END) as analyzing_count
      FROM proposals
    `);

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;
