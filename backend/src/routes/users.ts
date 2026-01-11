import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const userSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  full_name: z.string().min(3, 'Nome completo é obrigatório'),
  role: z.enum(['admin', 'user']),
});

const updateUserSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter pelo menos 3 caracteres').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  full_name: z.string().min(3, 'Nome completo é obrigatório').optional(),
  role: z.enum(['admin', 'user']).optional(),
  active: z.boolean().optional(),
});

// Listar usuários (somente admin)
router.get('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT id, username, full_name, role, active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Buscar usuário por ID (somente admin)
router.get('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, username, full_name, role, active, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Criar usuário (somente admin)
router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const data = userSchema.parse(req.body);

    // Verificar se usuário já existe
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1',
      [data.username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Nome de usuário já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await query(
      `INSERT INTO users (username, password, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, full_name, role, active, created_at`,
      [data.username, hashedPassword, data.full_name, data.role]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário (somente admin)
router.put('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    // Verificar se usuário existe
    const existingUser = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Se alterando username, verificar se já está em uso
    if (data.username) {
      const usernameCheck = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [data.username, id]
      );
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Nome de usuário já está em uso' });
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.username !== undefined) {
      updates.push(`username = $${paramCount++}`);
      values.push(data.username);
    }
    if (data.password !== undefined) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updates.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }
    if (data.full_name !== undefined) {
      updates.push(`full_name = $${paramCount++}`);
      values.push(data.full_name);
    }
    if (data.role !== undefined) {
      updates.push(`role = $${paramCount++}`);
      values.push(data.role);
    }
    if (data.active !== undefined) {
      updates.push(`active = $${paramCount++}`);
      values.push(data.active);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, username, full_name, role, active, created_at, updated_at`,
      values
    );

    return res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Excluir usuário (somente admin)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Não permitir excluir o próprio usuário
    if (req.user!.id === parseInt(id)) {
      return res.status(400).json({ error: 'Não é possível excluir seu próprio usuário' });
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

export default router;
