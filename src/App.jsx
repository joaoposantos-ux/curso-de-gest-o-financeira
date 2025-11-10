import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import HomeCurso from './components/HomeCurso';
import ModuloCurso from './components/ModuloCurso';
import Login from './components/Login';
import CadastroUsuario from './components/CadastroUsuario';
import AreaAluno from './components/AreaAluno';

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
      <nav className="flex gap-4 p-1 bg-blue-100 mb-2 items-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-14 w-14 object-contain mr-3"
          style={{ minWidth: 100 }}
        />
  <Link to="/curso" className="text-green-700 font-bold hover:underline">Gestão Financeira</Link>
  <Link to="/aluno" className="text-blue-700 font-bold hover:underline">Área do Aluno</Link>
        <span className="ml-auto flex items-center gap-2 text-gray-700 font-semibold">
          {usuario?.nome}
          <button
            onClick={() => {
              setUsuario(null);
              localStorage.removeItem('usuario');
            }}
            className="ml-4 text-red-500 font-semibold"
          >
            Sair
          </button>
        </span>
      </nav>
      <Routes>
        <Route path="/curso" element={<HomeCurso />} />
        <Route path="/modulo/:id" element={<ModuloCurso />} />
        <Route path="/aluno" element={<AreaAluno />} />
        <Route path="*" element={<HomeCurso />} />
      </Routes>
    </Router>
  );
}