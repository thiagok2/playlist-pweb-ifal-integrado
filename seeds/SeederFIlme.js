// scripts/seed-filmes.js
// Executa: node scripts/seed-filmes.js
// Requisitos: teu projeto ser ESM (package.json: "type": "module")

import { sequelize, Filme } from '../models/index.js';

/* ==========================================================
   MOCKS: cole suas três listas aqui (sem alterações)
   ========================================================== */

const filmes = [
  {
    id: 1,
    titulo: "Stranger Things",
    slug:"stranger-things",
    fotoThumbnail: "../Imagens/stranger3.jpeg",
    ano_lancamento: 2016,
    tipo: "s",
    temporadas: "3 temporadas",
    genero: "Ficção Científica, Terror",
    elenco: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"],
    nota_avaliacao: 8.7,
    numero_comentarios: 15230,
    faixa_etaria:"14", 
    indicacoes_premios: ["Emmy", "Globo de Ouro"],
    sinopse: "Em uma pequena cidade, um grupo de amigos se envolve em uma série de eventos sobrenaturais quando um garoto desaparece. Eles acabam descobrindo uma misteriosa menina com poderes telecinéticos e revelam experimentos secretos do governo, portais para outras dimensões e monstros aterrorizantes."
  },
  {
    id: 2,
    titulo: "Peak Blinders",
    fotoThumbnail: "../Imagens/Peaky-Blinders-NI.jpg",
    ano_lancamento: 2013,
    tipo: "s",
    temporadas: "6 temporadas",
    genero: "Drama, Crime",
    elenco: ["Cillian Murphy", "Paul Anderson", "Helen McCrory"],
    nota_avaliacao: 8.8,
    numero_comentarios: 9745,
    faixa_etaria: "16",
    indicacoes_premios: ["BAFTA", "Emmy"],
    sinopse: "Em Birmingham, Inglaterra, logo após a Primeira Guerra Mundial, a série acompanha a ascensão da família criminosa Shelby. Liderados pelo ambicioso e calculista Tommy Shelby, os Peaky Blinders expandem seus negócios ilegais enquanto lidam com gangues rivais, a polícia e seus próprios traumas."
  },
  {
    id: 3,
    titulo: "Suits",
    fotoThumbnail: "../Imagens/Suits.jpg",
    ano_lancamento: 2011,
    tipo: "s",
    temporadas:"9 temporadas",
    genero: "Drama, Jurídico",
    elenco: ["Gabriel Macht", "Patrick J. Adams", "Meghan Markle"],
    nota_avaliacao: 8.5,
    numero_comentarios: 18400,
    faixa_etaria: "14",
    indicacoes_premios: [],
    sinopse: "A trama acompanha Harvey Specter, um dos melhores advogados de Nova York, que decide contratar o jovem Mike Ross, um gênio com memória fotográfica, mas que abandonou a faculdade de direito. Juntos, eles formam uma dupla imbatível, enquanto escondem o segredo de que Mike não possui licença para advogar."
  },
  {
    id: 4,
    titulo: "The Umbrella Academy",
    fotoThumbnail: "../Imagens/umbrella.png",
    ano_lancamento: 2019,
    tipo: "s",
    temporadas: "4 temporadas",
    genero: "Ação, Fantasia",
    elenco: ["Elliot Page", "Aidan Gallagher", "Robert Sheehan"],
    nota_avaliacao: 7.9,
    numero_comentarios: 9200,
    faixa_etaria: "16",
    indicacoes_premios: ["Emmy"],
    sinopse: "Sete crianças extraordinárias, adotadas por um bilionário, se reúnem após a sua morte. Agora adultos e distantes, eles precisam superar suas diferenças para impedir um apocalipse iminente que eles mesmos podem ter causado."
  },
  {
    id: 5,
    titulo: "The Kingdom",
    tipo: "s",
    temporadas: "2 temporadas",
    fotoThumbnail: "../Imagens/The-Kingdom-NI.jpg",
    ano_lancamento: 2019,
    genero: "Drama Histórico",
    elenco: ["Ju Ji-hoon", "Bae Doona"],
    nota_avaliacao: 8.3,
    numero_comentarios: 3100,
    faixa_etaria: "16",
    indicacoes_premios: [],
    sinopse: "Durante a Dinastia Joseon da Coreia medieval, o príncipe herdeiro Chang investiga uma misteriosa praga que assola o reino. Ele descobre que a doença transforma os mortos em monstros sedentos por carne e precisa lutar para proteger seu povo."
  },
  {
    id: 6,
    titulo: "Lupin",
    tipo: "s",
    fotoThumbnail: 'public/Imagens/Lupin-NI.jpg',
    temporadas: "3 temporadas",
    ano_lancamento: 2021,
    genero: "Suspense, Crime",
    elenco: ["Omar Sy", "Ludivine Sagnier"],
    nota_avaliacao: 7.8,
    numero_comentarios: 6400,
    faixa_etaria: "14",
    indicacoes_premios: [],
    sinopse: "Inspirado pelas aventuras de Arsène Lupin, o ladrão de casaca Assane Diop busca vingança pela injustiça cometida contra seu pai por uma família rica. Usando seu carisma e maestria em disfarces, ele executa roubos elaborados."
  },
];

const filmes2 = [
  {
    id: 7,
    titulo: "Round 6",
    tipo: "s",
    temporadas: "3 temporadas",
    fotoThumbnail: "../Imagens/Round-6-NI.jpg",
    ano_lancamento: 2021,
    genero: "Drama, Suspense",
    elenco: ["Lee Jung-jae", "Park Hae-soo"],
    nota_avaliacao: 8.1,
    numero_comentarios: 15000,
    faixa_etaria: "16",
    indicacoes_premios: ["Emmy"],
    sinopse: "Um grupo de pessoas com dificuldades financeiras é convidado a participar de uma misteriosa competição de sobrevivência. Eles competem em jogos infantis mortais por um prêmio bilionário, onde quem perde é eliminado."
  },
  {
    id: 8,
    titulo: "La Casa de Papel",
    fotoThumbnail: "../Imagens/La-Casa-De-Papel-NI.jpg",
    tipo: "s",
    temporadas: "5 temporadas",
    ano_lancamento: 2017,
    genero: "Ação, Crime",
    elenco: ["Álvaro Morte", "Úrsula Corberó"],
    nota_avaliacao: 8.3,
    numero_comentarios: 21000,
    faixa_etaria: "16",
    indicacoes_premios: ["Emmy Internacional"],
    sinopse: "Um homem misterioso conhecido como 'O Professor' recruta oito pessoas para realizar o maior assalto da história: roubar a Casa da Moeda da Espanha. Enquanto executam o plano, eles precisam lidar com a polícia e reféns."
  },
  {
    id: 9,
    titulo: "Ragnarok",
    fotoThumbnail: "../Imagens/Ragnarok-NI.jpg",
    tipo: "s",
    temporadas: "3 temporadas",
    ano_lancamento: 2020,
    genero: "Fantasia, Drama",
    elenco: ["David Stakston", "Herman Tømmeraas"],
    nota_avaliacao: 7.5,
    numero_comentarios: 4300,
    faixa_etaria: "14",
    indicacoes_premios: [],
    sinopse: "Em uma cidade norueguesa afetada pela poluição, um jovem descobre que possui os poderes do deus Thor. Ele precisa confrontar uma família de gigantes disfarçados de empresários que está destruindo a cidade."
  },
  {
    id: 10,
    titulo: "Prision Break",
    tipo: "s",
    temporadas: "4 temporadas",
    fotoThumbnail: "../Imagens/Prision-Break-NI.jpg",
    ano_lancamento: 2017,
    genero: "Ação, Crime",
    elenco: ["Kim Rae-won", "Han Suk-kyu"],
    nota_avaliacao: 7.1,
    numero_comentarios: 1500,
    faixa_etaria: "16",
    indicacoes_premios: [],
    sinopse: "Um ex-detetive é enviado para a prisão e descobre que o local é dominado por um prisioneiro que comanda um sindicato do crime de dentro das celas. Para sobreviver, ele precisa se juntar ao grupo e descobrir a verdade."
  },
  {
    id: 11,
    titulo: "Narcos",
    fotoThumbnail: "../Imagens/Narcos-NI.jpg",
    tipo: "s",
    temporadas: "3 temporadas",
    ano_lancamento: 2015,
    genero: "Crime, Drama",
    elenco: ["Wagner Moura", "Pedro Pascal"],
    nota_avaliacao: 8.8,
    numero_comentarios: 12000,
    faixa_etaria: "16",
    indicacoes_premios: ["Emmy"],
    sinopse: "A série narra a história real da ascensão e queda do infame traficante colombiano Pablo Escobar e do Cartel de Medellín, contada a partir da perspectiva de Escobar e dos agentes do DEA que lideraram a missão para capturá-lo."
  },
  {
    id: 12,
    titulo: "Wednesday",
    tipo: "s",
    fotoThumbnail: "../Imagens/Wandinha-NI.jpg",
    ano_lancamento: 2018,
    genero: "Terror",
    temporadas: "2 temporadas",
    elenco: ["Atriz Fictícia 1", "Ator Fictício 2"],    
    nota_avaliacao: 5.9,
    numero_comentarios: 800,
    faixa_etaria: "18",
    indicacoes_premios: [],
    sinopse: 'A série "Wandinha" foca na filha da Família Addams em uma escola para jovens com poderes sobrenaturais. Lá, ela tenta controlar suas habilidades psíquicas enquanto investiga uma onda de assassinatos misteriosos na cidade, descobrindo segredos sobre a escola, sua família e uma antiga profecia que a envolve.'
  },
];

const filmesNum = [
  {
    id: 13,
    titulo: "The Chosen",
    tipo: "s",
    temporadas: "3 temporadas",
    fotoThumbnail: "../Imagens/The-Chosen-NI.jpg",
    ano_lancamento: 2017,
    genero: "Drama Religioso",
    elenco: ["Jonathan Roumie", "Shahar Isaac"],
    nota_avaliacao: 9.3,
    numero_comentarios: 7000,
    faixa_etaria: "12",
    indicacoes_premios: [],
    sinopse: "A série retrata a vida de Jesus Cristo sob a perspectiva das pessoas que o conheceram e seguiram, explorando suas vidas, lutas e a forma como seus encontros com Jesus os transformaram para sempre."
  },
  {
    id: 14,
    titulo: "Lupin",
    tipo: "s",
    temporadas: "3 temporadas",
    fotoThumbnail: "../Imagens/Lupin.png",
    ano_lancamento: 2021,
    genero: "Suspense, Crime",
    elenco: ["Omar Sy", "Clotilde Hesme"],
    nota_avaliacao: 7.8,
    numero_comentarios: 6400,
    faixa_etaria: "14",
    indicacoes_premios: [],
    sinopse: "Inspirado pelas aventuras de Arsène Lupin, o ladrão de casaca Assane Diop busca vingança pela injustiça cometida contra seu pai por uma família rica. Usando seu carisma e maestria em disfarces, ele executa roubos elaborados."
  },
  {
    id: 15,
    titulo: "Stranger Things",
    tipo: "s",
    fotoThumbnail: "../Imagens/stVertical.jpeg",
    ano_lancamento: 2016,
    temporadas: "4 temporadas",
    genero: "Ficção Científica, Terror",
    elenco: ["Millie Bobby Brown", "Finn Wolfhard"],
    nota_avaliacao: 8.7,
    numero_comentarios: 15230,
    faixa_etaria: "14",
    indicacoes_premios: ["Emmy"],
    sinopse: "Em uma pequena cidade, um grupo de amigos se envolve em uma série de eventos sobrenaturais quando um garoto desaparece. Eles acabam descobrindo uma misteriosa menina com poderes telecinéticos e revelam experimentos secretos do governo."
  },
  {
    id: 16,
    titulo: "The Good Place",
    fotoThumbnail: "../Imagens/The-Good-Place-NI.webp",
    tipo: "s",
    ano_lancamento: 2016,
    genero: "Comédia, Fantasia",
    elenco: ["Kristen Bell", "Ted Danson"],
    temporadas: "4 temporadas",
    nota_avaliacao: 8.2,
    numero_comentarios: 5400,
    faixa_etaria: "12",
    indicacoes_premios: ["Emmy"],
    sinopse: "Após sua morte, Eleanor Shellstrop é enviada por engano para o 'Lugar Bom'. Percebendo que não pertence àquele lugar, ela busca a ajuda de sua alma gêmea para aprender a ser uma pessoa melhor e garantir sua permanência."
  },
  {
    id: 17,
    titulo: "Cobra Kai",
    fotoThumbnail: "../Imagens/Cobra-Kai-NI.jpg",
    tipo: "s",
    temporadas: "6 temporadas",
    ano_lancamento: 2018,
    genero: "Ação, Drama",
    elenco: ["Ralph Macchio", "William Zabka"],
    nota_avaliacao: 8.6,
    numero_comentarios: 8600,
    faixa_etaria: "14",
    indicacoes_premios: [],
    sinopse: "Décadas após o torneio de karatê de 1984, Johnny Lawrence reabre o dojo Cobra Kai. Isso reacende sua rivalidade com Daniel LaRusso, e a vida dos dois e de uma nova geração de lutadores se entrelaçam."
  },
  {
    id: 18,
    titulo: "Arrow",
    tipo: "s",
    fotoThumbnail: "../Imagens/Arrow-NI.jpg",
    ano_lancamento: 2012,
    genero: "Ação, Super-herói",
    elenco: ["Stephen Amell", "Katie Cassidy"],
    temporadas: "8 temporadas",
    nota_avaliacao: 7.5,
    numero_comentarios: 9100,
    faixa_etaria: "14",
    indicacoes_premios: [],
    sinopse: "Após ser dado como morto por cinco anos, o bilionário Oliver Queen retorna à sua cidade com uma nova missão: combater o crime como um vigilante encapuzado, usando suas habilidades com arco e flecha para caçar os corruptos."
  },
  {
    id: 19,
    titulo: "Ratched",
    tipo: "s",
    fotoThumbnail: "../Imagens/ratched1.jpg",
    ano_lancamento: 2020,
    genero: "Drama, Suspense",
    elenco: ["Sarah Paulson", "Finn Wittrock"],
    temporadas: "8 episódios",
    nota_avaliacao: 7.3,
    numero_comentarios: 3200,
    faixa_etaria: "16",
    indicacoes_premios: [],
    sinopse: "Em 1947, a série explora a origem de Mildred Ratched, a icônica enfermeira do filme 'Um Estranho no Ninho', mostrando sua jornada de uma simples enfermeira a uma figura manipuladora e monstruosa dentro de um hospital psiquiátrico."
  },
  {
    id: 20,
    titulo: "The Witcher",
    tipo: "s",
    fotoThumbnail: "../Imagens/The-Witcher-NI.jpeg",
    ano_lancamento: 2019,
    genero: "Fantasia, Ação",
    elenco: ["Henry Cavill", "Anya Chalotra"],
    temporadas: "3 temporadas",
    nota_avaliacao: 8.2,
    numero_comentarios: 14500,
    faixa_etaria: "16",
    indicacoes_premios: ["Emmy"],
    sinopse: "Geralt de Rívia, um caçador de monstros solitário, luta para encontrar seu lugar em um mundo onde as pessoas frequentemente se mostram mais perversas do que as bestas. Seu destino se entrelaça com o de uma jovem princesa e uma feiticeira."
  },
  {
    id: 21,
    titulo: "O Atirador",
    tipo: "f",
    fotoThumbnail: "../Imagens/O-Atirador-NI.jpg",
    ano_lancamento: 2007,
    genero: "Ação, Suspense",
    elenco: ["Mark Wahlberg", "Danny Glover"],
    duracao: "2h 6min",
    nota_avaliacao: 7.2,
    numero_comentarios: 2100,
    faixa_etaria: "16",
    indicacoes_premios: [],
    sinopse: "Um exímio atirador de elite da marinha é convencido a voltar à ativa para impedir um atentado. No entanto, ele é traído e se torna o principal suspeito, precisando usar todas as suas habilidades para caçar os verdadeiros culpados."
  },
  {
    id: 22,
    titulo: "Como Treinar Seu Dragão",
    tipo:"f",
    temporadas: null,
    fotoThumbnail: "../Imagens/Como-Treinar-Seu-Dragao-NI.jpeg",
    ano_lancamento: 2010,
    genero: "Animação, Aventura",
    elenco: ["Jay Baruchel", "Gerard Butler"],
    duracao: "1h 38min",
    nota_avaliacao: 8.1,
    numero_comentarios: 12000,
    faixa_etaria: "L",
    indicacoes_premios: ["Oscar"],
    sinopse: "Na ilha de Berk, lutar contra dragões é um estilo de vida. Soluço, um jovem viking, muda tudo quando faz amizade com um temido dragão da espécie Fúria da Noite, provando que humanos e dragões podem conviver em paz."
  },
];

/* ==========================================================
   SEEDER SIMPLES
   ========================================================== */

async function run() {
  console.log('➡️  Iniciando seed de filmes (simples, sem merge/slug manual)...');
  await sequelize.authenticate();

  // junta todas as listas
  const all = [...filmes, ...filmes2, ...filmesNum];

  // remove 'id' para não colidir com autoIncrement; sem normalização adicional
  const payload = all.map(({ id, ...rest }) => rest);

  // transação + bulkCreate com validação e hooks (para gerar slug no hook)
  await sequelize.transaction(async (t) => {
    const created = await Filme.bulkCreate(payload, {
      validate: true,
      hooks: true,       // garante que o hook beforeValidate do model rode (gera slug)
      returning: true,   // útil se você quiser logar algo do retorno
      transaction: t,
    });
    console.log(`✅ Inseridos: ${created.length} registros em filmes`);
  });

  await sequelize.close();
  console.log('🎉 Seed concluído.');
}

// run
run().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
