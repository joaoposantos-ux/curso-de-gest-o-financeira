import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroFuncionalidade() {
  const [nome, setNome] = useState('');
  const [moduloId, setModuloId] = useState('');
  const [modulos, setModulos] = useState([]);
  const [funcionalidades, setFuncionalidades] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_API_URL;
  // Proteção: só permite acesso se usuário logado e admin
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.admin !== 1) {
      navigate('/'); // Redireciona para home se não for admin
    }
  }, [navigate]);

  // Carrega módulos e funcionalidades já cadastradas
  useEffect(() => {
    fetch(`${API_URL}/sistema_modulo`)
      .then(res => res.json())
      .then(data => setModulos(data));
    fetch(`${API_URL}/tela_funcionalidade`)
      .then(res => res.json())
      .then(data => setFuncionalidades(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !moduloId) return;
    const res = await fetch(`${API_URL}/tela_funcionalidade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, sistema_modulo_id: moduloId }),
    });
    if (res.ok) {
      setNome('');
      setModuloId('');
      setMsg('Funcionalidade cadastrada com sucesso!');
      // Atualiza lista
      const lista = await fetch(`${API_URL}/tela_funcionalidade`).then(r => r.json());
      setFuncionalidades(lista);
      setTimeout(() => setMsg(''), 2000);
    } else {
      setMsg('Erro ao cadastrar funcionalidade.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Cadastro de Funcionalidade</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome da funcionalidade"
          className="border border-gray-300 rounded px-3 py-2"
          required
        />
        <select
          value={moduloId}
          onChange={e => setModuloId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="">Selecione o módulo</option>
          {modulos.map(m => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
      {msg && <div className="mb-4 text-green-600">{msg}</div>}
      <h3 className="font-semibold mb-2">Funcionalidades cadastradas:</h3>
      <ul className="list-disc pl-5">
        {funcionalidades.map(f => (
          <li key={f.id}>
            {f.nome} <span className="text-gray-500 text-sm">({modulos.find(m => m.id === f.sistema_modulo_id)?.nome || 'Sem módulo'})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}