
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Users } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';

const Cadastro = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary mb-2">Cadastre-se no Quatro Patas</h1>
            <p className="text-gray-600">
              Escolha o tipo de perfil que melhor se adapta às suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Dog className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Sou Tutor</CardTitle>
                <CardDescription>
                  Para tutores que desejam castrar seus animais de estimação
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 text-center">
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <span className="bg-primary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Cadastre todos os seus pets
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Encontre ONGs próximas para castração
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Agende castrações com facilidade
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Acompanhe o histórico de procedimentos
                  </li>
                </ul>
                
                <Button 
                  onClick={() => navigate('/cadastro/tutor')} 
                  className="w-full bg-primary hover:bg-primary-600"
                >
                  Cadastrar como Tutor
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 bg-secondary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Sou ONG</CardTitle>
                <CardDescription>
                  Para ONGs que organizam mutirões de castração
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 text-center">
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <span className="bg-secondary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Cadastre sua organização
                  </li>
                  <li className="flex items-center">
                    <span className="bg-secondary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Gerencie mutirões de castração
                  </li>
                  <li className="flex items-center">
                    <span className="bg-secondary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Receba agendamentos online
                  </li>
                  <li className="flex items-center">
                    <span className="bg-secondary-100 rounded-full p-1 mr-2">
                      <svg className="h-3 w-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Relatórios detalhados de atendimentos
                  </li>
                </ul>
                
                <Button 
                  onClick={() => navigate('/cadastro/ong')} 
                  className="w-full bg-secondary hover:bg-secondary-600"
                >
                  Cadastrar como ONG
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-gray-500">Já possui uma conta?</p>
            <Button variant="link" onClick={() => navigate('/login')}>
              Faça login
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cadastro;
