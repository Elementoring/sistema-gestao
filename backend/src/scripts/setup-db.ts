import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runWithRetry = async (fn: () => Promise<void>, attempts = 10, delayMs = 2000) => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await fn();
      return;
    } catch (error) {
      lastError = error;
      console.error(`❌ Tentativa ${attempt}/${attempts} falhou ao configurar o banco.`, error);
      if (attempt < attempts) {
        await sleep(delayMs);
      }
    }
  }
  throw lastError;
};

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Tabela de usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de clientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        cpf VARCHAR(11) UNIQUE NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        birth_date DATE NOT NULL,
        age INTEGER,
        rg VARCHAR(20),
        document_type VARCHAR(50),
        rg_issuer VARCHAR(50),
        rg_issuer_state VARCHAR(2),
        rg_issue_date DATE,
        mother_name VARCHAR(200),
        father_name VARCHAR(200),
        birthplace_city VARCHAR(100),
        birthplace_state VARCHAR(2),
        zip_code VARCHAR(8),
        address VARCHAR(255),
        address_number VARCHAR(10),
        address_complement VARCHAR(100),
        neighborhood VARCHAR(100),
        city VARCHAR(100),
        state VARCHAR(2),
        phone_1 VARCHAR(15),
        phone_2 VARCHAR(15),
        email VARCHAR(200),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de benefícios dos clientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS client_benefits (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        benefit_organ VARCHAR(50) NOT NULL,
        benefit_number VARCHAR(50) NOT NULL,
        benefit_species VARCHAR(10),
        benefit_species_description VARCHAR(200),
        bank_code VARCHAR(10),
        bank_name VARCHAR(200),
        account_type VARCHAR(20) CHECK (account_type IN ('corrente', 'poupanca')),
        agency VARCHAR(10),
        account_number VARCHAR(20),
        account_digit VARCHAR(2),
        concession_date DATE,
        gross_salary DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_id, benefit_number)
      )
    `);

    // Tabela de propostas
    await client.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        benefit_id INTEGER REFERENCES client_benefits(id),
        proposal_date DATE NOT NULL,
        contract_value DECIMAL(10, 2) NOT NULL,
        balance_due DECIMAL(10, 2),
        change_amount DECIMAL(10, 2),
        installment_value DECIMAL(10, 2) NOT NULL,
        installment_count INTEGER NOT NULL,
        contract_bank VARCHAR(200) NOT NULL,
        bank_login VARCHAR(100),
        contract_type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        interest_rate DECIMAL(5, 2),
        digitized_by INTEGER REFERENCES users(id),
        attended_by INTEGER REFERENCES users(id),
        created_by INTEGER REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de órgãos de benefício
    await client.query(`
      CREATE TABLE IF NOT EXISTS benefit_organs (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL
      )
    `);

    // Inserir órgãos de benefício
    const organs = [
      'INSS',
      'SIAPE',
      'GOVERNO',
      'PREFEITURA',
      'FGTS / CLT',
      'FORÇAS ARMADAS',
      'VEÍCULOS',
      'BOLSA FAMÍLIA'
    ];

    for (const organ of organs) {
      await client.query(
        'INSERT INTO benefit_organs (code, name) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
        [organ, organ]
      );
    }

    // Criar usuário admin padrão
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultFullName = process.env.ADMIN_FULL_NAME || 'Administrador';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await client.query(`
      INSERT INTO users (username, password, full_name, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (username) DO NOTHING
    `, [defaultUsername, hashedPassword, defaultFullName]);

    await client.query('COMMIT');
    console.log('✅ Banco de dados configurado com sucesso!');
    console.log('👤 Usuário admin criado - ALTERE A SENHA NO PRIMEIRO LOGIN!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao configurar banco de dados:', error);
    throw error;
  } finally {
    client.release();
  }
};

runWithRetry(createTables)
  .then(() => {
    console.log('🎉 Setup concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha no setup:', error);
    process.exit(1);
  });
