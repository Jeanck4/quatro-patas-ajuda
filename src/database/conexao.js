
/**
 * PostgreSQL database connection module
 */

import { Pool } from 'pg';

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

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
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Implementação mock para ambiente de desenvolvimento em navegador
// Isso é um fallback para quando o pg não consegue se conectar ao banco
const mockImplementation = () => {
  console.warn('Usando implementação mock do banco de dados com localStorage');
  
  // Mock database implementation for browser environment
  const mockDb = {
    tutores: [],
    pets: [],
    ongs: []
  };

  // Helper function to load data from localStorage
  const loadData = () => {
    try {
      const tutores = JSON.parse(localStorage.getItem('tutores') || '[]');
      const pets = JSON.parse(localStorage.getItem('pets') || '[]');
      const ongs = JSON.parse(localStorage.getItem('ongs') || '[]');
      return { tutores, pets, ongs };
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return { tutores: [], pets: [], ongs: [] };
    }
  };

  // Helper function to save data to localStorage
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Initialize localStorage if not present
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

  // Initialize storage
  initializeStorage();
  
  // Override functions with mock implementations
  const originalTestarConexao = testarConexao;
  const originalInserirTutor = inserirTutor;
  const originalInserirPet = inserirPet;
  const originalInserirOng = inserirOng;
  const originalQuery = query;

  // Mock test connection
  window.testarConexao = async () => {
    try {
      const result = await originalTestarConexao();
      return result;
    } catch (error) {
      console.warn('Usando mock de conexão');
      const agora = new Date().toISOString();
      return { sucesso: true, dados: { agora } };
    }
  };

  // Mock insert tutor
  window.inserirTutor = async (tutor) => {
    try {
      const result = await originalInserirTutor(tutor);
      return result;
    } catch (error) {
      console.warn('Usando mock de inserção de tutor');
      const { tutores } = loadData();
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
      saveData('tutores', tutores);
      
      console.log('Tutor cadastrado com sucesso (mock)! ID:', tutorId);
      return { sucesso: true, id: tutorId };
    }
  };

  // Mock insert pet
  window.inserirPet = async (pet, tutorId) => {
    try {
      const result = await originalInserirPet(pet, tutorId);
      return result;
    } catch (error) {
      console.warn('Usando mock de inserção de pet');
      const { pets } = loadData();
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
      saveData('pets', pets);
      
      console.log('Pet cadastrado com sucesso (mock)! ID:', petId);
      return { sucesso: true, id: petId };
    }
  };

  // Mock insert ONG
  window.inserirOng = async (ong) => {
    try {
      const result = await originalInserirOng(ong);
      return result;
    } catch (error) {
      console.warn('Usando mock de inserção de ONG');
      const { ongs } = loadData();
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
      saveData('ongs', ongs);
      
      console.log('ONG cadastrada com sucesso (mock)! ID:', ongId);
      return { sucesso: true, id: ongId };
    }
  };

  // Mock query
  window.query = async (text, params) => {
    try {
      const result = await originalQuery(text, params);
      return result;
    } catch (error) {
      console.warn('Usando mock de query');
      console.log('Mock query executed with:', { text, params });
      return { rows: [] };
    }
  };

  // For convenience, export a function to get the current mock storage state
  window.getMockStorage = () => {
    return loadData();
  };
};

// Se estamos rodando no navegador, nem tentamos usar pg
if (typeof window !== 'undefined') {
  mockImplementation();
}
