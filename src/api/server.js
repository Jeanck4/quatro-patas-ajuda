
import express from 'express';
import cors from 'cors';
import { inserirTutor, inserirPet, inserirOng, testarConexao } from '../database/conexao.js';

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

app.listen(PORT, () => {
  console.log(`✅ Servidor Express rodando em http://localhost:${PORT}`);
});
