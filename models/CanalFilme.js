import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CanalFilme = sequelize.define('CanalFilme', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_canal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_filme: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data_recomendacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'canal_filmes',
    timestamps: false,
  });

  return CanalFilme;
};
