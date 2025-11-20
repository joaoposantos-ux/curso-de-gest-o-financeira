import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaChartLine, FaClock, FaCheckCircle } from 'react-icons/fa';
import NotasAlunoToggle from './NotasAlunoToggle';

const modulos = [
  {
    id: 1,
    titulo: 'Introdução à Gestão Financeira e Conceitos Básicos',
    descricao: 'Fundamentos essenciais para entender a gestão financeira.',
    icon: FaBook,
    duracao: '2-3 horas'
  },
  {
    id: 2,
    titulo: 'Planejamento e Controle Financeiro',
    descricao: 'Como planejar, organizar e controlar as finanças de uma organização.',
    icon: FaChartLine,
    duracao: '3-4 horas'
  },
  {
    id: 3,
    titulo: 'Análise de Demonstrativos Contábeis',
    descricao: 'Fundamentos essenciais para entender a gestão financeira.',
    icon: FaBook,
    duracao: '2-3 horas'
  },
  {
    id: 4,
    titulo: 'Fluxo de Caixa e Capital de Giro',
    descricao: 'Gestão do fluxo de caixa e capital de giro para saúde financeira.',
    icon: FaBook,
    duracao: '2-3 horas'
  },
  {
    id: 5,
    titulo: 'Fontes de Financiamento e Investimentos',
    descricao: 'Principais fontes de recursos e noções de investimento.',
    icon: FaChartLine,
    duracao: '3-4 horas'
  },
  {
    id: 6,
    titulo: 'Indicadores de Desempenho Financeiro e Tomada de Decisão',
    descricao: 'Como usar indicadores para decisões estratégicas.',
    icon: FaChartLine,
    duracao: '3-4 horas'
  }
];

export default function HomeCurso() {
  const [progresso, setProgresso] = useState({});
  const [atualizar, setAtualizar] = useState(0);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchProgresso() {
      if (!usuario) {
        console.error('Usuário não encontrado');
        return;
      }
      
      const urlApi = `${API_URL}/quiz/progresso?usuario_id=${usuario.id}`;
      console.log('Buscando progresso em:', urlApi);
      
      try {
        const res = await fetch(urlApi);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Dados de progresso recebidos:', data);
        
        const prog = {};
        data.forEach(p => {
          prog[p.modulo_id] = { acertos: p.acertos, total: p.total };
        });
        setProgresso(prog);
        console.log('Progresso atualizado:', prog);
      } catch (error) {
        console.error('Erro ao buscar progresso:', error);
      }
    }
    fetchProgresso();
  }, [usuario, API_URL, atualizar]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex flex-col items-center py-12 px-4">
      {/* Header Principal */}
      <div className="w-full max-w-6xl mb-12">
        <div className="bg-gradient-to-r from-gray-800 to-slate-800 rounded-2xl shadow-2xl p-10 text-white border border-gray-700">
          <h1 className="text-5xl font-bold mb-4">Curso de Gestão Financeira</h1>
          <p className="text-gray-300 text-lg">Módulos completos com conteúdo profissional e avaliações práticas</p>
        </div>
      </div>

      {/* Seção de Progresso Geral */}
      <div className="w-full max-w-6xl mb-12">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FaChartLine className="text-gray-700" />
              Seu Progresso Geral
            </h2>
            <div className="text-3xl font-bold text-gray-700">{percent}%</div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-md">
              <div 
                className="bg-gradient-to-r from-gray-600 to-slate-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${percent}%` }}
              >
                {percent > 10 && <span className="text-white font-bold text-sm">{percent}%</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Questões Respondidas</div>
              <div className="text-3xl font-bold text-gray-700">{totalRespondidas}</div>
              <div className="text-sm text-gray-500">de {totalPerguntas}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Taxa de Acerto</div>
              <div className="text-3xl font-bold text-gray-700">{percent}%</div>
              <div className="text-sm text-gray-500">Desempenho</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Módulos Iniciados</div>
              <div className="text-3xl font-bold text-gray-700">{Object.keys(progresso).length}</div>
              <div className="text-sm text-gray-500">de 6</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="w-full max-w-6xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <FaBook /> Módulos Disponíveis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map(modulo => {
            const prog = progresso[modulo.id];
            const percentModulo = prog && prog.total > 0 ? Math.round((prog.acertos / prog.total) * 100) : 0;
            const completo = prog && prog.total > 0 && prog.acertos === prog.total;
            const IconComponent = modulo.icon;

            // Força o card do módulo 3 a ser igual aos demais
            return (
              <Link key={modulo.id} to={`/modulo/${modulo.id}`} className="no-underline group">
                <div className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer h-full border border-gray-200`}> {/* Remove destaque especial */}
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <IconComponent className="text-xl text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">{modulo.titulo}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 text-sm mb-4">{modulo.descricao}</p>

                  {/* Duração */}
                  <div className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                    <FaClock className="text-xs" />
                    {modulo.duracao}
                  </div>

                  {/* Barra de Progresso */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-600">Progresso</span>
                      <span className="text-xs font-bold text-gray-700">{percentModulo}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-300 bg-gray-600"
                        style={{ width: `${percentModulo}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {prog ? `${prog.acertos}/${prog.total} questões` : 'Não iniciado'}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Footer */}
      <div className="w-full max-w-6xl bg-gray-800 rounded-xl p-6 text-center text-gray-300 text-sm border border-gray-700 mb-12">
        💡 <strong>Dica:</strong> Complete todos os módulos para obter a declaração de conclusão do curso. Acesse "Área do Aluno" para acompanhar seu progresso detalhado.
      </div>

      {/* Notas flutuantes */}
      <NotasAlunoToggle />
    </div>
  );
}
