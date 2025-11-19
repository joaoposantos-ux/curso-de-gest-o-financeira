import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import HomeCurso from './components/HomeCurso';
import ModuloCurso from './components/ModuloCurso';
import Login from './components/Login';
import CadastroUsuario from './components/CadastroUsuario';
import AreaAluno from './components/AreaAluno';
import DeclaracaoConclusao from './components/DeclaracaoConclusao';

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [telaCadastro, setTelaCadastro] = useState(false);




  if (!usuario) {
    return telaCadastro
      ? <CadastroUsuario onVoltar={() => setTelaCadastro(false)} />
      : <Login onLogin={user => {
          setUsuario(user);
          localStorage.setItem('usuario', JSON.stringify(user));
        }} onCadastrar={() => setTelaCadastro(true)} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <nav className="flex gap-4 p-4 bg-gradient-to-r from-blue-900 to-cyan-600 shadow-lg rounded-lg items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-20 object-contain mr-3"
            style={{ minWidth: 150 }}
          />
          <Link to="/curso" className="bg-green-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-800 shadow-md">Gestão Financeira</Link>
          <Link to="/aluno" className="bg-blue-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 shadow-md">Área do Aluno</Link>
          <Link to="/declaracao" className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 shadow-md">Declaração de Conclusão</Link>
          <span className="ml-auto flex items-center gap-2 text-gray-200 font-semibold">
            {usuario?.nome}
            <button
              onClick={() => {
                setUsuario(null);
                localStorage.removeItem('usuario');
              }}
              className="ml-4 text-red-500 font-semibold hover:underline"
            >
              Sair
            </button>
          </span>
        </nav>
        <main className="flex-1">
          <Routes>
            <Route path="/curso" element={<HomeCurso />} />
            <Route path="/modulo/:id" element={<ModuloCurso />} />
            <Route path="/aluno" element={<AreaAluno />} />
            <Route path="/declaracao" element={<DeclaracaoConclusao usuario={usuario} />} />
            <Route path="*" element={<HomeCurso />} />
          </Routes>
        </main>
        <footer className="bg-slate-800 text-white text-center py-4 mt-12 border-t border-slate-700">
          <p className="text-sm">© 2025 Curso de Gestão Financeira. Todos os dados são reservados e confidenciais.</p>
          <p className="text-xs text-slate-400 mt-1">Acesso restrito a usuários autorizados.</p>
        </footer>
      </div>
    </Router>
  );
}