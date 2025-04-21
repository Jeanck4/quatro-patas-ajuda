
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import * as api from '@/services/api';
import { MapPin, Calendar, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MutiroesDisponiveis = () => {
  const [mutiroes, setMutiroes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const carregarMutiroes = async (shouldRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar se o servidor está online
      const serverStatus = await api.testarConexao();
      if (!serverStatus.sucesso) {
        setError('Servidor backend offline. Execute: node src/api/server.js');
        setLoading(false);
        return;
      }
      
      const response = await api.buscarMutiroes();
      
      console.log("Resposta buscarMutiroes:", response);
      
      if (response.sucesso) {
        setMutiroes(response.dados?.mutiroes || []);
        // Reset retry count on success
        setRetryCount(0);
      } else {
        setError(response.erro || 'Erro desconhecido ao carregar mutirões');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os mutirões disponíveis: ' + (response.erro || 'Erro desconhecido'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar mutirões:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com o servidor';
      setError(errorMessage);
      
      // Auto-retry once if we got a network error
      if (errorMessage === 'Failed to fetch' && !shouldRetry && retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => carregarMutiroes(true), 2000);
        return;
      }
      
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os mutirões disponíveis: ' + errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMutiroes();
  }, []);

  // Formata a data no formato brasileiro
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Mutirões de Castração Disponíveis</h1>
          <Button variant="outline" size="sm" onClick={() => carregarMutiroes()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
        <p className="text-muted-foreground mb-8">
          Selecione um mutirão abaixo para agendar a castração do seu pet
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de conexão</AlertTitle>
            <AlertDescription>
              <div className="mb-2">
                {error === 'Failed to fetch'
                  ? 'Não foi possível conectar ao servidor backend. Certifique-se de que o servidor está rodando em http://localhost:3001 e tente novamente.'
                  : error}
              </div>
              <div className="text-xs">
                {error === 'Failed to fetch' && 'Execute: node src/api/server.js'}
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" onClick={() => carregarMutiroes()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Carregando mutirões disponíveis...</p>
          </div>
        ) : mutiroes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mutiroes.map((mutirao) => (
              <Card key={mutirao.mutirao_id} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Mutirão de Castração</CardTitle>
                  <CardDescription>
                    Organizado por: {mutirao.nome_ong || 'ONG não especificada'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Data</p>
                        <p>{formatarData(mutirao.data_mutirao)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Local</p>
                        <p className="text-sm">{mutirao.endereco}</p>
                        <p className="text-sm">{mutirao.cidade}/{mutirao.estado}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Vagas disponíveis</p>
                        <p>{mutirao.vagas_disponiveis} de {mutirao.total_vagas}</p>
                      </div>
                    </div>
                    
                    {mutirao.informacoes_adicionais && (
                      <div>
                        <p className="font-medium">Informações adicionais</p>
                        <p className="text-sm text-muted-foreground">{mutirao.informacoes_adicionais}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild disabled={mutirao.vagas_disponiveis <= 0}>
                    <Link to={`/agendar/${mutirao.mutirao_id}`}>
                      {mutirao.vagas_disponiveis > 0 ? 'Agendar castração' : 'Sem vagas disponíveis'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="text-muted-foreground">
              {error ? 'Não foi possível carregar os mutirões devido a um erro.' : 'Nenhum mutirão de castração disponível no momento.'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {error ? 'Clique em "Atualizar" para tentar novamente.' : 'Volte em breve para verificar novos mutirões.'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MutiroesDisponiveis;
