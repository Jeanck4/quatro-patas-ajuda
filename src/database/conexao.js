
/**
 * PostgreSQL database connection module
 * With browser fallback using localStorage
 */

// Browser detection - check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only import pg in Node.js environment
let Pool;
if (!isBrowser) {
  try {
    const pg = require('pg');
    Pool = pg.Pool;
  } catch (error) {
    console.warn('Failed to import pg module:', error);
  }
}

// Pool configuration - only used in Node.js environment
const poolConfig = !isBrowser ? {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
} : null;

// Pool instance - only created in Node.js environment
const pool = !isBrowser && Pool ? new Pool(poolConfig) : null;

// Função para testar conexão com o banco de dados
export const testarConexao = async () => {
  if (isBrowser) {
    console.warn('Usando mock de conexão em ambiente de navegador');
    const agora = new Date().toISOString();
    return { sucesso: true, dados: { agora } };
  }

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
  if (isBrowser) {
    console.warn('Usando mock de inserção de tutor em ambiente de navegador');
    const tutores = JSON.parse(localStorage.getItem('tutores') || '[]');
    const tutorId = Date.now().toString();
    
    const novoTutor = {
      tutor_id: tutorId,
      nome: tutor.nome,
      email: tutor.email,
      senha: tutor.senha,
      telefone: tutor.telefone,
      cpf: tutor.cpf,
      endereco: tutor.endereco,
      cidade: tutor.cidade,
      estado: tutor.estado,
      cep: tutor.cep
    };
    
    tutores.push(novoTutor);
    localStorage.setItem('tutores', JSON.stringify(tutores));
    
    console.log('Tutor cadastrado com sucesso (mock)! ID:', tutorId);
    return { sucesso: true, id: tutorId };
  }

  try {
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
  if (isBrowser) {
    console.warn('Usando mock de inserção de pet em ambiente de navegador');
    const pets = JSON.parse(localStorage.getItem('pets') || '[]');
    const petId = Date.now().toString();
    
    const novoPet = {
      pet_id: petId,
      tutor_id: tutorId,
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      idade: pet.idade,
      sexo: pet.sexo,
      peso: pet.peso
    };
    
    pets.push(novoPet);
    localStorage.setItem('pets', JSON.stringify(pets));
    
    console.log('Pet cadastrado com sucesso (mock)! ID:', petId);
    return { sucesso: true, id: petId };
  }

  try {
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
  if (isBrowser) {
    console.warn('Usando mock de inserção de ONG em ambiente de navegador');
    const ongs = JSON.parse(localStorage.getItem('ongs') || '[]');
    const ongId = Date.now().toString();
    
    const novaOng = {
      ong_id: ongId,
      nome: ong.nome,
      email: ong.email,
      senha: ong.senha,
      telefone: ong.telefone,
      cnpj: ong.cnpj,
      endereco: ong.endereco,
      cidade: ong.cidade,
      estado: ong.estado,
      cep: ong.cep,
      descricao: ong.descricao
    };
    
    ongs.push(novaOng);
    localStorage.setItem('ongs', JSON.stringify(ongs));
    
    console.log('ONG cadastrada com sucesso (mock)! ID:', ongId);
    return { sucesso: true, id: ongId };
  }

  try {
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
  if (isBrowser) {
    console.warn('Usando mock de query em ambiente de navegador');
    console.log('Mock query executed with:', { text, params });
    return { rows: [] };
  }

  try {
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Initialize localStorage if in browser environment
if (isBrowser) {
  if (!localStorage.getItem('tutores')) {
    localStorage.setItem('tutores', JSON.stringify([]));
  }
  if (!localStorage.getItem('pets')) {
    localStorage.setItem('pets', JSON.stringify([]));
  }
  if (!localStorage.getItem('ongs')) {
    localStorage.setItem('ongs', JSON.stringify([]));
  }
}

// For convenience, export a function to get the current mock storage state (browser only)
export const getMockStorage = () => {
  if (isBrowser) {
    return {
      tutores: JSON.parse(localStorage.getItem('tutores') || '[]'),
      pets: JSON.parse(localStorage.getItem('pets') || '[]'),
      ongs: JSON.parse(localStorage.getItem('ongs') || '[]')
    };
  }
  return null;
};
