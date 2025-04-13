
# Instruções para Configuração do Banco de Dados PostgreSQL

Este documento fornece instruções detalhadas para configurar o banco de dados PostgreSQL para o sistema "Quatro Patas" de mutirão de castração.

## 1. Instalando o PostgreSQL

### Windows:
1. Baixe o instalador em [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Execute o instalador e siga as instruções
3. Lembre-se de anotar a senha do superusuário (postgres)
4. Instale o pgAdmin junto com o PostgreSQL para facilitar a administração

### macOS:
```bash
# Usando Homebrew
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Criando o Banco de Dados

1. Acesse o PostgreSQL:

```bash
# Windows: use o pgAdmin ou
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

2. Crie o banco de dados:

```sql
CREATE DATABASE quatro_patas;
```

3. Crie um usuário (opcional, para maior segurança):

```sql
CREATE USER seu_usuario WITH ENCRYPTED PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE quatro_patas TO seu_usuario;
```

4. Conecte-se ao banco de dados:

```sql
\c quatro_patas
```

## 3. Criando as Tabelas

Execute o script SQL de criação de tabelas disponível no arquivo `createdatabase.sql`. Você pode fazer isso de diferentes maneiras:

### Via pgAdmin:
1. Abra o pgAdmin
2. Conecte-se ao servidor
3. Clique com o botão direito no banco de dados `quatro_patas`
4. Selecione "Query Tool"
5. Cole o conteúdo de `createdatabase.sql`
6. Clique em "Execute"

### Via linha de comando:
```bash
# Windows
psql -U postgres -d quatro_patas -f caminho/para/createdatabase.sql

# macOS/Linux
sudo -u postgres psql quatro_patas -f caminho/para/createdatabase.sql
```

## 4. Configurando a Conexão na Aplicação

1. Edite o arquivo `conexao.js` para refletir suas configurações:

```javascript
const pool = new Pool({
  user: 'seu_usuario',       // Usuário do PostgreSQL que você criou
  host: 'localhost',         // Ou o endereço do seu servidor
  database: 'quatro_patas',  // Nome do banco de dados
  password: 'sua_senha',     // Senha que você definiu
  port: 5432,                // Porta padrão do PostgreSQL
});
```

2. Instale a dependência necessária:

```bash
npm install pg
```

## 5. Testando a Conexão

Execute o seguinte comando para testar se a conexão está funcionando corretamente:

```javascript
const db = require('./caminho/para/conexao');

async function testarBancoDeDados() {
  try {
    await db.testarConexao();
    console.log('Conexão bem-sucedida!');
  } catch (err) {
    console.error('Erro:', err);
  }
}

testarBancoDeDados();
```

## 6. Dicas de Segurança

- Nunca armazene senhas em texto puro no banco de dados. Use funções de hash como bcrypt.
- Em produção, use variáveis de ambiente para armazenar credenciais sensíveis.
- Restrinja o acesso ao banco de dados apenas aos IPs necessários.
- Faça backups regulares do banco de dados.

## Recursos Adicionais

- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)
- [Documentação do Node-Postgres](https://node-postgres.com/)
