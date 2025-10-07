import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize) => {
  const Filme = sequelize.define('Filme', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100)
    },
    fotoThumbnail: {
      type: DataTypes.STRING(255)
    },
    tipo: {
      type: DataTypes.STRING(2)
    },
    genero: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    duracao: {
      type: DataTypes.STRING(50)
    },
    ano_lancamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numero_comentarios: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    nota_avaliacao: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0,
        max: 10,
      },
    },
    faixa_etaria: {
      type: DataTypes.STRING(50),
      defaultValue: 'Livre'
    },
    temporadas: {
      type: DataTypes.STRING(50)
    },
    sinopse: {
      type: DataTypes.TEXT
    },

    indicacoes_premios: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArrayOfStrings(v) {
          if (!Array.isArray(v)) throw new Error('indicacoes_premios deve ser array');
          for (const x of v) {
            if (typeof x !== 'string') throw new Error('indicacoes_premios: itens devem ser string');
          }
        }
      }
    },

    elenco: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArrayOfStrings(v) {
          if (!Array.isArray(v)) throw new Error('elenco deve ser array');
          for (const x of v) {
            if (typeof x !== 'string') throw new Error('elenco: itens devem ser string');
          }
        }
      }
    },
    
  }, {
    tableName: 'filmes',
    timestamps: true,
    hooks: {
      beforeValidate: (filme) => {
        if (!filme.slug && filme.titulo) {
          filme.slug = filme.titulo
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 100);
        }
      },
    },
    indexes: [
      { unique: true, fields: ['slug'] },
      { using: 'gin', fields: ['indicacoes_premios'] },
      { using: 'gin', fields: ['elenco'] },
      { fields: ['ano_lancamento'] },
    ]
  });

  return Filme;
};