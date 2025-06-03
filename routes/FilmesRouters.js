import express from 'express';
import { Op } from 'sequelize';
import { Filme } from '../models/Index.js';

const router = express.Router();

// GET /filmes/search?q=valor - busca por título ou gênero com LIKE
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });

  try {
    const filmes = await Filme.findAll({
      where: {
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${q}%` } },
          { genero: { [Op.iLike]: `%${q}%` } },
        ],
      },
    });
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filmes', details: err.message });
  }
});

router.get('/por-genero/:genero', async (req, res) => {
  const { genero } = req.params;
  const { sort, ordem } = req.query;
  
  const sortField = (sort === 'ano') ? 'ano_lancamento' :
                    (sort === 'nota') ? 'nota_avaliacao' :
                    null;

  const sortOrder = (ordem?.toLowerCase() === 'desc') ? 'DESC' : 'ASC';

  const options = {
    where: {
      genero: { [Op.iLike]: genero },
    },
  };

  if (sortField) {
    options.order = [[sortField, sortOrder]];
  }

  try {
    const filmes = await Filme.findAll(options);
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filmes por gênero', details: err.message });
  }
});

// GET /filmes/ultimos-lancamentos - últimos 10 lançamentos por ano, desempate por createdAt
router.get('/ultimos-lancamentos', async (req, res) => {
  try {
    const filmes = await Filme.findAll({
      order: [
        ['ano_lancamento', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: 10,
    });
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar últimos lançamentos', details: err.message });
  }
});

// GET /filmes/melhores-avaliados - top 10 por nota_avaliacao
router.get('/melhores-avaliados', async (req, res) => {
  try {
    const filmes = await Filme.findAll({
      order: [
        ['nota_avaliacao', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: 10,
    });
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar melhores avaliados', details: err.message });
  }
});


// GET /filmes - listar todos
router.get('/', async (req, res) => {
  const { sort, ordem } = req.query;

  const sortField = (sort === 'ano') ? 'ano_lancamento' :
                    (sort === 'nota') ? 'nota_avaliacao' :
                    null;

  const sortOrder = (ordem?.toLowerCase() === 'desc') ? 'DESC' : 'ASC';

  const options = {};
  if (sortField) {
    options.order = [[sortField, sortOrder]];
  }

  try {
    const filmes = await Filme.findAll(options);
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filmes', details: err.message });
  }
});

// GET /filmes/:id - buscar por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const filme = await Filme.findByPk(id);
  if (!filme) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }
  res.json(filme);
});

// POST /filmes - criar novo
router.post('/', async (req, res) => {
  try {
    const filme = await Filme.create(req.body);
    res.status(201).json(filme);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar filme', details: err });
  }
});

// PUT /filmes/:id - atualizar
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Filme.update(req.body, { where: { id } });
    if (updated) {
      const updatedFilme = await Filme.findByPk(id);
      return res.json(updatedFilme);
    }
    return res.status(404).json({ error: 'Filme não encontrado' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar filme', details: err });
  }
});

// DELETE /filmes/:id - remover
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Filme.destroy({ where: { id } });
  if (deleted) {
    return res.json({ message: 'Filme removido com sucesso' });
  }
  return res.status(404).json({ error: 'Filme não encontrado' });
});

export default router;