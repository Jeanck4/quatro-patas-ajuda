
/**
 * Mock PostgreSQL database connection for browser environment
 * 
 * This file provides a browser-compatible version that mimics PostgreSQL functionality
 * by using localStorage for storage instead of an actual database connection.
 */

// Mock database implementation for browser environment
const mockDb = {
  tutores: [],
  pets: [],
  ongs: []
};

// Function to test connection - always returns success in mock mode
export const testarConexao = async () => {
  try {
    const agora = new Date().toISOString();
    
    console.log('Mock database connection initialized successfully!');
    console.log('Current time:', agora);
    
    return { sucesso: true, dados: { agora } };
  } catch (error) {
    console.error('Error connecting to mock database:', error);
    return { sucesso: false, erro: error.message };
  }
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

// Function to insert a tutor
export const inserirTutor = async (tutor) => {
  try {
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
    
    console.log('Tutor cadastrado com sucesso! ID:', tutorId);
    return { sucesso: true, id: tutorId };
  } catch (error) {
    console.error('Erro ao cadastrar tutor:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Function to insert a pet
export const inserirPet = async (pet, tutorId) => {
  try {
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
    
    console.log('Pet cadastrado com sucesso! ID:', petId);
    return { sucesso: true, id: petId };
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Function to insert an ONG
export const inserirOng = async (ong) => {
  try {
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
    
    console.log('ONG cadastrada com sucesso! ID:', ongId);
    return { sucesso: true, id: ongId };
  } catch (error) {
    console.error('Erro ao cadastrar ONG:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Function to query the database - provides a compatible API with the real version
export const query = async (text, params) => {
  try {
    console.log('Mock query executed with:', { text, params });
    return { rows: [] };
  } catch (error) {
    console.error('Error in mock query:', error);
    throw error;
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

// Initialize storage on module load
initializeStorage();

// For convenience, export a function to get the current mock storage state
export const getMockStorage = () => {
  return loadData();
};
