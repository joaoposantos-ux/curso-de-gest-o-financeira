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
      try {
        const resp = await fetch(`http://servico.firstsolucoes.com.br/apicommerce/Getcliente/${cnpj}`);
        if (resp.ok) {
          const data = await resp.json();
          setFormData((prev) => ({
            ...prev,
            empresa_solicitante: data.RazapSocial || prev.empresa_solicitante,
            telefone_solicitante: data.Telefone || prev.telefone_solicitante,
          }));
        }
      } catch (err) {
        // Silencie erro ou mostre alerta se quiser
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
          <label className="block text-gray-700 font-medium mb-1">Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Correção</option>
            <option>Nova Implementação</option>
            <option>Melhoria</option>
          </select>
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
          <label className="block text-gray-700 font-medium mb-1">Possui solução alternativa provisória, se sim qual?</label>
          <input
            type="text"
            name="solucao_provisoria"
            value={formData.solucao_provisoria}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
          />
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
    </div>
  );
}
