import React, { useEffect, useState } from 'react';

const modulos = [
  'Introdução à Gestão Financeira',
  'Planejamento e Controle Financeiro',
  'Análise de Demonstrativos Contábeis',
  'Fluxo de Caixa e Capital de Giro',
  'Fontes de Financiamento e Investimentos',
  'Indicadores de Desempenho Financeiro'
];

export default function AreaAluno() {
  const [progresso, setProgresso] = useState({});
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchProgresso() {
      if (!usuario) return;
      const res = await fetch(`${API_URL}/quiz/progresso?usuario_id=${usuario.id}`);
      const data = await res.json();
      const prog = {};
      let totalRespondidas = 0;
      let totalPerguntas = 0;
      data.forEach(p => {
        prog[p.modulo_id] = { acertos: p.acertos, total: p.total };
        totalRespondidas += p.acertos;
        totalPerguntas += p.total;
      });
      prog._totalRespondidas = totalRespondidas;
      prog._totalPerguntas = totalPerguntas;
      setProgresso(prog);
    }
    fetchProgresso();
  }, [usuario]);

  const percent = progresso._totalPerguntas > 0 ? Math.round((progresso._totalRespondidas / progresso._totalPerguntas) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-blue-200 mb-8">
        <h1 className="text-2xl font-bold neon-title mb-4">Área do Aluno</h1>
        <img
          src="https://source.unsplash.com/800x180/?technology,student,finance"
          alt="Área do Aluno"
          className="mb-6 rounded-xl shadow border border-blue-100"
          style={{ width: '100%', maxHeight: 180, objectFit: 'cover' }}
        />
        <div className="mb-6">
          <div className="text-lg font-semibold text-green-700 mb-2">Progresso Geral</div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-blue-500 h-4 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="text-right text-sm text-gray-700">{progresso._totalRespondidas || 0} de {progresso._totalPerguntas || 0} questões respondidas ({percent}%)</div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Progresso por Módulo</h2>
          <ul>
            {modulos.map((nome, idx) => {
              const prog = progresso[idx + 1];
              let percentModulo = 0;
              if (prog && prog.total > 0) percentModulo = Math.round((prog.acertos / prog.total) * 100);
              return (
                <li key={idx} className="mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{nome}</span>
                    <span className="text-sm text-gray-600">{prog ? `${prog.acertos} / ${prog.total}` : '0 / 0'} ({percentModulo}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percentModulo}%` }}></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
