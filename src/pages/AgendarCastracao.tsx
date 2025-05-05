
/**
 * AgendarCastracao.tsx
 * 
 * Este componente implementa a página de agendamento de castração para pets.
 * Permite que tutores selecionem um de seus pets cadastrados e agendem sua
 * castração em um mutirão específico.
 * 
 * Funcionalidades:
 * - Carrega informações do mutirão selecionado
 * - Busca todos os pets do tutor
 * - Permite a seleção de um pet para castração
 * - Permite adicionar observações opcionais
 * - Envia os dados para o servidor e redireciona para o dashboard em caso de sucesso
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import * as api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dog, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define o schema de validação do formulário
const formSchema = z.object({
  pet_id: z.string({
    required_error: "Selecione um pet para castração",
  }),
  observacoes: z.string().optional(),
});

const AgendarCastracao = () => {
  const { mutiraoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, userType, isAuthenticated } = useAuth();
  
  const [mutirao, setMutirao] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPets, setLoadingPets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Configuração do formulário com react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observacoes: '',
    },
  });

  // Função para formatar a data no formato brasileiro
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Carregar informações do mutirão selecionado
  const carregarMutirao = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar se o ID do mutirão foi fornecido
      if (!mutiraoId) {
        setError('ID do mutirão não fornecido');
        setLoading(false);
        return;
      }
      
      // Buscar todos os mutirões e encontrar o selecionado
      const response = await api.buscarMutiroes();
      
      if (response.sucesso) {
        const mutiraoEncontrado = response.dados.mutiroes.find(
          (m: any) => m.mutirao_id.toString() === mutiraoId
        );
        
        if (mutiraoEncontrado) {
          setMutirao(mutiraoEncontrado);
        } else {
          setError('Mutirão não encontrado');
        }
      } else {
        setError(response.erro || 'Erro desconhecido ao carregar o mutirão');
      }
    } catch (error) {
      console.error('Erro ao carregar mutirão:', error);
      setError('Erro ao carregar mutirão: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  // Carregar pets do tutor
  const carregarPets = async () => {
    try {
      setLoadingPets(true);
      
      if (!currentUser?.tutor_id) {
        setPets([]);
        return;
      }
      
      const response = await api.buscarPetsDoTutor(currentUser.tutor_id);
      
      if (response.sucesso) {
        setPets(response.dados.pets || []);
        
        if (response.dados.pets.length === 0) {
          toast({
            title: 'Atenção',
            description: 'Você não possui pets cadastrados. Cadastre um pet antes de agendar uma castração.',
            variant: 'default',
          });
        }
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus pets: ' + (response.erro || 'Erro desconhecido'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus pets',
        variant: 'destructive',
      });
    } finally {
      setLoadingPets(false);
    }
  };

  useEffect(() => {
    carregarMutirao();
  }, [mutiraoId]);

  useEffect(() => {
    if (isAuthenticated && userType === 'tutor' && currentUser?.tutor_id) {
      carregarPets();
    }
  }, [isAuthenticated, userType, currentUser]);

  // Função para submeter o formulário
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!mutirao || !currentUser?.tutor_id) {
      toast({
        title: 'Erro',
        description: 'Informações necessárias não encontradas',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const agendamentoData = {
        mutiraoId: mutirao.mutirao_id,
        petId: values.pet_id,
        tutorId: currentUser.tutor_id,
        observacoes: values.observacoes,
      };
      
      console.log('Enviando dados de agendamento:', agendamentoData);
      
      const response = await api.criarAgendamento(agendamentoData);
      
      if (response.sucesso) {
        toast({
          title: 'Sucesso',
          description: 'Agendamento realizado com sucesso!',
        });
        // Redirecionar para o dashboard após o agendamento
        navigate('/dashboard');
      } else {
        toast({
          title: 'Erro',
          description: response.erro || 'Não foi possível realizar o agendamento',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao agendar castração:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao realizar o agendamento: ' + (error instanceof Error ? error.message : 'Erro desconhecido'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect if user is not a tutor
  if (userType !== 'tutor') {
    return <Navigate to="/dashboard/organizacao" />;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Agendar Castração</h1>
        <p className="text-muted-foreground mb-8">
          Preencha o formulário abaixo para agendar a castração do seu pet
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Carregando informações do mutirão...</p>
          </div>
        ) : mutirao ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Formulário de Agendamento</CardTitle>
                  <CardDescription>
                    Selecione um pet e preencha as informações necessárias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="pet_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pet para castração</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={loadingPets || pets.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um pet" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pets.map((pet) => (
                                  <SelectItem key={pet.pet_id} value={pet.pet_id.toString()}>
                                    {pet.nome} - {pet.especie}, {pet.sexo === 'M' ? 'Macho' : 'Fêmea'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {loadingPets 
                                ? 'Carregando seus pets...'
                                : pets.length === 0 
                                  ? 'Você não tem pets cadastrados. Cadastre um pet antes de agendar.'
                                  : 'Escolha qual pet será castrado neste mutirão.'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações (opcional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Informe aqui qualquer observação importante sobre seu pet"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Por exemplo: alergias, medicamentos em uso, ou outras informações relevantes.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={submitting || pets.length === 0}
                      >
                        {submitting ? 'Processando...' : 'Confirmar Agendamento'}
                      </Button>
                      
                      {pets.length === 0 && (
                        <Button 
                          variant="outline" 
                          className="w-full mt-2" 
                          onClick={() => navigate('/cadastro/pet')}
                        >
                          <Dog className="mr-2 h-4 w-4" />
                          Cadastrar Novo Pet
                        </Button>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Mutirão</CardTitle>
                  <CardDescription>
                    Detalhes do mutirão selecionado
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                    
                    <div>
                      <p className="font-medium">Organização</p>
                      <p>{mutirao.nome_organizacao || 'Não especificada'}</p>
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
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/mutiroes')}
                  >
                    Voltar para lista de mutirões
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertTitle>Mutirão não encontrado</AlertTitle>
            <AlertDescription>
              Não foi possível encontrar o mutirão selecionado. Volte para a lista de mutirões e tente novamente.
              <div className="mt-4">
                <Button onClick={() => navigate('/mutiroes')}>
                  Ver Mutirões Disponíveis
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </MainLayout>
  );
};

export default AgendarCastracao;
