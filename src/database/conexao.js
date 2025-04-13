
/**
 * Conexão com o banco de dados PostgreSQL
 * 
 * Instruções para uso:
 * 1. Certifique-se de ter o Node.js instalado
 * 2. Instale o pacote pg usando: npm install pg
 * 3. Ajuste os parâmetros de conexão abaixo conforme seu ambiente
 */

import pkg from 'pg';
const { Pool } = pkg;

// Configuração de conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER || 'seu_usuario',      // Substitua pelo seu usuário do PostgreSQL
  host: process.env.DB_HOST || 'localhost',        // Endereço do servidor PostgreSQL
  database: process.env.DB_NAME || 'quatro_patas', // Nome do banco de dados que você criou
  password: process.env.DB_PASSWORD || 'sua_senha', // Substitua pela sua senha do PostgreSQL
  port: process.env.DB_PORT || 5432,               // Porta padrão do PostgreSQL
  max: 20,                                         // Número máximo de conexões no pool
  idleTimeoutMillis: 30000,                        // Tempo limite de conexões ociosas
  connectionTimeoutMillis: 2000,                   // Tempo limite para estabelecer uma conexão
});

// Função para testar a conexão
export const testarConexao = async () => {
  try {
    const client = await pool.connect();
    const resultado = await client.query('SELECT NOW() as agora');
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
    console.log('Hora do servidor:', resultado.rows[0].agora);
    client.release();
    return { sucesso: true, dados: resultado.rows[0] };
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para inserir um tutor no banco de dados
export const inserirTutor = async (tutor) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const queryTutor = `
      INSERT INTO tutores (nome, email, senha, telefone, cpf, endereco, cidade, estado, cep)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`;
    
    const valuesTutor = [
      tutor.nome, 
      tutor.email, 
      tutor.senha, 
      tutor.telefone, 
      tutor.cpf, 
      tutor.endereco, 
      tutor.cidade, 
      tutor.estado, 
      tutor.cep
    ];
    
    const resultado = await client.query(queryTutor, valuesTutor);
    const tutorId = resultado.rows[0].id;
    
    await client.query('COMMIT');
    console.log('Tutor cadastrado com sucesso! ID:', tutorId);
    return { sucesso: true, id: tutorId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao cadastrar tutor:', error);
    return { sucesso: false, erro: error.message };
  } finally {
    client.release();
  }
};

// Função para inserir um pet no banco de dados
export const inserirPet = async (pet, tutorId) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO pets (tutor_id, nome, especie, raca, idade, sexo, peso)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`;
    
    const values = [
      tutorId, 
      pet.nome, 
      pet.especie, 
      pet.raca, 
      pet.idade, 
      pet.sexo, 
      pet.peso
    ];
    
    const resultado = await client.query(query, values);
    const petId = resultado.rows[0].id;
    
    console.log('Pet cadastrado com sucesso! ID:', petId);
    return { sucesso: true, id: petId };
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error);
    return { sucesso: false, erro: error.message };
  } finally {
    client.release();
  }
};

// Função para inserir uma ONG no banco de dados
export const inserirOng = async (ong) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO ongs (nome, email, senha, telefone, cnpj, endereco, cidade, estado, cep, descricao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`;
    
    const values = [
      ong.nome, 
      ong.email, 
      ong.senha, 
      ong.telefone, 
      ong.cnpj, 
      ong.endereco, 
      ong.cidade, 
      ong.estado, 
      ong.cep,
      ong.descricao
    ];
    
    const resultado = await client.query(query, values);
    const ongId = resultado.rows[0].id;
    
    console.log('ONG cadastrada com sucesso! ID:', ongId);
    return { sucesso: true, id: ongId };
  } catch (error) {
    console.error('Erro ao cadastrar ONG:', error);
    return { sucesso: false, erro: error.message };
  } finally {
    client.release();
  }
};

// Exporta a função de consulta para uso em outros arquivos
export const query = (text, params) => pool.query(text, params);

