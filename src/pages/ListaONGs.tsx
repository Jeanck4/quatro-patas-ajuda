
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Heart, MapPin, Phone, Clock } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import * as api from '@/services/api';

const ListaONGs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filtro, setFiltro] = useState({
    estado: 'todos',
    cidade: '',
  });
  
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongsFiltradas, setOngsFiltradas] = useState([]);
  
  useEffect(() => {
    carregarOngs();
  }, []);

  const carregarOngs = async () => {
    try {
      setLoading(true);
      const response = await api.buscarOngs();
      
      if (response.sucesso && response.dados) {
        setOngs(response.dados.ongs);
        setOngsFiltradas(response.dados.ongs);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as ONGs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar ONGs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar as ONGs",
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
    const resultado = ongs.filter(ong => {
      const estadoMatch = novoFiltro.estado === 'todos' || ong.estado.toLowerCase() === novoFiltro.estado.toLowerCase();
      const cidadeMatch = !novoFiltro.cidade || ong.cidade.toLowerCase().includes(novoFiltro.cidade.toLowerCase());
      return estadoMatch && cidadeMatch;
    });
    
    setOngsFiltradas(resultado);
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
  
  const handleAgendarCastracao = (ongId: string, data: string) => {
    // Implementação futura para agendar castração
    console.log('Agendando castração para ONG:', ongId, 'Data:', data);
    
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
            <h1 className="text-3xl font-bold text-primary mb-2">ONGs Parceiras</h1>
            <p className="text-gray-600">
              Encontre uma ONG próxima de você para agendar a castração dos seus pets.
            </p>
          </div>
          
          {/* Filtro */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Filtrar ONGs</CardTitle>
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
          
          {/* Lista de ONGs */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">Carregando ONGs...</p>
              </div>
            ) : ongsFiltradas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-500">Nenhuma ONG encontrada com os filtros selecionados.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setFiltro({ estado: 'todos', cidade: '' });
                    setOngsFiltradas(ongs);
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              ongsFiltradas.map((ong) => (
                <Card key={ong.ong_id} className="border overflow-hidden">
                  <CardHeader className="bg-primary-50 pb-2">
                    <CardTitle className="text-xl text-primary">{ong.nome}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> 
                      {ong.endereco}, {ong.cidade} - {ong.estado}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-2/3">
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" /> {ong.telefone}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" /> Disponível em: {formatarData(ong.data_disponivel)}
                          </p>
                          {ong.hora_inicio && ong.hora_fim && (
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" /> Horário: {ong.hora_inicio} às {ong.hora_fim}
                            </p>
                          )}
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-medium">Organização:</span> {ong.organizacao_nome}
                        </div>
                        <p className="mb-4">{ong.descricao}</p>
                        {ong.vagas_disponiveis > 0 && (
                          <div className="bg-green-50 p-2 rounded-md inline-block">
                            <p className="text-sm text-green-700">
                              {ong.vagas_disponiveis} vagas disponíveis para castração
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-1/3 flex flex-col gap-2">
                        {ong.data_disponivel && ong.vagas_disponiveis > 0 && (
                          <Button 
                            onClick={() => handleAgendarCastracao(ong.ong_id, formatarData(ong.data_disponivel))}
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

export default ListaONGs;
