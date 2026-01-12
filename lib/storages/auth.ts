import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const auth = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  logout: () => {
    auth.removeToken();
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },
};
