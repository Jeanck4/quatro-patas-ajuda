
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/components/ui/toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tutorData, setTutorData] = useState({
    email: '',
    senha: ''
  });
  
  const [ongData, setOngData] = useState({
    email: '',
    senha: ''
  });
  
  const handleTutorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTutorData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOngData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui seria feita a validação e integração com o banco de dados
    console.log('Login de Tutor:', tutorData);
    
    // Simular login bem-sucedido
    toast({
      title: "Login realizado!",
      description: "Bem-vindo de volta ao Quatro Patas.",
    });
    
    // Redirecionar para a página inicial do tutor (dashboard)
    setTimeout(() => {
      navigate('/ongs');
    }, 1500);
  };
  
  const handleOngSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui seria feita a validação e integração com o banco de dados
    console.log('Login de ONG:', ongData);
    
    // Simular login bem-sucedido
    toast({
      title: "Login realizado!",
      description: "Bem-vindo de volta ao Quatro Patas.",
    });
    
    // Redirecionar para a página inicial da ONG (dashboard)
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card className="border shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Entrar no Quatro Patas</CardTitle>
              <CardDescription>
                Acesse sua conta para continuar
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="tutor" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 mx-6">
                <TabsTrigger value="tutor">Sou Tutor</TabsTrigger>
                <TabsTrigger value="ong">Sou ONG</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tutor">
                <form onSubmit={handleTutorSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tutor-email">Email</Label>
                      <Input
                        id="tutor-email"
                        name="email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={tutorData.email}
                        onChange={handleTutorChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="tutor-senha">Senha</Label>
                        <Button type="button" variant="link" className="p-0 h-auto text-sm">
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <Input
                        id="tutor-senha"
                        name="senha"
                        type="password"
                        placeholder="******"
                        value={tutorData.senha}
                        onChange={handleTutorChange}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary-600">
                      Entrar como Tutor
                    </Button>
                    <div className="text-center text-sm">
                      <span className="text-gray-500">Não tem uma conta? </span>
                      <Button type="button" variant="link" className="p-0 h-auto" onClick={() => navigate('/cadastro/tutor')}>
                        Cadastre-se
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="ong">
                <form onSubmit={handleOngSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ong-email">Email</Label>
                      <Input
                        id="ong-email"
                        name="email"
                        type="email"
                        placeholder="ong@exemplo.com"
                        value={ongData.email}
                        onChange={handleOngChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ong-senha">Senha</Label>
                        <Button type="button" variant="link" className="p-0 h-auto text-sm">
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <Input
                        id="ong-senha"
                        name="senha"
                        type="password"
                        placeholder="******"
                        value={ongData.senha}
                        onChange={handleOngChange}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary-600">
                      Entrar como ONG
                    </Button>
                    <div className="text-center text-sm">
                      <span className="text-gray-500">Não tem uma conta? </span>
                      <Button type="button" variant="link" className="p-0 h-auto" onClick={() => navigate('/cadastro/ong')}>
                        Cadastre-se
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
