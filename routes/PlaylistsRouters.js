import express from 'express';
import { Playlist, Filme, PlaylistFilme, Usuario } from '../models/Index.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /playlists?id_usuario=123 - Lista playlists de um usuário
router.get('/', async (req, res) => {
  const { id_usuario } = req.query;

  try {
    const where = id_usuario ? { id_usuario } : undefined;

    const playlists = await Playlist.findAll({
      where,
      include: [{ model: Usuario, attributes: ['id', 'nome'] }],
      order: [['created_at', 'DESC']],
    });

    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar playlists.' });
  }
});


// GET /playlists/:id - Detalha playlist com filmes ordenados por assistido
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: [{
        model: Filme,
        as: 'filmes',
        through: {
          attributes: ['assistido', 'tempo_assistido', 'nota_avaliacao_usuario', 'data_visualizacao'],
        },
      }],
    });

    if (!playlist) return res.status(404).json({ error: 'Playlist não encontrada.' });

    playlist.filmes.sort((a, b) => {
      const aData = a.PlaylistFilme;
      const bData = b.PlaylistFilme;
    
      // 1. Prioriza filmes assistidos
      const assistidoDiff = (bData.assistido === true) - (aData.assistido === true);
      if (assistidoDiff !== 0) return assistidoDiff;
    
      // 2. Prioriza por data_visualizacao mais recente (desc)
      const dateA = aData.data_visualizacao ? new Date(aData.data_visualizacao).getTime() : 0;
      const dateB = bData.data_visualizacao ? new Date(bData.data_visualizacao).getTime() : 0;
      const dateDiff = dateB - dateA;
      if (dateDiff !== 0) return dateDiff;
    
      // 3. Por fim, tempo assistido maior primeiro
      return (bData.tempo_assistido || 0) - (aData.tempo_assistido || 0);
    });

    res.json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar playlist.' });
  }
});

// POST /playlists - Cria nova playlist
router.post('/', async (req, res) => {
  const { id_usuario, nome } = req.body;

  if (!id_usuario || !nome) {
    return res.status(400).json({ error: 'Campos obrigatórios: id_usuario e nome.' });
  }

  try {
    const playlist = await Playlist.create({
      id_usuario,
      nome
    });

    res.status(201).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar playlist.' });
  }
});

// POST /playlists/:id/filmes - Adiciona um filme à playlist
router.post('/:id/filmes', async (req, res) => {
  const { id } = req.params;
  const { id_filme, assistido, tempo_assistido, nota_avaliacao_usuario, data_visualizacao } = req.body;

  try {
    const [playlist, filme] = await Promise.all([
      Playlist.findByPk(id),
      Filme.findByPk(id_filme),
    ]);

    if (!playlist) return res.status(404).json({ error: 'Playlist não encontrada.' });
    if (!filme) return res.status(404).json({ error: 'Filme não encontrado.' });

    const [record, created] = await PlaylistFilme.findOrCreate({
      where: {
        id_playlist: id,
        id_filme,
      },
      defaults: {
        assistido,
        tempo_assistido,
        nota_avaliacao_usuario,
        data_visualizacao,
      },
    });

    if (!created) {
      return res.status(409).json({ error: 'Filme já está na playlist.' });
    }

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar filme à playlist.' });
  }
});

// DELETE /playlists/:id/filmes/:id_filme - Remove filme da playlist
router.delete('/:id/filmes/:id_filme', async (req, res) => {
  const { id, id_filme } = req.params;

  try {
    const deleted = await PlaylistFilme.destroy({
      where: {
        id_playlist: id,
        id_filme,
      },
    });

    if (!deleted) return res.status(404).json({ error: 'Filme não estava na playlist.' });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover filme da playlist.' });
  }
});


// POST /playlists/:id/filmes/lote - Adiciona vários filmes à playlist
router.post('/:id/filmes/lote', async (req, res) => {
  const { id } = req.params;
  const { filmes } = req.body;

  if (!Array.isArray(filmes) || filmes.length === 0) {
    return res.status(400).json({ error: 'Informe uma lista de filmes.' });
  }

  try {
    const playlist = await Playlist.findByPk(id);
    if (!playlist) return res.status(404).json({ error: 'Playlist não encontrada.' });

    const inseridos = [];

    for (const filme of filmes) {
      const { id_filme, assistido = false, tempo_assistido = 0, nota_avaliacao_usuario = null, data_visualizacao = null } = filme;

      const [registro, created] = await PlaylistFilme.findOrCreate({
        where: { id_playlist: id, id_filme },
        defaults: { assistido, tempo_assistido, nota_avaliacao_usuario, data_visualizacao },
      });

      if (created) inseridos.push(registro);
    }

    res.status(201).json({ adicionados: inseridos.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar filmes à playlist.' });
  }
});

export default router;