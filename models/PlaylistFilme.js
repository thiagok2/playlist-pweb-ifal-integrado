import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PlaylistFilme = sequelize.define('PlaylistFilme', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_playlist: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'playlists', key: 'id' },
      onDelete: 'CASCADE', onUpdate: 'CASCADE',
    },
    id_canal: {
      type: DataTypes.INTEGER,
      references: { model: 'canais', key: 'id' },
      onDelete: 'SET NULL', onUpdate: 'CASCADE',
    },
    id_filme: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'filmes', key: 'id' },
      onDelete: 'SET NULL', onUpdate: 'CASCADE',
    },
    assistido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tempo_assistido: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    data_visualizacao: {
      type: DataTypes.DATE,
    },
    nota_avaliacao_usuario: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
  }, {
    tableName: 'playlist_filmes',
    timestamps: true,
    indexes: [
    { unique: true, fields: ['id_playlist', 'id_filme'] },
    { fields: ['id_playlist'] },
    { fields: ['id_filme'] },
  ]
  });

  return PlaylistFilme;
};
