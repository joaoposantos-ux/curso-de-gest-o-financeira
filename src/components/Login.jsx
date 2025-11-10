// src/components/Login.jsx
import React, { useState } from 'react';

export default function Login({ onLogin, onCadastrar }) {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) setMsg(data.error);
    else {
      setMsg('');
      onLogin(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center"
        style={{ minWidth: 340 }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-30 h-24 object-contain mb-4"
        />
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Acesse o Sistema</h2>
        <input
          name="email"
          placeholder="E-mail"
          value={form.email}
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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold shadow hover:bg-blue-700 transition mb-2"
        >
          Entrar
        </button>
        {msg && <div className="mb-2 text-center text-red-500">{msg}</div>}
        <button
          type="button"
          onClick={onCadastrar}
          className="mt-2 w-full text-blue-600 underline hover:text-blue-800"
        >
          Cadastrar novo usuário
        </button>
      </form>
    </div>
  );
}