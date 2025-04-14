
/**
 * Conexão com o banco de dados PostgreSQL
 */
import pg from 'pg';
const { Pool } = pg;

// Configuração para conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'quatro_patas',
  password: 'admin',
  port: 5432,
});

// Função para testar a conexão
export const testarConexao = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as agora');
    const agora = result.rows[0].agora;
    client.release();
    
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
    console.log('Hora do servidor:', agora);
    return { sucesso: true, dados: { agora } };
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para inserir um tutor
export const inserirTutor = async (tutor) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO tutores (nome, email, senha, telefone, cpf, endereco, cidade, estado, cep)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING tutor_id as id
    `;
    
    const values = [
      tutor.nome,
      tutor.email,
      tutor.senha, // Em produção, deve-se usar hash da senha
      tutor.telefone,
      tutor.cpf,
      tutor.endereco,
      tutor.cidade,
      tutor.estado,
      tutor.cep
    ];
    
    const result = await client.query(query, values);
    await client.query('COMMIT');
    
    const tutorId = result.rows[0].id;
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

// Função para inserir um pet
export const inserirPet = async (pet, tutorId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO pets (tutor_id, nome, especie, raca, idade, sexo, peso)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING pet_id as id
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
    
    const petId = result.rows[0].id;
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

// Função para inserir uma ONG
export const inserirOng = async (ong) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO ongs (nome, email, senha, telefone, cnpj, endereco, cidade, estado, cep, descricao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING ong_id as id
    `;
    
    const values = [
      ong.nome,
      ong.email,
      ong.senha, // Em produção, deve-se usar hash da senha
      ong.telefone,
      ong.cnpj,
      ong.endereco,
      ong.cidade,
      ong.estado,
      ong.cep,
      ong.descricao || ''
    ];
    
    const result = await client.query(query, values);
    await client.query('COMMIT');
    
    const ongId = result.rows[0].id;
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

// Função genérica para executar consultas SQL
export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Mantém o mock storage para compatibilidade com código existente
// Pode ser removido quando o código for totalmente migrado
const mockStorage = {
  tutores: [],
  pets: [],
  ongs: []
};


export const getMockStorage = () => {
  return mockStorage;
};
