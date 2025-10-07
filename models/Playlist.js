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
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE',
    },
    nome: {
      type: DataTypes.STRING(200),
    },
    numero_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    numero_adds: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    tableName: 'playlists',
    timestamps: true,
    indexes: [
      { fields: ['id_usuario'] },
      // (opcional) { unique: true, fields: ['id_usuario', 'nome'] },
    ]
  });

  return Playlist;
};
