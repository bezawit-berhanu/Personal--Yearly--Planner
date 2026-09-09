import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bezawit_planner_jwt_secret_2027_super_key_987';

export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function extractAuthUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return null;
  return verifyToken(token);
}
