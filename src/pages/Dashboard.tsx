
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import * as api from '@/services/api';
import { Dog, Building, ListPlus, Settings, Calendar, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, userType, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<any[]>([]);
  const [ongs, setOngs] = useState<any[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isLoadingOngs, setIsLoadingOngs] = useState(false);
  
  // Se não estiver autenticado, redirecione para login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Buscar os dados do usuário quando o componente é montado
  useEffect(() => {
    const fetchUserData = async () => {
      if (userType === 'tutor' && currentUser?.id) {
        setIsLoadingPets(true);
        try {
          const resultado = await api.buscarPetsTutor(currentUser.id);
          if (resultado.sucesso && resultado.dados) {
            setPets(resultado.dados.pets || []);
          }
        } catch (error) {
          console.error('Erro ao buscar pets:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus pets.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingPets(false);
        }
        
        // Buscar ONGs disponíveis
        setIsLoadingOngs(true);
        try {
          const resultado = await api.buscarOngs();
          if (resultado.sucesso && resultado.dados) {
            setOngs(resultado.dados.ongs || []);
          }
        } catch (error) {
          console.error('Erro ao buscar ONGs:', error);
        } finally {
          setIsLoadingOngs(false);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser, userType]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };
  
  const renderTutorDashboard = () => (
    <div className="grid gap-6">
      <Tabs defaultValue="pets" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="pets" className="flex gap-2 items-center">
            <Dog className="h-4 w-4" />
            Meus Pets
          </TabsTrigger>
          <TabsTrigger value="ongs" className="flex gap-2 items-center">
            <Building className="h-4 w-4" />
            ONGs
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            Perfil
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Meus Pets</h2>
            <Link to="/cadastro/pet">
              <Button>
                <ListPlus className="h-4 w-4 mr-2" />
                Adicionar Pet
              </Button>
            </Link>
          </div>
          
          {isLoadingPets ? (
            <div className="text-center py-8">Carregando pets...</div>
          ) : pets.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Você ainda não cadastrou nenhum pet.
                </p>
                <Link to="/cadastro/pet" className="mt-4 inline-block">
                  <Button>
                    <ListPlus className="h-4 w-4 mr-2" />
                    Adicionar Pet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{pet.nome}</CardTitle>
                    <CardDescription>
                      {pet.especie} • {pet.raca} • {pet.sexo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <p><span className="font-medium">Idade:</span> {pet.idade} {Number(pet.idade) === 1 ? 'ano' : 'anos'}</p>
                      <p><span className="font-medium">Peso:</span> {pet.peso} kg</p>
                      <div className="pt-4">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar Castração
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ongs" className="space-y-4">
          <h2 className="text-2xl font-bold">ONGs Disponíveis</h2>
          
          {isLoadingOngs ? (
            <div className="text-center py-8">Carregando ONGs...</div>
          ) : ongs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Não há ONGs cadastradas no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {ongs.map((ong) => (
                <Card key={ong.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{ong.nome}</CardTitle>
                    <CardDescription>
                      {ong.cidade}, {ong.estado}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <p><span className="font-medium">Endereço:</span> {ong.endereco}</p>
                      <p><span className="font-medium">Telefone:</span> {ong.telefone}</p>
                      {ong.descricao && (
                        <p className="pt-2">{ong.descricao}</p>
                      )}
                      <div className="pt-4">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="perfil" className="space-y-4">
          <h2 className="text-2xl font-bold">Meu Perfil</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p>{currentUser?.nome || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p>{currentUser?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CPF</p>
                  <p>{currentUser?.cpf || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p>{currentUser?.telefone || '-'}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Endereço</p>
                <p>{currentUser?.endereco || '-'}</p>
                <p>{currentUser?.cidade}, {currentUser?.estado} - {currentUser?.cep}</p>
              </div>
              
              <div className="pt-4 flex gap-2">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  const renderOngDashboard = () => (
    <div className="grid gap-6">
      <Tabs defaultValue="eventos" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="eventos" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            Perfil
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="eventos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Eventos de Castração</h2>
            <Button>
              <ListPlus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
          
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Você ainda não cadastrou nenhum evento de castração.
              </p>
              <Button className="mt-4">
                <ListPlus className="h-4 w-4 mr-2" />
                Criar Evento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="perfil" className="space-y-4">
          <h2 className="text-2xl font-bold">Perfil da ONG</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações da ONG</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p>{currentUser?.nome || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p>{currentUser?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CNPJ</p>
                  <p>{currentUser?.cnpj || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p>{currentUser?.telefone || '-'}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Endereço</p>
                <p>{currentUser?.endereco || '-'}</p>
                <p>{currentUser?.cidade}, {currentUser?.estado} - {currentUser?.cep}</p>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Sobre a ONG</p>
                <p>{currentUser?.descricao || 'Nenhuma descrição disponível.'}</p>
              </div>
              
              <div className="pt-4 flex gap-2">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
            {userType === 'tutor' ? 'Portal do Tutor' : 'Portal da ONG'}
          </h1>
          <p className="text-gray-600">
            Bem-vindo(a), {currentUser?.nome || 'Usuário'}!
          </p>
        </div>
        
        {userType === 'tutor' ? renderTutorDashboard() : renderOngDashboard()}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
