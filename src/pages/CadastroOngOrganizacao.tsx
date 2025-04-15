
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, AlertTriangle } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';

const CadastroOngOrganizacao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    organizacao_id: '',
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    descricao: '',
    data_disponivel: '',
    hora_inicio: '',
    hora_fim: '',
    vagas_disponiveis: '10'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Verifica se o usuário está logado como organização
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado como uma organização para cadastrar ONGs.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Define o ID da organização no formulário
    setFormData(prev => ({
      ...prev,
      organizacao_id: localStorage.getItem('organizacaoId') || ''
    }));
  }, [isAuthenticated, currentUser, navigate, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.data_disponivel) newErrors.data_disponivel = 'Data é obrigatória';
    if (!formData.hora_inicio) newErrors.hora_inicio = 'Hora de início é obrigatória';
    if (!formData.hora_fim) newErrors.hora_fim = 'Hora de término é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        console.log('Dados da ONG sendo enviados para o banco:', formData);
        
        const resultado = await api.inserirOng(formData);
        
        if (resultado.sucesso) {
          toast({
            title: "ONG cadastrada!",
            description: `Os dados da ONG foram salvos com sucesso. ID: ${resultado.id}`,
          });
          
          // Limpa o formulário
          setFormData(prev => ({
            ...prev,
            nome: '',
            email: '',
            telefone: '',
            endereco: '',
            cidade: '',
            estado: '',
            cep: '',
            descricao: '',
            data_disponivel: '',
            hora_inicio: '',
            hora_fim: '',
            vagas_disponiveis: '10'
          }));
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          toast({
            title: "Erro no cadastro",
            description: resultado.erro || "Ocorreu um erro ao salvar os dados",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erro ao cadastrar ONG:', error);
        toast({
          title: "Erro no cadastro",
          description: "Ocorreu um erro ao processar sua solicitação",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Cadastrar Nova ONG</CardTitle>
              <CardDescription>
                Preencha os dados da ONG para disponibilizá-la na plataforma.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Básicas da ONG</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da ONG</Label>
                      <Input
                        id="nome"
                        name="nome"
                        placeholder="Nome da ONG"
                        value={formData.nome}
                        onChange={handleChange}
                        className={errors.nome ? "border-red-500" : ""}
                      />
                      {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ong@exemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                      className={errors.telefone ? "border-red-500" : ""}
                    />
                    {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Localização</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      placeholder="Rua, número, bairro"
                      value={formData.endereco}
                      onChange={handleChange}
                      className={errors.endereco ? "border-red-500" : ""}
                    />
                    {errors.endereco && <p className="text-sm text-red-500">{errors.endereco}</p>}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        placeholder="Cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        className={errors.cidade ? "border-red-500" : ""}
                      />
                      {errors.cidade && <p className="text-sm text-red-500">{errors.cidade}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        name="estado"
                        placeholder="Estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className={errors.estado ? "border-red-500" : ""}
                      />
                      {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        name="cep"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={handleChange}
                        className={errors.cep ? "border-red-500" : ""}
                      />
                      {errors.cep && <p className="text-sm text-red-500">{errors.cep}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detalhes do Atendimento</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data_disponivel">Data Disponível</Label>
                      <Input
                        id="data_disponivel"
                        name="data_disponivel"
                        type="date"
                        value={formData.data_disponivel}
                        onChange={handleChange}
                        className={errors.data_disponivel ? "border-red-500" : ""}
                      />
                      {errors.data_disponivel && <p className="text-sm text-red-500">{errors.data_disponivel}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vagas_disponiveis">Vagas Disponíveis</Label>
                      <Input
                        id="vagas_disponiveis"
                        name="vagas_disponiveis"
                        type="number"
                        value={formData.vagas_disponiveis}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hora_inicio">Hora de Início</Label>
                      <Input
                        id="hora_inicio"
                        name="hora_inicio"
                        type="time"
                        value={formData.hora_inicio}
                        onChange={handleChange}
                        className={errors.hora_inicio ? "border-red-500" : ""}
                      />
                      {errors.hora_inicio && <p className="text-sm text-red-500">{errors.hora_inicio}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hora_fim">Hora de Término</Label>
                      <Input
                        id="hora_fim"
                        name="hora_fim"
                        type="time"
                        value={formData.hora_fim}
                        onChange={handleChange}
                        className={errors.hora_fim ? "border-red-500" : ""}
                      />
                      {errors.hora_fim && <p className="text-sm text-red-500">{errors.hora_fim}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição da ONG</Label>
                    <Textarea
                      id="descricao"
                      name="descricao"
                      placeholder="Descreva o trabalho realizado pela ONG..."
                      rows={4}
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col md:flex-row gap-4 md:justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-600" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span> Processando...
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Cadastrar ONG
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CadastroOngOrganizacao;
