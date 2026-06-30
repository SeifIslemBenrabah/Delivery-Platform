const jwt = require('jsonwebtoken');

// Express route middleware
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  try {
    const payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = { userId: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Socket.IO handshake middleware
const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Token manquant'));
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    next(new Error('Token invalide'));
  }
};

module.exports = { authenticate, authenticateSocket };