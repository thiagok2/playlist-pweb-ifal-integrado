// server.js (ou outro nome que você preferir)
import { sequelize, Usuario, Filme, Canal, CanalFilme, Playlist, Comentario } from './models/Index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true }); // Isso agora criará TODAS as tabelas com base em todos os modelos importados e relacionados
    console.log('✅ Tabelas sincronizadas com sucesso.');

    // Exemplo de uso:
    const novoUsuario = await Usuario.create({
      login: 'thiago2.oliveira',
      nome: 'Thiago2 Oliveira',
      email: 'thiago2soliveira@ifal.edu.br'
    });

    const usuarios = await Usuario.findAll();
    console.log(`Total de usuários: ${usuarios.length}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ou sincronizar o banco de dados:', error);
  } finally {
    await sequelize.close();
  }
})();
