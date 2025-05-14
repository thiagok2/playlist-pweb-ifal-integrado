import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define('Mensalidade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    data_pagamento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ano_mes: {
      type: DataTypes.STRING(7),
      allowNull: false,
      validate: {
        isValidAnoMes(value) {
          if (!/^\d{4}-\d{2}$/.test(value)) {
            throw new Error('Formato de ano_mes deve ser YYYY-MM');
          }
          const [ano, mes] = value.split('-').map(Number);
          if (mes < 1 || mes > 12) {
            throw new Error('Mês deve estar entre 01 e 12');
          }
          if (ano < 1900 || ano > 9999) {
            throw new Error('Ano deve estar entre 1900 e 9999');
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM('pago', 'pendente', 'atrasado'),
      allowNull: false,
      defaultValue: 'pendente',
    },
  }, {
    tableName: 'mensalidades',
    timestamps: false,
  });