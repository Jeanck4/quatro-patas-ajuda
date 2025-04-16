
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, LogOut, MapPin, Users, CalendarPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';

const DashboardOrganizacao = () => {
  const { currentUser, userType, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [mutiroes, setMutiroes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && userType === 'organizacao' && currentUser?.organizacao_id) {
      loadMutiroes(currentUser.organizacao_id);
    }
  }, [isAuthenticated, userType, currentUser]);

  const loadMutiroes = async (organizacaoId: string) => {
    try {
      setLoading(true);
      const response = await api.buscarMutiroesOrganizacao(organizacaoId);
      
      if (response.sucesso) {
        setMutiroes(response.dados.mutiroes || []);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os mutirões: ' + (response.erro || 'Erro desconhecido'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar mutirões:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os mutirões',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Formata a data no formato brasileiro
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Redirect if not authenticated or not an organization
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userType !== 'organizacao') {
    return <Navigate to="/dashboard" />;
  }

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard da Organização</h1>
            <p className="text-muted-foreground">
              Bem-vindo(a) à área da organização {currentUser?.nome || ''}!
            </p>
          </div>
          
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/cadastro/mutirao">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Cadastrar Novo Mutirão
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="mutiroes" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="mutiroes">
              <Calendar className="mr-2 h-4 w-4" />
              Meus Mutirões
            </TabsTrigger>
            <TabsTrigger value="config">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mutiroes">
            <h2 className="text-xl font-semibold mb-4">Meus Mutirões de Castração</h2>
            
            {loading ? (
              <p>Carregando mutirões...</p>
            ) : mutiroes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mutiroes.map((mutirao) => (
                  <Card key={mutirao.mutirao_id}>
                    <CardHeader>
                      <CardTitle>Mutirão de Castração</CardTitle>
                      <CardDescription>
                        Data: {formatarData(mutirao.data_mutirao)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Local</p>
                            <p className="text-sm">{mutirao.endereco}</p>
                            <p className="text-sm">{mutirao.cidade}/{mutirao.estado}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Users className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Vagas</p>
                            <p>{mutirao.vagas_disponiveis} disponíveis de {mutirao.total_vagas}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Ver Agendamentos
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Você ainda não cadastrou nenhum mutirão.</p>
                <Button className="mt-4" asChild>
                  <Link to="/cadastro/mutirao">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Cadastrar Mutirão
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="config">
            <h2 className="text-xl font-semibold mb-4">Configurações</h2>
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Conta</CardTitle>
                <CardDescription>
                  Gerencie as configurações da sua conta e preferências
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Alterar Senha</h3>
                  <p className="text-sm text-muted-foreground">
                    Funcionalidade de alteração de senha estará disponível em breve.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" onClick={handleLogoutClick}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DashboardOrganizacao;
