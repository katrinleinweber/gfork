const api = require('./api');

const getTokenFromGitHub = exports.getTokenFromGitHub = async ({
  username,
  password,
  tokenNote = 'Token for gfork'
}) => {
  api.authenticate({
    type: 'basic',
    username,
    password
  });

  const { token } = await api.authorization.create({
    scopes: ['user', 'user:email', 'public_repo', 'repo', 'repo:status', 'gist'],
    note: tokenNote
  });

  return token;
};

const authenticateWithToken = exports.authenticateWithToken = async ({ token, silent = false }) => {
  silent || console.log('Authenticating...');

  api.authenticate({
    type: 'oauth',
    token
  });

  // const something = await Promise.all([
  const [
    { data: { login } },
    { data: [{ email }] }
  ] = await Promise.all([
    api.users.get({}),
    api.users.getEmails({})
  ]);
  // console.log(`something:`, something);
  // [
  //   { login },
  //   [{ email }]
  // ]

  return { user: login, email };
};
