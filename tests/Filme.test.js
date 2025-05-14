import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Filme Model', () => {
  it('Deve criar um filme com dados válidos', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme Teste',
      genero: 'Ação',
      duracao: 120,
      ano_lancamento: 2023,
      nota_avaliacao: 8.5,
    });

    expect(filme).to.have.property('id');
    expect(filme.titulo).to.equal('Filme Teste');
    expect(parseFloat(filme.nota_avaliacao)).to.equal(8.5);
  });

  it('Não deve criar um filme sem título', async () => {
    try {
      await db.Filme.create({
        genero: 'Ação',
        duracao: 120,
        ano_lancamento: 2023,
        nota_avaliacao: 8.5,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar um filme com nota_avaliacao fora do intervalo', async () => {
    try {
      await db.Filme.create({
        titulo: 'Filme Inválido',
        genero: 'Ação',
        duracao: 120,
        ano_lancamento: 2023,
        nota_avaliacao: 11,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar um filme sem gênero', async () => {
    try {
      await db.Filme.create({
        titulo: 'Filme Sem Gênero',
        duracao: 120,
        ano_lancamento: 2023,
        nota_avaliacao: 8.5,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });
});