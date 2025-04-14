/**
 * PostgreSQL database connection
 */

import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'quatro_patas',
  password: 'admin',
  port: 5432,
});

// Function to test connection
export const testarConexao = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    const agora = result.rows[0].now;
    
    console.log('Conexão com banco de dados iniciada com sucesso!');
    console.log('Hora atual do banco:', agora);
    
    client.release();
    return { sucesso: true, dados: { agora } };
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Function to insert a tutor in the actual database
export const inserirTutor = async (tutor) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO tutores 
      (nome, email, senha, telefone, cpf, endereco, cidade, estado, cep)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING tutor_id
    `;
    
    const values = [
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
    
    const result = await client.query(query, values);
    await client.query('COMMIT');
    
    const tutorId = result.rows[0].tutor_id;
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

// Function to insert a pet in the actual database
export const inserirPet = async (pet, tutorId) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO pets 
      (tutor_id, nome, especie, raca, idade, sexo, peso)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING pet_id
    `;
    
    const values = [
      tutorId,
      pet.nome,
      pet.especie,
      pet.raca,
      pet.idade,
      pet.sexo,
      pet.peso
    ];
    
    const result = await client.query(query, values);
    await client.query('COMMIT');
    
    const petId = result.rows[0].pet_id;
    console.log('Pet cadastrado com sucesso! ID:', petId);
    
    return { sucesso: true, id: petId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao cadastrar pet:', error);
    return { sucesso: false, erro: error.message };
  } finally {
    client.release();
  }
};

// Function to insert an ONG in the actual database
export const inserirOng = async (ong) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO ongs 
      (nome, email, senha, telefone, cnpj, endereco, cidade, estado, cep, descricao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING ong_id
    `;
    
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
    
    const result = await client.query(query, values);
    await client.query('COMMIT');
    
    const ongId = result.rows[0].ong_id;
    console.log('ONG cadastrada com sucesso! ID:', ongId);
    
    return { sucesso: true, id: ongId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao cadastrar ONG:', error);
    return { sucesso: false, erro: error.message };
  } finally {
    client.release();
  }
};

// Function to query the database
export const query = async (text, params) => {
  try {
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    return result;
  } catch (error) {
    console.error('Erro na consulta:', error);
    throw error;
  }
};

// For browser compatibility, we'll keep a mock storage function
// This will be used as fallback if the database connection fails
export const getMockStorage = () => {
  return {
    tutores: JSON.parse(localStorage.getItem('tutores') || '[]'),
    pets: JSON.parse(localStorage.getItem('pets') || '[]'),
    ongs: JSON.parse(localStorage.getItem('ongs') || '[]')
  };
};

// Initialize localStorage as backup
const initializeStorage = () => {
  if (!localStorage.getItem('tutores')) {
    localStorage.setItem('tutores', JSON.stringify([]));
  }
  if (!localStorage.getItem('pets')) {
    localStorage.setItem('pets', JSON.stringify([]));
  }
  if (!localStorage.getItem('ongs')) {
    localStorage.setItem('ongs', JSON.stringify([]));
  }
};

initializeStorage();
