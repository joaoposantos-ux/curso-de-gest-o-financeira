// src/components/CadastroUsuario.jsx
import React, { useState } from 'react';
import InputMask from 'react-input-mask';

export default function CadastroUsuario({ onVoltar }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '' });
  const [foto, setFoto] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFotoChange = e => setFoto(e.target.files[0]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (foto) formData.append('foto', foto);

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data = await res.json();
      setMsg(data.error ? data.error : 'Usuário cadastrado com sucesso!');
      if (!data.error) {
        // Limpar formulário após sucesso
        setForm({ nome: '', email: '', senha: '', telefone: '' });
        setFoto(null);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setMsg('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center"
        style={{ minWidth: 340 }}
        encType="multipart/form-data"
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-30 h-24 object-contain mb-4"
        />
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Cadastro de Usuário</h2>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="mb-3 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <input
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          className="mb-3 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <InputMask
          mask="(99)99999-9999"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className="mb-3 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <input
          name="senha"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="mb-3 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          className="mb-3 w-full"
        />
        <button
          disabled={loading}
          className={`bg-green-600 text-white px-4 py-2 rounded w-full font-semibold shadow hover:bg-green-700 transition mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        {msg && <div className="mb-2 text-center text-green-700">{msg}</div>}
        <button
          type="button"
          onClick={onVoltar}
          className="mt-2 w-full text-blue-600 underline hover:text-blue-800"
        >
          Voltar para Login
        </button>
      </form>
    </div>
  );
}