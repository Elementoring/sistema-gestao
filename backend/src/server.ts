import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import proposalRoutes from './routes/proposals';
import userRoutes from './routes/users';
import historyRoutes from './routes/history';
import uploadRoutes from './routes/uploads';
import { sanitizeInput, detectSQLInjection, securityLogger } from './middleware/sanitize';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuração de CORS para produção, desenvolvimento e desktop
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      // Desenvolvimento local
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      // Desktop Electron
      'file://',
      // Produção Render.com
      'https://cred-management-frontend.onrender.com'
    ];

console.log('🔐 CORS Configuration:');
console.log('   ALLOWED_ORIGINS env:', process.env.ALLOWED_ORIGINS);
console.log('   Parsed origins:', allowedOrigins);
console.log('   NODE_ENV:', process.env.NODE_ENV);

app.use(cors({
  origin: (origin, callback) => {
    console.log(`🔍 CORS check for origin: ${origin || 'NO ORIGIN'}`);
    
    // Permite requisições sem origin (mobile apps, Postman, curl, etc)
    if (!origin) {
      console.log('✅ Allowing request without origin (mobile/curl/postman)');
      return callback(null, true);
    }

    // Permite requisições do Electron (file:// protocol)
    if (origin.startsWith('file://')) {
      console.log('✅ Allowing Electron (file://) request');
      return callback(null, true);
    }
    
    // Verifica se a origem está na lista permitida
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS permitiu origem: ${origin}`);
      return callback(null, true);
    }
    
    // Em desenvolvimento, permite qualquer localhost
    if (process.env.NODE_ENV !== 'production' && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      console.log(`✅ CORS permitiu origem em desenvolvimento: ${origin}`);
      return callback(null, true);
    }

    console.warn(`❌ CORS BLOCKED - Origin: ${origin}`);
    console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    console.warn(`   NODE_ENV: ${process.env.NODE_ENV}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Total-Count'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight por 24 horas
}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de requisições por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting específico para login (mais restritivo)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // apenas 5 tentativas de login
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos',
  skipSuccessfulRequests: true, // não conta logins bem-sucedidos
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json({ limit: '10mb' })); // Limitar tamanho do payload
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middlewares de segurança adicionais
app.use(securityLogger); // Log de atividades suspeitas
app.use(sanitizeInput); // Sanitizar inputs
app.use(detectSQLInjection); // Detectar SQL injection

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api/auth', loginLimiter, authRoutes); // Rate limit específico para login
app.use('/api/clients', clientRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/uploads', uploadRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cred Management + API está rodando!' });
});

// Rota raiz (útil para verificar no browser)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Cred Management + API está rodando!',
    health: '/api/health',
  });
});

// Handler de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🏦  CRED MANAGEMENT + API                         ║
║                                                          ║
║        🚀  Servidor rodando em http://localhost:${PORT}    ║
║        📊  Ambiente: ${process.env.NODE_ENV || 'development'}                       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

export default app;
