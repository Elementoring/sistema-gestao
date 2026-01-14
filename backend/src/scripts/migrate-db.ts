import { pool } from '../config/database';

const migrateDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Iniciando migração do banco de dados...');
    
    await client.query('BEGIN');

    // Adicionar coluna tags se não existir
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'clients' AND column_name = 'tags'
        ) THEN
          ALTER TABLE clients ADD COLUMN tags TEXT[];
          RAISE NOTICE 'Coluna tags adicionada com sucesso';
        ELSE
          RAISE NOTICE 'Coluna tags já existe';
        END IF;
      END $$;
    `);

    // Adicionar coluna notes se não existir
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'clients' AND column_name = 'notes'
        ) THEN
          ALTER TABLE clients ADD COLUMN notes TEXT;
          RAISE NOTICE 'Coluna notes adicionada com sucesso';
        ELSE
          RAISE NOTICE 'Coluna notes já existe';
        END IF;
      END $$;
    `);

    await client.query('COMMIT');
    console.log('✅ Migração concluída com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro durante migração:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

migrateDatabase()
  .then(() => {
    console.log('🎉 Banco de dados atualizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha na migração:', error);
    process.exit(1);
  });
