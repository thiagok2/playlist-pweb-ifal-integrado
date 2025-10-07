import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Canal = sequelize.define('Canal', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    genero_tema: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE',
    },
    numero_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'canais',
    timestamps: true,
  });

  return Canal;
};
