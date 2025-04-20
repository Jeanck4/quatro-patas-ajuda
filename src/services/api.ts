
/**
 * API service for making requests to our backend server
 */

const API_URL = 'http://localhost:3001/api';

// Interface para as respostas da API
interface ApiResponse<T = any> {
  sucesso: boolean;
  id?: string;
  erro?: string;
  dados?: T;
}

// Estado de conexão para evitar múltiplas tentativas quando o servidor está offline
let serverOnline: boolean | null = null;
let lastCheck: number = 0;
const CHECK_INTERVAL = 5000; // 5 segundos entre verificações

/**
 * Verifica se o servidor está online
 */
export const isServerOnline = async (): Promise<boolean> => {
  const now = Date.now();
  
  // Se já verificamos recentemente, retorna o último estado conhecido
  if (serverOnline !== null && (now - lastCheck) < CHECK_INTERVAL) {
    return serverOnline;
  }
  
  try {
    console.log('Verificando conexão com o servidor...');
    const response = await fetch(`${API_URL}/teste-conexao`, { 
      signal: AbortSignal.timeout(3000) // timeout de 3 segundos
    });
    const data = await response.json();
    
    serverOnline = data.sucesso === true;
    lastCheck = now;
    console.log('Status do servidor:', serverOnline ? 'Online' : 'Offline');
    return serverOnline;
  } catch (error) {
    console.error('Erro ao verificar conexão com servidor:', error);
    serverOnline = false;
    lastCheck = now;
    return false;
  }
};

/**
 * Testa a conexão com o servidor e banco de dados
 */
export const testarConexao = async (): Promise<ApiResponse<{agora: string}>> => {
  try {
    const response = await fetch(`${API_URL}/teste-conexao`);
    const data = await response.json();
    
    // Atualiza o estado de conexão
    serverOnline = data.sucesso === true;
    lastCheck = Date.now();
    
    return data;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    
    // Atualiza o estado de conexão
    serverOnline = false;
    lastCheck = Date.now();
    
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
 * Insere uma organização no banco de dados
 */
export const inserirOrganizacao = async (organizacao: any): Promise<ApiResponse<never>> => {
  try {
    const response = await fetch(`${API_URL}/organizacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organizacao),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao inserir organização:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao salvar dados da organização' 
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
 * Insere um mutirão no banco de dados
 */
export const inserirMutirao = async (mutirao: any): Promise<ApiResponse<never>> => {
  try {
    // Verificar se o servidor está online antes de fazer a requisição
    if (!(await isServerOnline())) {
      return {
        sucesso: false,
        erro: 'Servidor offline. Verifique se o servidor backend está rodando.'
      };
    }

    console.log('Enviando dados de mutirão para cadastro:', mutirao);
    
    const response = await fetch(`${API_URL}/mutiroes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mutirao),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP: ${response.status}. Detalhes:`, errorText);
      return { 
        sucesso: false, 
        erro: `Erro HTTP ${response.status}: ${errorText || 'Sem detalhes'}`
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao inserir mutirão:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao salvar dados do mutirão' 
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
 * Realiza login de organizações
 */
export const loginOrganizacao = async (email: string, senha: string): Promise<ApiResponse<{organizacao: any}>> => {
  try {
    const response = await fetch(`${API_URL}/login/organizacao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao fazer login como organização:', error);
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
    console.log(`Fetching pets for tutor ${tutorId} from ${API_URL}/tutores/${tutorId}/pets`);
    const response = await fetch(`${API_URL}/tutores/${tutorId}/pets`);
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      return {
        sucesso: false,
        erro: `Erro na API: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log("API response data:", data);
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
 * Atualiza um pet
 */
export const atualizarPet = async (petId: string, pet: any): Promise<ApiResponse<any>> => {
  try {
    console.log(`Updating pet ${petId} with data:`, pet);
    const response = await fetch(`${API_URL}/pets/${petId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pet),
    });
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      return {
        sucesso: false,
        erro: `Erro na API: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log("API update response:", data);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao atualizar pet' 
    };
  }
};

/**
 * Remove um pet
 */
export const removerPet = async (petId: string): Promise<ApiResponse<any>> => {
  try {
    console.log(`Removing pet ${petId}`);
    const response = await fetch(`${API_URL}/pets/${petId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      return {
        sucesso: false,
        erro: `Erro na API: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log("API delete response:", data);
    return data;
  } catch (error) {
    console.error('Erro ao remover pet:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao remover pet' 
    };
  }
};

/**
 * Busca todas as ONGs cadastradas
 */
export const buscarOngs = async (): Promise<ApiResponse<{ongs: any[]}>> => {
  try {
    console.log('Buscando ONGs do banco de dados...');
    const response = await fetch(`${API_URL}/ongs`);
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      return {
        sucesso: false,
        erro: `Erro na API: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log('ONGs encontradas:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar ONGs:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao buscar ONGs' 
    };
  }
};

/**
 * Busca as ONGs de uma organização específica
 */
export const buscarOngsOrganizacao = async (organizacaoId: string): Promise<ApiResponse<{ongs: any[]}>> => {
  try {
    console.log(`Buscando ONGs da organização ${organizacaoId}...`);
    const response = await fetch(`${API_URL}/organizacoes/${organizacaoId}/ongs`);
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      return {
        sucesso: false,
        erro: `Erro na API: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log(`ONGs da organização ${organizacaoId} encontradas:`, data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar ONGs da organização:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao buscar ONGs da organização' 
    };
  }
};

/**
 * Busca os agendamentos de um tutor
 */
export const buscarAgendamentosTutor = async (tutorId: string): Promise<ApiResponse<{agendamentos: any[]}>> => {
  try {
    console.log(`Buscando agendamentos para tutor ${tutorId}...`);
    const response = await fetch(`${API_URL}/tutores/${tutorId}/agendamentos`);
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      return {
        sucesso: false,
        erro: `Erro na API: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log('Agendamentos encontrados:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao buscar agendamentos' 
    };
  }
};

/**
 * Busca todos os mutirões disponíveis
 */
export const buscarMutiroes = async (): Promise<ApiResponse<{mutiroes: any[]}>> => {
  try {
    // Verificar se o servidor está online antes de fazer a requisição
    if (!(await isServerOnline())) {
      console.log('Servidor offline. Não é possível buscar mutirões.');
      return {
        sucesso: false,
        erro: 'Servidor offline. Verifique se o servidor backend está rodando.'
      };
    }
    
    console.log('Buscando mutirões disponíveis...');
    const response = await fetch(`${API_URL}/mutiroes`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP: ${response.status}. Detalhes:`, errorText);
      return {
        sucesso: false,
        erro: `Erro HTTP ${response.status}: ${errorText || response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log('Resposta da API de mutirões:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar mutirões:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao buscar mutirões' 
    };
  }
};

/**
 * Busca os mutirões de uma organização específica
 */
export const buscarMutiroesOrganizacao = async (organizacaoId: string): Promise<ApiResponse<{mutiroes: any[]}>> => {
  try {
    // Verificar se o servidor está online antes de fazer a requisição
    if (!(await isServerOnline())) {
      console.log('Servidor offline. Não é possível buscar mutirões da organização.');
      return {
        sucesso: false,
        erro: 'Servidor offline. Verifique se o servidor backend está rodando.'
      };
    }
    
    console.log(`Buscando mutirões da organização ${organizacaoId}...`);
    const response = await fetch(`${API_URL}/organizacoes/${organizacaoId}/mutiroes`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro HTTP: ${response.status}. Detalhes:`, errorText);
      return {
        sucesso: false,
        erro: `Erro HTTP ${response.status}: ${errorText || response.statusText}`
      };
    }
    
    const data = await response.json();
    console.log(`Mutirões da organização ${organizacaoId}:`, data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar mutirões da organização:', error);
    return { 
      sucesso: false, 
      erro: error instanceof Error ? error.message : 'Erro ao buscar mutirões da organização' 
    };
  }
};

// The following functions are deprecated and should be replaced with the ones above
export const getPets = buscarPetsTutor;
export const updatePet = atualizarPet;
export const removePet = removerPet;
