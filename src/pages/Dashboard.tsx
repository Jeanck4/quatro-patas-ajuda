
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { EditPetDialog } from '@/components/EditPetDialog';
import * as api from '@/services/api';
import { Dog, Calendar, Settings, LogOut, Trash, Pencil, MapPin, HelpCircle } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, userType, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setPetsLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [agendamentosLoading, setAgendamentosLoading] = useState(true);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userType === 'tutor' && currentUser?.tutor_id) {
      loadPets(currentUser.tutor_id);
      loadAgendamentos(currentUser.tutor_id);
    }
  }, [isAuthenticated, userType, currentUser]);

  const loadPets = async (tutorId: string) => {
    try {
      setPetsLoading(true);
      console.log("Fetching pets for tutor ID:", tutorId);
      
      const response = await api.buscarPetsTutor(tutorId);
      
      console.log("API response for pets:", response);
      
      if (response.sucesso) {
        setPets(response.dados.pets || []);
      } else {
        console.error("Failed to load pets:", response.erro);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus pets: ' + (response.erro || 'Erro desconhecido'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus pets',
        variant: 'destructive',
      });
    } finally {
      setPetsLoading(false);
    }
  };

  const loadAgendamentos = async (tutorId: string) => {
    try {
      setAgendamentosLoading(true);
      console.log("Fetching agendamentos for tutor ID:", tutorId);
      
      const response = await api.buscarAgendamentosTutor(tutorId);
      
      console.log("API response for agendamentos:", response);
      
      if (response.sucesso) {
        setAgendamentos(response.dados.agendamentos || []);
      } else {
        console.error("Failed to load agendamentos:", response.erro);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus agendamentos: ' + (response.erro || 'Erro desconhecido'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus agendamentos',
        variant: 'destructive',
      });
    } finally {
      setAgendamentosLoading(false);
    }
  };

  const handleEditPet = (pet: any) => {
    setEditingPet(pet);
    setIsEditDialogOpen(true);
  };

  const handlePetUpdated = (updatedPet: any) => {
    if (currentUser?.tutor_id) {
      loadPets(currentUser.tutor_id);
    }
    setIsEditDialogOpen(false);
    toast({
      title: 'Sucesso',
      description: 'Pet atualizado com sucesso!',
    });
  };

  const handleDeletePet = async (petId: string) => {
    try {
      const response = await api.removerPet(petId);
      if (response.sucesso) {
        toast({
          title: 'Sucesso',
          description: 'Pet removido com sucesso!',
        });
        if (currentUser?.tutor_id) {
          loadPets(currentUser.tutor_id);
        }
      } else {
        toast({
          title: 'Erro',
          description: response.erro || 'Não foi possível remover o pet',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover o pet',
        variant: 'destructive',
      });
    }
  };

  const handleLogoutClick = () => {
    logout();
  };

  // Formata a data no formato brasileiro
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect if user is not a tutor
  if (userType !== 'tutor') {
    return <Navigate to="/dashboard/organizacao" />;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo(a), {currentUser?.nome || ''}!
            </p>
          </div>
          
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/cadastro/pet">
              <Dog className="mr-2 h-4 w-4" />
              Cadastrar Novo Pet
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="meus-pets" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="meus-pets">
              <Dog className="mr-2 h-4 w-4" />
              Meus Pets
            </TabsTrigger>
            <TabsTrigger value="agendamentos">
              <Calendar className="mr-2 h-4 w-4" />
              Mutirões
            </TabsTrigger>
            <TabsTrigger value="config">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meus-pets" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Meus Pets</h2>
            
            {loading ? (
              <p>Carregando seus pets...</p>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet) => (
                  <Card key={pet.pet_id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {pet.nome}
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditPet(pet)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeletePet(pet.pet_id)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {pet.especie} • {pet.raca}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium">Idade</p>
                          <p>{pet.idade} anos</p>
                        </div>
                        <div>
                          <p className="font-medium">Peso</p>
                          <p>{pet.peso} kg</p>
                        </div>
                        <div>
                          <p className="font-medium">Sexo</p>
                          <p>{pet.sexo === 'M' ? 'Macho' : 'Fêmea'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Dog className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Você ainda não cadastrou nenhum pet.</p>
                <Button className="mt-4" asChild>
                  <Link to="/cadastro/pet">
                    <Dog className="mr-2 h-4 w-4" />
                    Cadastrar Pet
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="agendamentos">
            <h2 className="text-xl font-semibold mb-4">Meus Agendamentos de Mutirão</h2>
            
            {agendamentosLoading ? (
              <p>Carregando seus agendamentos...</p>
            ) : agendamentos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {agendamentos.map((agendamento) => (
                  <Card key={agendamento.agendamento_id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Mutirão de Castração</CardTitle>
                          <CardDescription>
                            {formatarData(agendamento.data_mutirao)}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            agendamento.status === 'Agendado' 
                              ? 'bg-blue-500' 
                              : agendamento.status === 'Confirmado' 
                                ? 'bg-green-500' 
                                : agendamento.status === 'Realizado' 
                                  ? 'bg-green-700'
                                  : 'bg-red-500'
                          }
                        >
                          {agendamento.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <div className="mt-1"><Dog className="h-5 w-5 text-primary" /></div>
                          <div>
                            <p className="font-medium">Pet</p>
                            <p>{agendamento.nome_pet}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="mt-1"><MapPin className="h-5 w-5 text-primary" /></div>
                          <div>
                            <p className="font-medium">Local</p>
                            <p>{agendamento.nome_ong}</p>
                            <p className="text-sm text-muted-foreground">
                              {agendamento.endereco_ong}, {agendamento.cidade_ong}/{agendamento.estado_ong}
                            </p>
                          </div>
                        </div>
                        
                        {agendamento.observacoes && (
                          <div className="flex items-start gap-2">
                            <div className="mt-1"><HelpCircle className="h-5 w-5 text-primary" /></div>
                            <div>
                              <p className="font-medium">Observações</p>
                              <p className="text-sm">{agendamento.observacoes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Você ainda não possui agendamentos em mutirões.</p>
                <Button className="mt-4" asChild>
                  <Link to="/mutiroes">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Mutirões Disponíveis
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
      
      {/* Edit Pet Dialog */}
      {editingPet && isEditDialogOpen && (
        <EditPetDialog
          pet={editingPet}
          onPetUpdated={handlePetUpdated}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
