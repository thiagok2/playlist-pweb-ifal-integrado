import 'dotenv/config.js';
import { sequelize, Usuario } from '../models/Index.js';

const SENHA = 'Teste@123!';

const USERS = [
  { login: 'ana.souza',        nome: 'Ana Beatriz Souza',      apelido: 'Bia',      email: 'ana.souza@example.com',        senha: SENHA, avatar_url: 'https://i.pinimg.com/474x/c0/8e/6c/c08e6c9595e03202a46a95f66578799f.jpg' },
  { login: 'bruno.costa',      nome: 'Bruno Oliveira Costa',   apelido: 'Bruninho', email: 'bruno.costa@example.com',      senha: SENHA, avatar_url: 'https://i.pinimg.com/564x/b2/a0/29/b2a029a6c2757e9d3a09265e3d07d49d.jpg' },
  { login: 'carla.martins',    nome: 'Carla Dias Martins',     apelido: 'Cacá',     email: 'carla.martins@example.com',    senha: SENHA, avatar_url: 'https://i.pinimg.com/474x/c0/8e/6c/c08e6c9595e03202a46a95f66578799f.jpg' },
  { login: 'daniel.almeida',   nome: 'Daniel Almeida',         apelido: 'Dani',     email: 'daniel.almeida@example.com',   senha: SENHA, avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7DAUxmpoOjffahuqaSfqvc3w6Pa1kJjKeOA&s' },
  { login: 'eduarda.ferreira', nome: 'Eduarda Lima Ferreira',  apelido: 'Duda',     email: 'eduarda.ferreira@example.com', senha: SENHA, avatar_url: 'https://loodibee.com/wp-content/uploads/Netflix-avatar-2-300x300.png' },
  { login: 'felipe.rocha',     nome: 'Felipe Rocha',           apelido: 'Lipe',     email: 'felipe.rocha@example.com',     senha: SENHA, avatar_url: 'https://loodibee.com/wp-content/uploads/Netflix-avatar-8-300x300.png' },
  { login: 'gabriela.p',       nome: 'Gabriela Pereira',       apelido: 'Gabi',     email: 'gabriela.p@example.com',       senha: SENHA, avatar_url: 'https://i.pinimg.com/236x/20/b3/31/20b33159c69b9af6701eaf07f2bb638a.jpg' },
  { login: 'heitor.goncalves', nome: 'Heitor Gonçalves',       apelido: 'Heitor',   email: 'heitor.goncalves@example.com', senha: SENHA, avatar_url: 'https://wallpapers.com/images/featured/netflix-profile-pictures-w3lqr61qe57e9yt8.jpg' },
  { login: 'isabela.santos',   nome: 'Isabela Santos',         apelido: 'Bela',     email: 'isabela.santos@example.com',   senha: SENHA, avatar_url: 'https://i.pinimg.com/564x/a4/c6/5f/a4c65f709d4c0cb1b4329c12beb9cd78.jpg' },
  { login: 'jp.azevedo',       nome: 'João Pedro Azevedo',     apelido: 'JP',       email: 'jp.azevedo@example.com',       senha: SENHA, avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQps70kliI5ZYNdtKxMUPju3TEzaaIyv3hCsmdx_qMdLHR47ECmwBmw1Zbcj23j8USO6-U&usqp=CAU' },
];

async function run() {
  try {
    await sequelize.query('TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE');

    for (const u of USERS) {
      await Usuario.create(u); // hooks de senha rodam aqui ✔
    }

    console.log('✅ seed-usuarios-reset: usuários recriados.');
  } catch (err) {
    console.error('❌ seed-usuarios-reset falhou:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
