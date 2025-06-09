import express from 'express';
import cors from 'cors';
import { 
  inserirTutor, 
  inserirPet, 
  inserirOrganizacao, 
  testarConexao, 
  query,
  inserirMutirao,
  buscarMutiroes,
  buscarAgendamentosTutor,
  buscarMutiroesPorOrganizacao,
  pool
} from '../database/conexao.js';

/**
 * server.js
 * 
 * Servidor Express para a API REST do backend
 * Gerencia todas as rotas e requisições para o banco de dados
 */

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rota para testar conexão com o banco de dados
app.get('/api/teste-conexao', async (req, res) => {
  try {
    const resultado = await testarConexao();
    res.json(resultado);
  } catch (err) {
    console.error('Erro ao testar conexão:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao conectar ao banco de dados' });
  }
});

// Rota para cadastrar tutor
app.post('/api/tutores', async (req, res) => {
  try {
    const resultado = await inserirTutor(req.body);
    if (resultado.sucesso) {
      res.status(201).json({ sucesso: true, id: resultado.id });
    } else {
      res.status(400).json({ sucesso: false, erro: resultado.erro });
    }
  } catch (err) {
    console.error('Erro no backend:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor' });
  }
});

// Rota para cadastrar pet
app.post('/api/pets', async (req, res) => {
  try {
    const { pet, tutorId } = req.body;
    const resultado = await inserirPet(pet, tutorId);
    if (resultado.sucesso) {
      res.status(201).json({ sucesso: true, id: resultado.id });
    } else {
      res.status(400).json({ sucesso: false, erro: resultado.erro });
    }
  } catch (err) {
    console.error('Erro no backend:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor' });
  }
});

// Rota para cadastrar organização
app.post('/api/organizacoes', async (req, res) => {
  try {
    const resultado = await inserirOrganizacao(req.body);
    if (resultado.sucesso) {
      res.status(201).json({ sucesso: true, id: resultado.id });
    } else {
      res.status(400).json({ sucesso: false, erro: resultado.erro });
    }
  } catch (err) {
    console.error('Erro no backend:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor' });
  }
});

// Rota para cadastrar mutirão
app.post('/api/mutiroes', async (req, res) => {
  try {
    console.log('Recebendo requisição para cadastrar mutirão:', req.body);
    
    if (!req.body.organizacao_id) {
      console.error('Erro: organizacao_id não fornecido');
      return res.status(400).json({ sucesso: false, erro: 'organizacao_id é obrigatório' });
    }
    
    // Verifica se a organização existe
    const orgResult = await query(
      'SELECT organizacao_id FROM organizacoes WHERE organizacao_id = $1',
      [req.body.organizacao_id]
    );
    
    if (orgResult.rows.length === 0) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Organização não encontrada. Verifique o ID da organização fornecido.' 
      });
    }
    
    // Processa o corpo da requisição
    const mutiraoData = {
      ...req.body,
      vagas_disponiveis: req.body.vagas_disponiveis || req.body.total_vagas
    };
    
    const resultado = await inserirMutirao(mutiraoData);
    
    if (resultado.sucesso) {
      res.status(201).json({ sucesso: true, id: resultado.id });
    } else {
      res.status(400).json({ sucesso: false, erro: resultado.erro });
    }
  } catch (err) {
    console.error('Erro no backend:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor' });
  }
});

// Rota para buscar mutirões disponíveis
app.get('/api/mutiroes', async (req, res) => {
  try {
    console.log('Requisição recebida: buscar mutirões disponíveis');
    const resultado = await buscarMutiroes();
    console.log('Resultado da busca de mutirões:', resultado);
    res.json(resultado);
  } catch (err) {
    console.error('Erro ao buscar mutirões:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar mutirões' });
  }
});

// Rota para buscar mutirões de uma organização específica
app.get('/api/organizacoes/:organizacaoId/mutiroes', async (req, res) => {
  try {
    const { organizacaoId } = req.params;
    console.log(`Buscando mutirões para organização ID: ${organizacaoId}`);
    const resultado = await buscarMutiroesPorOrganizacao(organizacaoId);
    res.json(resultado);
  } catch (err) {
    console.error('Erro ao buscar mutirões da organização:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar mutirões da organização' });
  }
});

// Rota para buscar todas as organizações (substitui a antiga rota de ONGs)
app.get('/api/organizacoes', async (req, res) => {
  try {
    console.log('Buscando todas as organizações');
    const result = await query(
      'SELECT organizacao_id, nome, email, telefone, endereco, cidade, estado, cep, descricao, data_disponivel, hora_inicio, hora_fim, vagas_disponiveis FROM organizacoes',
      []
    );
    res.json({ sucesso: true, dados: { organizacoes: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar organizações:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar organizações' });
  }
});

// Rota para buscar agendamentos de um tutor
app.get('/api/tutores/:tutorId/agendamentos', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const resultado = await buscarAgendamentosTutor(tutorId);
    res.json(resultado);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar agendamentos do tutor' });
  }
});

// Rota para buscar agendamentos de um mutirão específico
app.get('/api/mutiroes/:mutiraoId/agendamentos', async (req, res) => {
  try {
    const { mutiraoId } = req.params;
    console.log(`Buscando agendamentos para mutirão ID: ${mutiraoId}`);
    
    // Verificar se o mutirão existe primeiro
    const mutiraoCheck = await query(
      'SELECT mutirao_id FROM mutiroes WHERE mutirao_id = $1',
      [mutiraoId]
    );
    
    if (mutiraoCheck.rows.length === 0) {
      console.log(`Mutirão ${mutiraoId} não encontrado`);
      return res.json({ 
        sucesso: true, 
        dados: { agendamentos: [] },
        mensagem: 'Mutirão não encontrado'
      });
    }
    
    const result = await query(`
      SELECT 
        a.agendamento_id,
        a.observacoes,
        a.data_agendamento,
        t.tutor_id,
        t.nome as nome_tutor,
        t.email as email_tutor,
        t.telefone as telefone_tutor,
        p.pet_id,
        p.nome as nome_pet,
        p.especie,
        p.raca,
        p.idade,
        p.sexo,
        p.peso,
        m.data_mutirao
      FROM agendamentos a
      JOIN tutores t ON a.tutor_id = t.tutor_id
      JOIN pets p ON a.pet_id = p.pet_id
      JOIN mutiroes m ON a.mutirao_id = m.mutirao_id
      WHERE a.mutirao_id = $1
      ORDER BY a.data_agendamento DESC
    `, [mutiraoId]);
    
    console.log(`Encontrados ${result.rows.length} agendamentos para mutirão ${mutiraoId}`);
    console.log('Agendamentos:', result.rows);
    
    res.json({ 
      sucesso: true, 
      dados: { agendamentos: result.rows } 
    });
  } catch (error) {
    console.error('Erro detalhado ao buscar agendamentos do mutirão:', error);
    res.status(500).json({ 
      sucesso: false, 
      erro: 'Erro ao buscar agendamentos do mutirão: ' + error.message 
    });
  }
});

// Rota para criar um agendamento
app.post('/api/agendamentos', async (req, res) => {
  try {
    const { tutorId, petId, mutiraoId, observacoes } = req.body;
    
    // Verifica se o mutirão existe e tem vagas disponíveis
    const mutiraoResult = await query(
      'SELECT vagas_disponiveis FROM mutiroes WHERE mutirao_id = $1',
      [mutiraoId]
    );
    
    if (mutiraoResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Mutirão não encontrado' });
    }
    
    if (mutiraoResult.rows[0].vagas_disponiveis <= 0) {
      return res.status(400).json({ sucesso: false, erro: 'Não há vagas disponíveis neste mutirão' });
    }
    
    // Criar o agendamento em uma transação para garantir atomicidade
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Inserir agendamento
      const agendamentoResult = await client.query(
        `INSERT INTO agendamentos (tutor_id, pet_id, mutirao_id, observacoes)
         VALUES ($1, $2, $3, $4)
         RETURNING agendamento_id`,
        [tutorId, petId, mutiraoId, observacoes || '']
      );
      
      // Atualizar vagas disponíveis
      await client.query(
        `UPDATE mutiroes SET vagas_disponiveis = vagas_disponiveis - 1
         WHERE mutirao_id = $1`,
        [mutiraoId]
      );
      
      await client.query('COMMIT');
      
      res.status(201).json({
        sucesso: true,
        id: agendamentoResult.rows[0].agendamento_id
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao criar agendamento' });
  }
});

// Rota para cancelar um agendamento
app.delete('/api/agendamentos/:agendamentoId', async (req, res) => {
  try {
    const { agendamentoId } = req.params;
    console.log(`Tentando cancelar agendamento ID: ${agendamentoId}`);
    
    // Verificar se o agendamento existe e buscar o mutirao_id
    const agendamentoCheck = await query(
      'SELECT mutirao_id FROM agendamentos WHERE agendamento_id = $1',
      [agendamentoId]
    );
    
    if (agendamentoCheck.rows.length === 0) {
      console.log(`Agendamento ${agendamentoId} não encontrado`);
      return res.status(404).json({ sucesso: false, erro: 'Agendamento não encontrado' });
    }
    
    const mutiraoId = agendamentoCheck.rows[0].mutirao_id;
    console.log(`Agendamento encontrado, mutirao_id: ${mutiraoId}`);
    
    // Cancelar o agendamento em uma transação
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Deletar o agendamento
      const deleteResult = await client.query(
        'DELETE FROM agendamentos WHERE agendamento_id = $1',
        [agendamentoId]
      );
      
      console.log(`Agendamento deletado, linhas afetadas: ${deleteResult.rowCount}`);
      
      // Incrementar as vagas disponíveis no mutirão
      const updateResult = await client.query(
        'UPDATE mutiroes SET vagas_disponiveis = vagas_disponiveis + 1 WHERE mutirao_id = $1',
        [mutiraoId]
      );
      
      console.log(`Vagas atualizadas, linhas afetadas: ${updateResult.rowCount}`);
      
      await client.query('COMMIT');
      
      res.json({ 
        sucesso: true, 
        mensagem: 'Agendamento cancelado com sucesso' 
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro na transação:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ 
      sucesso: false, 
      erro: 'Erro ao cancelar agendamento: ' + error.message 
    });
  }
});

// Rota de login para tutor
app.post('/api/login/tutor', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await query(
      'SELECT tutor_id, nome FROM tutores WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    res.status(200).json({ sucesso: true, tutor: result.rows[0] });
  } catch (error) {
    console.error('Erro no login de tutor:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Rota de login para organização
app.post('/api/login/organizacao', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await query(
      'SELECT organizacao_id, nome FROM organizacoes WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    res.status(200).json({ sucesso: true, organizacao: result.rows[0] });
  } catch (error) {
    console.error('Erro no login de organização:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Rota para buscar pets de um tutor
app.get('/api/tutores/:tutorId/pets', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await query(
      'SELECT * FROM pets WHERE tutor_id = $1',
      [tutorId]
    );
    res.json({ sucesso: true, dados: { pets: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar pets' });
  }
});

// Rota para atualizar pet
app.put('/api/pets/:petId', async (req, res) => {
  try {
    const { petId } = req.params;
    const { nome, especie, raca, idade, sexo, peso } = req.body;
    
    const result = await query(
      `UPDATE pets 
       SET nome = $1, especie = $2, raca = $3, idade = $4, sexo = $5, peso = $6
       WHERE pet_id = $7 RETURNING *`,
      [nome, especie, raca, idade, sexo, peso, petId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Pet não encontrado' });
    }
    
    res.json({ sucesso: true, dados: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar pet' });
  }
});

// Rota para deletar pet
app.delete('/api/pets/:petId', async (req, res) => {
  try {
    const { petId } = req.params;
    
    const result = await query(
      'DELETE FROM pets WHERE pet_id = $1 RETURNING *',
      [petId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Pet não encontrado' });
    }
    
    res.json({ sucesso: true, mensagem: 'Pet removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao deletar pet' });
  }
});

// Rota para buscar todas as organizações
app.get('/api/organizacoes', async (req, res) => {
  try {
    const result = await query(
      'SELECT organizacao_id, nome, email, telefone, endereco, cidade, estado, cep, descricao, data_disponivel, hora_inicio, hora_fim, vagas_disponiveis FROM organizacoes',
      []
    );
    res.json({ sucesso: true, dados: { organizacoes: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar organizações:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar organizações' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Express rodando em http://localhost:${PORT}`);
});
