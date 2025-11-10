import React from 'react';
import QuizModulo from './QuizModulo';
import { useParams, Link } from 'react-router-dom';

const conteudos = [
  {
    id: 1,
    titulo: 'Introdução à Gestão Financeira e Conceitos Básicos',
    texto: `Este módulo apresenta os fundamentos da gestão financeira, conceitos de finanças, objetivos e importância para organizações e pessoas.`
  },
  {
    id: 2,
    titulo: 'Planejamento e Controle Financeiro',
    texto: `Aprenda a planejar receitas, despesas, orçamentos e a controlar o fluxo financeiro para garantir sustentabilidade.`
  },
  {
    id: 3,
    titulo: 'Análise de Demonstrativos Contábeis',
    texto: `Entenda como analisar balanço patrimonial, demonstração de resultados e outros relatórios contábeis.`
  },
  {
    id: 4,
    titulo: 'Fluxo de Caixa e Capital de Giro',
    texto: `Saiba como gerenciar o fluxo de caixa, prever entradas e saídas e administrar o capital de giro.`
  },
  {
    id: 5,
    titulo: 'Fontes de Financiamento e Investimentos',
    texto: `Conheça as principais fontes de financiamento, tipos de investimentos e como avaliar oportunidades.`
  },
  {
    id: 6,
    titulo: 'Indicadores de Desempenho Financeiro e Tomada de Decisão',
    texto: `Utilize indicadores financeiros para avaliar resultados e apoiar decisões estratégicas.`
  }
];

export default function ModuloCurso() {
  const { id } = useParams();
  const modulo = conteudos.find(m => m.id === Number(id));

  if (!modulo) return <div className="p-8">Módulo não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-blue-200 mb-8">
        <h1 className="text-2xl font-bold neon-title mb-4">{modulo.titulo}</h1>
        {/* Seção Conteudista */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold neon-subtitle mb-2">Conteúdo do Módulo</h2>
          <div className="text-gray-800 whitespace-pre-line leading-relaxed">
            {modulo.texto}
            {/* Imagem ilustrativa dinâmica por módulo */}
            <img
              src={`https://source.unsplash.com/800x200/?finance,technology,${modulo.id}`}
              alt="Ilustração do módulo"
              className="my-4 rounded-xl shadow-lg border border-blue-100"
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
            />
          </div>
        </div>
        <Link to="/" className="text-blue-600 underline hover:text-blue-800">Voltar para módulos</Link>
      </div>
      {/* Quiz interativo do módulo */}
      <QuizModulo moduloId={modulo.id} />
    </div>
  );
}
