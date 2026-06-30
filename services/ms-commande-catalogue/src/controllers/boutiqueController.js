const { Boutique, Produit, Catalogue } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const boutiques = await Boutique.findAll({
      include: [{ model: Catalogue, as: 'catalogues' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(boutiques);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const boutique = await Boutique.findByPk(req.params.id, {
      include: [
        { model: Catalogue, as: 'catalogues', include: [{ model: Produit, as: 'produits' }] },
      ],
    });
    if (!boutique) return res.status(404).json({ error: 'Boutique introuvable' });
    res.json(boutique);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { nomBoutique, address } = req.body;
    if (!nomBoutique || !address) {
      return res.status(400).json({ error: 'nomBoutique et address sont requis' });
    }
    const photoFrontBoutique = req.file?.path ?? null;
    const boutique = await Boutique.create({
      nomBoutique,
      address,
      photoFrontBoutique,
      idCommercant: req.user.userId,
    });
    res.status(201).json(boutique);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const boutique = await Boutique.findByPk(req.params.id);
    if (!boutique) return res.status(404).json({ error: 'Boutique introuvable' });
    if (boutique.idCommercant !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    const { nomBoutique, address } = req.body;
    if (nomBoutique) boutique.nomBoutique = nomBoutique;
    if (address)     boutique.address = address;
    if (req.file)    boutique.photoFrontBoutique = req.file.path;
    await boutique.save();
    res.json(boutique);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const boutique = await Boutique.findByPk(req.params.id);
    if (!boutique) return res.status(404).json({ error: 'Boutique introuvable' });
    if (boutique.idCommercant !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    await boutique.destroy();
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };