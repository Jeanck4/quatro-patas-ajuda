
/**
 * Exemplo de conexão com o banco de dados PostgreSQL
 * 
 * Instruções para uso:
 * 1. Certifique-se de ter o Node.js instalado
 * 2. Instale o pacote pg usando: npm install pg
 * 3. Ajuste os parâmetros de conexão abaixo conforme seu ambiente
 */

const { Pool } = require('pg');

// Configuração de conexão com o banco de dados
const pool = new Pool({
  user: 'seu_usuario',      // Substitua pelo seu usuário do PostgreSQL
  host: 'localhost',        // Endereço do servidor PostgreSQL
  database: 'quatro_patas', // Nome do banco de dados que você criou
  password: 'sua_senha',    // Substitua pela sua senha do PostgreSQL
  port: 5432,               // Porta padrão do PostgreSQL
  max: 20,                  // Número máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo limite de conexões ociosas
  connectionTimeoutMillis: 2000, // Tempo limite para estabelecer uma conexão
});

// Função para testar a conexão
const testarConexao = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
    client.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    return false;
  }
};

// Exporta as funções e o pool para uso em outros arquivos
module.exports = {
  pool,
  testarConexao,
  query: (text, params) => pool.query(text, params),
};

/**
 * Exemplo de uso do módulo de conexão:
 * 
 * const db = require('./caminho/para/conexao');
 * 
 * async function exemploConsulta() {
 *   try {
 *     // Teste de conexão
 *     await db.testarConexao();
 *     
 *     // Exemplo de consulta
 *     const resultado = await db.query('SELECT * FROM tutores WHERE email = $1', ['exemplo@email.com']);
 *     console.log('Resultado da consulta:', resultado.rows);
 *   } catch (err) {
 *     console.error('Erro ao executar consulta:', err);
 *   }
 * }
 * 
 * exemploConsulta();
 */
