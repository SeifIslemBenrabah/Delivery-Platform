const fetch = require('node-fetch'); 
const {client,getServiceUrl} = require('../config/eureka-client');

function auth() {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Authorization header missing or malformed');
      }

      const token = authHeader.split(' ')[1];
      const url = `${getServiceUrl('MS-GATEWAY')}/service-user/api/v1/auth/verify-token`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (response.status !== 200) {
        return res.status(403).send('Invalid token');
      }

      const data = await response.json();

      req.user = {
        username: data.username,
        roles: data.roles,
      };

      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      res.status(500).send('Internal Server Error');
    }
  };
}

module.exports = auth;
