
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Phone, Clock } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import * as api from '@/services/api';

/**
 * ListaOrganizacoes - Componente para exibir e filtrar organizações cadastradas
 * 
 * Este componente permite:
 * - Listar todas as organizações disponíveis
 * - Filtrar organizações por estado e cidade
 * - Visualizar informações detalhadas de cada organização
 * - Agendar castração com a organização selecionada
 */
const ListaOrganizacoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filtro, setFiltro] = useState({
    estado: 'todos',
    cidade: '',
  });
  
  const [organizacoes, setOrganizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [organizacoesFiltradas, setOrganizacoesFiltradas] = useState([]);
  
  useEffect(() => {
    carregarOrganizacoes();
  }, []);

  const carregarOrganizacoes = async () => {
    try {
      setLoading(true);
      const response = await api.buscarOrganizacoes();
      
      if (response.sucesso && response.dados) {
        setOrganizacoes(response.dados.organizacoes);
        setOrganizacoesFiltradas(response.dados.organizacoes);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as organizações",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar organizações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar as organizações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFiltroChange = (valor: string, campo: string) => {
    const novoFiltro = { ...filtro, [campo]: valor };
    setFiltro(novoFiltro);
    
    // Aplicar filtro
    const resultado = organizacoes.filter(org => {
      const estadoMatch = novoFiltro.estado === 'todos' || org.estado.toLowerCase() === novoFiltro.estado.toLowerCase();
      const cidadeMatch = !novoFiltro.cidade || org.cidade.toLowerCase().includes(novoFiltro.cidade.toLowerCase());
      return estadoMatch && cidadeMatch;
    });
    
    setOrganizacoesFiltradas(resultado);
  };
  
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };
  
  const handleAgendarCastracao = (organizacaoId: string, data: string) => {
    // Implementação futura para agendar castração
    console.log('Agendando castração para Organização:', organizacaoId, 'Data:', data);
    
    toast({
      title: "Castração agendada!",
      description: `Seu agendamento para ${data} foi realizado com sucesso.`,
    });
  };
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary mb-2">Organizações Parceiras</h1>
            <p className="text-gray-600">
              Encontre uma organização próxima de você para agendar a castração dos seus pets.
            </p>
          </div>
          
          {/* Filtro */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Filtrar Organizações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={filtro.estado}
                    onValueChange={(valor) => handleFiltroChange(valor, 'estado')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os estados</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    placeholder="Digite o nome da cidade"
                    value={filtro.cidade}
                    onChange={(e) => handleFiltroChange(e.target.value, 'cidade')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Lista de Organizações */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">Carregando organizações...</p>
              </div>
            ) : organizacoesFiltradas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-500">Nenhuma organização encontrada com os filtros selecionados.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setFiltro({ estado: 'todos', cidade: '' });
                    setOrganizacoesFiltradas(organizacoes);
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              organizacoesFiltradas.map((org) => (
                <Card key={org.organizacao_id} className="border overflow-hidden">
                  <CardHeader className="bg-primary-50 pb-2">
                    <CardTitle className="text-xl text-primary">{org.nome}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> 
                      {org.endereco}, {org.cidade} - {org.estado}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-2/3">
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" /> {org.telefone}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" /> Disponível em: {formatarData(org.data_disponivel)}
                          </p>
                          {org.hora_inicio && org.hora_fim && (
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" /> Horário: {org.hora_inicio} às {org.hora_fim}
                            </p>
                          )}
                        </div>
                        <p className="mb-4">{org.descricao}</p>
                        {org.vagas_disponiveis > 0 && (
                          <div className="bg-green-50 p-2 rounded-md inline-block">
                            <p className="text-sm text-green-700">
                              {org.vagas_disponiveis} vagas disponíveis para castração
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-1/3 flex flex-col gap-2">
                        {org.data_disponivel && org.vagas_disponiveis > 0 && (
                          <Button 
                            onClick={() => handleAgendarCastracao(org.organizacao_id, formatarData(org.data_disponivel))}
                            className="w-full"
                          >
                            <Calendar className="h-4 w-4 mr-2" /> Agendar Castração
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListaOrganizacoes;
