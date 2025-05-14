import sequelize from '../config/database.js'; // Importa a instância do Sequelize
import { Usuario } from '../models/Index.js'; // Importa o modelo do Usuário

async function testModels() {
  try {
    // Sincroniza as tabelas antes de tentar qualquer operação
    await sequelize.sync(); // ou use { force: true } para recriar as tabelas

    // Criando um usuário
    const usuario = await Usuario.create({
      nome: 'Teste Usuario',
      login: 'teste@usuario.com',
    });

    console.log('Usuário criado com sucesso:', usuario.toJSON());

    // Buscando o usuário
    const usuarioBusca = await Usuario.findOne({
      where: { id: usuario.id },
    });

    console.log('Usuário encontrado:', usuarioBusca.toJSON());
  } catch (error) {
    console.error('Erro ao criar ou buscar usuário:', error);
  } finally {
    sequelize.close();
  }
}

testModels();
