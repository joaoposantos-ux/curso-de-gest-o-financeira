import React, { useEffect, useState } from 'react';
import { FaUserTie, FaChartLine, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function DashboardGestor() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/dados`);
      if (!res.ok) throw new Error('Falha ao buscar dados');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Métricas Gerais
  const totalAlunos = usuarios.filter(u => !u.admin).length;
  const mediaGeralProgresso = usuarios.length > 0 
    ? Math.round(usuarios.reduce((acc, curr) => acc + curr.progresso, 0) / usuarios.length) 
    : 0;
  const concluidos = usuarios.filter(u => u.progresso === 100).length;

  if (loading) return <div className="p-8 text-center text-gray-600">Carregando painel...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserTie className="text-blue-600" /> Painel do Gestor
        </h1>
        <p className="text-gray-600 mt-2">Acompanhe o desempenho e engajamento da sua equipe.</p>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Total de Alunos</p>
              <p className="text-3xl font-bold text-gray-800">{totalAlunos}</p>
            </div>
            <FaUserTie className="text-4xl text-blue-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Média de Progresso</p>
              <p className="text-3xl font-bold text-gray-800">{mediaGeralProgresso}%</p>
            </div>
            <FaChartLine className="text-4xl text-green-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Conclusões</p>
              <p className="text-3xl font-bold text-gray-800">{concluidos}</p>
            </div>
            <FaCheckCircle className="text-4xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Tabela de Detalhes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Desempenho Individual</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Colaborador</th>
                <th className="p-4 font-semibold">Progresso</th>
                <th className="p-4 font-semibold">Média (Quiz)</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.foto ? (
                        <img src={`data:image/jpeg;base64,${user.foto}`} alt={user.nome} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {user.nome.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{user.nome}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${user.progresso}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{user.progresso}% Concluído</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${user.media >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                      {user.media}%
                    </span>
                  </td>
                  <td className="p-4">
                    {user.progresso === 100 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        Certificado
                      </span>
                    ) : user.progresso > 0 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                        Em Andamento
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        Não Iniciado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
