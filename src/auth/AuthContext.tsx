import { createContext } from 'react';

type AuthContextType = {
  user: { token: string } | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);