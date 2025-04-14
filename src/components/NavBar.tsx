
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Dog, User, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="flex items-center gap-2 text-primary-700 font-semibold">
            <Dog className="h-6 w-6" />
            <span className="text-xl font-bold">Quatro Patas</span>
          </NavLink>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-foreground/60"
            )}
          >
            Home
          </NavLink>
          <NavLink 
            to="/sobre" 
            className={({ isActive }) => cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-foreground/60"
            )}
          >
            Sobre
          </NavLink>
          <NavLink 
            to="/ongs" 
            className={({ isActive }) => cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-foreground/60"
            )}
          >
            ONGs
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground/60"
                )}
              >
                Dashboard
              </NavLink>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/cadastro')}>
                Cadastre-se
              </Button>
              <Button onClick={() => navigate('/login')}>
                <User className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden container py-4 bg-white">
          <nav className="flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => cn(
                "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                isActive ? "bg-primary-50 text-primary" : "text-foreground/60"
              )}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/sobre" 
              className={({ isActive }) => cn(
                "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                isActive ? "bg-primary-50 text-primary" : "text-foreground/60"
              )}
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </NavLink>
            <NavLink 
              to="/ongs" 
              className={({ isActive }) => cn(
                "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                isActive ? "bg-primary-50 text-primary" : "text-foreground/60"
              )}
              onClick={() => setIsOpen(false)}
            >
              ONGs
            </NavLink>
            
            <div className="flex flex-col gap-2 pt-2 border-t">
              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                      isActive ? "bg-primary-50 text-primary" : "text-foreground/60"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </NavLink>
                  <Button variant="outline" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { navigate('/cadastro'); setIsOpen(false); }}>
                    Cadastre-se
                  </Button>
                  <Button onClick={() => { navigate('/login'); setIsOpen(false); }}>
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
