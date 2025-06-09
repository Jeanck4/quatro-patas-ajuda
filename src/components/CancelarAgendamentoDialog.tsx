
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import * as api from '@/services/api';

interface CancelarAgendamentoDialogProps {
  agendamentoId: string;
  nomePet: string;
  onCancelado: () => void;
}

export const CancelarAgendamentoDialog = ({ 
  agendamentoId, 
  nomePet, 
  onCancelado 
}: CancelarAgendamentoDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCancelar = async () => {
    try {
      setLoading(true);
      
      await api.cancelarAgendamento(agendamentoId);
      
      toast({
        title: 'Agendamento cancelado',
        description: `O agendamento de ${nomePet} foi cancelado com sucesso.`,
      });
      
      setOpen(false);
      onCancelado();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o agendamento. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Cancelar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar o agendamento de castração para {nomePet}? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Voltar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancelar}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Cancelando...' : 'Confirmar cancelamento'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
