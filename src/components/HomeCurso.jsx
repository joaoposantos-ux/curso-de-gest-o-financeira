import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NotasAluno from './NotasAluno';
import NotasAlunoToggle from './NotasAlunoToggle';


const modulos = [
  {
    id: 1,
    titulo: 'Introdução à Gestão Financeira e Conceitos Básicos',
    descricao: 'Fundamentos essenciais para entender a gestão financeira.',
    imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    titulo: 'Planejamento e Controle Financeiro',
    descricao: 'Como planejar, organizar e controlar as finanças de uma organização.',
    imagem: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    titulo: 'Análise de Demonstrativos Contábeis',
    descricao: 'Entenda balanço patrimonial, DRE e outros relatórios.',
    imagem: 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    titulo: 'Fluxo de Caixa e Capital de Giro',
    descricao: 'Gestão do fluxo de caixa e capital de giro para saúde financeira.',
    imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    titulo: 'Fontes de Financiamento e Investimentos',
    descricao: 'Principais fontes de recursos e noções de investimento.',
    imagem: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    titulo: 'Indicadores de Desempenho Financeiro e Tomada de Decisão',
    descricao: 'Como usar indicadores para decisões estratégicas.',
    imagem: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80'
  }
];

import ModuloCurso from './ModuloCurso';

export default function HomeCurso() {
  const [progresso, setProgresso] = useState({});
  const [atualizar, setAtualizar] = useState(0);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchProgresso() {
      if (!usuario) return;
      const res = await fetch(`${API_URL}/quiz/progresso?usuario_id=${usuario.id}`);
      const data = await res.json();
      const prog = {};
      data.forEach(p => {
        prog[p.modulo_id] = { acertos: p.acertos, total: p.total };
      });
      setProgresso(prog);
    }
    fetchProgresso();
  }, [usuario, atualizar]);

  // Função para ser chamada ao finalizar quiz
  function handleQuizFinalizado() {
    setAtualizar(a => a + 1);
  }


  // Cálculo do progresso geral do aluno
  let totalRespondidas = 0;
  let totalPerguntas = 0;
  Object.values(progresso).forEach(p => {
    if (p && typeof p === 'object') {
      totalRespondidas += p.acertos || 0;
      totalPerguntas += p.total || 0;
    }
  });
  const percent = totalPerguntas > 0 ? Math.round((totalRespondidas / totalPerguntas) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-row items-start py-10">
      {/* Cronograma como aba lateral */}
      <aside className="sticky top-10 left-0 h-fit bg-white rounded-xl shadow border border-blue-200 p-5 ml-4 mr-8 w-72 flex flex-col items-center animate-fade-in" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        <h2 className="text-lg font-bold mb-4 tracking-wide" style={{ color: '#222', fontFamily: 'Inter, Arial, Helvetica, sans-serif', letterSpacing: '0.5px' }}>Cronograma</h2>
        <table className="w-full text-left border-separate border-spacing-y-1 text-[15px]">
          <thead>
            <tr>
              <th className="border-b border-blue-100 pb-1 font-semibold text-gray-700">Módulo</th>
              <th className="border-b border-blue-100 pb-1 font-semibold text-gray-700">Tema</th>
              <th className="border-b border-blue-100 pb-1 font-semibold text-gray-700">Duração</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 font-bold text-blue-900">1</td>
              <td className="text-gray-700">Introdução</td>
              <td className="text-blue-700">1 sem</td>
            </tr>
            <tr>
              <td className="py-1 font-bold text-blue-900">2</td>
              <td className="text-gray-700">Planejamento</td>
              <td className="text-blue-700">1 sem</td>
            </tr>
            <tr>
              <td className="py-1 font-bold text-blue-900">3</td>
              <td className="text-gray-700">Análise</td>
              <td className="text-blue-700">2 sem</td>
            </tr>
            <tr>
              <td className="py-1 font-bold text-blue-900">4</td>
              <td className="text-gray-700">Fluxo de Caixa</td>
              <td className="text-blue-700">1 sem</td>
            </tr>
            <tr>
              <td className="py-1 font-bold text-blue-900">5</td>
              <td className="text-gray-700">Financiamento</td>
              <td className="text-blue-700">2 sem</td>
            </tr>
            <tr>
              <td className="py-1 font-bold text-blue-900">6</td>
              <td className="text-gray-700">Indicadores</td>
              <td className="text-blue-700">1 sem</td>
            </tr>
          </tbody>
        </table>

        {/* Progresso do aluno abaixo do cronograma */}
        <div className="w-full mt-8 p-3 rounded-xl bg-blue-50 border border-blue-200 shadow animate-fade-in">
          <div className="text-base font-semibold text-blue-700 mb-2">Seu Progresso</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="text-right text-xs text-gray-700">{totalRespondidas} de {totalPerguntas} questões respondidas ({percent}%)</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col items-center">
  <h1 className="text-4xl font-extrabold mb-10" style={{ color: '#222', fontFamily: 'Inter, Arial, Helvetica, sans-serif', letterSpacing: '1px' }}>Curso de Gestão Financeira</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {modulos.map(modulo => {
            const prog = progresso[modulo.id];
            let percent = 0;
            if (prog && prog.total > 0) percent = Math.round((prog.acertos / prog.total) * 100);
            return (
              <Link
                key={modulo.id}
                to={`/modulo/${modulo.id}`}
                className="block bg-white rounded-xl shadow-lg p-6 hover:bg-blue-50 transition border border-blue-200"
                // ...sem state, navegação padrão
              >
                <img
                  src={modulo.imagem}
                  alt={modulo.titulo}
                  className="w-full h-32 object-cover rounded-md mb-4 border border-blue-100"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{modulo.titulo}</h2>
                <p className="text-gray-700 mb-2">{modulo.descricao}</p>
                {/* Barra de progresso do quiz */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Progresso do Quiz</span>
                    <span className="text-xs text-blue-700 font-semibold">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{prog ? `${prog.acertos} / ${prog.total}` : '0 / 0'}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Área de anotações do aluno */}
  {/* Removido NotasAluno fixo, agora é flutuante */}
  <NotasAlunoToggle />
    </div>
  );
}
