import request from 'supertest';
import express from 'express';
import { authenticate } from '../middleware/auth';
import jwt from 'jsonwebtoken';

describe('Middleware - Authentication', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/protected', authenticate, (req, res) => {
      res.json({ message: 'success', user: (req as any).user });
    });
  });

  it('deve permitir acesso com token válido', async () => {
    const token = jwt.sign(
      { id: 1, username: 'testuser', role: 'user' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    expect(response.body.user).toHaveProperty('id', 1);
  });

  it('deve rejeitar requisição sem token', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('deve rejeitar token inválido', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('deve rejeitar token expirado', async () => {
    const token = jwt.sign(
      { id: 1, username: 'testuser', role: 'user' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '-1h' } // Token expirado
    );

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
  });
});
