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
      references: { model: 'canais', key: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE',
    },
    id_filme: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'filmes', key: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE',
    },
    data_recomendacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'canal_filmes',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['id_canal', 'id_filme'] },
      { fields: ['id_filme'] },
    ]
  });


  return CanalFilme;
};
