const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'taste-the-joy-super-secret-key-2026';

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'مطلوب تسجيل دخول كمسؤول (Unauthorized)' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'الجلسة غير صالحة أو منتهية الصلاحية' });
  }
}

module.exports = {
  verifyAdmin,
  JWT_SECRET
};
