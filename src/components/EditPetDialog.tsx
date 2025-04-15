
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import * as api from '@/services/api';

interface Pet {
  pet_id: string;
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  sexo: string;
  peso: string;
}

interface EditPetDialogProps {
  pet: Pet;
  onPetUpdated: (updatedPet: Pet) => void;
}

export function EditPetDialog({ pet, onPetUpdated }: EditPetDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState<Pet>(pet);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Update form data when pet prop changes
    setFormData(pet);
  }, [pet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Updating pet with ID:", pet.pet_id, "Data:", formData);
      // Using atualizarPet to match the API function name in services/api.ts
      const resultado = await api.atualizarPet(pet.pet_id, formData);
      
      console.log("Update pet result:", resultado);
      
      if (resultado.sucesso) {
        toast({
          title: "Pet atualizado!",
          description: `${formData.nome} foi atualizado com sucesso.`,
        });
        onPetUpdated(formData);
        setIsOpen(false);
      } else {
        toast({
          title: "Erro ao atualizar",
          description: resultado.erro || "Erro ao atualizar o pet",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating pet:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o pet",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Pet</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="especie">Espécie</Label>
            <Select 
              value={formData.especie} 
              onValueChange={(value) => handleSelectChange(value, 'especie')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cachorro">Cachorro</SelectItem>
                <SelectItem value="Gato">Gato</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="raca">Raça</Label>
            <Input
              id="raca"
              name="raca"
              value={formData.raca}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idade">Idade (anos)</Label>
              <Input
                id="idade"
                name="idade"
                type="number"
                value={formData.idade}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                name="peso"
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Select 
              value={formData.sexo} 
              onValueChange={(value) => handleSelectChange(value, 'sexo')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Macho</SelectItem>
                <SelectItem value="F">Fêmea</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
