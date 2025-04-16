
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

interface AuthContextType {
  currentUser: any | null;
  userType: 'tutor' | 'organizacao' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string, type: 'tutor' | 'organizacao') => Promise<boolean>;
  logout: () => void;
  redirectToDashboard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userType, setUserType] = useState<'tutor' | 'organizacao' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('currentUser');
      const savedUserType = localStorage.getItem('userType') as 'tutor' | 'organizacao' | null;
      
      if (savedUser && savedUserType) {
        setCurrentUser(JSON.parse(savedUser));
        setUserType(savedUserType);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Função para fazer login
  const login = async (email: string, senha: string, type: 'tutor' | 'organizacao'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      let resultado;
      
      if (type === 'tutor') {
        resultado = await api.loginTutor(email, senha);
      } else {
        resultado = await api.loginOrganizacao(email, senha);
      }
      
      if (resultado.sucesso && (resultado.tutor || resultado.organizacao)) {
        const userData = type === 'tutor' ? resultado.tutor : resultado.organizacao;
        
        setCurrentUser(userData);
        setUserType(type);
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userType', type);
        
        if (type === 'tutor') {
          localStorage.setItem('tutorId', userData.tutor_id);
        } else {
          localStorage.setItem('organizacaoId', userData.organizacao_id);
        }
        
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
  
  // Função para redirecionar o usuário para o dashboard apropriado
  const redirectToDashboard = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userType === 'tutor') {
      navigate('/dashboard');
    } else if (userType === 'organizacao') {
      navigate('/dashboard/organizacao');
    }
  };
  
  // Função para fazer logout
  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('tutorId');
    localStorage.removeItem('organizacaoId');
    navigate('/login');
  };
  
  const value = {
    currentUser,
    userType,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    redirectToDashboard
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
