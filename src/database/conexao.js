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

// Função para inserir uma organização
export const inserirOrganizacao = async (org) => {
  try {
    console.log('Inserindo Organização no PostgreSQL:', org);
    const client = await pool.connect();

    const result = await client.query(
      `INSERT INTO organizacoes (
        nome, email, senha, telefone, cnpj, endereco, cidade, estado, cep, descricao,
        data_disponivel, hora_inicio, hora_fim, vagas_disponiveis
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING organizacao_id`,
      [
        org.nome, org.email, org.senha, org.telefone, org.cnpj, org.endereco, 
        org.cidade, org.estado, org.cep, org.descricao || '', 
        org.data_disponivel || null, org.hora_inicio || null, 
        org.hora_fim || null, org.vagas_disponiveis || 0
      ]
    );

    const organizacaoId = result.rows[0].organizacao_id;
    client.release();

    console.log('Organização cadastrada com sucesso! ID:', organizacaoId);
    return { sucesso: true, id: organizacaoId };
  } catch (error) {
    console.error('Erro ao cadastrar organização:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para inserir um mutirão
export const inserirMutirao = async (mutirao) => {
  try {
    console.log('Inserindo mutirão no PostgreSQL:', mutirao);
    const client = await pool.connect();
    
    if (!mutirao.organizacao_id) {
      client.release();
      return { sucesso: false, erro: 'ID da organização não fornecido' };
    }
    
    const result = await client.query(
      `INSERT INTO mutiroes (
        organizacao_id, nome, data_mutirao, total_vagas, vagas_disponiveis, 
        endereco, cidade, estado, informacoes_adicionais
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING mutirao_id`,
      [
        mutirao.organizacao_id,
        mutirao.nome,
        mutirao.data_mutirao, 
        mutirao.total_vagas, 
        mutirao.vagas_disponiveis,
        mutirao.endereco,
        mutirao.cidade,
        mutirao.estado,
        mutirao.informacoes_adicionais || ''
      ]
    );

    const mutiraoId = result.rows[0].mutirao_id;
    client.release();

    console.log('Mutirão cadastrado com sucesso! ID:', mutiraoId);
    return { sucesso: true, id: mutiraoId };
  } catch (error) {
    console.error('Erro ao cadastrar mutirão:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para buscar mutirões disponíveis
export const buscarMutiroes = async () => {
  try {
    console.log('Buscando mutirões disponíveis...');
    const client = await pool.connect();

    // Verificamos se conseguimos estabelecer a conexão
    if (!client) {
      throw new Error('Não foi possível conectar ao banco de dados');
    }

    // Correção na consulta SQL - usando organizacao_id em vez de uma coluna inexistente
    const result = await client.query(
      `SELECT m.*, org.nome as nome_organizacao 
       FROM mutiroes m 
       LEFT JOIN organizacoes org ON m.organizacao_id = org.organizacao_id
       ORDER BY m.data_mutirao ASC`
    );

    console.log(`Mutirões encontrados: ${result.rows.length}`);
    
    if (result.rows.length === 0) {
      console.log('Nenhum mutirão encontrado na consulta');
    } else {
      console.log('Primeiro mutirão:', JSON.stringify(result.rows[0]));
    }

    client.release();
    return { sucesso: true, dados: { mutiroes: result.rows } };
  } catch (error) {
    console.error('Erro ao buscar mutirões:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para buscar agendamentos de um tutor
export const buscarAgendamentosTutor = async (tutorId) => {
  try {
    console.log('Buscando agendamentos do tutor ID:', tutorId);
    const client = await pool.connect();

    const result = await client.query(
      `SELECT a.*, 
              p.nome as nome_pet,
              m.data_mutirao,
              org.nome as nome_organizacao,
              org.endereco as endereco_organizacao,
              org.cidade as cidade_organizacao,
              org.estado as estado_organizacao
       FROM agendamentos a
       JOIN pets p ON a.pet_id = p.pet_id
       JOIN mutiroes m ON a.mutirao_id = m.mutirao_id
       JOIN organizacoes org ON m.organizacao_id = org.organizacao_id
       WHERE a.tutor_id = $1
       ORDER BY m.data_mutirao DESC`,
      [tutorId]
    );

    client.release();
    return { sucesso: true, dados: { agendamentos: result.rows } };
  } catch (error) {
    console.error('Erro ao buscar agendamentos do tutor:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Função para buscar mutirões de uma organização
export const buscarMutiroesPorOrganizacao = async (organizacaoId) => {
  try {
    console.log(`Buscando mutirões da organização ${organizacaoId}...`);
    
    // Verificando se ID da organização foi fornecido
    if (!organizacaoId) {
      return { sucesso: false, erro: 'ID da organização não fornecido' };
    }
    
    const client = await pool.connect();
    
    // Correção na consulta SQL - usando organizacao_id em vez de uma coluna inexistente
    const result = await client.query(
      `SELECT m.*, 
              org.nome as nome_organizacao
       FROM mutiroes m
       JOIN organizacoes org ON m.organizacao_id = org.organizacao_id
       WHERE m.organizacao_id = $1
       ORDER BY m.data_mutirao DESC`,
      [organizacaoId]
    );
    
    console.log(`Encontrados ${result.rows.length} mutirões para organização ${organizacaoId}`);
    client.release();
    
    return { sucesso: true, dados: { mutiroes: result.rows } };
  } catch (error) {
    console.error('Erro ao buscar mutirões da organização:', error);
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

// Aliases para compatibilidade com código existente
export const isServerOnline = testarConexao;
export const buscarMutiroesOrganizacao = buscarMutiroesPorOrganizacao;

// Adicionando funções que estavam faltando para compatibilidade com outros arquivos
export const inserirOng = async (ongData) => {
  console.log('Redirecionando para inserirOrganizacao, função inserirOng está obsoleta');
  return inserirOrganizacao(ongData);
};

export const buscarOngs = async () => {
  try {
    console.log('Buscando todas as organizações...');
    const client = await pool.connect();
    
    const result = await client.query(
      `SELECT organizacao_id, nome, email, telefone, endereco, cidade, estado, 
              cep, descricao, data_disponivel, hora_inicio, hora_fim, vagas_disponiveis 
       FROM organizacoes
       ORDER BY nome ASC`
    );
    
    client.release();
    return { sucesso: true, dados: { organizacoes: result.rows } };
  } catch (error) {
    console.error('Erro ao buscar organizações:', error);
    return { sucesso: false, erro: error.message };
  }
};
