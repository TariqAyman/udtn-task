export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'MY_JWT_SECRET',
  expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1d',
  refreshExpiresIn: '7d',
};
