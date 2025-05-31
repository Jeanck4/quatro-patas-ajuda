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

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware de tratamento de erro
const errorHandler = (err, req, res, next) => {
  console.error('Erro no backend:', err);
  res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor' });
};

app.get('/api/teste-conexao', async (req, res) => {
  try {
    const resultado = await testarConexao();
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

app.post('/api/tutores', async (req, res, next) => {
  try {
    const resultado = await inserirTutor(req.body);
    if (resultado.sucesso) {
      res.status(201).json({ sucesso: true, id: resultado.id });
    } else {
      res.status(400).json({ sucesso: false, erro: resultado.erro });
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/pets', async (req, res, next) => {
  try {
    const { pet, tutorId } = req.body;
    const resultado = await inserirPet(pet, tutorId);
    if (resultado.sucesso) {
      res.status(201).json({ sucesso: true, id: resultado.id });
    } else {
      res.status(400).json({ sucesso: false, erro: resultado.erro });
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/organizacoes', async (req, res, next) => {
  try {
    const resultado = await inserirOrganizacao(req.body);
    if (resultado.sucesso) {
      res.status(201).json({ sucesso: true, id: resultado.id });
    } else {
      res.status(400).json({ sucesso: false, erro: resultado.erro });
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/mutiroes', async (req, res, next) => {
  try {
    if (!req.body.organizacao_id) {
      return res.status(400).json({ sucesso: false, erro: 'organizacao_id é obrigatório' });
    }
    
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
    next(err);
  }
});

app.get('/api/mutiroes', async (req, res, next) => {
  try {
    const resultado = await buscarMutiroes();
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

app.get('/api/organizacoes/:organizacaoId/mutiroes', async (req, res, next) => {
  try {
    const { organizacaoId } = req.params;
    const resultado = await buscarMutiroesPorOrganizacao(organizacaoId);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

app.get('/api/organizacoes', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT organizacao_id, nome, email, telefone, endereco, cidade, estado, cep, descricao, data_disponivel, hora_inicio, hora_fim, vagas_disponiveis FROM organizacoes',
      []
    );
    res.json({ sucesso: true, dados: { organizacoes: result.rows } });
  } catch (err) {
    next(err);
  }
});

app.get('/api/tutores/:tutorId/agendamentos', async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const resultado = await buscarAgendamentosTutor(tutorId);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

app.post('/api/agendamentos', async (req, res, next) => {
  try {
    const { tutorId, petId, mutiraoId, observacoes } = req.body;
    
    const mutiraoResult = await query(
      'SELECT vagas_disponiveis FROM mutiroes WHERE mutirao_id = $1',
      [mutiraoId]
    );
    
    if (!mutiraoResult.rows.length || mutiraoResult.rows[0].vagas_disponiveis <= 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: mutiraoResult.rows.length ? 'Não há vagas disponíveis neste mutirão' : 'Mutirão não encontrado'
      });
    }
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const agendamentoResult = await client.query(
        `INSERT INTO agendamentos (tutor_id, pet_id, mutirao_id, observacoes)
         VALUES ($1, $2, $3, $4)
         RETURNING agendamento_id`,
        [tutorId, petId, mutiraoId, observacoes || '']
      );
      
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
  } catch (err) {
    next(err);
  }
});

app.post('/api/login/tutor', async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const result = await query(
      'SELECT tutor_id, nome FROM tutores WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    res.json({ 
      sucesso: true, 
      dados: { 
        id: result.rows[0].tutor_id,
        nome: result.rows[0].nome
      }
    });
  } catch (err) {
    next(err);
  }
});

// Registra o middleware de erro após todas as rotas
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});