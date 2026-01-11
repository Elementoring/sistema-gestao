-- ============================================
-- CRED MANAGEMENT + 
-- Script de Criação Manual de Usuários
-- ============================================

-- IMPORTANTE: Este script é para criar usuários MANUALMENTE via psql
-- Se você está usando a interface web (após login como admin), 
-- use a página de "Usuários" ao invés deste script.

-- ============================================
-- Como usar este script:
-- ============================================
-- 1. Abra o psql: psql -U postgres -d cred_management
-- 2. Copie e cole os comandos abaixo
-- 3. Altere os valores conforme necessário

-- ============================================
-- EXEMPLOS DE USUÁRIOS
-- ============================================

-- Criar Usuário Admin
-- Senha: >[SENHA_REMOVIDA]<< (sempre use senhas fortes em produção!)
INSERT INTO users (username, password, full_name, role) 
VALUES (
  'admin', 
  '$2a$10$rZ5qKZ4kKyZ8kqKZqKZqKZeKZqKZqKZqKZqKZqKZqKZqKZqKZqKZqK', 
  'Administrador', 
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- Criar Usuário Normal (Operador)
-- Senha: senha123
INSERT INTO users (username, password, full_name, role) 
VALUES (
  'operador', 
  '$2a$10$8kYkZqKZqKZqKZqKZqKZeKZqKZqKZqKZqKZqKZqKZqKZqKZqKZqKZ', 
  'Operador Padrão', 
  'user'
) ON CONFLICT (username) DO NOTHING;

-- ============================================
-- COMO GERAR HASH DE SENHA
-- ============================================
-- No PowerShell, na pasta do backend, execute:
-- 
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SUASENHA', 10));"
--
-- Substitua 'SUASENHA' pela senha desejada
-- O resultado é o hash que você deve usar no campo 'password'

-- ============================================
-- TEMPLATE PARA NOVOS USUÁRIOS
-- ============================================

-- Copie este template e preencha os valores:

/*
INSERT INTO users (username, password, full_name, role) 
VALUES (
  'NOME_USUARIO',           -- Login (sem espaços, minúsculas)
  'HASH_DA_SENHA_AQUI',     -- Hash gerado pelo bcrypt
  'Nome Completo',          -- Nome completo do usuário
  'user'                    -- 'admin' ou 'user'
);
*/

-- ============================================
-- EXEMPLOS DE USUÁRIOS PARA SUA EMPRESA
-- ============================================

-- Gerente
/*
INSERT INTO users (username, password, full_name, role) 
VALUES ('gerente', 'HASH_AQUI', 'João Silva - Gerente', 'admin');
*/

-- Atendentes
/*
INSERT INTO users (username, password, full_name, role) 
VALUES ('maria', 'HASH_AQUI', 'Maria Santos', 'user');

INSERT INTO users (username, password, full_name, role) 
VALUES ('jose', 'HASH_AQUI', 'José Oliveira', 'user');

INSERT INTO users (username, password, full_name, role) 
VALUES ('ana', 'HASH_AQUI', 'Ana Costa', 'user');
*/

-- ============================================
-- CONSULTAS ÚTEIS
-- ============================================

-- Ver todos os usuários
-- SELECT id, username, full_name, role, active, created_at FROM users;

-- Ver apenas usuários ativos
-- SELECT id, username, full_name, role FROM users WHERE active = true;

-- Ver apenas admins
-- SELECT id, username, full_name FROM users WHERE role = 'admin' AND active = true;

-- Desativar usuário (ao invés de deletar)
-- UPDATE users SET active = false WHERE username = 'nome_usuario';

-- Reativar usuário
-- UPDATE users SET active = true WHERE username = 'nome_usuario';

-- Alterar senha de usuário
-- UPDATE users SET password = 'NOVO_HASH_AQUI' WHERE username = 'nome_usuario';

-- Promover usuário para admin
-- UPDATE users SET role = 'admin' WHERE username = 'nome_usuario';

-- Rebaixar admin para usuário
-- UPDATE users SET role = 'user' WHERE username = 'nome_usuario';

-- Deletar usuário (USE COM CUIDADO!)
-- DELETE FROM users WHERE username = 'nome_usuario';

-- ============================================
-- VERIFICAÇÕES DE SEGURANÇA
-- ============================================

-- Verificar se senhas padrão ainda estão ativas (MUDE EM PRODUÇÃO!)
-- SELECT username, full_name FROM users 
-- WHERE password = '$2a$10$rZ5qKZ4kKyZ8kqKZqKZqKZeKZqKZqKZqKZqKZqKZqKZqKZqKZqKZqK';

-- ============================================
-- BOAS PRÁTICAS
-- ============================================

-- 1. Sempre use senhas fortes (mínimo 8 caracteres, letras, números e símbolos)
-- 2. Altere a senha padrão do admin imediatamente
-- 3. Não compartilhe senhas entre usuários
-- 4. Desative usuários inativos ao invés de deletá-los
-- 5. Faça backup regular do banco de dados
-- 6. Mantenha um registro de quem tem acesso admin

-- ============================================
-- FIM DO SCRIPT
-- ============================================
