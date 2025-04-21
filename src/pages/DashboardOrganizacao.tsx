
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, LogOut, MapPin, Users, CalendarPlus, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';

const DashboardOrganizacao = () => {
  const { currentUser, userType, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [mutiroes, setMutiroes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && userType === 'organizacao' && currentUser?.organizacao_id) {
      loadMutiroes(currentUser.organizacao_id);
    }
  }, [isAuthenticated, userType, currentUser]);

  const loadMutiroes = async (organizacaoId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Loading mutiroes for organization ID: ${organizacaoId}`);
      
      // Verificar se o servidor está online
      const serverStatus = await api.testarConexao();
      if (!serverStatus.sucesso) {
        setError('Servidor backend offline. Execute: node src/api/server.js');
        setLoading(false);
        return;
      }
      
      // Usando a função buscarMutiroesPorOrganizacao
      const response = await api.buscarMutiroesPorOrganizacao(organizacaoId);
      
      if (response.sucesso) {
        console.log("Mutirões carregados com sucesso:", response.dados.mutiroes);
        setMutiroes(response.dados.mutiroes || []);
      } else {
        console.error("Erro ao carregar mutirões:", response.erro);
        setError(response.erro || 'Erro desconhecido ao carregar mutirões');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os mutirões: ' + (response.erro || 'Erro desconhecido'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar mutirões:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar mutirões');
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

  const handleRefreshMutiroes = () => {
    if (currentUser?.organizacao_id) {
      loadMutiroes(currentUser.organizacao_id);
    }
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Meus Mutirões de Castração</h2>
              <Button variant="outline" size="sm" onClick={handleRefreshMutiroes}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Lista
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de conexão</AlertTitle>
                <AlertDescription>
                  <div className="mb-2">
                    {error === 'Failed to fetch'
                      ? 'Não foi possível conectar ao servidor backend. Certifique-se de que o servidor está rodando em http://localhost:3001 e tente novamente.'
                      : error}
                  </div>
                  <div className="text-xs">
                    {error === 'Failed to fetch' && 'Execute: node src/api/server.js'}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleRefreshMutiroes}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <p>Carregando mutirões...</p>
              </div>
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

                        {mutirao.nome_ong && (
                          <div>
                            <p className="font-medium">ONG Parceira</p>
                            <p className="text-sm">{mutirao.nome_ong}</p>
                          </div>
                        )}
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
                <p className="text-muted-foreground">
                  {error ? 'Não foi possível carregar os mutirões devido a um erro.' : 'Você ainda não cadastrou nenhum mutirão.'}
                </p>
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
