const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    console.log('=== MIDDLEWARE AUTHENTICATE ===');
    console.log('Headers recebidos:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    console.log('JWT_SECRET existe?', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET primeiros chars:', process.env.JWT_SECRET?.substring(0, 10));
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token não fornecido ou formato errado');
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido. Use: Authorization: Bearer <token>'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído (primeiros 20 chars):', token.substring(0, 20));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decodificado com sucesso:', decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.log('❌ Erro ao verificar token:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado',
        error: err.message
      });
    }
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erro ao autenticar',
      error: error.message
    });
  }
};

module.exports = { authenticate };