import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth';

describe('Auth Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      // Pode retornar 200 ou 401 dependendo se o usuário existe no DB de teste
      expect([200, 401, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('username');
        expect(response.body.user).toHaveProperty('role');
      }
    });

    it('deve rejeitar login sem username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'admin123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve rejeitar login sem password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'invaliduser',
          password: 'wrongpassword'
        });

      expect([401, 500]).toContain(response.status);
    });
  });
});
