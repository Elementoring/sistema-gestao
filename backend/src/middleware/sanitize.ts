import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para sanitizar inputs e prevenir XSS
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitizar body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitizar query params
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitizar route params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Sanitiza um objeto recursivamente
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitiza uma string removendo caracteres perigosos
 */
function sanitizeString(str: string): string {
  if (!str || typeof str !== 'string') {
    return str;
  }

  // Remove tags HTML e JavaScript
  let sanitized = str
    // Remove <script> tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (pode ser usado para XSS)
    .replace(/data:text\/html/gi, '')
    // Remove <iframe>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove <object>
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove <embed>
    .replace(/<embed\b[^<]*>/gi, '')
    // Remove <style>
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  return sanitized;
}

/**
 * Valida que uma string não contém SQL injection
 */
export function validateNoSQLInjection(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return true;
  }

  const sqlPatterns = [
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bUPDATE\b.*\bSET\b)/i,
    /(--)/,
    /(;.*--)/,
    /('.*OR.*'.*=.*')/i,
  ];

  return !sqlPatterns.some(pattern => pattern.test(value));
}

/**
 * Valida que uma string não contém command injection
 */
export function validateNoCommandInjection(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return true;
  }

  const commandPatterns = [
    /[;&|`$()]/,
    /\.\.\//,
    /~\//,
  ];

  return !commandPatterns.some(pattern => pattern.test(value));
}

/**
 * Middleware para detectar e bloquear SQL injection
 */
export const detectSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const checkObject = (obj: any, path: string = ''): string | null => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof value === 'string') {
          if (!validateNoSQLInjection(value)) {
            return currentPath;
          }
        } else if (typeof value === 'object' && value !== null) {
          const result = checkObject(value, currentPath);
          if (result) return result;
        }
      }
    }
    return null;
  };

  // Verificar body
  if (req.body) {
    const suspiciousField = checkObject(req.body);
    if (suspiciousField) {
      console.warn(`🚨 SQL Injection detectado no campo: ${suspiciousField}`);
      console.warn(`🚨 IP: ${req.ip}, User-Agent: ${req.get('user-agent')}`);
      return res.status(400).json({ 
        error: 'Entrada inválida detectada',
        field: suspiciousField 
      });
    }
  }

  // Verificar query params
  if (req.query) {
    const suspiciousField = checkObject(req.query, 'query');
    if (suspiciousField) {
      console.warn(`🚨 SQL Injection detectado no campo: ${suspiciousField}`);
      return res.status(400).json({ 
        error: 'Parâmetros inválidos detectados',
        field: suspiciousField 
      });
    }
  }

  next();
};

/**
 * Middleware para logging de segurança
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log de tentativas suspeitas
  const userAgent = req.get('user-agent') || 'unknown';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // Detectar user agents suspeitos
  const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'burp'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    console.warn(`🚨 ALERTA: User-Agent suspeito detectado`);
    console.warn(`   IP: ${ip}`);
    console.warn(`   User-Agent: ${userAgent}`);
    console.warn(`   Path: ${req.path}`);
  }

  next();
};
