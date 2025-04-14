
/**
 * Mock database connection for browser environment
 * 
 * This module provides a browser-compatible mock of the PostgreSQL database functions.
 * It uses localStorage to persist data between page reloads.
 */

// Initialize localStorage storage with default empty arrays if they don't exist
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

// Function to test connection (mock)
export const testarConexao = async () => {
  try {
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const agora = new Date().toISOString();
    console.log('Mock conexão iniciada com sucesso!');
    console.log('Hora atual:', agora);
    return { sucesso: true, dados: { agora } };
  } catch (error) {
    console.error('Erro ao simular conexão:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Function to insert a tutor
export const inserirTutor = async (tutor) => {
  try {
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tutores = JSON.parse(localStorage.getItem('tutores') || '[]');
    
    // Generate a unique ID
    const tutorId = Date.now().toString();
    
    // Add tutor to storage
    const novoTutor = {
      ...tutor,
      tutor_id: tutorId
    };
    
    tutores.push(novoTutor);
    localStorage.setItem('tutores', JSON.stringify(tutores));
    
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
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const pets = JSON.parse(localStorage.getItem('pets') || '[]');
    
    // Generate a unique ID
    const petId = Date.now().toString();
    
    // Add pet to storage
    const novoPet = {
      ...pet,
      pet_id: petId,
      tutor_id: tutorId
    };
    
    pets.push(novoPet);
    localStorage.setItem('pets', JSON.stringify(pets));
    
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
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const ongs = JSON.parse(localStorage.getItem('ongs') || '[]');
    
    // Generate a unique ID
    const ongId = Date.now().toString();
    
    // Add ONG to storage
    const novaOng = {
      ...ong,
      ong_id: ongId
    };
    
    ongs.push(novaOng);
    localStorage.setItem('ongs', JSON.stringify(ongs));
    
    console.log('ONG cadastrada com sucesso! ID:', ongId);
    return { sucesso: true, id: ongId };
  } catch (error) {
    console.error('Erro ao cadastrar ONG:', error);
    return { sucesso: false, erro: error.message };
  }
};

// Generic query function (mock)
export const query = async (text, params) => {
  console.log('Mock query executed:', text, params);
  return { rows: [], rowCount: 0 };
};

// Export mock storage for compatibility
export const getMockStorage = () => {
  return {
    tutores: JSON.parse(localStorage.getItem('tutores') || '[]'),
    pets: JSON.parse(localStorage.getItem('pets') || '[]'),
    ongs: JSON.parse(localStorage.getItem('ongs') || '[]')
  };
};
