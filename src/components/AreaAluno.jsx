import React, { useEffect, useState } from 'react';
import { FaBook, FaCheckCircle, FaClock, FaTrophy, FaFileDownload, FaChartLine, FaMedal } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DeclaracaoConclusao from './DeclaracaoConclusao';
import AnaliseDemonstrativosContabeis from './AnaliseDemonstrativosContabeis';

const modulos = [
  { id: 1, titulo: 'Fundamentos da Administração Financeira', icon: FaBook },
  { id: 2, titulo: 'Análise e Planejamento Financeiro', icon: FaChartLine },
  { id: 3, titulo: 'Gestão do Capital de Giro', icon: FaBook },
  { id: 4, titulo: 'Matemática Financeira Aplicada', icon: FaBook },
  { id: 5, titulo: 'Avaliação de Investimentos', icon: FaTrophy },
  { id: 6, titulo: 'Custo e Estrutura de Capital', icon: FaMedal }
];

export default function AreaAluno() {
  const [progresso, setProgresso] = useState({});
  const [mostraDeclaracao, setMostraDeclaracao] = useState(false);
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
        const res = await fetch(urlApi, {
          headers: { 
            'Bypass-Tunnel-Reminder': 'true'
          }
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Dados de progresso recebidos:', data);
        
        const prog = {};
        let totalRespondidas = 0;
        let totalPerguntas = 0;

        data.forEach(p => {
          if (p.modulo_id) {
            prog[p.modulo_id] = { acertos: p.acertos, total: p.total };
          }
          totalRespondidas += p.acertos || 0;
          totalPerguntas += p.total || 0;
        });

        prog._totalRespondidas = totalRespondidas;
        prog._totalPerguntas = totalPerguntas;
        setProgresso(prog);
        console.log('Progresso atualizado:', prog);
      } catch (error) {
        console.error('Erro ao buscar progresso:', error);
      }
    }
    fetchProgresso();
  }, [usuario, API_URL]);

  const percent = progresso._totalPerguntas > 0 ? Math.round((progresso._totalRespondidas / progresso._totalPerguntas) * 100) : 0;
  const podeEmitirDeclaracao = percent === 100;

  if (mostraDeclaracao) {
    return <DeclaracaoConclusao usuario={usuario} onVoltar={() => setMostraDeclaracao(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center py-12 px-4">
      {/* Header com Boas-vindas */}
      <div className="w-full max-w-5xl mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <FaTrophy className="text-4xl text-yellow-300" />
            <h1 className="text-4xl font-bold">Bem-vindo, {usuario?.nome}!</h1>
          </div>
          <p className="text-blue-100 text-lg">Acompanhe seu progresso no curso de Gestão Financeira</p>
        </div>
      </div>

      {/* Progresso Geral - Card Principal */}
      <div className="w-full max-w-5xl mb-8">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaChartLine className="text-blue-600" />
              Progresso Geral do Curso
            </h2>
            <div className="text-4xl font-bold text-blue-600">{percent}%</div>
          </div>
          
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-md">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${percent}%` }}
              >
                {percent > 10 && <span className="text-white font-bold text-sm">{percent}%</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Questões Respondidas</div>
              <div className="text-3xl font-bold text-blue-600">{progresso._totalRespondidas || 0}</div>
              <div className="text-sm text-gray-500">de {progresso._totalPerguntas || 0}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
              <div className="text-sm text-gray-600 mb-1">Taxa de Acerto</div>
              <div className="text-3xl font-bold text-green-600">
                {progresso._totalPerguntas > 0 ? Math.round((progresso._totalRespondidas / progresso._totalPerguntas) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Desempenho</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center border-2 border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Módulos Completos</div>
              <div className="text-3xl font-bold text-purple-600">
                {Object.keys(progresso).filter(k => {
                  if (k.startsWith('_')) return false;
                  const p = progresso[k];
                  return p.total > 0 && p.acertos === p.total;
                }).length}
              </div>
              <div className="text-sm text-gray-500">de 6</div>
            </div>
          </div>

          {podeEmitirDeclaracao && (
            <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
              <p className="text-green-800 font-semibold mb-3 flex items-center gap-2">
                <FaCheckCircle /> Parabéns! Você completou o curso com sucesso!
              </p>
              <button
                onClick={() => setMostraDeclaracao(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <FaFileDownload /> Emitir Declaração de Conclusão
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progresso por Módulo */}
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <FaBook /> Progresso por Módulo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modulos.map((modulo) => {
            const prog = progresso[modulo.id];
            const percentModulo = prog && prog.total > 0 ? Math.round((prog.acertos / prog.total) * 100) : 0;
            const IconComponent = modulo.icon;
            const completo = prog && prog.total > 0 && prog.acertos === prog.total;

            return (
              <Link key={modulo.id} to={`/modulo/${modulo.id}`} className="no-underline group">
                <div className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer ${completo ? 'border-2 border-green-500 bg-green-50' : 'border border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${completo ? 'bg-green-100' : 'bg-blue-100'}`}>
                        <IconComponent className={`text-xl ${completo ? 'text-green-600' : 'text-blue-600'}`} />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm">{modulo.titulo}</h3>
                    </div>
                    {completo && <FaCheckCircle className="text-green-500 text-xl" />}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className="text-sm font-bold text-gray-700">{percentModulo}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${completo ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${percentModulo}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <FaClock className="text-xs" />
                    {prog ? `${prog.acertos} de ${prog.total} questões` : 'Não iniciado'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer com dicas */}
      <div className="w-full max-w-5xl mt-12 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
        <p className="text-gray-700 text-sm">
          💡 <strong>Dica:</strong> Complete todos os módulos e responda todos os quizzes para obter a declaração de conclusão do curso!
        </p>
      </div>
    </div>
  );
}
