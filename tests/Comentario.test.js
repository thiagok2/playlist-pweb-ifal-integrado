import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Comentario Model', () => {
  it('Deve criar um comentário com dados válidos', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Teste',
      genero: 'Ação',
      duracao: 120,
      ano_lancamento: 2023,
      nota_avaliacao: 8.5,
    });

    const comentario = await db.Comentario.create({
      id_usuario: usuario.id,
      id_filme: filme.id,
      texto: 'Ótimo filme!',
      avaliacao: 9.0,
    });

    expect(comentario).to.have.property('id');
    expect(comentario.id_usuario).to.equal(usuario.id);
    expect(comentario.id_filme).to.equal(filme.id);
    expect(comentario.texto).to.equal('Ótimo filme!');
    expect(parseFloat(comentario.avaliacao)).to.equal(9);
  });

  it('Não deve criar um comentário sem texto', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Teste',
      genero: 'Ação',
      duracao: 120,
      ano_lancamento: 2023,
      nota_avaliacao: 8.5,
    });

    try {
      await db.Comentario.create({
        id_usuario: usuario.id,
        id_filme: filme.id,
        avaliacao: 9.0,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar um comentário com avaliacao fora do intervalo', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Teste',
      genero: 'Ação',
      duracao: 120,
      ano_lancamento: 2023,
      nota_avaliacao: 8.5,
    });

    try {
      await db.Comentario.create({
        id_usuario: usuario.id,
        id_filme: filme.id,
        texto: 'Comentário Inválido',
        avaliacao: 11,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });
});