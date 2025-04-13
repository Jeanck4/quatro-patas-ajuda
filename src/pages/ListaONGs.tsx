
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Heart, MapPin, Phone } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/toast';

// Dados de exemplo das ONGs
const ongsData = [
  {
    id: '1',
    nome: 'Amor Animal',
    endereco: 'Rua das Flores, 123 - Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '(11) 98765-4321',
    descricao: 'ONG dedicada à castração e bem-estar animal',
    proximasCampanhas: [
      { data: '25/05/2023', vagas: 15 },
      { data: '10/06/2023', vagas: 20 }
    ]
  },
  {
    id: '2',
    nome: 'Proteção Pet',
    endereco: 'Av. Principal, 456 - Jardim',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    telefone: '(21) 91234-5678',
    descricao: 'Ajudamos pets abandonados e promovemos castrações mensais',
    proximasCampanhas: [
      { data: '15/05/2023', vagas: 10 },
      { data: '20/05/2023', vagas: 12 }
    ]
  },
  {
    id: '3',
    nome: 'Amigos de Patas',
    endereco: 'Rua Secundária, 789 - Vila Nova',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    telefone: '(31) 97654-3210',
    descricao: 'Focamos em castrações e adoções responsáveis',
    proximasCampanhas: [
      { data: '30/05/2023', vagas: 8 },
      { data: '12/06/2023', vagas: 25 }
    ]
  },
  {
    id: '4',
    nome: 'Quatro Patas Felizes',
    endereco: 'Av. das Árvores, 234 - Parque',
    cidade: 'Curitiba',
    estado: 'PR',
    telefone: '(41) 94567-8901',
    descricao: 'Trabalhamos com resgate, reabilitação e castração de animais de rua',
    proximasCampanhas: [
      { data: '18/05/2023', vagas: 15 },
      { data: '01/06/2023', vagas: 18 }
    ]
  }
];

const ListaONGs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filtro, setFiltro] = useState({
    estado: '',
    cidade: '',
  });
  
  const [ongsFiltradas, setOngsFiltradas] = useState(ongsData);
  
  const handleFiltroChange = (valor: string, campo: string) => {
    const novoFiltro = { ...filtro, [campo]: valor };
    setFiltro(novoFiltro);
    
    // Aplicar filtro
    const resultado = ongsData.filter(ong => {
      const estadoMatch = !novoFiltro.estado || ong.estado.toLowerCase() === novoFiltro.estado.toLowerCase();
      const cidadeMatch = !novoFiltro.cidade || ong.cidade.toLowerCase().includes(novoFiltro.cidade.toLowerCase());
      return estadoMatch && cidadeMatch;
    });
    
    setOngsFiltradas(resultado);
  };
  
  const handleAgendarCastracao = (ongId: string, data: string) => {
    // Aqui será implementada a integração com o banco de dados
    console.log('Agendando castração para ONG:', ongId, 'Data:', data);
    
    toast({
      title: "Castração agendada!",
      description: `Seu agendamento para ${data} foi realizado com sucesso.`,
    });
    
    // Em uma aplicação real, redirecionaria para um formulário de escolha dos pets a serem castrados
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
                      <SelectItem value="">Todos os estados</SelectItem>
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
            {ongsFiltradas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-500">Nenhuma ONG encontrada com os filtros selecionados.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setFiltro({ estado: '', cidade: '' });
                    setOngsFiltradas(ongsData);
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              ongsFiltradas.map((ong) => (
                <Card key={ong.id} className="border overflow-hidden">
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
                        <p className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" /> {ong.telefone}
                        </p>
                        <p className="mb-4">{ong.descricao}</p>
                      </div>
                      
                      <div className="md:w-1/3 space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> Próximas Campanhas
                        </h4>
                        
                        <div className="space-y-2">
                          {ong.proximasCampanhas.map((campanha, idx) => (
                            <div key={idx} className="bg-secondary-50 p-3 rounded-md">
                              <p className="text-sm font-medium mb-1">Data: {campanha.data}</p>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">{campanha.vagas} vagas disponíveis</p>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary-600"
                                  onClick={() => handleAgendarCastracao(ong.id, campanha.data)}
                                >
                                  <Heart className="h-3 w-3 mr-1" /> Agendar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Não encontrou uma ONG parceira na sua região?
            </p>
            <Button variant="outline" onClick={() => navigate('/cadastro/ong')}>
              Cadastre sua ONG na plataforma
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListaONGs;
