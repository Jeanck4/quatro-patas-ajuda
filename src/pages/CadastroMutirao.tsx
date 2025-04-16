
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';

// Schema do formulário
const formSchema = z.object({
  data_mutirao: z.date({
    required_error: "Por favor, selecione a data do mutirão",
  }),
  endereco: z.string().min(3, "O endereço deve ter pelo menos 3 caracteres"),
  cidade: z.string().min(2, "A cidade deve ter pelo menos 2 caracteres"),
  estado: z.string().length(2, "O estado deve ter 2 caracteres"),
  cep: z.string().min(8, "O CEP deve ter 8 dígitos"),
  total_vagas: z.coerce.number().min(1, "O mutirão deve ter pelo menos 1 vaga"),
  informacoes_adicionais: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CadastroMutirao = () => {
  const { currentUser, userType, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      informacoes_adicionais: "",
    },
  });

  // Função para enviar o formulário
  const onSubmit = async (values: FormValues) => {
    if (!isAuthenticated || !currentUser?.organizacao_id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado como organização para cadastrar mutirões',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const mutiraoData = {
        ...values,
        organizacao_id: currentUser.organizacao_id,
        vagas_disponiveis: values.total_vagas,
      };

      const response = await api.inserirMutirao(mutiraoData);

      if (response.sucesso) {
        toast({
          title: 'Sucesso',
          description: 'Mutirão cadastrado com sucesso!',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Erro',
          description: response.erro || 'Não foi possível cadastrar o mutirão',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao cadastrar mutirão:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao cadastrar o mutirão',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Cadastrar Novo Mutirão de Castração</CardTitle>
              <CardDescription>
                Preencha as informações do mutirão que sua organização irá realizar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Selecione a data</span>
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
                          <FormDescription>
                            Data em que o mutirão será realizado
                          </FormDescription>
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
                            <Input type="number" min="1" placeholder="Ex: 30" {...field} />
                          </FormControl>
                          <FormDescription>
                            Quantidade de animais que poderão ser castrados
                          </FormDescription>
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
                          <Input placeholder="Ex: Rua das Flores, 123" {...field} />
                        </FormControl>
                        <FormDescription>
                          Endereço completo onde o mutirão será realizado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: São Paulo" {...field} />
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
                          <FormLabel>Estado (UF)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: SP" maxLength={2} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 12345678" maxLength={9} {...field} />
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
                            placeholder="Adicione informações importantes sobre o mutirão, como horários, recomendações, etc." 
                            className="min-h-[120px]" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Essas informações serão exibidas para os tutores
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Mutirão"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Voltar</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CadastroMutirao;
