function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }
  next();
}

module.exports = { requireLogin }; 