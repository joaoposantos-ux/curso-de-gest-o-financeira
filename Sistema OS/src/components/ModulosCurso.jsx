import React from 'react';

const modulos = [
  {
    titulo: 'Módulo 1: Introdução à Gestão Financeira e Conceitos Básicos',
    descricao: 'Conceitos fundamentais, objetivos da gestão financeira, terminologias e importância para empresas e pessoas.'
  },
  {
    titulo: 'Módulo 2: Planejamento e Controle Financeiro',
    descricao: 'Orçamento, planejamento financeiro, controle de receitas e despesas, ferramentas e boas práticas.'
  },
  {
    titulo: 'Módulo 3: Análise de Demonstrativos Contábeis',
    descricao: 'Balanço patrimonial, DRE, análise de indicadores, leitura e interpretação de relatórios.'
  },
  {
    titulo: 'Módulo 4: Fluxo de Caixa e Capital de Giro',
    descricao: 'Gestão do fluxo de caixa, capital de giro, ciclo financeiro e estratégias para saúde financeira.'
  },
  {
    titulo: 'Módulo 5: Fontes de Financiamento e Investimentos',
    descricao: 'Tipos de financiamento, análise de crédito, opções de investimento e avaliação de riscos.'
  },
  {
    titulo: 'Módulo 6: Indicadores de Desempenho Financeiro e Tomada de Decisão',
    descricao: 'KPIs financeiros, análise de desempenho, tomada de decisão baseada em dados.'
  }
];

export default function ModulosCurso() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Curso de Gestão Financeira</h1>
      <p className="mb-8 text-lg text-gray-700">Conheça os módulos do curso e aprofunde seus conhecimentos em gestão financeira!</p>
      <div className="grid gap-6">
        {modulos.map((mod, idx) => (
          <div key={idx} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
            <h2 className="text-xl font-semibold text-blue-800 mb-1">{mod.titulo}</h2>
            <p className="text-gray-700">{mod.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
