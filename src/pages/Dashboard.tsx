
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { EditPetDialog } from '@/components/EditPetDialog';
import * as api from '@/services/api';
import { Dog, Building, ListPlus, Settings, Calendar, LogOut, Trash, Pencil } from 'lucide-react';

const Dashboard = () => {
  const { user, userType, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState([]);
  const [loading, setPetsLoading] = useState(true);
  const [editingPet, setEditingPet] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userType === 'tutor' && user?.id) {
      loadPets();
    }
  }, [isAuthenticated, userType, user]);

  const loadPets = async () => {
    try {
      setPetsLoading(true);
      const response = await api.getPetsByTutor(user.id);
      if (response.sucesso) {
        setPets(response.dados.pets);
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

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setIsEditDialogOpen(true);
  };

  const handlePetUpdated = () => {
    loadPets();
    setIsEditDialogOpen(false);
    toast({
      title: 'Sucesso',
      description: 'Pet atualizado com sucesso!',
    });
  };

  const handleDeletePet = async (petId) => {
    try {
      const response = await api.deletePet(petId);
      if (response.sucesso) {
        toast({
          title: 'Sucesso',
          description: 'Pet removido com sucesso!',
        });
        loadPets();
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

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {userType === 'tutor' 
                ? `Bem-vindo(a), ${user?.nome || ''}!`
                : `ONG: ${user?.nome || ''}`}
            </p>
          </div>
          
          {userType === 'tutor' && (
            <Button className="mt-4 md:mt-0" asChild>
              <Link to="/cadastro/pet">
                <ListPlus className="mr-2 h-4 w-4" />
                Cadastrar Novo Pet
              </Link>
            </Button>
          )}
        </div>

        <Tabs defaultValue={userType === 'tutor' ? 'meus-pets' : 'ongs'} className="w-full">
          <TabsList className="mb-8">
            {userType === 'tutor' && (
              <>
                <TabsTrigger value="meus-pets">
                  <Dog className="mr-2 h-4 w-4" />
                  Meus Pets
                </TabsTrigger>
                <TabsTrigger value="ongs">
                  <Building className="mr-2 h-4 w-4" />
                  ONGs
                </TabsTrigger>
                <TabsTrigger value="agendamentos">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendamentos
                </TabsTrigger>
              </>
            )}
            {userType === 'ong' && (
              <>
                <TabsTrigger value="agendamentos">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendamentos
                </TabsTrigger>
                <TabsTrigger value="perfil">
                  <Building className="mr-2 h-4 w-4" />
                  Perfil
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="config">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {userType === 'tutor' && (
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
                      <ListPlus className="mr-2 h-4 w-4" />
                      Cadastrar Pet
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
          
          <TabsContent value="ongs">
            <h2 className="text-xl font-semibold mb-4">ONGs Parceiras</h2>
            <p>Lista de ONGs parceiras estará disponível em breve.</p>
          </TabsContent>
          
          <TabsContent value="agendamentos">
            <h2 className="text-xl font-semibold mb-4">Meus Agendamentos</h2>
            <p>Sistema de agendamentos estará disponível em breve.</p>
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
                  <Button variant="destructive">
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
      {editingPet && (
        <EditPetDialog
          pet={editingPet}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handlePetUpdated}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
