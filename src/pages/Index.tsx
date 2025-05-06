
import { Dog, Heart, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="space-y-6 flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-primary-800">
                Mutirão de Castração Quatro Patas
              </h1>
              <p className="text-lg text-gray-700 md:text-xl">
                Conectamos tutores de animais com ONGs que realizam campanhas de castração acessíveis para garantir o bem-estar animal e controle populacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => navigate('/cadastro/ong')} size="lg" className="bg-primary hover:bg-primary-600">
                  Sou uma ONG
                </Button>
                <Button onClick={() => navigate('/cadastro/tutor')} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary-50">
                  Sou um Tutor
                </Button>
              </div>
            </div>
            <div className="flex-1 md:order-2 relative">
              <img 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop" 
                alt="Cachorros felizes" 
                className="rounded-lg shadow-lg object-cover w-full max-w-md mx-auto h-64 md:h-80" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma facilita o acesso a serviços de castração para tutores e gerenciamento de campanhas para ONGs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Dog className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cadastre seus Pets</h3>
                <p className="text-gray-600">
                  Tutores podem cadastrar todos os seus pets na plataforma, mantendo um registro fácil e organizado.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Calendar className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Encontre Campanhas</h3>
                <p className="text-gray-600">
                  Localize ONGs próximas a você que estejam realizando mutirões de castração com datas disponíveis.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Heart className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Agende a Castração</h3>
                <p className="text-gray-600">
                  Inscreva seus animais em campanhas de castração de forma rápida e simples, contribuindo para o bem-estar animal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefícios da Castração</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A castração traz inúmeros benefícios tanto para os animais quanto para a comunidade.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="rounded-full bg-secondary-100 p-2 h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1">
                <Info className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Saúde do Pet</h3>
                <p className="text-gray-600">
                  Reduz significativamente o risco de câncer de mama e doenças uterinas em fêmeas, e problemas prostáticos e testiculares em machos.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="rounded-full bg-secondary-100 p-2 h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1">
                <Info className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Comportamento</h3>
                <p className="text-gray-600">
                  Animais castrados tendem a ser mais calmos, menos territoriais e apresentam menos comportamentos como marcação de território e fugas.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="rounded-full bg-secondary-100 p-2 h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1">
                <Info className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Controle Populacional</h3>
                <p className="text-gray-600">
                  Reduz a superpopulação de animais abandonados e, consequentemente, diminui o sofrimento nas ruas.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="rounded-full bg-secondary-100 p-2 h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1">
                <Info className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Bem-estar Social</h3>
                <p className="text-gray-600">
                  Menos animais nas ruas significa menos acidentes, transmissão de doenças e outros problemas associados a animais abandonados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Faça parte desse movimento!
            </h2>
            <p className="text-white/90 mb-8">
              Cadastre-se agora e contribua para a causa da saúde animal, seja você uma ONG ou um tutor responsável.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/cadastro/ong')} size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Sou uma ONG
              </Button>
              <Button onClick={() => navigate('/cadastro/tutor')} size="lg" className="bg-accent hover:bg-accent-600">
                Sou um Tutor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
