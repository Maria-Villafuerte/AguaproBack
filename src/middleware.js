import jwt from 'jsonwebtoken';
import { rolePermissions } from './accessRoles.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.status(401).send('No token provided');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send(`Forbidden: ${err.message}`);
    }
    req.user = user;
    next();
  });

}

export function authorizeRole(resource) {
  return (req, res, next) => {
    const userRole = req.user.role;

    // Check if the user's role has permission for the specified resource
    if (!rolePermissions[userRole]?.includes(resource)) {
      return res.status(403).send('Access denied');
    }

    next();
  };
}