import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

// Estender a interface Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Função para obter IP do cliente
const getClientIp = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

// Middleware de auditoria
export const auditLog = (action: string, entityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.json;
    const userId = req.userId;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Capturar dados antes da operação (para UPDATE e DELETE)
    let oldData = null;
    if ((action === 'UPDATE' || action === 'DELETE') && req.params.id) {
      try {
        const tableName = entityType.toLowerCase() + 's';
        const result = await pool.query(
          `SELECT * FROM ${tableName} WHERE id = $1`,
          [req.params.id]
        );
        oldData = result.rows[0] || null;
      } catch (error) {
        console.error('Erro ao capturar oldData:', error);
      }
    }

    // Interceptar a resposta
    res.json = function (data: any) {
      // Salvar log de auditoria
      if (data && (data.id || req.params.id)) {
        const entityId = data.id || parseInt(req.params.id);
        const newData = action === 'DELETE' ? null : data;

        pool
          .query(
            `INSERT INTO audit_logs 
            (user_id, action, entity_type, entity_id, old_data, new_data, ip_address, user_agent) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              userId || null,
              action,
              entityType,
              entityId,
              oldData ? JSON.stringify(oldData) : null,
              newData ? JSON.stringify(newData) : null,
              ip,
              userAgent,
            ]
          )
          .catch((err) => console.error('Erro ao salvar log de auditoria:', err));
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

// Função auxiliar para registrar logs manualmente
export const logAudit = async (
  userId: number | null,
  action: string,
  entityType: string,
  entityId: number,
  oldData: any = null,
  newData: any = null,
  ipAddress: string = 'system',
  userAgent: string = 'system'
) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs 
      (user_id, action, entity_type, entity_id, old_data, new_data, ip_address, user_agent) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        action,
        entityType,
        entityId,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
        ipAddress,
        userAgent,
      ]
    );
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
  }
};
