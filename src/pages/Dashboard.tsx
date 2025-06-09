
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import * as api from '@/services/api';
import { Dog, Calendar, MapPin, RefreshCw, AlertCircle, Plus, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CancelarAgendamentoDialog } from '@/components/CancelarAgendamentoDialog';

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);
  const [errorPets, setErrorPets] = useState<string | null>(null);
  const [errorAgendamentos, setErrorAgendamentos] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.tutor_id) {
      carregarPets();
      carregarAgendamentos();
    }
  }, [currentUser]);

  // Se não estiver autenticado, mostra mensagem para fazer login
  if (!isAuthenticated || !currentUser) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center py-12 bg-muted rounded-lg">
            <div className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4 flex items-center justify-center">
              <LogIn className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Acesso restrito</h2>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para acessar o painel de controle.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/cadastro">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const carregarPets = async () => {
    if (!currentUser?.tutor_id) return;
    
    try {
      setLoadingPets(true);
      setErrorPets(null);
      
      const response = await api.buscarPetsTutor(currentUser.tutor_id.toString());
      
      if (response.sucesso) {
        setPets(response.dados?.pets || []);
      } else {
        setErrorPets(response.erro || 'Erro ao carregar pets');
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      setErrorPets('Erro ao conectar com o servidor');
    } finally {
      setLoadingPets(false);
    }
  };

  const carregarAgendamentos = async () => {
    if (!currentUser?.tutor_id) return;
    
    try {
      setLoadingAgendamentos(true);
      setErrorAgendamentos(null);
      
      const response = await api.buscarAgendamentosTutor(currentUser.tutor_id.toString());
      
      if (response.sucesso) {
        setAgendamentos(response.dados?.agendamentos || []);
      } else {
        setErrorAgendamentos(response.erro || 'Erro ao carregar agendamentos');
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setErrorAgendamentos('Erro ao conectar com o servidor');
    } finally {
      setLoadingAgendamentos(false);
    }
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return 'Data não informada';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const handleRemoverPet = async (petId: string) => {
    try {
      await api.removerPet(petId);
      toast({
        title: 'Pet removido',
        description: 'O pet foi removido com sucesso.',
      });
      carregarPets();
    } catch (error) {
      console.error('Erro ao remover pet:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o pet. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Meu Painel</h1>
        <p className="text-muted-foreground mb-8">
          Bem-vindo(a), {currentUser?.nome}! Gerencie seus pets e agendamentos.
        </p>

        <Tabs defaultValue="pets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pets">Meus Pets</TabsTrigger>
            <TabsTrigger value="agendamentos">Meus Agendamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meus Pets</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={carregarPets}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                <Button size="sm" asChild>
                  <Link to="/cadastro/pet">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Pet
                  </Link>
                </Button>
              </div>
            </div>

            {errorPets && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Erro ao carregar pets</p>
                  <p className="text-sm">{errorPets}</p>
                </div>
              </div>
            )}

            {loadingPets ? (
              <div className="text-center py-8">
                <p>Carregando seus pets...</p>
              </div>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet) => (
                  <Card key={pet.pet_id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Dog className="h-5 w-5 text-primary" />
                        {pet.nome}
                      </CardTitle>
                      <CardDescription>
                        {pet.especie} • {pet.raca}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Idade:</span>
                          <span>{pet.idade} anos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sexo:</span>
                          <span>{pet.sexo === 'M' ? 'Macho' : 'Fêmea'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peso:</span>
                          <span>{pet.peso} kg</span>
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/editar/pet/${pet.pet_id}`}>
                              Editar
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoverPet(pet.pet_id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Dog className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">
                  Você ainda não cadastrou nenhum pet.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Clique em "Cadastrar Pet" para adicionar seu primeiro pet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meus Agendamentos</h2>
              <Button variant="outline" size="sm" onClick={carregarAgendamentos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>

            {errorAgendamentos && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Erro ao carregar agendamentos</p>
                  <p className="text-sm">{errorAgendamentos}</p>
                </div>
              </div>
            )}

            {loadingAgendamentos ? (
              <div className="text-center py-8">
                <p>Carregando seus agendamentos...</p>
              </div>
            ) : agendamentos.length > 0 ? (
              <div className="grid gap-4">
                {agendamentos.map((agendamento) => (
                  <Card key={agendamento.agendamento_id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Dog className="h-4 w-4 text-primary" />
                            <span className="font-medium">{agendamento.nome_pet}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Data: {formatarData(agendamento.data_mutirao)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{agendamento.endereco_mutirao}</span>
                          </div>
                          {agendamento.observacoes && (
                            <p className="text-sm text-muted-foreground">
                              Observações: {agendamento.observacoes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <CancelarAgendamentoDialog
                            agendamentoId={agendamento.agendamento_id}
                            nomePet={agendamento.nome_pet}
                            onCancelado={carregarAgendamentos}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">
                  Você não possui agendamentos de castração.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Visite a página de mutirões para agendar uma castração.
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/mutiroes">Ver mutirões disponíveis</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
