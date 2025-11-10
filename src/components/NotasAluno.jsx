import React, { useState, useEffect } from 'react';

const STATUS = ['Pendentes', 'Cursando', 'Concluído'];

export default function NotasAluno() {
  const [notas, setNotas] = useState([]);
  const [novaNota, setNovaNota] = useState('');

  useEffect(() => {
    const salvas = localStorage.getItem('notasAluno');
    if (salvas) setNotas(JSON.parse(salvas));
  }, []);

  useEffect(() => {
    localStorage.setItem('notasAluno', JSON.stringify(notas));
  }, [notas]);

  function adicionarNota() {
    if (novaNota.trim()) {
      setNotas([...notas, { texto: novaNota, status: 'Pendentes' }]);
      setNovaNota('');
    }
  }

  function moverNota(idx, novoStatus) {
    setNotas(notas => notas.map((n, i) => i === idx ? { ...n, status: novoStatus } : n));
  }

  function removerNota(idx) {
    setNotas(notas => notas.filter((_, i) => i !== idx));
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-blue-200 w-full max-w-4xl mt-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Minhas Anotações & Controle de Matérias</h2>
      <div className="flex gap-4 mb-6">
        <input
          className="flex-1 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Nova anotação ou matéria..."
          value={novaNota}
          onChange={e => setNovaNota(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && adicionarNota()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={adicionarNota}
        >Adicionar</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS.map(status => (
          <div key={status} className="bg-blue-50 rounded-lg p-4 border border-blue-100 min-h-[180px]">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">{status}</h3>
            {notas.filter(n => n.status === status).length === 0 && (
              <div className="text-gray-400 italic text-sm">Nenhuma anotação</div>
            )}
            {notas.map((nota, idx) => nota.status === status && (
              <div key={idx} className="bg-white rounded shadow p-3 mb-3 flex flex-col gap-2 border border-blue-100">
                <div className="text-gray-800 text-sm">{nota.texto}</div>
                <div className="flex gap-2">
                  {STATUS.filter(s => s !== status).map(s => (
                    <button
                      key={s}
                      className="text-xs px-2 py-1 rounded border border-blue-300 bg-blue-100 hover:bg-blue-200 text-blue-700"
                      onClick={() => moverNota(idx, s)}
                    >Mover para {s}</button>
                  ))}
                  <button
                    className="text-xs px-2 py-1 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
                    onClick={() => removerNota(idx)}
                  >Remover</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
