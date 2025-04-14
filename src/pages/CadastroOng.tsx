import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, AlertTriangle, Server } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import * as api from '@/services/api';

const CadastroOng = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    descricao: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverConectado, setServerConectado] = useState(false);
  
  useEffect(() => {
    const verificarConexao = async () => {
      try {
        const resultado = await api.testarConexao();
        setServerConectado(resultado.sucesso);
      } catch (error) {
        console.error('Erro ao verificar conexão:', error);
        setServerConectado(false);
      }
    };
    
    verificarConexao();
  }, []);
  
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
    
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não correspondem';
    }
    
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    
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
          localStorage.setItem('ongId', resultado.id || '');
          
          toast({
            title: "Cadastro realizado!",
            description: `Seus dados foram salvos com sucesso. ID: ${resultado.id}`,
          });
          
          setTimeout(() => {
            navigate('/login');
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
          {!serverConectado && (
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="font-bold text-yellow-700">Atenção: Servidor indisponível</h3>
                <p className="text-sm text-yellow-700">
                  Não foi possível conectar ao servidor backend. Certifique-se de que o servidor está rodando em http://localhost:3001 
                  e tente novamente. Execute: <code>node src/api/server.js</code> no terminal.
                </p>
              </div>
            </div>
          )}
          
          {serverConectado && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded flex items-center">
              <Server className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h3 className="font-bold text-green-700">Conectado ao servidor</h3>
                <p className="text-sm text-green-700">
                  Seu app está conectado ao servidor backend e ao banco de dados PostgreSQL. Os dados serão persistidos corretamente.
                </p>
              </div>
            </div>
          )}
          
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Cadastro de ONG</CardTitle>
              <CardDescription>
                Preencha os dados da sua organização para se cadastrar na plataforma.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Básicas</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da ONG</Label>
                      <Input
                        id="nome"
                        name="nome"
                        placeholder="Nome da sua ONG"
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
                        placeholder="email@exemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <Input
                        id="senha"
                        name="senha"
                        type="password"
                        placeholder="******"
                        value={formData.senha}
                        onChange={handleChange}
                        className={errors.senha ? "border-red-500" : ""}
                      />
                      {errors.senha && <p className="text-sm text-red-500">{errors.senha}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                      <Input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        placeholder="******"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        className={errors.confirmarSenha ? "border-red-500" : ""}
                      />
                      {errors.confirmarSenha && <p className="text-sm text-red-500">{errors.confirmarSenha}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dados da ONG</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        placeholder="00.000.000/0000-00"
                        value={formData.cnpj}
                        onChange={handleChange}
                        className={errors.cnpj ? "border-red-500" : ""}
                      />
                      {errors.cnpj && <p className="text-sm text-red-500">{errors.cnpj}</p>}
                    </div>
                  </div>
                  
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
                        placeholder="Sua cidade"
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
                        placeholder="Seu estado"
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição da ONG</Label>
                    <Textarea
                      id="descricao"
                      name="descricao"
                      placeholder="Conte um pouco sobre o trabalho da sua ONG..."
                      rows={4}
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col md:flex-row gap-4 md:justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-600" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span> Processando...
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Finalizar Cadastro
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

export default CadastroOng;
