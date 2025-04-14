import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/hooks/use-toast';
import * as db from '@/database/conexao.js';

const CadastroTutor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const testarConexaoBanco = async () => {
    try {
      const resultado = await db.testarConexao();
      if (resultado.sucesso) {
        toast({
          title: "Conexão com o banco bem-sucedida!",
          description: `Servidor respondeu em: ${resultado.dados.agora}`,
        });
      } else {
        toast({
          title: "Falha na conexão!",
          description: resultado.erro,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      toast({
        title: "Erro no teste de conexão",
        description: "Verifique o console para mais detalhes",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        console.log('Dados do tutor sendo enviados para o banco:', formData);
        
        const resultado = await db.inserirTutor(formData);
        
        if (resultado.sucesso) {
          localStorage.setItem('tutorId', resultado.id);
          
          toast({
            title: "Cadastro realizado!",
            description: `Seus dados foram salvos no banco de dados. ID: ${resultado.id}`,
          });
          
          setTimeout(() => {
            navigate('/cadastro/pet');
          }, 2000);
        } else {
          toast({
            title: "Erro no cadastro",
            description: resultado.erro || "Ocorreu um erro ao salvar os dados no banco",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erro ao cadastrar tutor:', error);
        toast({
          title: "Erro no cadastro",
          description: "Ocorreu um erro ao processar sua solicitação no banco de dados",
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
              <CardTitle className="text-2xl text-primary">Cadastro de Tutor</CardTitle>
              <CardDescription>
                Preencha seus dados para se cadastrar como tutor na plataforma.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Pessoais</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        name="nome"
                        placeholder="Seu nome completo"
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
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleChange}
                        className={errors.cpf ? "border-red-500" : ""}
                      />
                      {errors.cpf && <p className="text-sm text-red-500">{errors.cpf}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Endereço</h3>
                  
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
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col md:flex-row gap-4 md:justify-between">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate('/')}>
                    Cancelar
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={testarConexaoBanco}
                  >
                    Testar Conexão
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-600"
                  disabled={loading}
                >
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

export default CadastroTutor;
