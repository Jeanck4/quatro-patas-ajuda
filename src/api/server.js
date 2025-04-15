import express from 'express';
import cors from 'cors';
import { inserirTutor, inserirPet, inserirOng, testarConexao} from '../database/conexao.js';

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

// Rota para cadastrar ONG
app.post('/api/ongs', async (req, res) => {
  try {
    const resultado = await inserirOng(req.body);
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

import { query } from '../database/conexao.js';

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

// Rota de login para ONG
app.post('/api/login/ong', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await query(
      'SELECT ong_id, nome FROM ongs WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    res.status(200).json({ sucesso: true, ong: result.rows[0] });
  } catch (error) {
    console.error('Erro no login de ONG:', error);
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

// Rota para buscar todas as ONGs
app.get('/api/ongs', async (req, res) => {
  try {
    const result = await query(
      'SELECT ong_id, nome, email, telefone, endereco, cidade, estado, cep, descricao FROM ongs',
      []
    );
    res.json({ sucesso: true, dados: { ongs: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar ONGs:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar ONGs' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Express rodando em http://localhost:${PORT}`);
});
