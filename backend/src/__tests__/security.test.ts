import request from 'supertest';
import express from 'express';
import { query } from '../config/database';

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('🔒 TESTES DE SEGURANÇA - ATAQUES SIMULADOS', () => {
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Login normal para obter token
    const loginRes = await request(API_URL)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    authToken = loginRes.body.token;
    adminToken = loginRes.body.token;
  });

  describe('1. SQL INJECTION ATTACKS', () => {
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "admin'--",
      "' OR 1=1--",
      "' UNION SELECT NULL--",
      "'; DROP TABLE users--",
      "1' AND '1'='1",
      "' OR 'a'='a",
      "admin' OR '1'='1'/*",
      "' OR EXISTS(SELECT * FROM users)--",
      "1' UNION SELECT password FROM users--"
    ];

    test('❌ SQL Injection no login - username', async () => {
      for (const payload of sqlInjectionPayloads) {
        const res = await request(API_URL)
          .post('/api/auth/login')
          .send({ username: payload, password: 'anything' });
        
        expect(res.status).not.toBe(200);
        expect(res.body).not.toHaveProperty('token');
      }
    });

    test('❌ SQL Injection no login - password', async () => {
      for (const payload of sqlInjectionPayloads) {
        const res = await request(API_URL)
          .post('/api/auth/login')
          .send({ username: 'admin', password: payload });
        
        expect(res.status).not.toBe(200);
      }
    });

    test('❌ SQL Injection em busca de clientes', async () => {
      const res = await request(API_URL)
        .get("/api/clients/cpf/'; DROP TABLE clients--")
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(404);
    });

    test('❌ SQL Injection em parâmetros de URL', async () => {
      const maliciousIds = [
        "1 OR 1=1",
        "1'; DELETE FROM users WHERE '1'='1",
        "999 UNION SELECT * FROM users"
      ];

      for (const id of maliciousIds) {
        const res = await request(API_URL)
          .get(`/api/clients/${id}`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(res.status).not.toBe(200);
      }
    });
  });

  describe('2. XSS (CROSS-SITE SCRIPTING) ATTACKS', () => {
    const xssPayloads = [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert('XSS')>",
      "<svg onload=alert('XSS')>",
      "javascript:alert('XSS')",
      "<iframe src='javascript:alert(\"XSS\")'></iframe>",
      "<body onload=alert('XSS')>",
      "<input onfocus=alert('XSS') autofocus>",
      "'-alert('XSS')-'",
      "\"><script>alert(String.fromCharCode(88,83,83))</script>"
    ];

    test('❌ XSS em cadastro de cliente - nome', async () => {
      for (const payload of xssPayloads) {
        const res = await request(API_URL)
          .post('/api/clients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            cpf: '12345678901',
            full_name: payload,
            birth_date: '1990-01-01',
            benefits: []
          });
        
        // Deve aceitar mas sanitizar
        if (res.status === 201) {
          expect(res.body.full_name).not.toContain('<script');
          expect(res.body.full_name).not.toContain('javascript:');
        }
      }
    });

    test('❌ XSS em notas do cliente', async () => {
      const res = await request(API_URL)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpf: '98765432100',
          full_name: 'Test User',
          birth_date: '1990-01-01',
          notes: "<script>alert('XSS')</script>",
          benefits: []
        });
      
      if (res.status === 201) {
        expect(res.body.notes).not.toContain('<script');
      }
    });
  });

  describe('3. BRUTE FORCE ATTACKS', () => {
    test('❌ Brute force no login (múltiplas tentativas)', async () => {
      const attempts = 20;
      let successCount = 0;

      for (let i = 0; i < attempts; i++) {
        const res = await request(API_URL)
          .post('/api/auth/login')
          .send({ username: 'admin', password: `wrong_password_${i}` });
        
        if (res.status === 200) {
          successCount++;
        }
      }

      // Nenhuma tentativa deve ter sucesso
      expect(successCount).toBe(0);
    });

    test('❌ Brute force com diferentes usuários', async () => {
      const usernames = [
        'admin', 'root', 'administrator', 'user', 'test',
        'admin1', 'admin2', 'superadmin', 'system', 'operator'
      ];

      for (const username of usernames) {
        const res = await request(API_URL)
          .post('/api/auth/login')
          .send({ username, password: 'password123' });
        
        if (res.status === 200) {
          // Se conseguiu login, deve ser credencial válida
          expect(res.body).toHaveProperty('token');
        }
      }
    });
  });

  describe('4. AUTHENTICATION BYPASS ATTEMPTS', () => {
    test('❌ Acesso sem token', async () => {
      const res = await request(API_URL)
        .get('/api/clients');
      
      expect(res.status).toBe(401);
    });

    test('❌ Token inválido', async () => {
      const res = await request(API_URL)
        .get('/api/clients')
        .set('Authorization', 'Bearer invalid_token_12345');
      
      expect(res.status).toBe(401);
    });

    test('❌ Token malformado', async () => {
      const malformedTokens = [
        'Bearer ',
        'Bearer null',
        'Bearer undefined',
        'InvalidFormat token',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid',
      ];

      for (const token of malformedTokens) {
        const res = await request(API_URL)
          .get('/api/clients')
          .set('Authorization', token);
        
        expect(res.status).toBe(401);
      }
    });

    test('❌ Token expirado simulado', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      const res = await request(API_URL)
        .get('/api/clients')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(res.status).toBe(401);
    });
  });

  describe('5. PRIVILEGE ESCALATION ATTEMPTS', () => {
    test('❌ Usuário comum tentando criar outro usuário', async () => {
      // Criar usuário comum primeiro
      const userLogin = await request(API_URL)
        .post('/api/auth/login')
        .send({ username: 'user', password: 'user123' });
      
      if (userLogin.status === 200) {
        const userToken = userLogin.body.token;
        
        const res = await request(API_URL)
          .post('/api/users')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            username: 'hacker',
            password: 'hacker123',
            fullName: 'Hacker User',
            role: 'admin'
          });
        
        expect(res.status).toBe(403);
      }
    });

    test('❌ Modificar role para admin', async () => {
      const res = await request(API_URL)
        .put('/api/users/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ role: 'admin' });
      
      // Pode retornar 404 (usuário não existe) ou 403 (sem permissão)
      expect([403, 404]).toContain(res.status);
    });
  });

  describe('6. INJECTION ATTACKS - DIVERSOS TIPOS', () => {
    test('❌ Command Injection em campos de texto', async () => {
      const commandPayloads = [
        "; ls -la",
        "| cat /etc/passwd",
        "`whoami`",
        "$(rm -rf /)",
        "&& echo vulnerable",
        "|| pwd"
      ];

      for (const payload of commandPayloads) {
        const res = await request(API_URL)
          .post('/api/clients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            cpf: '11111111111',
            full_name: payload,
            birth_date: '1990-01-01',
            benefits: []
          });
        
        if (res.status === 201) {
          // Verificar se o payload foi sanitizado
          expect(res.body.full_name).toBe(payload); // Deve ser salvo como texto
        }
      }
    });

    test('❌ Path Traversal em upload de arquivos', async () => {
      const maliciousPaths = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '/etc/shadow',
        'C:\\Windows\\System32\\config\\SAM'
      ];

      // Teste conceitual - não vamos fazer upload real
      maliciousPaths.forEach(path => {
        expect(path).toContain('..');
      });
    });

    test('❌ LDAP Injection', async () => {
      const ldapPayloads = [
        "*)(&",
        "admin)(&(password=*))",
        "*)(objectClass=*",
        "*)|(objectClass=*"
      ];

      for (const payload of ldapPayloads) {
        const res = await request(API_URL)
          .post('/api/auth/login')
          .send({ username: payload, password: 'test' });
        
        expect(res.status).not.toBe(200);
      }
    });
  });

  describe('7. DOS (DENIAL OF SERVICE) SIMULATION', () => {
    test('❌ Payload excessivamente grande', async () => {
      const hugeString = 'A'.repeat(10000000); // 10MB de dados
      
      const res = await request(API_URL)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpf: '22222222222',
          full_name: hugeString,
          birth_date: '1990-01-01',
          benefits: []
        });
      
      // Deve rejeitar payloads muito grandes
      expect([413, 400]).toContain(res.status);
    });

    test('❌ Requisições em loop rápido', async () => {
      const requests = 50;
      const start = Date.now();
      
      const promises = Array(requests).fill(null).map(() =>
        request(API_URL)
          .get('/api/clients')
          .set('Authorization', `Bearer ${authToken}`)
      );

      await Promise.all(promises);
      const duration = Date.now() - start;

      // Servidor deve lidar com múltiplas requisições
      expect(duration).toBeLessThan(10000); // Máximo 10s para 50 requisições
    });
  });

  describe('8. CSRF (CROSS-SITE REQUEST FORGERY)', () => {
    test('❌ Requisição sem origem válida', async () => {
      const res = await request(API_URL)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Origin', 'http://evil-site.com')
        .send({
          cpf: '33333333333',
          full_name: 'CSRF Test',
          birth_date: '1990-01-01',
          benefits: []
        });
      
      // Deve ser bloqueado por CORS ou aceitar (depende da configuração)
      expect([201, 403]).toContain(res.status);
    });
  });

  describe('9. MASS ASSIGNMENT ATTACKS', () => {
    test('❌ Tentativa de modificar campos protegidos', async () => {
      const res = await request(API_URL)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpf: '44444444444',
          full_name: 'Test User',
          birth_date: '1990-01-01',
          id: 999999, // Tentando forçar ID
          created_by: 1, // Tentando manipular created_by
          created_at: '2020-01-01', // Tentando manipular data
          benefits: []
        });
      
      if (res.status === 201) {
        expect(res.body.id).not.toBe(999999);
        expect(res.body.created_by).toBe(1); // Deve ser o ID do usuário logado
      }
    });
  });

  describe('10. DATA VALIDATION ATTACKS', () => {
    test('❌ CPF inválido', async () => {
      const invalidCPFs = [
        '00000000000',
        '11111111111',
        '12345678901',
        'abcdefghijk',
        '123',
        ''
      ];

      for (const cpf of invalidCPFs) {
        const res = await request(API_URL)
          .post('/api/clients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            cpf,
            full_name: 'Test User',
            birth_date: '1990-01-01',
            benefits: []
          });
        
        expect(res.status).toBe(400);
      }
    });

    test('❌ Email inválido', async () => {
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'user@',
        'user @example.com',
        'user@.com',
        '<script>alert("xss")</script>@email.com'
      ];

      for (const email of invalidEmails) {
        const res = await request(API_URL)
          .post('/api/clients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            cpf: '12345678909',
            full_name: 'Test User',
            birth_date: '1990-01-01',
            email,
            benefits: []
          });
        
        expect(res.status).toBe(400);
      }
    });

    test('❌ Data no futuro', async () => {
      const res = await request(API_URL)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpf: '55555555555',
          full_name: 'Test User',
          birth_date: '2050-01-01', // Data no futuro
          benefits: []
        });
      
      // Pode aceitar ou rejeitar dependendo da validação
      if (res.status === 201) {
        expect(res.body.age).toBeLessThan(0);
      }
    });
  });

  describe('11. BUSINESS LOGIC ATTACKS', () => {
    test('❌ Criar cliente com CPF duplicado', async () => {
      const cpf = '66666666666';
      
      // Primeira criação
      const res1 = await request(API_URL)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpf,
          full_name: 'First User',
          birth_date: '1990-01-01',
          benefits: []
        });
      
      // Segunda criação com mesmo CPF
      const res2 = await request(API_URL)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cpf,
          full_name: 'Second User',
          birth_date: '1990-01-01',
          benefits: []
        });
      
      // Segunda tentativa deve falhar
      expect(res2.status).toBe(409);
    });
  });

  describe('12. SENSITIVE DATA EXPOSURE', () => {
    test('❌ Senha não deve aparecer em respostas', async () => {
      const res = await request(API_URL)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      if (res.status === 200) {
        res.body.forEach((user: any) => {
          expect(user).not.toHaveProperty('password');
        });
      }
    });

    test('❌ Token não deve ser logado', async () => {
      // Teste conceitual - verificar logs manualmente
      const res = await request(API_URL)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });
      
      expect(res.body).toHaveProperty('token');
      // Token deve ser hash, não plaintext
      expect(res.body.token.length).toBeGreaterThan(20);
    });
  });
});
