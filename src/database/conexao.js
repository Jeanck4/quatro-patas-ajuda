
/**
 * PostgreSQL database connection module
 * With browser fallback using localStorage
 */

// Browser detection - check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof process === 'undefined';

// Only import pg in Node.js environment
let Pool;
if (!isBrowser) {
  try {
    const pg = require('pg');
    Pool = pg.Pool;
    console.log("PostgreSQL module loaded successfully");
  } catch (error) {
    console.error('Failed to import pg module:', error);
  }
}

// Pool configuration - only used in Node.js environment
const poolConfig = !isBrowser ? {
  user: 'postgres',
  host: 'localhost',
  database: 'quatro_patas',
  password: 'admin',
  port: 5432,
} : null;

// Pool instance - only created in Node.js environment
let pool;
if (!isBrowser && Pool) {
  pool = new Pool(poolConfig);
  console.log("PostgreSQL pool created with config:", poolConfig);
}

// Função para testar conexão com o banco de dados
export const testarConexao = async () => {
  if (isBrowser) {
    console.warn('Usando mock de conexão em ambiente de navegador');
    const agora = new Date().toISOString();
    return { sucesso: true, dados: { agora }, ambiente: 'browser' };
  }

  try {
    console.log("Attempting to connect to PostgreSQL...");
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as agora');
    const agora = result.rows[0].agora;
    
    console.log('Database connection initialized successfully!');
    console.log('Current time from database:', agora);
    
    client.release();
    return { sucesso: true, dados: { agora }, ambiente: 'servidor' };
  } catch (error) {
    console.error('Error connecting to database:', error);
    return { sucesso: false, erro: error.message, ambiente: 'servidor' };
  }
};

// Função para inserir um tutor
export const inserirTutor = async (tutor) => {
  console.log("Ambiente de execução:", isBrowser ? "browser" : "servidor");
  
  if (isBrowser) {
    console.warn('AVISO: Executando em ambiente de navegador - os dados não serão salvos no PostgreSQL');
    console.warn('Use esta aplicação em um ambiente de servidor para salvar no banco PostgreSQL');
    
    // Simulação de inserção para ambiente de navegador
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
    
    console.log('Mock: Tutor cadastrado com ID:', tutorId);
    return { sucesso: true, id: tutorId, ambiente: 'browser' };
  }

  try {
    console.log("Tentando inserir tutor no PostgreSQL:", tutor);
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO tutores (nome, email, senha, telefone, cpf, endereco, cidade, estado, cep)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING tutor_id`,
      [tutor.nome, tutor.email, tutor.senha, tutor.telefone, tutor.cpf, tutor.endereco, tutor.cidade, tutor.estado, tutor.cep]
    );
    
    const tutorId = result.rows[0].tutor_id;
    client.release();
    
    console.log('PostgreSQL: Tutor cadastrado com ID:', tutorId);
    return { sucesso: true, id: tutorId, ambiente: 'servidor' };
  } catch (error) {
    console.error('Erro ao cadastrar tutor no PostgreSQL:', error);
    return { sucesso: false, erro: error.message, ambiente: 'servidor' };
  }
};

// Função para inserir um pet
export const inserirPet = async (pet, tutorId) => {
  console.log("Ambiente de execução para inserir pet:", isBrowser ? "browser" : "servidor");
  
  if (isBrowser) {
    console.warn('AVISO: Executando em ambiente de navegador - os dados não serão salvos no PostgreSQL');
    console.warn('Use esta aplicação em um ambiente de servidor para salvar no banco PostgreSQL');
    
    // Simulação de inserção para ambiente de navegador
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
    
    console.log('Mock: Pet cadastrado com ID:', petId);
    return { sucesso: true, id: petId, ambiente: 'browser' };
  }

  try {
    console.log("Tentando inserir pet no PostgreSQL:", pet, "para tutor ID:", tutorId);
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO pets (tutor_id, nome, especie, raca, idade, sexo, peso)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING pet_id`,
      [tutorId, pet.nome, pet.especie, pet.raca, pet.idade, pet.sexo, pet.peso]
    );
    
    const petId = result.rows[0].pet_id;
    client.release();
    
    console.log('PostgreSQL: Pet cadastrado com ID:', petId);
    return { sucesso: true, id: petId, ambiente: 'servidor' };
  } catch (error) {
    console.error('Erro ao cadastrar pet no PostgreSQL:', error);
    return { sucesso: false, erro: error.message, ambiente: 'servidor' };
  }
};

// Função para inserir uma ONG
export const inserirOng = async (ong) => {
  console.log("Ambiente de execução para inserir ONG:", isBrowser ? "browser" : "servidor");
  
  if (isBrowser) {
    console.warn('AVISO: Executando em ambiente de navegador - os dados não serão salvos no PostgreSQL');
    console.warn('Use esta aplicação em um ambiente de servidor para salvar no banco PostgreSQL');
    
    // Simulação de inserção para ambiente de navegador
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
    
    console.log('Mock: ONG cadastrada com ID:', ongId);
    return { sucesso: true, id: ongId, ambiente: 'browser' };
  }

  try {
    console.log("Tentando inserir ONG no PostgreSQL:", ong);
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO ongs (nome, email, senha, telefone, cnpj, endereco, cidade, estado, cep, descricao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ong_id`,
      [ong.nome, ong.email, ong.senha, ong.telefone, ong.cnpj, ong.endereco, ong.cidade, ong.estado, ong.cep, ong.descricao]
    );
    
    const ongId = result.rows[0].ong_id;
    client.release();
    
    console.log('PostgreSQL: ONG cadastrada com ID:', ongId);
    return { sucesso: true, id: ongId, ambiente: 'servidor' };
  } catch (error) {
    console.error('Erro ao cadastrar ONG no PostgreSQL:', error);
    return { sucesso: false, erro: error.message, ambiente: 'servidor' };
  }
};

// Função genérica para executar queries
export const query = async (text, params) => {
  if (isBrowser) {
    console.warn('AVISO: Tentativa de executar query SQL em ambiente de navegador');
    console.warn('Esta operação só funciona em ambiente de servidor');
    console.log('Mock query:', { text, params });
    return { rows: [], ambiente: 'browser' };
  }

  try {
    console.log("Executando query no PostgreSQL:", text, params);
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    return { ...result, ambiente: 'servidor' };
  } catch (error) {
    console.error('Erro ao executar query no PostgreSQL:', error);
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
