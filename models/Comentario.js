import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Comentario = sequelize.define('Comentario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_filme: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 500],
          msg: 'O comentário deve ter no máximo 500 caracteres.',
        },
      }
    },
    data_comentario: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isNotFuture(value) {
          if (value && new Date(value) > new Date()) {
            throw new Error('A data do comentário não pode ser no futuro.');
          }
        },
      }
    },
    avaliacao: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0,
        max: 10,
      },
    },
  }, {
    tableName: 'comentarios',
    timestamps: false,
  });

  return Comentario;
};