const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation échouée',
      details: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Cette ressource existe déjà' });
  }

  res.status(err.status || 500).json({ error: err.message || 'Erreur interne' });
};

module.exports = errorHandler;