import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Plus } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';

interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  sexo: string;
  peso: string;
}

const CadastroPet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Pet>({
    id: Date.now().toString(),
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    sexo: '',
    peso: ''
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validatePetForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.especie) newErrors.especie = 'Espécie é obrigatória';
    if (!formData.raca.trim()) newErrors.raca = 'Raça é obrigatória';
    if (!formData.idade.trim()) newErrors.idade = 'Idade é obrigatória';
    if (!formData.sexo) newErrors.sexo = 'Sexo é obrigatório';
    if (!formData.peso.trim()) newErrors.peso = 'Peso é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePetForm()) {
      setPets(prev => [...prev, formData]);
      
      toast({
        title: "Pet adicionado!",
        description: `${formData.nome} foi adicionado à sua lista de pets.`,
      });
      
      // Limpar formulário para adicionar outro pet
      setFormData({
        id: Date.now().toString(),
        nome: '',
        especie: '',
        raca: '',
        idade: '',
        sexo: '',
        peso: ''
      });
    }
  };
  
  const handleFinish = () => {
    if (pets.length === 0) {
      toast({
        title: "Nenhum pet cadastrado",
        description: "Adicione pelo menos um pet antes de finalizar.",
        variant: "destructive"
      });
      return;
    }
    
    // Aqui será implementada a integração com o banco de dados
    console.log('Lista de pets enviada:', pets);
    
    toast({
      title: "Cadastro finalizado!",
      description: `${pets.length} ${pets.length === 1 ? 'pet foi cadastrado' : 'pets foram cadastrados'} com sucesso.`,
    });
    
    // Redirecionar para a página de listagem de ONGs
    setTimeout(() => {
      navigate('/ongs');
    }, 2000);
  };
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <Card className="border shadow-md mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Cadastro de Pets</CardTitle>
              <CardDescription>
                Cadastre seus animais de estimação para agendar castrações.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleAddPet}>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Pet</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Nome do seu pet"
                      value={formData.nome}
                      onChange={handleChange}
                      className={errors.nome ? "border-red-500" : ""}
                    />
                    {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="especie">Espécie</Label>
                    <Select 
                      value={formData.especie} 
                      onValueChange={(value) => handleSelectChange(value, 'especie')}
                    >
                      <SelectTrigger className={errors.especie ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cachorro">Cachorro</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.especie && <p className="text-sm text-red-500">{errors.especie}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="raca">Raça</Label>
                    <Input
                      id="raca"
                      name="raca"
                      placeholder="Raça do pet"
                      value={formData.raca}
                      onChange={handleChange}
                      className={errors.raca ? "border-red-500" : ""}
                    />
                    {errors.raca && <p className="text-sm text-red-500">{errors.raca}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade (anos)</Label>
                    <Input
                      id="idade"
                      name="idade"
                      type="number"
                      placeholder="Idade aproximada"
                      value={formData.idade}
                      onChange={handleChange}
                      className={errors.idade ? "border-red-500" : ""}
                    />
                    {errors.idade && <p className="text-sm text-red-500">{errors.idade}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select 
                      value={formData.sexo} 
                      onValueChange={(value) => handleSelectChange(value, 'sexo')}
                    >
                      <SelectTrigger className={errors.sexo ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Fêmea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && <p className="text-sm text-red-500">{errors.sexo}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      name="peso"
                      type="number"
                      step="0.1"
                      placeholder="Peso aproximado"
                      value={formData.peso}
                      onChange={handleChange}
                      className={errors.peso ? "border-red-500" : ""}
                    />
                    {errors.peso && <p className="text-sm text-red-500">{errors.peso}</p>}
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-4 bg-accent hover:bg-accent-600">
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Pet
                </Button>
              </CardContent>
            </form>
          </Card>
          
          {/* Lista de Pets */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Pets Cadastrados ({pets.length})</h3>
            
            {pets.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">Nenhum pet cadastrado ainda</p>
                <p className="text-sm text-gray-400 mt-1">Use o formulário acima para adicionar seus pets</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <Card key={pet.id} className="border">
                    <CardContent className="py-4">
                      <div className="flex flex-wrap md:flex-nowrap justify-between items-center">
                        <div className="space-y-1 mb-2 md:mb-0">
                          <h4 className="font-medium">{pet.nome}</h4>
                          <p className="text-sm text-gray-600">
                            {pet.especie} • {pet.raca} • {pet.sexo}
                          </p>
                          <p className="text-xs text-gray-500">
                            {pet.idade} {Number(pet.idade) === 1 ? 'ano' : 'anos'} • {pet.peso} kg
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/cadastro/tutor')}>
              Voltar
            </Button>
            
            <Button className="bg-primary hover:bg-primary-600" onClick={handleFinish}>
              <Check className="mr-2 h-4 w-4" /> Finalizar Cadastro
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CadastroPet;
