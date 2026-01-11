import { Router, Response } from 'express';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Buscar histórico de status de uma proposta
router.get('/proposal/:proposalId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { proposalId } = req.params;

    const result = await query(
      `SELECT 
        psh.*,
        u.full_name as changed_by_name
      FROM proposal_status_history psh
      LEFT JOIN users u ON psh.changed_by = u.id
      WHERE psh.proposal_id = $1
      ORDER BY psh.created_at ASC`,
      [proposalId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar histórico de status:', error);
    return res.status(500).json({ error: 'Erro ao buscar histórico de status' });
  }
});

// Buscar interações de um cliente
router.get('/interactions/:clientId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;

    const result = await query(
      `SELECT 
        ci.*,
        u.full_name as user_name
      FROM client_interactions ci
      LEFT JOIN users u ON ci.user_id = u.id
      WHERE ci.client_id = $1
      ORDER BY ci.created_at DESC`,
      [clientId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar interações:', error);
    return res.status(500).json({ error: 'Erro ao buscar interações' });
  }
});

// Criar interação com cliente
router.post('/interactions', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { client_id, interaction_type, description } = req.body;

    if (!client_id || !interaction_type || !description) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const result = await query(
      `INSERT INTO client_interactions (client_id, user_id, interaction_type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [client_id, req.user!.id, interaction_type, description]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar interação:', error);
    return res.status(500).json({ error: 'Erro ao criar interação' });
  }
});

// Buscar logs de auditoria
router.get('/audit/:entityType/:entityId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { entityType, entityId } = req.params;

    const result = await query(
      `SELECT 
        al.*,
        u.full_name as user_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.entity_type = $1 AND al.entity_id = $2
      ORDER BY al.created_at DESC
      LIMIT 100`,
      [entityType.toUpperCase(), entityId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar logs de auditoria:', error);
    return res.status(500).json({ error: 'Erro ao buscar logs de auditoria' });
  }
});

// Buscar todos os logs de auditoria (com paginação)
router.get('/audit', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        al.*,
        u.full_name as user_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM audit_logs');
    const total = parseInt(countResult.rows[0].count);

    return res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar logs de auditoria:', error);
    return res.status(500).json({ error: 'Erro ao buscar logs de auditoria' });
  }
});

export default router;
