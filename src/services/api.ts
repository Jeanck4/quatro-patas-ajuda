
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
