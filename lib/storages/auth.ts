import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

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

  setUser: (user: User) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 }); // 7 days
  },

  getUser: (): User | null => {
    const userStr = Cookies.get(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  logout: () => {
    auth.removeToken();
    auth.removeUser();
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },
};
