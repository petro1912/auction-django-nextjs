const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default {
  meEndpoint: `${API_URL}/auth/me`,
  loginEndpoint: `${API_URL}/auth/login`,
  registerEndpoint: `${API_URL}/auth/register`,
  refreshEndpoint: `${API_URL}/auth/token/refresh`,
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
