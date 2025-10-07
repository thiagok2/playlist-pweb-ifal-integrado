import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Canal Model', () => {
  it('Deve criar um canal com dados válidos', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    const canal = await db.Canal.create({
      nome: 'Canal Teste',
      genero_tema: 'Entretenimento',
      id_usuario: usuario.id
    });

    expect(canal).to.have.property('id');
    expect(canal.nome).to.equal('Canal Teste');
    expect(canal.genero_tema).to.equal('Entretenimento');
  });

  it('Não deve criar um canal sem nome', async () => {
    try {
      await db.Canal.create({
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
        nome: 'Canal Sem Tema'
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });
});