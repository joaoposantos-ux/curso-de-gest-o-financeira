import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

export default function FormularioOS({ onAddOs, initialData, modoEdicao }) {
  const [formData, setFormData] = useState(
    initialData || {
      titulo: '',
      descricao: '',
      tipo: 'Correção',
      status: 'Pendente',
      usuario_responsavel_id: '',
      cnpj: '',
      empresa_solicitante: '',
      telefone_solicitante: '',
      solucao_provisoria: '',
    }
  );
  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [funcionalidades, setFuncionalidades] = useState([]);
  const [sistemaModuloId, setSistemaModuloId] = useState('');
  const [telaFuncionalidadeId, setTelaFuncionalidadeId] = useState('');
  const [alertaCliente, setAlertaCliente] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data));

    fetch(`${API_URL}/sistema_modulo`)
      .then((res) => res.json())
      .then((data) => setModulos(data));

    fetch(`${API_URL}/tela_funcionalidade`)
      .then((res) => res.json())
      .then((data) => setFuncionalidades(data));
  }, []);

  // Busca dados do cliente ao sair do campo CNPJ
  const handleCnpjBlur = async (e) => {
    const cnpj = (e.target.value || '').replace(/\D/g, '');
    if (cnpj.length === 14) {
      setLoadingCliente(true);
      try {
        const resp = await fetch(`http://localhost:3001/clientes/cnpj/${cnpj}`);
        if (resp.ok) {
          const data = await resp.json();
          const cliente = Array.isArray(data) ? data[0] : data;
          setFormData((prev) => ({
            ...prev,
            empresa_solicitante: cliente?.RazaoSocial || prev.empresa_solicitante,
            telefone_solicitante: cliente?.Telefone || prev.telefone_solicitante,
          }));

          // Se DtVencimento e Valor existirem, abre modal de alerta
          if (cliente?.DtVencimento && cliente?.Valor) {
            setAlertaCliente(cliente);
          }
        }
      } catch (err) {
        // Trate o erro se quiser
      } finally {
        setLoadingCliente(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataCriacao = modoEdicao ? formData.data_criacao : new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const novaOs = {
      ...formData,
      status: 'Pendente',
      data_criacao: dataCriacao,
      sistema_modulo_id: sistemaModuloId,
      tela_funcionalidade_id: telaFuncionalidadeId,
    };
    onAddOs(novaOs);
    setShowModal(true);
     // Chama a função para atualizar o celular do cliente
  if (formData.cnpj && formData.telefone_solicitante) {
    atualizarCelularCliente(
      formData.cnpj.replace(/\D/g, ''), // Remove máscara do CNPJ
      formData.telefone_solicitante
    );
  }
    if (!modoEdicao) {
      setFormData({
        titulo: '',
        descricao: '',
        tipo: 'Correção',
        status: 'Pendente',
        usuario_responsavel_id: '',
        cnpj: '',
        empresa_solicitante: '',
        telefone_solicitante: '',
        solucao_provisoria: '',
      });
      setSistemaModuloId('');
      setTelaFuncionalidadeId('');
    }
  };
async function atualizarCelularCliente(cnpj, celular) {
  try {
    const resp = await fetch('http://localhost:3001/clientes/AttCelular', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cnpj, celular })
    });
    const data = await resp.json();
    if (data.success) {
      alert('Celular atualizado com sucesso!');
    } else {
      alert('Erro: ' + (data.error || 'Não foi possível atualizar.'));
    }
  } catch (err) {
    alert('Erro ao conectar ao servidor.');
  }
}

// Exemplo de uso:

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {modoEdicao ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">CNPJ</label>
          <InputMask
            mask="99.999.999/9999-99"
            type="text"
            name="cnpj"
            value={formData.cnpj || ''}
            onChange={handleChange}
            onBlur={handleCnpjBlur}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Empresa Solicitante</label>
          <input
            type="text"
            name="empresa_solicitante"
            value={formData.empresa_solicitante || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Telefone do Solicitante</label>
          <InputMask
            mask="(99)99999-9999"
            type="text"
            name="telefone_solicitante"
            value={formData.telefone_solicitante || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
          />
        </div>


        <div>
          <label className="block text-gray-700 font-medium mb-1">Tipo</label>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipo"
                value="Correção"
                checked={formData.tipo === "Correção"}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">Correção</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipo"
                value="Nova Implementação"
                checked={formData.tipo === "Nova Implementação"}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">Nova Implementação</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipo"
                value="Melhoria"
                checked={formData.tipo === "Melhoria"}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">Melhoria</span>
            </label>
          </div>
        </div>

     

        <div>
          <label className="block mb-2 font-medium">Módulo do Sistema</label>
          <select
            value={sistemaModuloId}
            onChange={e => {
              setSistemaModuloId(e.target.value);
              setTelaFuncionalidadeId(''); // Limpa funcionalidade ao trocar módulo
            }}
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
            required
          >
            <option value="">Selecione o módulo</option>
            {modulos.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Funcionalidade</label>
          <select
            value={telaFuncionalidadeId}
            onChange={e => setTelaFuncionalidadeId(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
            required
            disabled={!sistemaModuloId}
          >
            <option value="">Selecione a funcionalidade</option>
            {funcionalidades
              .filter(f => String(f.sistema_modulo_id) === String(sistemaModuloId))
              .map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>



   <div>
          <label className="block text-gray-700 font-medium mb-1">Usuário Responsável</label>
          <select
            name="usuario_responsavel_id"
            value={formData.usuario_responsavel_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
          >
            <option value="">Selecione...</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nome}</option>
            ))}
          </select>
        </div>






        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
        >
          {modoEdicao ? 'Salvar Alterações' : 'Criar OS'}
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs w-full">
            <h2 className="text-lg font-bold mb-4 text-green-700">Cadastro realizado com sucesso!</h2>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setShowModal(false);
                navigate('/');
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {alertaCliente && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs w-full">
            <h2 className="text-lg font-bold mb-4 text-red-700">Atenção cliente inadimplente!</h2>
            <div className="text-left text-sm mb-4">
              <div><b>Razão Social:</b> {alertaCliente.RazaoSocial}</div>
              <div><b>Nome Fantasia:</b> {alertaCliente.NomeFantasia}</div>
              <div><b>Responsável:</b> {alertaCliente.Responsavel}</div>
              <div><b>Cidade:</b> {alertaCliente.Cidade}</div>
              <div className="mt-3 p-2 rounded bg-red-100 flex flex-col items-start">
                <span className="font-bold text-base text-red-700">
                  Data de Vencimento: {new Date(alertaCliente.DtVencimento).toLocaleDateString()}
                </span>
                <span className="font-bold text-lg text-red-800">
                  Valor: R$ {Number(alertaCliente.Valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </span>
              </div>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setAlertaCliente(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {loadingCliente && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-xs w-full flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-blue-700 font-semibold">Buscando dados do cliente...</span>
          </div>
        </div>
      )}
    </div>
  );
}
