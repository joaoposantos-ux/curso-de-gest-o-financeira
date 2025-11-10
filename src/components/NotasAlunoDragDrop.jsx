import React, { useState, useEffect } from 'react';

const STATUS = ['Pendentes', 'Cursando', 'Concluído'];

export default function NotasAlunoDragDrop() {
  const [notas, setNotas] = useState([]);
  const [novaNota, setNovaNota] = useState('');
  const [draggedIdx, setDraggedIdx] = useState(null);

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

  function onDragStart(idx) {
    setDraggedIdx(idx);
  }

  function onDrop(status) {
    if (draggedIdx !== null) {
      setNotas(notas => notas.map((n, i) => i === draggedIdx ? { ...n, status } : n));
      setDraggedIdx(null);
    }
  }

  function removerNota(idx) {
    setNotas(notas => notas.filter((_, i) => i !== idx));
  }

  return (
    <div className="bg-white rounded-lg shadow p-3 border border-blue-200 w-full max-w-xl mt-4 animate-fade-in text-sm">
      <h2 className="text-lg font-bold text-blue-800 mb-2">Minhas Anotações</h2>
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Nova anotação ou matéria..."
          value={novaNota}
          onChange={e => setNovaNota(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && adicionarNota()}
        />
        <button
          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition"
          onClick={adicionarNota}
        >Adicionar</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {STATUS.map(status => (
          <div
            key={status}
            className="bg-blue-50 rounded p-2 border border-blue-100 min-h-[80px]"
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(status)}
          >
            <h3 className="text-xs font-semibold text-blue-700 mb-1 text-center">{status}</h3>
            {notas.filter(n => n.status === status).length === 0 && (
              <div className="text-gray-300 italic text-xs text-center">Nenhuma</div>
            )}
            {notas.filter(n => n.status === status).map((nota, idx) => (
              <div
                key={nota.texto + idx}
                className="bg-white rounded shadow p-2 mb-2 flex items-center justify-between border border-blue-100 cursor-move text-xs"
                draggable
                onDragStart={() => onDragStart(notas.findIndex(n2 => n2 === nota))}
              >
                <span className="truncate max-w-[90px]">{nota.texto}</span>
                <button
                  className="text-xs px-1 py-0.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 ml-2"
                  onClick={() => removerNota(notas.findIndex(n2 => n2 === nota))}
                >Remover</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
