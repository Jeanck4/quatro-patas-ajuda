
/**
 * Sobre.tsx
 * 
 * Página que apresenta a missão e objetivos do site Quatro Patas.
 * Explica como a plataforma conecta tutores com organizações para
 * tornar os cuidados veterinários mais acessíveis, especialmente
 * campanhas de castração gratuitas ou de baixo custo.
 */

import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, DollarSign, Shield } from 'lucide-react';

const Sobre = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-900 mb-4">
              Sobre o Quatro Patas
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Uma plataforma criada com o objetivo de tornar o cuidado com pets mais acessível 
              para famílias que precisam de apoio financeiro.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Nossa Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                O Quatro Patas nasceu da necessidade de democratizar o acesso aos cuidados veterinários. 
                Sabemos que muitas famílias amam seus pets, mas enfrentam dificuldades financeiras para 
                proporcionar todos os cuidados necessários, especialmente procedimentos como castração, 
                vacinação e consultas veterinárias.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Nossa plataforma conecta tutores responsáveis com organizações que oferecem serviços 
                veterinários gratuitos ou a preços populares, garantindo que o amor pelos animais 
                não seja limitado pela condição financeira.
              </p>
            </CardContent>
          </Card>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Cuidados Acessíveis
                </CardTitle>
                <CardDescription>
                  Acesso a serviços veterinários gratuitos ou de baixo custo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conectamos você com organizações que oferecem campanhas de castração, 
                  vacinação e outros cuidados essenciais a preços acessíveis ou gratuitos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Rede de Apoio
                </CardTitle>
                <CardDescription>
                  Comunidade unida pelo bem-estar animal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Facilitamos a conexão entre tutores responsáveis e organizações 
                  comprometidas com a causa animal, criando uma rede de apoio mútuo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Cuidado Responsável
                </CardTitle>
                <CardDescription>
                  Promovendo a posse responsável de animais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Incentivamos práticas de cuidado responsável, incluindo castração 
                  para controle populacional e prevenção de doenças.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Impacto Social
                </CardTitle>
                <CardDescription>
                  Transformando vidas de pets e famílias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cada procedimento realizado através da nossa plataforma representa 
                  uma vida animal protegida e uma família mais tranquila.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-primary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800">
                Faça Parte Desta Causa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-700 mb-4">
                Se você é um tutor que precisa de apoio ou uma organização que oferece 
                serviços veterinários acessíveis, junte-se à nossa comunidade. 
                Juntos, podemos garantir que todos os pets recebam o cuidado que merecem.
              </p>
              <div className="flex gap-4">
                <a 
                  href="/cadastro" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Cadastre-se Agora
                </a>
                <a 
                  href="/mutiroes" 
                  className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                >
                  Ver Mutirões Disponíveis
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Sobre;
