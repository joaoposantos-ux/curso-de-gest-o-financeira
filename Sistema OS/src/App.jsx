import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, PlusCircleIcon, ClipboardDocumentListIcon, WrenchScrewdriverIcon, PuzzlePieceIcon, UsersIcon, RectangleGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Kanban from './components/Kanban';
import KanbanDesenv from './components/KanbanDesenv';
import FormularioOS from './components/FormularioOS';
import Login from './components/Login';
import CadastroUsuario from './components/CadastroUsuario';
import CadastroModulo from './components/CadastroModulo';
import CadastroFuncionalidade from './components/CadastroFuncionalidade';
import Usuarios from './components/Usuarios';
import Dashboard from './components/Dashboard';
import ModulosCurso from './components/ModulosCurso';

function AppContent() {
  const [osList, setOsList] = useState([]);
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [telaCadastro, setTelaCadastro] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();

  // Buscar OS ao carregar e ao trocar de rota
  useEffect(() => {
    if (usuario) {
      fetch(`${API_URL}/os`)
        .then(res => res.json())
        .then(data => setOsList(Array.isArray(data) ? data : []));
    }
  }, [API_URL, location.pathname, usuario]);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem('usuario', JSON.stringify(user));
  };

  const fetchOsList = () => {
    fetch(`${API_URL}/os`)
      .then(res => res.json())
      .then(data => setOsList(Array.isArray(data) ? data : []));
  };

  const addOs = (novaOs) => {
    fetch(`${API_URL}/os`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...novaOs, usuario_id: usuario.id }),
    })
      .then(res => res.json())
      .then(() => fetchOsList());
  };

  const onUpdateOs = () => {
    fetchOsList();
  };

  const onDragEnd = (result) => {
    if (result?.type === 'delete' && result.id) {
      setOsList(prev => prev.filter(os => os.id !== result.id));
      return;
    }
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const os = osList.find(os => os.id === Number(draggableId));
    if (!os) return;

    const novoStatus = destination.droppableId;
    const updated = { ...os, status: novoStatus };

    fetch(`${API_URL}/os/${os.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }),
    })
      .then(res => res.json())
      .then(() => {
        setOsList(osList =>
          osList.map(item =>
            item.id === os.id ? updated : item
          )
        );
      });
  };

  // Se não estiver logado, mostra Login ou Cadastro
  if (!usuario) {
    return telaCadastro
      ? <CadastroUsuario onVoltar={() => setTelaCadastro(false)} />
      : <Login onLogin={handleLogin} onCadastrar={() => setTelaCadastro(true)} />;
  }

  // Se estiver logado, mostra o restante da aplicação
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 object-contain max-w-[120px]"
          />
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
         <div className="ml-4 flex items-center gap-2 pt-4">
            {usuario?.foto && (
              <img
                src={`data:${usuario.foto_mime || 'image/jpeg'};base64,${usuario.foto}`}
                alt="Foto do usuário"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
            )}
            <span className="font-semibold text-gray-700">{usuario?.nome}</span>
           
          </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link to="/" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
            <ChartBarIcon className="h-5 w-5" /> Dashboard
          </Link>
          <Link to="/nova-os" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
            <PlusCircleIcon className="h-5 w-5" /> Nova OS
          </Link>
          <Link to="/Kanban" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
            <ClipboardDocumentListIcon className="h-5 w-5" /> OS
          </Link>
          <Link to="/osDesenv/" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
            <WrenchScrewdriverIcon className="h-5 w-5" /> Desenv.
          </Link>
          {usuario?.admin === 1 && (
            <>
              <Link to="/cadastro-modulo" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
                <RectangleGroupIcon className="h-5 w-5" /> Módulo
              </Link>
              <Link to="/cadastro-funcionalidade" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
                <PuzzlePieceIcon className="h-5 w-5" /> Funcionalidade
              </Link>
              <Link to="/usuarios" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
                <UsersIcon className="h-5 w-5" /> Usuários
              </Link>
            </>
          )}
          <Link to="/modulos" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-100 font-medium text-blue-700" onClick={() => setSidebarOpen(false)}>
            <UsersIcon className="h-5 w-5" /> Módulos
          </Link>
          <div className="mt-2 flex gap-2 border-t pt-4">
            <button
              onClick={() => {
                setUsuario(null);
                localStorage.removeItem('usuario');
              }}
              className="text-red-500 font-semibold"
            >
              Sair
            </button>
          </div>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Topbar para mobile */}
        <div className="md:hidden flex items-center bg-white shadow px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-6 w-6 text-blue-700" />
          </button>
          <span className="ml-4 font-bold text-blue-700">Sistema OS</span>
        </div>
        <main className="flex-1 p-1">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded shadow">
                  <h1 className="text-3xl font-bold text-blue-700 mb-6">Curso de Gestão Financeira</h1>
                  <p className="mb-8 text-lg text-gray-700">Bem-vindo ao curso! Escolha um módulo para começar:</p>
                  <ul className="grid gap-4">
                    <li><Link to="/modulos" className="block bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded px-6 py-4">Ver Módulos do Curso</Link></li>
                  </ul>
                </div>
              }
            />
             <Route
              path="/Kanban"
              element={
                <Kanban
                  osList={osList}
                  onDragEnd={onDragEnd}
                  usuario={usuario}
                  onUpdateOs={onUpdateOs}
                />
              }
            />
            <Route path="/nova-os" element={<FormularioOS onAddOs={addOs} />} />
            <Route path="/cadastro-modulo" element={<CadastroModulo />} />
            <Route path="/cadastro-funcionalidade" element={<CadastroFuncionalidade />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route
              path="/os/:id"
              element={
                <Kanban
                  osList={osList}
                  onDragEnd={onDragEnd}
                  usuario={usuario}
                  onUpdateOs={onUpdateOs}
                  osIdSelecionadaInicial
                />
              }
            />
            <Route
              path="/osDesenv"
              element={
                <KanbanDesenv
                  osList={osList}
                  onDragEnd={onDragEnd}
                  usuario={usuario}
                  onUpdateOs={onUpdateOs}
                  osIdSelecionadaInicial
                />
              }
            />
            <Route path="/modulos" element={<ModulosCurso />} />
            {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative border border-blue-100">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowEditModal(false)}
              title="Fechar"
            >
              &times;
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="mb-3">
                {usuario?.foto ? (
                  <img
                    src={`data:${usuario.foto_mime || 'image/jpeg'};base64,${usuario.foto}`}
                    alt="Foto do usuário"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400 border-4 border-blue-100">
                    <span role="img" aria-label="Usuário">👤</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-blue-700 mb-1">Editar Usuário</h2>
              <p className="text-gray-500 text-sm mb-2">Atualize seus dados abaixo</p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                // Envia para o backend
                const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
                  method: 'PUT',
                  body: formData,
                });
                const atualizado = await res.json();
                setUsuario((prev) => ({
                  ...prev,
                  ...atualizado,
                  foto: atualizado.foto || prev.foto,
                }));
                localStorage.setItem('usuario', JSON.stringify({
                  ...usuario,
                  ...atualizado,
                  foto: atualizado.foto || usuario.foto,
                }));
                setShowEditModal(false);
              }}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nome</label>
                <input
                  className="w-full border p-2 rounded"
                  name="nome"
                  defaultValue={usuario.nome}
                  placeholder="Nome"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">E-mail</label>
                <input
                  className="w-full border p-2 rounded"
                  name="email"
                  defaultValue={usuario.email}
                  placeholder="E-mail"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Telefone</label>
                <input
                  className="w-full border p-2 rounded"
                  name="telefone"
                  defaultValue={usuario.telefone}
                  placeholder="Telefone"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Foto</label>
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold shadow hover:bg-blue-700 transition"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}