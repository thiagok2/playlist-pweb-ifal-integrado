import { Usuario, Filme, Comentario } from '../models/Index.js';
import sequelize from '../config/database.js'; // Importa a instância do Sequelize

async function testRelacionamento() {
  try {
    await sequelize.sync(); 

    const usuario = await Usuario.create({
      nome: 'Usuario Relacionado',
      login: 'exempo@exemplo.com',
    });

    const filme = await Filme.create({
      titulo: 'Meu Filme',
      genero: 'Ação',
      duracao: '100',
      ano_lancamento: '2025',
    });
    const comentario = await Comentario.create({
      id_usuario: usuario.id,
      id_filme: filme.id,
      texto: 'ARRR',
    });

    console.log('Comentário criado:', comentario.toJSON());
  } catch (error) {
    console.error('Erro ao criar ou associar dados:', error);
  } finally {
    sequelize.close();
  }
}

testRelacionamento();
