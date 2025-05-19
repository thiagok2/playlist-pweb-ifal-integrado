import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Mensalidade Model', () => {
  it('Deve criar uma mensalidade com dados válidos', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    const mensalidade = await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 99.90,
      data_pagamento: new Date('2023-10-01'),
      ano_mes: '2023-10',
      status: 'pago',
    });

    expect(mensalidade).to.have.property('id');
    expect(mensalidade.id_usuario).to.equal(usuario.id);
    expect(parseFloat(mensalidade.valor)).to.equal(99.90);
    expect(mensalidade.ano_mes).to.equal('2023-10');
    expect(mensalidade.status).to.equal('pago');
  });

  it('Não deve criar uma mensalidade sem id_usuario', async () => {
    try {
      await db.Mensalidade.create({
        valor: 99.90,
        data_pagamento: new Date('2023-10-01'),
        ano_mes: '2023-10',
        status: 'pago',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar uma mensalidade sem valor', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    try {
      await db.Mensalidade.create({
        id_usuario: usuario.id,
        data_pagamento: new Date('2023-10-01'),
        ano_mes: '2023-10',
        status: 'pago',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar uma mensalidade com ano_mes inválido', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    // Teste 1: Mês inválido (13)
    try {
      await db.Mensalidade.create({
        id_usuario: usuario.id,
        valor: 99.90,
        data_pagamento: new Date('2023-10-01'),
        ano_mes: '2023-13',
        status: 'pago',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
      expect(error.message).to.include('Mês deve estar entre 01 e 12');
    }

    // Teste 2: Formato inválido
    try {
      await db.Mensalidade.create({
        id_usuario: usuario.id,
        valor: 99.90,
        data_pagamento: new Date('2023-10-01'),
        ano_mes: '2023/10',
        status: 'pago',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
      expect(error.message).to.include('Formato de ano_mes deve ser YYYY-MM');
    }

    // Teste 3: Ano inválido
    try {
      await db.Mensalidade.create({
        id_usuario: usuario.id,
        valor: 99.90,
        data_pagamento: new Date('2023-10-01'),
        ano_mes: '1899-12',
        status: 'pago',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
      expect(error.message).to.include('Ano deve estar entre 2000 e 9999');
    }
  });

  it('Não deve criar uma mensalidade com status inválido', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    try {
      await db.Mensalidade.create({
        id_usuario: usuario.id,
        valor: 99.90,
        data_pagamento: new Date('2023-10-01'),
        ano_mes: '2023-10',
        status: 'invalido',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeDatabaseError');
      expect(error.message).to.include('invalid input value for enum');
    }
  });

  it('Deve associar um usuário a múltiplas mensalidades', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 99.90,
      data_pagamento: new Date('2023-10-01'),
      ano_mes: '2023-10',
      status: 'pago',
    });

    await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 99.90,
      data_pagamento: null,
      ano_mes: '2023-11',
      status: 'pendente',
    });

    const mensalidades = await usuario.getMensalidades();
    expect(mensalidades).to.have.lengthOf(2);
    expect(mensalidades.map(m => m.ano_mes)).to.include.members(['2023-10', '2023-11']);
    expect(mensalidades.map(m => m.status)).to.include.members(['pago', 'pendente']);
  });
});