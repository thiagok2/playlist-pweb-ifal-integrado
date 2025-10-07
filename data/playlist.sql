-- CRIAÇÃO DAS TABELAS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    email VARCHAR(100)
);

CREATE TABLE filmes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    duracao INT NOT NULL, -- duração em minutos
    ano_lancamento INT NOT NULL,
    nota_avaliacao NUMERIC(10, 2) CHECK (nota_avaliacao BETWEEN 0 AND 10)
);

CREATE TABLE canais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_criacao DATE NOT NULL,
    genero_tema VARCHAR(50) NOT NULL -- relacionado ao gênero do canal
);

CREATE TABLE canal_filmes (
    id SERIAL PRIMARY KEY,
    id_canal INT REFERENCES canais(id) ON DELETE CASCADE,
    id_filme INT REFERENCES filmes(id) ON DELETE CASCADE,
    data_recomendacao DATE DEFAULT NOW()
);

CREATE TABLE playlists(
  id SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(200),
  data_criacao DATE
);

CREATE TABLE playlist_filmes (
    id SERIAL PRIMARY KEY,
    id_playlist INT REFERENCES playlists ON DELETE NO ACTION,
    id_canal INT REFERENCES canais(id) ON DELETE NO ACTION,
    id_filme INT REFERENCES filmes(id) ON DELETE CASCADE,
    assistido BOOLEAN DEFAULT FALSE,
    tempo_assistido INT DEFAULT 0, -- em minutos
    data_visualizacao DATE,
    nota_avaliacao_usuario INT CHECK (nota_avaliacao_usuario BETWEEN 1 AND 5)
);

CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
    id_filme INT REFERENCES filmes(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    data_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avaliacao NUMERIC(10, 2) CHECK (avaliacao BETWEEN 0 AND 10)
);

-- INSERTS EM FILMES
INSERT INTO filmes (titulo, genero, duracao, ano_lancamento, nota_avaliacao) VALUES
('Avatar: The Way of Water', 'Ação', 192, 2022, 8.0),
('Top Gun: Maverick', 'Ação', 131, 2022, 8.3);

-- INSERTS EM CANAIS
INSERT INTO canais (nome, data_criacao, genero_tema) VALUES
('Dicas do Artur', '2023-01-01', 'Ação'),
('Dramas do Joseph Paul', '2023-01-02', 'Drama');

-- INSERTS EM CANAL_FILMES
INSERT INTO canal_filmes (id_canal, id_filme) VALUES
(1, 1), (1, 2);

-- INSERTS EM USUÁRIOS
INSERT INTO usuarios (login, nome) VALUES
('joao123', 'João Silva'),
('mariazinha', 'Maria Oliveira')

-- INSERTS EM COMENTÁRIOS
INSERT INTO comentarios (id_usuario, id_filme, texto, avaliacao) VALUES
(1, 1, 'Avatar: The Way of Water trouxe visuais de outro mundo e uma história cativante!', 9.5),
(2, 2, 'Top Gun: Maverick foi incrível, cheio de ação e nostalgia.', 9.0),
(1, 1, 'Os efeitos visuais de Avatar são de tirar o fôlego. Um marco no cinema.', 9.8),
(2, 1, 'Apesar de longo, Avatar: The Way of Water mantém você preso à tela.', 9.0),
(3, 2, 'A química entre os personagens em Top Gun é perfeita!', 8.7),
(4, 2, 'As cenas de voo em Maverick são impressionantes e emocionantes.', 9.3),
(1, 1, 'A sequência de Avatar foi uma surpresa positiva. Adorei!', 9.4),
(2, 2, 'Maverick é pura adrenalina e emoção nostálgica.', 8.9),
(3, 1, 'Avatar redefine o que é cinema. Maravilhoso.', 9.9);