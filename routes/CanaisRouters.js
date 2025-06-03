import express from 'express';
import { Op } from 'sequelize';
import { Canal, Filme } from '../models/Index.js';

const router = express.Router();

// GET /canais - lista todos os canais
// GET /canais?genero_tema=valor - lista todos ou filtra por genero_tema
router.get('/', async (req, res) => {
  const { genero_tema } = req.query;

  try {
    const where = {};

    if (genero_tema) {
      where.genero_tema = {
        [Op.iLike]: `%${genero_tema}%`, // usa ILIKE para case-insensitive
      };
    }

    const canais = await Canal.findAll({ where });
    res.json(canais);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar canais.' });
  }
});

// GET /canais/:id - retorna canal com os filmes
router.get('/:id', async (req, res) => {
  try {
    const canal = await Canal.findByPk(req.params.id, {
      include: [{
        model: Filme,
        through: { attributes: ['data_recomendacao'] }
      }],
    });

    if (!canal) return res.status(404).json({ error: 'Canal não encontrado.' });

    res.json(canal);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar canal.' });
  }
});

// POST /canais - cria novo canal
router.post('/', async (req, res) => {
  try {
    const { nome, data_criacao, genero_tema } = req.body;

    const novoCanal = await Canal.create({
      nome,
      data_criacao,
      genero_tema,
    });

    res.status(201).json(novoCanal);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar canal.' });
  }
});

// PUT /canais/:id - atualiza canal
router.put('/:id', async (req, res) => {
  try {
    const canal = await Canal.findByPk(req.params.id);
    if (!canal) return res.status(404).json({ error: 'Canal não encontrado.' });

    const { nome, data_criacao, genero_tema } = req.body;
    await canal.update({ nome, data_criacao, genero_tema });

    res.json(canal);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar canal.' });
  }
});

// DELETE /canais/:id - remove canal
router.delete('/:id', async (req, res) => {
  try {
    const canal = await Canal.findByPk(req.params.id);
    if (!canal) return res.status(404).json({ error: 'Canal não encontrado.' });

    await canal.destroy();
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar canal.' });
  }
});

// GET /canais/melhores-avaliados - canais com filmes de maior nota média
router.get('/avaliacoes/melhores', async (req, res) => {
  try {
    const canais = await Canal.findAll({
      include: [
        {
          model: Filme,
          attributes: ['id', 'titulo', 'nota_avaliacao'],
          through: { attributes: [] }, // não retorna dados da tabela intermediária
        },
      ],
    });

    // Ordena localmente pela nota média dos filmes por canal
    const canaisOrdenados = canais
      .map(canal => {
        const filmes = canal.Filmes || [];
        const notaMedia =
          filmes.length > 0
            ? filmes.reduce((sum, f) => sum + (f.nota_avaliacao || 0), 0) / filmes.length
            : 0;
        return {
          ...canal.toJSON(),
          nota_media_filmes: notaMedia,
        };
      })
      .sort((a, b) => b.nota_media_filmes - a.nota_media_filmes);

    res.json(canaisOrdenados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar canais com melhores avaliações.' });
  }
});

// POST /canais/:id/filmes - associa canal a filme
router.post('/:id/add-filme', async (req, res) => {
  const { id } = req.params;
  const { id_filme, data_recomendacao } = req.body;

  try {
    const canal = await Canal.findByPk(id);
    if (!canal) return res.status(404).json({ error: 'Canal não encontrado.' });

    const filme = await Filme.findByPk(id_filme);
    if (!filme) return res.status(404).json({ error: 'Filme não encontrado.' });

    // Evita duplicidade (opcional)
    const existe = await CanalFilme.findOne({
      where: { id_canal: id, id_filme }
    });

    if (existe) {
      return res.status(409).json({ error: 'Relação já existente entre canal e filme.' });
    }

    // Cria a associação
    const associacao = await CanalFilme.create({
      id_canal: id,
      id_filme,
      data_recomendacao: data_recomendacao || new Date(),
    });

    res.status(201).json(associacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao associar filme ao canal.' });
  }
});


export default router;
