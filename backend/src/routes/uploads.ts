import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { auditLog } from '../middleware/audit';

const router = Router();

// Middleware CORS específico para uploads (garante headers mesmo com erros do multer)
router.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  }
  
  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Verificar se Cloudinary está configurado
const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

console.log(`📦 Storage: ${useCloudinary ? 'Cloudinary' : 'Local filesystem'}`);

// Configurar diretório de uploads local (fallback)
const uploadDir = path.join(__dirname, '../../uploads');
const clientPhotosDir = path.join(uploadDir, 'client-photos');
const documentsDir = path.join(uploadDir, 'documents');

if (!useCloudinary) {
  [uploadDir, clientPhotosDir, documentsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Storage para fotos de clientes
const clientPhotoStorage = useCloudinary
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => ({
        folder: 'cred-management/client-photos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
      }),
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, clientPhotosDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'client-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

const clientPhotoUpload = multer({
  storage: clientPhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// Configuração do multer para documentos gerais
const documentStorage = useCloudinary
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => ({
        folder: 'cred-management/documents',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
        resource_type: 'auto',
      }),
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, documentsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

const documentUpload = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// Upload de foto do cliente
router.post('/client-photo/:clientId', authenticate, clientPhotoUpload.single('photo'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { clientId } = req.params;
    
    // URL da foto (Cloudinary ou local)
    const photoUrl = useCloudinary 
      ? (req.file as any).path  // Cloudinary retorna a URL completa em .path
      : `/uploads/client-photos/${req.file.filename}`;

    // Buscar foto anterior para deletar
    const oldClient = await query('SELECT photo_url FROM clients WHERE id = $1', [clientId]);
    
    // Atualizar URL da foto no banco
    await query(
      'UPDATE clients SET photo_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [photoUrl, clientId]
    );

    // Deletar foto anterior se existir
    if (oldClient.rows[0]?.photo_url) {
      if (useCloudinary) {
        // Extrair public_id da URL do Cloudinary para deletar
        const urlParts = oldClient.rows[0].photo_url.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/'); // folder/filename.ext
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // remover extensão
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Erro ao deletar foto antiga do Cloudinary:', error);
        }
      } else {
        // Sistema de arquivos local
        const oldPhotoPath = path.join(__dirname, '../..', oldClient.rows[0].photo_url);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    return res.json({ 
      message: 'Foto enviada com sucesso',
      photoUrl 
    });
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    return res.status(500).json({ error: 'Erro ao fazer upload da foto' });
  }
});

// Upload de documento
router.post('/document', authenticate, auditLog('CREATE', 'DOCUMENT'), documentUpload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { entity_type, entity_id, document_type } = req.body;

    if (!entity_type || !entity_id || !document_type) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // URL do arquivo (Cloudinary ou local)
    const filePath = useCloudinary 
      ? (req.file as any).path  // Cloudinary retorna a URL completa em .path
      : `/uploads/documents/${req.file.filename}`;

    const result = await query(
      `INSERT INTO documents 
       (entity_type, entity_id, document_type, file_name, file_path, file_size, mime_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        entity_type,
        entity_id,
        document_type,
        req.file.originalname,
        filePath,
        req.file.size,
        req.file.mimetype,
        req.user!.id
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    return res.status(500).json({ error: 'Erro ao fazer upload do documento' });
  }
});

// Listar documentos de uma entidade
router.get('/documents/:entityType/:entityId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { entityType, entityId } = req.params;

    const result = await query(
      `SELECT d.*, u.full_name as uploaded_by_name
       FROM documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.entity_type = $1 AND d.entity_id = $2
       ORDER BY d.created_at DESC`,
      [entityType.toUpperCase(), entityId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    return res.status(500).json({ error: 'Erro ao listar documentos' });
  }
});

// Deletar documento
router.delete('/document/:id', authenticate, auditLog('DELETE', 'DOCUMENT'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT file_path FROM documents WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    const filePath = path.join(__dirname, '../..', result.rows[0].file_path);
    
    // Deletar do banco
    await query('DELETE FROM documents WHERE id = $1', [id]);

    // Deletar arquivo físico
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json({ message: 'Documento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    return res.status(500).json({ error: 'Erro ao excluir documento' });
  }
});

// Download de arquivo
router.get('/download/:type/:filename', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { type, filename } = req.params;
    
    let filePath: string;
    if (type === 'client-photos') {
      filePath = path.join(clientPhotosDir, filename);
    } else if (type === 'documents') {
      filePath = path.join(documentsDir, filename);
    } else {
      return res.status(400).json({ error: 'Tipo de arquivo inválido' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    return res.sendFile(filePath);
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    return res.status(500).json({ error: 'Erro ao fazer download' });
  }
});

export default router;
