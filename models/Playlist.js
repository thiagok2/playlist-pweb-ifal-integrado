import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize) => {
  const Playlist = sequelize.define('Playlist', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(200),
    },
    data_criacao: {
      type: DataTypes.DATE,
      default: Sequelize.NOW
    },
  }, {
    tableName: 'playlists',
    timestamps: false,
  });

  return Playlist;
};
