
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Dog, User, Phone, Mail, X } from 'lucide-react';
import * as api from '@/services/api';

interface AgendamentosMutiraoDialogProps {
  mutiraoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AgendamentosMutiraoDialog = ({ mutiraoId, isOpen, onClose }: AgendamentosMutiraoDialogProps) => {
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && mutiraoId) {
      loadAgendamentos();
    }
  }, [isOpen, mutiraoId]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      console.log(`Carregando agendamentos para mutirão ${mutiraoId}`);
      
      const response = await api.buscarAgendamentosMutirao(mutiraoId);
      
      if (response.sucesso) {
        setAgendamentos(response.dados.agendamentos || []);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os agendamentos',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar agendamentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Agendamentos do Mutirão</DialogTitle>
              <DialogDescription>
                Lista de todos os tutores e pets agendados para este mutirão
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <p>Carregando agendamentos...</p>
          </div>
        ) : agendamentos.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Total de agendamentos: {agendamentos.length}
            </p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Detalhes do Pet</TableHead>
                  <TableHead>Data do Agendamento</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendamentos.map((agendamento) => (
                  <TableRow key={agendamento.agendamento_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{agendamento.nome_tutor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{agendamento.email_tutor}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{agendamento.telefone_tutor}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dog className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{agendamento.nome_pet}</p>
                          <p className="text-sm text-muted-foreground">
                            {agendamento.especie}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Raça:</span> {agendamento.raca}</p>
                        <p><span className="font-medium">Idade:</span> {agendamento.idade} anos</p>
                        <p><span className="font-medium">Sexo:</span> {agendamento.sexo === 'M' ? 'Macho' : 'Fêmea'}</p>
                        <p><span className="font-medium">Peso:</span> {agendamento.peso} kg</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {formatarData(agendamento.data_agendamento)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {agendamento.observacoes || 'Nenhuma observação'}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Dog className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="text-muted-foreground">
              Nenhum agendamento encontrado para este mutirão.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
