
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

interface AuthContextType {
  currentUser: any | null;
  userType: 'tutor' | 'ong' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string, type: 'tutor' | 'ong') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userType, setUserType] = useState<'tutor' | 'ong' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('currentUser');
      const savedUserType = localStorage.getItem('userType') as 'tutor' | 'ong' | null;
      
      if (savedUser && savedUserType) {
        setCurrentUser(JSON.parse(savedUser));
        setUserType(savedUserType);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Função para fazer login
  const login = async (email: string, senha: string, type: 'tutor' | 'ong'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      let resultado;
      
      if (type === 'tutor') {
        resultado = await api.loginTutor(email, senha);
      } else {
        resultado = await api.loginOng(email, senha);
      }
      
      if (resultado.sucesso && resultado.dados) {
        const userData = type === 'tutor' ? resultado.dados.tutor : resultado.dados.ong;
        
        setCurrentUser(userData);
        setUserType(type);
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userType', type);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro durante login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para fazer logout
  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('tutorId');
    localStorage.removeItem('ongId');
  };
  
  const value = {
    currentUser,
    userType,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
