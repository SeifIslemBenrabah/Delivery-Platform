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
      const url = `http://localhost:8082/api/v1/auth/verify-token`;
      console.log(token);
      console.log('URL:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      if (response.status !== 200) {
       // console.log(response)
        console.log('Invalid token response:', response.status);
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
