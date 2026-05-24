const TOKEN_KEY = "accessToken"

// Function to save the access token in local storage for later use in authenticated requests
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}
// Function to retrieve the access token from local storage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

// Function to remove the access token from local storage (used for logout)
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
// Function to check if an access token exists in local storage (used to determine if the user is authenticated)
export const hasToken = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY)
}
const TokenService = {
  saveToken,
  getToken,
  removeToken,
  hasToken
}
export default TokenService