
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// URL base da API
const API_URL = 'http://localhost:3001/api';

// Função para verificar se o servidor está online
export const testarConexao = async () => {
  try {
    const response = await fetch(`${API_URL}/teste-conexao`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        sucesso: true,
        dados: data
      };
    }
    
    return {
      sucesso: false,
      erro: 'Servidor indisponível'
    };
  } catch (error) {
    console.error('Erro ao verificar status do servidor:', error);
    return {
      sucesso: false,
      erro: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Alias para compatibilidade com código existente
export const isServerOnline = testarConexao;

// Função para formatar a data
export const formatDate = (date: Date | null): string => {
  if (!date) return 'Data não informada';
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

// Função para cadastrar tutor
export const inserirTutor = async (tutorData: any) => {
  try {
    const response = await fetch(`${API_URL}/tutores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tutorData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao cadastrar tutor');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao cadastrar tutor:', error);
    throw error;
  }
};

// Função para cadastrar pet
export const inserirPet = async (petData: any, tutorId: string) => {
  try {
    const response = await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pet: petData, tutorId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao cadastrar pet');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao cadastrar pet:', error);
    throw error;
  }
};

// Função para cadastrar organização
export const inserirOrganizacao = async (organizacaoData: any) => {
  try {
    const response = await fetch(`${API_URL}/organizacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(organizacaoData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao cadastrar organização');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao cadastrar organização:', error);
    throw error;
  }
};

// Função para inserir mutirão
export const inserirMutirao = async (mutiraoData: any) => {
  try {
    console.log("Enviando dados de mutirão para cadastro:", mutiraoData);
    
    // Make sure organizacao_id is included in the request
    if (!mutiraoData.organizacao_id) {
      throw new Error('ID da organização não fornecido');
    }
    
    const response = await fetch(`${API_URL}/mutiroes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mutiraoData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao cadastrar mutirão');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao cadastrar mutirão:', error);
    throw error;
  }
};

// Função para buscar mutirões
export const buscarMutiroes = async () => {
  try {
    const response = await fetch(`${API_URL}/mutiroes`);
    if (!response.ok) {
      throw new Error('Erro ao buscar mutirões');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao buscar mutirões:', error);
    throw error;
  }
};

// Função para buscar mutirões de uma organização
export const buscarMutiroesPorOrganizacao = async (organizacaoId: string) => {
  try {
    const response = await fetch(`${API_URL}/organizacoes/${organizacaoId}/mutiroes`);
    if (!response.ok) {
      throw new Error('Erro ao buscar mutirões da organização');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao buscar mutirões da organização:', error);
    throw error;
  }
};

// Alias para compatibilidade com código existente
export const buscarMutiroesOrganizacao = buscarMutiroesPorOrganizacao;

// Função para buscar agendamentos do tutor
export const buscarAgendamentosTutor = async (tutorId: string) => {
  try {
    const response = await fetch(`${API_URL}/tutores/${tutorId}/agendamentos`);
    if (!response.ok) {
      throw new Error('Erro ao buscar agendamentos do tutor');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos do tutor:', error);
    throw error;
  }
};

// Função para criar agendamento
export const criarAgendamento = async (agendamentoData: any) => {
  try {
    const response = await fetch(`${API_URL}/agendamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agendamentoData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao criar agendamento');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

// Função para realizar login do tutor
export const loginTutor = async (email: string, senha: string) => {
  try {
    const response = await fetch(`${API_URL}/login/tutor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao realizar login');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao realizar login:', error);
    throw error;
  }
};

// Função para realizar login da organização
export const loginOrganizacao = async (email: string, senha: string) => {
  try {
    const response = await fetch(`${API_URL}/login/organizacao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao realizar login');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao realizar login:', error);
    throw error;
  }
};

// Função para buscar pets do tutor
export const buscarPetsDoTutor = async (tutorId: string) => {
  try {
    const response = await fetch(`${API_URL}/tutores/${tutorId}/pets`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pets do tutor');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao buscar pets do tutor:', error);
    throw error;
  }
};

// Alias para compatibilidade com código existente
export const buscarPetsTutor = buscarPetsDoTutor;

// Função para atualizar pet
export const atualizarPet = async (petId: string, petData: any) => {
  try {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(petData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao atualizar pet');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao atualizar pet:', error);
    throw error;
  }
};

// Função para deletar pet
export const deletarPet = async (petId: string) => {
  try {
    const response = await fetch(`${API_URL}/pets/${petId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro ao deletar pet');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao deletar pet:', error);
    throw error;
  }
};

// Alias para compatibilidade com código existente
export const removerPet = deletarPet;

// Função para buscar todas as organizações
export const buscarOrganizacoes = async () => {
  try {
    const response = await fetch(`${API_URL}/organizacoes`);
    if (!response.ok) {
      throw new Error('Erro ao buscar organizações');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao buscar organizações:', error);
    throw error;
  }
};
