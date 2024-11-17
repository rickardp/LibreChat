const cookies = require('cookie');
const { isProxyAuthEnabled } = require('~/server/services/proxyAuth');
const { logoutUser } = require('~/server/services/AuthService');
const { logger } = require('~/config');

const logoutController = async (req, res) => {
  if (isProxyAuthEnabled()) {
    return res.status(400).json({ message: 'Cannot log out from this environment' });
  }
  const refreshToken = req.headers.cookie ? cookies.parse(req.headers.cookie).refreshToken : null;
  try {
    const logout = await logoutUser(req.user._id, refreshToken);
    const { status, message } = logout;
    res.clearCookie('refreshToken');
    return res.status(status).send({ message });
  } catch (err) {
    logger.error('[logoutController]', err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  logoutController,
};
