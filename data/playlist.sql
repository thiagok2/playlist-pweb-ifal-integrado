-- CRIAÇÃO DAS TABELAS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL
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
('Top Gun: Maverick', 'Ação', 131, 2022, 8.3),
('Duna', 'Ficção Científica', 155, 2021, 8.1),
('Tudo em Todo Lugar ao Mesmo Tempo', 'Comédia', 139, 2022, 8.0),
('Homem-Aranha: Sem Volta para Casa', 'Ação', 148, 2021, 8.5),
('The Batman', 'Ação', 176, 2022, 7.9),
('Encanto', 'Animação', 102, 2021, 7.5),
('Lightyear', 'Animação', 105, 2022, 6.2),
('Jurassic World: Domínio', 'Aventura', 146, 2022, 5.7),
('Minions 2: A Origem de Gru', 'Animação', 87, 2022, 6.6),
('Thor: Amor e Trovão', 'Ação', 119, 2022, 6.4),
('Black Panther: Wakanda Forever', 'Ação', 161, 2022, 7.2),
('Sonic 2: O Filme', 'Aventura', 122, 2022, 6.5),
('Adão Negro', 'Ação', 125, 2022, 6.7),
('Red: Crescer é uma Fera', 'Animação', 100, 2022, 7.0),
('Uncharted', 'Aventura', 116, 2022, 6.4),
('Free Guy: Assumindo o Controle', 'Comédia', 115, 2021, 7.2),
('Morte no Nilo', 'Mistério', 127, 2022, 6.3),
('Nope', 'Terror', 130, 2022, 7.0),
('The Fabelmans', 'Drama', 151, 2022, 8.2),
('Elvis', 'Drama', 159, 2022, 7.4),
('Bullet Train', 'Ação', 126, 2022, 7.3),
('Glass Onion: Um Mistério Knives Out', 'Mistério', 139, 2022, 7.8),
('Halloween Ends', 'Terror', 111, 2022, 5.0),
('Pinóquio de Guillermo del Toro', 'Animação', 117, 2022, 7.9),
('Avatar', 'Ficção Científica', 162, 2009, 7.9),
('Interestelar', 'Ficção Científica', 169, 2014, 8.6),
('Vingadores: Ultimato', 'Ação', 181, 2019, 8.4),
('Coringa', 'Drama', 122, 2019, 8.5);

-- INSERTS EM CANAIS
INSERT INTO canais (nome, data_criacao, genero_tema) VALUES
('Dicas do Artur', '2023-01-01', 'Ação'),
('Dramas do Joseph Paul', '2023-01-02', 'Drama'),
('Caio Animações', '2023-01-03', 'Animação'),
('Rebeca e suas Aventura', '2023-01-04', 'Aventura'),
('Nilton Mistérios', '2023-01-05', 'Mistério');

-- INSERTS EM CANAL_FILMES
INSERT INTO canal_filmes (id_canal, id_filme) VALUES
(1, 1), (1, 2), (1, 5), (1, 6), (1, 12), (1, 14),
(2, 20), (2, 21), (2, 29),
(3, 7), (3, 8), (3, 10), (3, 15), (3, 26),
(4, 9), (4, 13), (4, 17), (4, 16), (4, 28),
(5, 18), (5, 23), (5, 24), (5, 19), (5, 27),
(1, 3), (1, 4), (1, 11), (1, 22), (1, 23),
(2, 9), (2, 10), (2, 15), (2, 18), (2, 25),
(3, 14), (3, 20), (3, 21), (3, 29),
(4, 24), (4, 26), (4, 27), (4, 28),
(5, 1), (5, 2), (5, 6), (5, 7), (5, 12);

-- INSERTS EM USUÁRIOS
INSERT INTO usuarios (login, nome) VALUES
('joao123', 'João Silva'),
('mariazinha', 'Maria Oliveira'),
('pedro_99', 'Pedro Santos'),
('ana_clara', 'Ana Clara'),
('lucas.1987', 'Lucas Costa'),
('bia_lima', 'Beatriz Lima'),
('carlos.x', 'Carlos Xavier'),
('fernanda89', 'Fernanda Nunes'),
('rafaella', 'Rafaella Souza'),
('andre_h', 'André Henrique');

-- INSERTS EM COMENTÁRIOS
INSERT INTO comentarios (id_usuario, id_filme, texto, avaliacao) VALUES
(1, 1, 'Avatar: The Way of Water trouxe visuais de outro mundo e uma história cativante!', 9.5),
(2, 2, 'Top Gun: Maverick foi incrível, cheio de ação e nostalgia.', 9.0),
(3, 3, 'Duna é uma obra-prima da ficção científica, com um visual espetacular.', 8.8),
(4, 5, 'Homem-Aranha: Sem Volta para Casa entregou emoção pura para os fãs!', 9.7),
(5, 6, 'The Batman trouxe um tom sombrio e uma nova perspectiva para o herói.', 8.5),
(1, 9, 'Jurassic World: Domínio teve cenas de ação emocionantes, mas a trama foi fraca.', 6.5),
(2, 12, 'Black Panther: Wakanda Forever foi um tributo emocionante e cheio de ação.', 8.9),
(3, 13, 'Uncharted foi uma aventura divertida, mas pouco memorável.', 7.2),
(4, 15, 'Red: Crescer é uma Fera trouxe uma história cativante e emocional.', 8.0),
(5, 16, 'Uncharted tem uma vibe divertida, mas senti falta de algo mais profundo.', 7.0),
(1, 1, 'Os efeitos visuais de Avatar são de tirar o fôlego. Um marco no cinema.', 9.8),
(2, 1, 'Apesar de longo, Avatar: The Way of Water mantém você preso à tela.', 9.0),
(3, 2, 'A química entre os personagens em Top Gun é perfeita!', 8.7),
(4, 2, 'As cenas de voo em Maverick são impressionantes e emocionantes.', 9.3),
(5, 3, 'Duna é uma viagem épica. Mal posso esperar pela continuação!', 9.0),
(1, 5, 'O multiverso do Homem-Aranha foi tratado de forma brilhante.', 9.5),
(2, 5, 'Um verdadeiro presente para os fãs da Marvel.', 9.8),
(3, 6, 'The Batman tem uma abordagem única, mas um pouco longo demais.', 8.0),
(4, 6, 'Robert Pattinson surpreendeu como Batman. Gostei bastante.', 8.5),
(5, 9, 'Adorei as criaturas em Jurassic World, mas o roteiro deixou a desejar.', 6.8),
(1, 12, 'Wakanda Forever traz uma bela homenagem a Chadwick Boseman.', 9.2),
(2, 12, 'O enredo de Wakanda Forever é forte, com atuações incríveis.', 8.7),
(3, 13, 'Uncharted tem cenas de ação boas, mas poderia ser mais emocionante.', 7.5),
(4, 15, 'Red é um filme animado que toca no coração de qualquer um.', 8.2),
(5, 15, 'Uma animação com uma mensagem profunda. Red é incrível.', 8.4),
(1, 16, 'Adorei as referências em Uncharted, mas senti falta de mais tensão.', 7.3),
(2, 9, 'Jurassic World teve momentos bons, mas faltou originalidade.', 6.5),
(3, 5, 'Homem-Aranha é sempre uma boa pedida para diversão e emoção.', 9.6),
(4, 6, 'O Batman tem um tom noir que combina perfeitamente com o herói.', 8.7),
(5, 3, 'Duna é pura imersão visual e narrativa. Impressionante!', 9.1),
(1, 1, 'A sequência de Avatar foi uma surpresa positiva. Adorei!', 9.4),
(2, 2, 'Maverick é pura adrenalina e emoção nostálgica.', 8.9),
(3, 5, 'Os arcos dos personagens em Sem Volta para Casa são fantásticos.', 9.7),
(4, 5, 'O Homem-Aranha nunca decepciona. Esse filme é incrível!', 9.9),
(5, 5, 'Uma obra-prima do universo Marvel. Simplesmente épico.', 10.0),
(1, 6, 'A cinematografia de The Batman é espetacular.', 8.6),
(2, 6, 'Gostei muito do vilão. Trouxe mais peso à trama.', 8.9),
(3, 9, 'Jurassic World é visualmente bonito, mas poderia ser mais original.', 6.7),
(4, 12, 'A continuação de Black Panther não desaponta. Ótimo filme.', 9.0),
(5, 13, 'Uncharted é uma boa diversão casual para o fim de semana.', 7.4),
(1, 15, 'Animação perfeita para toda a família. Red é encantador.', 8.3),
(2, 16, 'Uncharted tem seus momentos, mas é só isso. Nada excepcional.', 7.1),
(3, 1, 'Avatar redefine o que é cinema. Maravilhoso.', 9.9),
(4, 5, 'Sem Volta para Casa é pura magia e emoção.', 9.8);







