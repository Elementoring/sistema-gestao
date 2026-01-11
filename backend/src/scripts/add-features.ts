import { pool } from '../config/database';

const addNewFeatures = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Adicionar campos novos nas tabelas existentes
    console.log('📝 Adicionando novos campos nas tabelas existentes...');
    
    // Adicionar tags e foto ao cliente
    await client.query(`
      ALTER TABLE clients 
      ADD COLUMN IF NOT EXISTS tags TEXT[],
      ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS credit_score INTEGER,
      ADD COLUMN IF NOT EXISTS notes TEXT
    `);

    // Tabela de histórico de auditoria
    console.log('📊 Criando tabela de auditoria...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        old_data JSONB,
        new_data JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de interações com clientes
    console.log('💬 Criando tabela de interações...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS client_interactions (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        interaction_type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de histórico de status de propostas
    console.log('📋 Criando tabela de histórico de status...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS proposal_status_history (
        id SERIAL PRIMARY KEY,
        proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
        old_status VARCHAR(50),
        new_status VARCHAR(50) NOT NULL,
        changed_by INTEGER REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de documentos/anexos
    console.log('📎 Criando tabela de documentos...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de notificações
    console.log('🔔 Criando tabela de notificações...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        link VARCHAR(500),
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de tarefas/lembretes
    console.log('📅 Criando tabela de tarefas...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        due_date TIMESTAMP,
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'pending',
        related_entity_type VARCHAR(50),
        related_entity_id INTEGER,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de comissões
    console.log('💰 Criando tabela de comissões...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS commissions (
        id SERIAL PRIMARY KEY,
        proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        commission_type VARCHAR(50) NOT NULL,
        percentage DECIMAL(5, 2),
        amount DECIMAL(10, 2) NOT NULL,
        paid BOOLEAN DEFAULT false,
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de configurações do sistema
    console.log('⚙️ Criando tabela de configurações...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        description TEXT,
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de chat interno
    console.log('💬 Criando tabela de chat...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER REFERENCES users(id),
        to_user_id INTEGER REFERENCES users(id),
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices para performance
    console.log('🚀 Criando índices...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_interactions_client ON client_interactions(client_id);
      CREATE INDEX IF NOT EXISTS idx_status_history_proposal ON proposal_status_history(proposal_id);
      CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
      CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id, status);
      CREATE INDEX IF NOT EXISTS idx_commissions_user ON commissions(user_id, paid);
    `);

    // Inserir configurações padrão
    console.log('📝 Inserindo configurações padrão...');
    await client.query(`
      INSERT INTO system_settings (key, value, description) VALUES
      ('commission_rates', '{"digitador": 0.5, "atendente": 0.3, "gerente": 0.2}', 'Taxas de comissão por função'),
      ('alert_days', '{"stuck_proposal": 7, "document_pending": 3}', 'Dias para alertas automáticos'),
      ('email_notifications', '{"enabled": true, "smtp_host": "", "smtp_port": 587}', 'Configurações de email'),
      ('backup_settings', '{"enabled": true, "frequency": "daily", "retention_days": 30}', 'Configurações de backup')
      ON CONFLICT (key) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Todas as novas funcionalidades foram adicionadas com sucesso!');
    console.log('');
    console.log('📊 Tabelas criadas:');
    console.log('   - audit_logs (Log de auditoria)');
    console.log('   - client_interactions (Histórico de interações)');
    console.log('   - proposal_status_history (Histórico de status)');
    console.log('   - documents (Anexos e documentos)');
    console.log('   - notifications (Notificações push)');
    console.log('   - tasks (Tarefas e lembretes)');
    console.log('   - commissions (Comissionamento)');
    console.log('   - system_settings (Configurações)');
    console.log('   - chat_messages (Chat interno)');
    console.log('');
    console.log('🎉 Sistema pronto para as novas funcionalidades!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao adicionar funcionalidades:', error);
    throw error;
  } finally {
    client.release();
  }
};

addNewFeatures()
  .then(() => {
    console.log('🎊 Migração concluída com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na migração:', error);
    process.exit(1);
  });
