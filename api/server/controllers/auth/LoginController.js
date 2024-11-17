const { setAuthTokens } = require('~/server/services/AuthService');
const { isProxyAuthEnabled } = require('~/server/services/proxyAuth');
const { logger } = require('~/config');

const loginController = async (req, res) => {
  if (isProxyAuthEnabled()) {
    console.log(JSON.stringify(req.headers));
    return res.status(400).json({ message: 'Cannot log in to this environment' });
  }
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { password: _, __v, ...user } = req.user;
    user.id = user._id.toString();

    const token = await setAuthTokens(req.user._id, res);

    return res.status(200).send({ token, user });
  } catch (err) {
    logger.error('[loginController]', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  loginController,
};
