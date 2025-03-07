import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: {
        code: 'AUTH_TOKEN_MISSING',
        message: 'Authentication token is required'
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: {
          code: 'AUTH_TOKEN_INVALID',
          message: 'Invalid or expired token'
        }
      });
    }
    req.user = user;
    next();
  });
}