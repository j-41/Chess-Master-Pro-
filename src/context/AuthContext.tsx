import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface UserProfile {
  username: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  puzzleRating: number;
  puzzlesSolved: number;
  createdAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: UserProfile | null;
  users: Record<string, { password: string; profile: UserProfile }>;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { username: string } }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: { username: string; password: string } }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'LOAD_STATE'; payload: AuthState };

const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: null,
  users: {},
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN': {
      const user = state.users[action.payload.username];
      if (!user) return state;
      return { ...state, isLoggedIn: true, currentUser: user.profile };
    }
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, currentUser: null };
    case 'REGISTER': {
      const newProfile: UserProfile = {
        username: action.payload.username,
        rating: 1200,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        puzzleRating: 1200,
        puzzlesSolved: 0,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        isLoggedIn: true,
        currentUser: newProfile,
        users: {
          ...state.users,
          [action.payload.username]: {
            password: action.payload.password,
            profile: newProfile,
          },
        },
      };
    }
    case 'UPDATE_PROFILE': {
      if (!state.currentUser) return state;
      const updated = { ...state.currentUser, ...action.payload };
      return {
        ...state,
        currentUser: updated,
        users: {
          ...state.users,
          [updated.username]: {
            ...state.users[updated.username],
            profile: updated,
          },
        },
      };
    }
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string) => boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chessmaster_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
    }
  }, []);

  // Save state on every change
  useEffect(() => {
    try {
      localStorage.setItem('chessmaster_auth', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  }, [state]);

  const login = (username: string, password: string): boolean => {
    const user = state.users[username];
    if (!user || user.password !== password) return false;
    dispatch({ type: 'LOGIN', payload: { username } });
    return true;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const register = (username: string, password: string): boolean => {
    if (state.users[username]) return false; // Username taken
    if (username.length < 3 || password.length < 4) return false;
    dispatch({ type: 'REGISTER', payload: { username, password } });
    return true;
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
