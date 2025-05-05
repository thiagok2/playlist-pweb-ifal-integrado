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
    },
    id_canal: {
      type: DataTypes.INTEGER,
    },
    id_filme: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    timestamps: false,
  });

  return PlaylistFilme;
};
