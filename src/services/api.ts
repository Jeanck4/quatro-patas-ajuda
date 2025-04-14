
/**
 * API service for making requests to our backend server
 */

const API_URL = 'http://localhost:3001/api';

// Interface para as respostas da API
interface ApiResponse<T> {
  sucesso: boolean;
  id?: string;
  erro?: string;
  dados?: T;
}

// Funções para consumir a API do backend

/**
 * Testa a conexão com o servidor e banco de dados
 */
export const testarConexao = async (): Promise<ApiResponse<{agora: string}>> => {
  try {
    const response = await fetch(`${API_URL}/teste-conexao`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro desconhecido ao conectar ao servidor' 
    };
  }
};

/**
 * Insere um tutor no banco de dados
 */
export const inserirTutor = async (tutor: any): Promise<ApiResponse<never>> => {
  try {
    const response = await fetch(`${API_URL}/tutores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tutor),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao inserir tutor:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao salvar dados do tutor' 
    };
  }
};

/**
 * Insere um pet no banco de dados
 */
export const inserirPet = async (pet: any, tutorId: string): Promise<ApiResponse<never>> => {
  try {
    const response = await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pet, tutorId }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao inserir pet:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao salvar dados do pet' 
    };
  }
};

/**
 * Insere uma ONG no banco de dados
 */
export const inserirOng = async (ong: any): Promise<ApiResponse<never>> => {
  try {
    const response = await fetch(`${API_URL}/ongs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ong),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao inserir ONG:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao salvar dados da ONG' 
    };
  }
};

/**
 * Realiza login de tutores
 */
export const loginTutor = async (email: string, senha: string): Promise<ApiResponse<{tutor: any}>> => {
  try {
    const response = await fetch(`${API_URL}/login/tutor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao fazer login como tutor:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao fazer login' 
    };
  }
};

/**
 * Realiza login de ONGs
 */
export const loginOng = async (email: string, senha: string): Promise<ApiResponse<{ong: any}>> => {
  try {
    const response = await fetch(`${API_URL}/login/ong`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao fazer login como ONG:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao fazer login' 
    };
  }
};

/**
 * Busca os pets de um tutor
 */
export const buscarPetsTutor = async (tutorId: string): Promise<ApiResponse<{pets: any[]}>> => {
  try {
    const response = await fetch(`${API_URL}/tutores/${tutorId}/pets`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao buscar pets' 
    };
  }
};

/**
 * Busca todas as ONGs cadastradas
 */
export const buscarOngs = async (): Promise<ApiResponse<{ongs: any[]}>> => {
  try {
    const response = await fetch(`${API_URL}/ongs`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar ONGs:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao buscar ONGs' 
    };
  }
};
