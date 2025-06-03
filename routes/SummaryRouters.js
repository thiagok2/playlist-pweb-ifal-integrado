import express from 'express';
import { Filme } from '../models/Index.js';

import {  fn, col, literal } from 'sequelize';

const router = express.Router();

/**
 * 1. Total de filmes por gênero
 */
router.get('/filmes-total-por-genero', async (req, res) => {
  try {
    const resultados = await Filme.findAll({
      attributes: [
        'genero',
        [fn('COUNT', col('id')), 'total']
      ],
      group: ['genero'],
      order: [[literal('total'), 'DESC']]
    });

    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar total de filmes por gênero.' });
  }
});

/**
 * 2. Total de filmes por ano de lançamento
 */
router.get('/filmes-total-por-ano', async (req, res) => {
  try {
    const resultados = await Filme.findAll({
      attributes: [
        'ano_lancamento',
        [fn('COUNT', col('id')), 'total']
      ],
      group: ['ano_lancamento'],
      order: [['ano_lancamento', 'ASC']]
    });

    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar total de filmes por ano.' });
  }
});

/**
 * 3. Média de avaliações por ano, por gênero, ou ambos
 * - ?por=ano         → agrupado por ano
 * - ?por=genero      → agrupado por gênero
 * - ?por=ambos       → agrupado por ano e gênero
 */
router.get('/filmes-media-avaliacoes', async (req, res) => {
  const agrupamento = req.query.por;

  let attributes = [];
  let group = [];

  switch (agrupamento) {
    case 'ano':
      attributes = [
        'ano_lancamento',
        [fn('AVG', col('nota_avaliacao')), 'media_avaliacao']
      ];
      group = ['ano_lancamento'];
      break;
    case 'genero':
      attributes = [
        'genero',
        [fn('AVG', col('nota_avaliacao')), 'media_avaliacao']
      ];
      group = ['genero'];
      break;
    case 'ambos':
      attributes = [
        'ano_lancamento',
        'genero',
        [fn('AVG', col('nota_avaliacao')), 'media_avaliacao']
      ];
      group = ['ano_lancamento', 'genero'];
      break;
    default:
      return res.status(400).json({ error: 'Parâmetro "por" inválido. Use: ano, genero ou ambos.' });
  }

  try {
    const resultados = await Filme.findAll({
      attributes,
      group,
      order: group.map(g => [g, 'ASC']),
    });

    // 🔧 Aqui é onde a conversão correta ocorre
    const formatados = resultados.map(r => {
      const data = r.toJSON();
      data.media_avaliacao = parseFloat(data.media_avaliacao);
      return data;
    });

    res.json(formatados); // ✅ Apenas esta linha deve responder
  } catch (err) {
    res.status(500).json({ error: 'Erro ao calcular média de avaliações.' });
  }
});


export default router;
