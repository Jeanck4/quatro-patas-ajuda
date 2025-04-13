
/**
 * Mock da conexão com o banco de dados PostgreSQL para ambiente de frontend
 * 
 * Esta versão simula as operações de banco de dados para desenvolvimento frontend.
 * Em produção, estas chamadas seriam substituídas por requisições a uma API backend.
 */

// Mock de dados para simular o armazenamento
const mockStorage = {
  tutores: [],
  pets: [],
  ongs: []
};

// Simula a função para testar a conexão
export const testarConexao = async () => {
  try {
    // Simula uma consulta bem-sucedida
    const agora = new Date().toISOString();
    console.log('Conexão com o PostgreSQL (simulada) estabelecida com sucesso!');
    console.log('Hora do servidor (simulada):', agora);
    return { sucesso: true, dados: { agora } };
  } catch (error) {
    console.error('Erro ao conectar (simulado):', error);
    return { sucesso: false, erro: error.message };
  }
};

// Simula a função para inserir um tutor
export const inserirTutor = async (tutor) => {
  try {
    // Gera um ID único
    const tutorId = Date.now().toString();
    const novoTutor = { ...tutor, id: tutorId };
    
    // Armazena no mock de dados
    mockStorage.tutores.push(novoTutor);
    
    console.log('Tutor cadastrado com sucesso! ID:', tutorId);
    return { sucesso: true, id: tutorId };
  } catch (error) {
    console.error('Erro ao cadastrar tutor (simulado):', error);
    return { sucesso: false, erro: error.message };
  }
};

// Simula a função para inserir um pet
export const inserirPet = async (pet, tutorId) => {
  try {
    const petId = Date.now().toString();
    const novoPet = { ...pet, id: petId, tutor_id: tutorId };
    
    mockStorage.pets.push(novoPet);
    
    console.log('Pet cadastrado com sucesso! ID:', petId);
    return { sucesso: true, id: petId };
  } catch (error) {
    console.error('Erro ao cadastrar pet (simulado):', error);
    return { sucesso: false, erro: error.message };
  }
};

// Simula a função para inserir uma ONG
export const inserirOng = async (ong) => {
  try {
    const ongId = Date.now().toString();
    const novaOng = { ...ong, id: ongId };
    
    mockStorage.ongs.push(novaOng);
    
    console.log('ONG cadastrada com sucesso! ID:', ongId);
    return { sucesso: true, id: ongId };
  } catch (error) {
    console.error('Erro ao cadastrar ONG (simulada):', error);
    return { sucesso: false, erro: error.message };
  }
};

// Simula uma função de consulta genérica
export const query = async (text, params) => {
  console.log('Consulta simulada:', text, params);
  return { rows: [], rowCount: 0 };
};

// Função para obter os dados mock (para depuração)
export const getMockStorage = () => {
  return mockStorage;
};
