import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroModulo() {
  const [nome, setNome] = useState('');
  const [modulos, setModulos] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // Proteção: só permite acesso se usuário logado e admin
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.admin !== 1) {
      navigate('/'); // Redireciona para home se não for admin
    }
  }, [navigate]);

  // Carrega módulos já cadastrados
  useEffect(() => {
    fetch('http://localhost:3001/sistema_modulo')
      .then(res => res.json())
      .then(data => setModulos(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    const res = await fetch('http://localhost:3001/sistema_modulo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    });
    if (res.ok) {
      setNome('');
      setMsg('Módulo cadastrado com sucesso!');
      // Atualiza lista
      const lista = await fetch('http://localhost:3001/sistema_modulo').then(r => r.json());
      setModulos(lista);
      setTimeout(() => setMsg(''), 2000);
    } else {
      setMsg('Erro ao cadastrar módulo.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Cadastro de Módulo do Sistema</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do módulo"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
      {msg && <div className="mb-4 text-green-600">{msg}</div>}
      <h3 className="font-semibold mb-2">Módulos cadastrados:</h3>
      <ul className="list-disc pl-5">
        {modulos.map(m => (
          <li key={m.id}>{m.nome}</li>
        ))}
      </ul>
    </div>
  );
}