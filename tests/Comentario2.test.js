import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Comentario2 Model - Validações adicionais', () => {
  //tanto o usuario como o filme são utilizados sempre para cada comentário, vamos colocar eles dentro de 
  //um bloco beforeEach
  let usuario, filme;

  beforeEach(async () => {
    // Limpa e recria o banco antes de cada teste p
    await sequelize.sync({ force: true });

    usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    filme = await db.Filme.create({
      titulo: 'Filme Teste',
      genero: 'Ação',
      duracao: 120,
      ano_lancamento: 2023,
      nota_avaliacao: 8.5,
    });
  });

  it('Deve criar um comentário com texto de até 500 caracteres', async () => {
    const textoValido = 'A'.repeat(500);

    const comentario = await db.Comentario.create({
      id_usuario: usuario.id,
      id_filme: filme.id,
      texto: textoValido,
      avaliacao: 8.0,
    });

    expect(comentario.texto).to.have.lengthOf(500);
  });

  it('Não deve criar comentário com texto maior que 500 caracteres', async () => {
    const textoLongo = 'A'.repeat(501);

    try {
      await db.Comentario.create({
        id_usuario: usuario.id,
        id_filme: filme.id,
        texto: textoLongo,
        avaliacao: 7.0,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
      expect(error.errors[0].message).to.equal('O comentário deve ter no máximo 500 caracteres.');
    }
  });

  it('Não deve criar comentário com data no futuro', async () => {
    const dataFutura = new Date(Date.now() + 24 * 60 * 60 * 1000); // amanhã

    try {
      await db.Comentario.create({
        id_usuario: usuario.id,
        id_filme: filme.id,
        texto: 'Comentário com data futura',
        data_comentario: dataFutura,
        avaliacao: 6.0,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
      expect(error.errors[0].message).to.equal('A data do comentário não pode ser no futuro.');
    }
  });

  it('Deve aceitar data atual ou passada no comentário', async () => {
    const dataAtual = new Date();
    const dataPassada = new Date('2022-01-01');

    const comentarioAtual = await db.Comentario.create({
      id_usuario: usuario.id,
      id_filme: filme.id,
      texto: 'Comentário com data atual',
      data_comentario: dataAtual,
      avaliacao: 5.5,
    });

    const comentarioPassado = await db.Comentario.create({
      id_usuario: usuario.id,
      id_filme: filme.id,
      texto: 'Comentário com data passada',
      data_comentario: dataPassada,
      avaliacao: 5.5,
    });

    expect(new Date(comentarioAtual.data_comentario).getTime()).to.be.closeTo(dataAtual.getTime(), 1000);
    expect(new Date(comentarioPassado.data_comentario)).to.deep.equal(dataPassada);
  });
});
