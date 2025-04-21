
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';

// Schema para validação do formulário (atualizado)
const mutiraoFormSchema = z.object({
  nome: z.string().min(5, "O nome do mutirão deve ter pelo menos 5 caracteres."),
  data_mutirao: z.date({
    required_error: "A data do mutirão é obrigatória.",
  }),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres."),
  cidade: z.string().min(2, "A cidade deve ter pelo menos 2 caracteres."),
  estado: z.string().length(2, "O estado deve ter 2 caracteres.").toUpperCase(),
  total_vagas: z.coerce.number().int().min(1, "O mutirão deve ter pelo menos 1 vaga."),
  informacoes_adicionais: z.string().optional()
});

type MutiraoFormValues = z.infer<typeof mutiraoFormSchema>;

const CadastroMutirao = () => {
  const { currentUser, userType, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formulário usando react-hook-form
  const form = useForm<MutiraoFormValues>({
    resolver: zodResolver(mutiraoFormSchema),
    defaultValues: {
      nome: '',
      endereco: '',
      cidade: '',
      estado: '',
      total_vagas: 10,
      informacoes_adicionais: ''
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (userType !== 'organizacao') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, userType]);

  const onSubmit = async (data: MutiraoFormValues) => {
    try {
      if (!isAuthenticated || !currentUser?.organizacao_id) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado como organização para cadastrar um mutirão',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // Verificar se o servidor está online
      const serverStatus = await api.testarConexao();
      if (!serverStatus.sucesso) {
        setError('Servidor backend offline. Execute: node src/api/server.js');
        return;
      }

      // Preparar os dados para envio, incluindo o ID da organização
      const mutiraoData = {
        ...data,
        organizacao_id: currentUser.organizacao_id, // Incluir o ID da organização atual
        vagas_disponiveis: data.total_vagas, // Inicialmente todas as vagas estão disponíveis
        ong_id: null // Será preenchido no backend
      };

      console.log("Dados do mutirão para cadastro:", mutiraoData);

      const resultado = await api.inserirMutirao(mutiraoData);

      if (resultado.sucesso) {
        toast({
          title: 'Sucesso',
          description: 'Mutirão cadastrado com sucesso!',
        });
        navigate('/dashboard/organizacao');
      } else {
        setError(resultado.erro || 'Não foi possível cadastrar o mutirão');
        toast({
          title: 'Erro',
          description: resultado.erro || 'Não foi possível cadastrar o mutirão',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao cadastrar mutirão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar mutirão';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Cadastro de Mutirão de Castração</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Novo Mutirão</CardTitle>
            <CardDescription>
              Preencha os dados para cadastrar um novo mutirão de castração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Mutirão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Mutirão de Castração - Bairro Vila Nova" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="data_mutirao"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data do Mutirão</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_vagas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total de Vagas</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="informacoes_adicionais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informações Adicionais</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Informe detalhes adicionais sobre o mutirão de castração" 
                          className="resize-none" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard/organizacao')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar Mutirão'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CadastroMutirao;
