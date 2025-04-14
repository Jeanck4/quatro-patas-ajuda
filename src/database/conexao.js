
/**
 * PostgreSQL database connection module
 */

import pg from 'pg';
const { Pool } = pg;

const poolConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'quatro_patas',
  password: 'admin',
  port: 5432,
};

const pool = new Pool(poolConfig);

// Função para testar conexão com o banco de dados
export const testarConexao = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as agora');
    const agora = result.rows[0].agora;

    console.log('Database connection initialized successfully!');
    console.log('Current time:', agora);

    client.release();
    return { sucesso: true, dados: { agora } };
  } catch (error) {
    console.error('Error connecting to database:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para inserir um tutor
export const inserirTutor = async (tutor) => {
  try {
    console.log('Inserindo tutor no PostgreSQL:', tutor);
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO tutores (nome, email, senha, telefone, cpf, endereco, cidade, estado, cep)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING tutor_id`,
      [tutor.nome, tutor.email, tutor.senha, tutor.telefone, tutor.cpf, tutor.endereco, tutor.cidade, tutor.estado, tutor.cep]
    );

    const tutorId = result.rows[0].tutor_id;
    client.release();

    console.log('Tutor cadastrado com sucesso! ID:', tutorId);
    return { sucesso: true, id: tutorId };
  } catch (error) {
    console.error('Erro ao cadastrar tutor:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para inserir um pet
export const inserirPet = async (pet, tutorId) => {
  try {
    console.log('Inserindo pet no PostgreSQL:', pet);
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO pets (tutor_id, nome, especie, raca, idade, sexo, peso)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING pet_id`,
      [tutorId, pet.nome, pet.especie, pet.raca, pet.idade, pet.sexo, pet.peso]
    );

    const petId = result.rows[0].pet_id;
    client.release();

    console.log('Pet cadastrado com sucesso! ID:', petId);
    return { sucesso: true, id: petId };
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para inserir uma ONG
export const inserirOng = async (ong) => {
  try {
    console.log('Inserindo ONG no PostgreSQL:', ong);
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO ongs (nome, email, senha, telefone, cnpj, endereco, cidade, estado, cep, descricao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ong_id`,
      [ong.nome, ong.email, ong.senha, ong.telefone, ong.cnpj, ong.endereco, ong.cidade, ong.estado, ong.cep, ong.descricao]
    );

    const ongId = result.rows[0].ong_id;
    client.release();

    console.log('ONG cadastrada com sucesso! ID:', ongId);
    return { sucesso: true, id: ongId };
  } catch (error) {
    console.error('Erro ao cadastrar ONG:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função genérica para executar queries
export const query = async (text, params) => {
  try {
    console.log('Executando query no PostgreSQL:', text, params);
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};
