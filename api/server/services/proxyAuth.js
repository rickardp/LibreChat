const { isDomainAllowed } = require('~/server/services/isDomainAllowed');

function isProxyAuthEnabled() {
  return !!process.env.PROXY_AUTH_USER_HEADER;
}

function getProxyAuthHeaderName() {
  return (process.env.PROXY_AUTH_USER_HEADER ?? '').toLowerCase().trim();
}

function getProxyUserDisplayNameHeaderName() {
  return (process.env.PROXY_AUTH_USER_DISPLAYNAME_HEADER ?? '').toLowerCase().trim();
}

function getUserName(req) {
  const headerName = getProxyAuthHeaderName();
  return (req.headers[headerName] ?? '').trim();
}

function getUserEmail(req) {
  const userName = getUserName(req);
  if (userName.includes('@')) {
    return userName;
  }
  return userName + '@local';
}

function getUserDisplayName(req) {
  const headerName = getProxyUserDisplayNameHeaderName();
  const displayName = (req.headers[headerName] ?? '').trim();
  if (displayName) {
    return displayName;
  }
  const userName = getUserName(req);
  if (userName.includes('@')) {
    return userName.split('@')[0];
  }
  return userName;
}

function hasValidUser(req) {
  const userName = getUserName(req);
  return userName && isDomainAllowed(userName);
}

module.exports = {
  isProxyAuthEnabled,
  getProxyAuthHeaderName,
  getUserName,
  hasValidUser,
  getUserEmail,
  getUserDisplayName,
};
