export const AUTH_CONFIG = {
  apiBase: process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:5000/api/v1/users",
  githubAuthUrl: process.env.NEXT_PUBLIC_GITHUB_AUTH_URL,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};
