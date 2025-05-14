import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Canal Model', () => {
  it('Deve criar um canal com dados válidos', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal Teste',
      data_criacao: '2023-01-01',
      genero_tema: 'Entretenimento',
    });

    expect(canal).to.have.property('id');
    expect(canal.nome).to.equal('Canal Teste');
    expect(canal.genero_tema).to.equal('Entretenimento');
  });

  it('Não deve criar um canal sem nome', async () => {
    try {
      await db.Canal.create({
        data_criacao: '2023-01-01',
        genero_tema: 'Entretenimento',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar um canal sem data_criacao', async () => {
    try {
      await db.Canal.create({
        nome: 'Canal Sem Data',
        genero_tema: 'Entretenimento',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar um canal sem genero_tema', async () => {
    try {
      await db.Canal.create({
        nome: 'Canal Sem Tema',
        data_criacao: '2023-01-01',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });
});