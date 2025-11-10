import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import OSEvidencias from './OSEvidencias'; // Importe o componente OSEvidencias
import { useParams } from 'react-router-dom';

const columnStyles = {
  'Pendente': 'bg-yellow-50 border-yellow-200',
  'Em Andamento': 'bg-blue-50 border-blue-200',
  'Testes': 'bg-purple-50 border-purple-200',
  'Concluído': 'bg-green-50 border-green-200',
};

function TipoIcone({ tipo }) {
  if (tipo === 'Correção') {
    // Ícone de ferramenta (ex: chave inglesa)
    return (
      <svg className="w-5 h-5 text-red-500 inline-block mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 11-5.656-5.656l2.828-2.828" />
      </svg>
    );
  }
  if (tipo === 'Nova Implementação') {
    // Ícone de foguete
    return (
      <svg className="w-5 h-5 text-blue-500 inline-block mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7M5 13V7h6" />
      </svg>
    );
  }
  if (tipo === 'Melhoria') {
    // Ícone de estrela
    return (
      <svg className="w-5 h-5 text-yellow-500 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    );
  }
  return null;
}

function Kanban({ osList, onDragEnd, usuario, onUpdateOs, osIdSelecionadaInicial }) {
  const params = useParams();
  const [osSelecionada, setOsSelecionada] = useState(null);
  const [osParaDeletar, setOsParaDeletar] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroResponsavel, setFiltroResponsavel] = useState(''); // NOVO ESTADO
  const [modulos, setModulos] = useState([]);
  const [funcionalidades, setFuncionalidades] = useState([]);
  const columns = ['Pendente', 'Em Andamento', 'Testes', 'Concluído'];
const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/usuarios`)
      .then(res => res.json())
      .then(data => setUsuarios(data));
    // Carregar módulos e funcionalidades para exibir nomes no modal
    fetch(`${API_URL}/sistema_modulo`)
      .then(res => res.json())
      .then(data => setModulos(data));
    fetch(`${API_URL}/tela_funcionalidade`)
      .then(res => res.json())
      .then(data => setFuncionalidades(data));
  }, []);

  useEffect(() => {
    const id = params.id || osIdSelecionadaInicial;
    if (id && osList.length) {
      const os = osList.find(o => o.id.toString() === id.toString());
      if (os) setOsSelecionada(os);
    }
  }, [params.id, osList, osIdSelecionadaInicial]);

  // FILTRO por responsável
  const osFiltradas = filtroResponsavel
    ? osList.filter(os => String(os.usuario_responsavel_id) === filtroResponsavel)
    : osList;

  const grouped = columns.reduce((acc, col) => {
    acc[col] = osFiltradas.filter(os => os.status === col);
    return acc;
  }, {});

  // Função utilitária para formatar data no padrão BR
  function formatarDataBR(dataStr) {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    if (isNaN(data)) return dataStr;
    return data.toLocaleDateString('pt-BR');
  }

  // Função utilitária para calcular dias desde a criação
  function diasDesdeCriacao(dataStr) {
    if (!dataStr) return '';
    const dataCriacao = new Date(dataStr);
    const hoje = new Date();
    const diffMs = hoje - dataCriacao;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDias === 0 ? 'Criado Hoje' : `Criado a ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
  }

  // Atualize o status usando o endpoint PATCH /os/:id/status
  const handleDragEnd = (result) => {
    if (onDragEnd) onDragEnd(result);
  };

  return (
    <>
      {/* Filtro por responsável */}
      <div className="flex justify-end mb-1">
        <label className="mr-2 font-medium text-gray-700">Filtrar por responsável:</label>
        <select
          value={filtroResponsavel}
          onChange={e => setFiltroResponsavel(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-gray-800"
        >
          <option value="">Todos</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </select>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="p-6 min-h-screen bg-gradient-to-br from-white to-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {columns.map((col) => (
              <Droppable droppableId={col} key={col}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl p-4 shadow-md border-t-4 min-h-[200px] ${columnStyles[col] || 'bg-gray-50 border-gray-200'} transition ${snapshot.isDraggingOver ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    <h2 className="text-xl font-bold mb-5 text-center text-gray-600 tracking-wide">{col}</h2>
                    <div className="space-y-5">
                      {grouped[col].map((os, idx) => (
                        <Draggable draggableId={os.id.toString()} index={idx} key={os.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-50 border border-gray-100 rounded-lg p-4 shadow-sm transition-shadow duration-200 cursor-pointer ${snapshot.isDragging ? 'ring-2 ring-blue-300' : ''}`}
                            >
                              <h3 className="font-semibold text-gray-800 flex items-center justify-between">
                                <span className="flex items-center">
                                  <TipoIcone tipo={os.tipo} />
                                  {os.titulo}
                                  <span className="ml-2 text-xs text-gray-500 italic">
                                    {diasDesdeCriacao(os.data_criacao)}
                                  </span>
                                </span>
                                {/* Foto do responsável alinhada à direita */}
                                {os.responsavel_foto ? (
                                  <img
                                    src={`data:image/jpeg;base64,${os.responsavel_foto}`}
                                    alt="Responsável"
                                    className="w-7 h-7 rounded-full object-cover border-2 border-blue-200 ml-2"
                                    title={os.responsavel_nome}
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-400 border-2 border-blue-100 ml-2">
                                    <span role="img" aria-label="Usuário">👤</span>
                                  </div>
                                )}
                              </h3>
                              <div className="flex gap-2 mt-2">
                                <button
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setOsSelecionada(os);
                                  }}
                                >
                                  Visualizar
                                </button>
                                <button
                                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setOsParaDeletar(os);
                                  }}
                                >
                                  Deletar
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {grouped[col].length === 0 && (
                        <div className="text-gray-300 text-center italic">Nenhuma OS</div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* Legenda dos ícones no rodapé */}
      <footer className="w-full mt-8 flex gap-6 items-center justify-center py-4 bg-white border-t">
        <span className="flex items-center gap-1">
          <TipoIcone tipo="Correção" /> <span className="text-gray-700 text-sm">Correção</span>
        </span>
        <span className="flex items-center gap-1">
          <TipoIcone tipo="Nova Implementação" /> <span className="text-gray-700 text-sm">Nova Implementação</span>
        </span>
        <span className="flex items-center gap-1">
          <TipoIcone tipo="Melhoria" /> <span className="text-gray-700 text-sm">Melhoria</span>
        </span>
      </footer>

      {/* Modal de confirmação de deleção */}
      {osParaDeletar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xs w-full text-center border border-red-200">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 mb-2">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-700 mb-2">Confirmar Exclusão</h2>
              <p className="text-gray-700 mb-4">Deseja realmente deletar a OS <span className="font-semibold">{osParaDeletar.titulo}</span>?</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setOsParaDeletar(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  fetch(`${API_URL}/os/${osParaDeletar.id}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(() => {
                      onDragEnd && onDragEnd({ type: 'delete', id: osParaDeletar.id });
                      setOsParaDeletar(null);
                    });
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização/edição */}
      {osSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative border border-blue-100"
            style={{ maxHeight: '90vh', overflowY: 'auto' }} // <-- Adicione esta linha
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setOsSelecionada(null)}
              title="Fechar"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-6">
              {/* Foto do criador */}
              {osSelecionada.usuario_foto ? (
                <img
                  src={`data:${osSelecionada.usuario_foto || 'image/jpeg'};base64,${osSelecionada.usuario_foto}`}
                  alt="Foto do criador"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400 border-2 border-blue-100">
                  <span role="img" aria-label="Usuário">👤</span>
                </div>
              )}
              {/* Foto do responsável */}
              {osSelecionada.responsavel_foto ? (
                <img
                  src={`data:${osSelecionada.responsavel_foto || 'image/jpeg'};base64,${osSelecionada.responsavel_foto}`}
                  alt="Foto do responsável"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400 border-2 border-blue-100">
                  <span role="img" aria-label="Usuário">👤</span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <TipoIcone tipo={osSelecionada.tipo} />
                  <h2 className="text-2xl font-bold text-blue-700">{osSelecionada.titulo}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>
                    Criada em: <span className="font-semibold">{formatarDataBR(osSelecionada.data_criacao)}</span>
                    <> - Por: <span className="font-semibold">
                      {osSelecionada.usuario_nome || <span className="text-red-400">Desconhecido</span>}
                    </span></>
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded text-white text-xs ${osSelecionada.status === 'Concluído' ? 'bg-green-500' : osSelecionada.status === 'Testes' ? 'bg-purple-500' : osSelecionada.status === 'Em Andamento' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                    {osSelecionada.status}
                  </span>
                </div>
              </div>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const novaDescricao = e.target.descricao.value;
                const usuario_responsavel_id = e.target.usuario_responsavel_id
                  ? e.target.usuario_responsavel_id.value
                  : osSelecionada.usuario_responsavel_id;
                const analise_desenvolvimento = e.target.analise_desenvolvimento.value;
                const solucao_proposta = e.target.solucao_proposta.value;

                await fetch(`${API_URL}/os/${osSelecionada.id}/descricao`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    descricao: novaDescricao,
                    usuario_responsavel_id: usuario_responsavel_id || null,
                    analise_desenvolvimento,
                    solucao_proposta,
                  }),
                });

                const usuarioSelecionado = usuarios.find(u => u.id == usuario_responsavel_id);
                const osAtualizada = {
                  ...osSelecionada,
                  descricao: novaDescricao,
                  usuario_responsavel_id,
                  analise_desenvolvimento,
                  solucao_proposta,
                  responsavel_nome: usuarioSelecionado?.nome,
                  responsavel_foto: usuarioSelecionado?.foto,
                };
                setOsSelecionada(osAtualizada);
                if (onUpdateOs) onUpdateOs(osAtualizada);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2500);
              }}
            >
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Responsável:</label>
                  <select
                    name="usuario_responsavel_id"
                    defaultValue={osSelecionada.usuario_responsavel_id || ''}
                    className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-full"
                  >
                    <option value="">Não definido</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Descrição:</label>
                  <textarea
                    name="descricao"
                    defaultValue={osSelecionada.descricao}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Análise do Desenvolvimento:</label>
                  <textarea
                    name="analise_desenvolvimento"
                    defaultValue={osSelecionada.analise_desenvolvimento || ''}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Solução Proposta:</label>
                  <textarea
                    name="solucao_proposta"
                    defaultValue={osSelecionada.solucao_proposta || ''}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-gray-800"
                    rows={2}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700 transition w-full"
                >
                  Salvar
                </button>
              </div>
            </form>

            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Módulo:</span>
                <span className="text-gray-800">
                  {modulos.find(m => m.id === osSelecionada.sistema_modulo_id)?.nome || ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Funcionalidade:</span>
                <span className="text-gray-800">
                  {funcionalidades.find(f => f.id === osSelecionada.tela_funcionalidade_id)?.nome || ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Solução Provisória:</span>
                <span className="text-gray-800">{osSelecionada.solucao_provisoria || ''}</span>
              </div>
            </div>

            {/* Componente de Evidências da OS */}
            <OSEvidencias osId={osSelecionada.id} />
          </div>
        </div>
      )}

      {/* Toast de sucesso */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className="bg-green-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fade-in">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Salvo com sucesso!</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Kanban;