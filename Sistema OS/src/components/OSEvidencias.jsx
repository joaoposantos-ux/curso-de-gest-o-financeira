import React, { useRef, useState, useEffect } from 'react';

export default function OSEvidencias({ osId }) {
  const [evidencias, setEvidencias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imagemExpandida, setImagemExpandida] = useState(null); // NOVO
  const fileInputRef = useRef();
 const API_URL = import.meta.env.VITE_API_URL;
  // Carrega evidências ao abrir o modal
  useEffect(() => {
    if (osId) {
      fetch(`${API_URL}/os/${osId}/evidencias`)
        .then(res => res.json())
        .then(setEvidencias);
    }
  }, [osId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('arquivo', file);
    await fetch(`${API_URL}/os/${osId}/evidencias`, {
      method: 'POST',
      body: formData,
    });
    // Atualiza lista
    const lista = await fetch(`${API_URL}/os/${osId}/evidencias`).then(r => r.json());
    setEvidencias(lista);
    setUploading(false);
    fileInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/os/evidencias/${id}`, { method: 'DELETE' });
    setEvidencias(evidencias.filter(ev => ev.id !== id));
  };

  return (
    <div className="mt-4">
      <label className="block font-semibold mb-2">Evidências (pdf, imagens ou vídeos):</label>
      <input
        type="file"
        accept="image/*,video/*,application/pdf"
        ref={fileInputRef}
        onChange={handleUpload}
        disabled={uploading}
        className="mb-2"
      />
      <div className="flex flex-wrap gap-4 mt-2">
        {evidencias.map(ev => (
          <div key={ev.id} className="border rounded p-2 flex flex-col items-center">
            {ev.tipo === 'imagem' ? (
              <img
                src={`${API_URL}/uploads/${ev.caminho_arquivo}`}
                alt={ev.nome_arquivo}
                className="w-32 h-32 object-cover mb-2 cursor-pointer"
                onClick={() => setImagemExpandida(`${API_URL}/uploads/${ev.caminho_arquivo}`)}
                title="Clique para expandir"
              />
            ) : ev.tipo === 'video' ? (
              <video
                src={`${API_URL}/uploads/${ev.caminho_arquivo}`}
                controls
                className="w-32 h-32 mb-2"
              />
            ) : ev.tipo === 'pdf' || ev.nome_arquivo?.toLowerCase().endsWith('.pdf') ? (
              <a
                href={`${API_URL}/uploads/${ev.caminho_arquivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-blue-600 hover:underline mb-2"
                title="Abrir PDF em nova aba"
              >
                <svg className="w-10 h-10 mb-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.828A2 2 0 0015.414 7L11 2.586A2 2 0 009.586 2H6zm5 1.414L14.586 7H13a2 2 0 01-2-2V3.414z" />
    </svg>
    <span>Abrir PDF</span>
  </a>
            ) : (
              <span>Arquivo</span>
            )}
            <span className="text-xs break-all">
              {ev.nome_arquivo.length > 10
                ? ev.nome_arquivo.slice(0, 10) + '...'
                : ev.nome_arquivo}
            </span>
            <button
              className="mt-1 text-red-600 text-xs underline"
              onClick={() => handleDelete(ev.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* Modal para imagem expandida */}
      {imagemExpandida && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
          onClick={() => setImagemExpandida(null)}
        >
          <img
            src={imagemExpandida}
            alt="Evidência expandida"
            className="max-w-full max-h-[90vh] rounded shadow-lg border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold"
            onClick={() => setImagemExpandida(null)}
            title="Fechar"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}