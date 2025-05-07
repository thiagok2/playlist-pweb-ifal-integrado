import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    data_nascimento: {
      type: DataTypes.DATEONLY
    },
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });

  return Usuario;
};
