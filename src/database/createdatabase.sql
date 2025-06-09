-- Tabela para armazenar informações das organizações
CREATE TABLE organizacoes (
    organizacao_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Deve ser armazenada com hash na aplicação real
    telefone VARCHAR(20) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    endereco TEXT NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    descricao TEXT,
    data_disponivel DATE,
    hora_inicio TIME,
    hora_fim TIME,
    vagas_disponiveis INTEGER,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar informações dos tutores
CREATE TABLE tutores (
    tutor_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Deve ser armazenada com hash na aplicação real
    telefone VARCHAR(20) NOT NULL,
    cpf VARCHAR(15) UNIQUE NOT NULL,
    endereco TEXT NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar informações dos pets
CREATE TABLE pets (
    pet_id SERIAL PRIMARY KEY,
    tutor_id INTEGER REFERENCES tutores(tutor_id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL, -- Ex: Cachorro, Gato
    raca VARCHAR(100) NOT NULL,
    idade INTEGER NOT NULL,
    sexo VARCHAR(10) NOT NULL, -- Ex: Macho, Fêmea
    peso NUMERIC(5,2) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar informações dos mutirões (vinculados diretamente a organizações)
CREATE TABLE mutiroes (
    mutirao_id SERIAL PRIMARY KEY,
    organizacao_id INTEGER REFERENCES organizacoes(organizacao_id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    data_mutirao DATE NOT NULL,
    total_vagas INTEGER NOT NULL,
    vagas_disponiveis INTEGER NOT NULL,
    endereco TEXT NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    informacoes_adicionais TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar os agendamentos de castração
CREATE TABLE agendamentos (
    agendamento_id SERIAL PRIMARY KEY,
    mutirao_id INTEGER REFERENCES mutiroes(mutirao_id) ON DELETE CASCADE,
    pet_id INTEGER REFERENCES pets(pet_id) ON DELETE CASCADE,
    tutor_id INTEGER REFERENCES tutores(tutor_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'Agendado', -- Ex: Agendado, Confirmado, Realizado, Cancelado
    observacoes TEXT,
    data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar a performance de consultas frequentes
CREATE INDEX idx_pets_tutor_id ON pets(tutor_id);
CREATE INDEX idx_mutiroes_organizacao_id ON mutiroes(organizacao_id);
CREATE INDEX idx_mutiroes_data ON mutiroes(data_mutirao);
CREATE INDEX idx_agendamentos_mutirao_id ON agendamentos(mutirao_id);
CREATE INDEX idx_agendamentos_pet_id ON agendamentos(pet_id);
CREATE INDEX idx_agendamentos_tutor_id ON agendamentos(tutor_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
