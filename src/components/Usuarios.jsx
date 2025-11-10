import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    // Proteção: só permite acesso se usuário logado e admin
    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || usuario.admin !== 1) {
            navigate('/'); // Redireciona para home se não for admin
        }
    }, [navigate]);

    useEffect(() => {
        fetch(`${API_URL}/usuarios`)
            .then(res => res.json())
            .then(data => setUsuarios(data));
    }, []);

    const handleEditClick = (usuario) => {
        setUsuarioEditando(usuario.id);
        setForm({
            nome: usuario.nome || '',
            email: usuario.email || '',
            telefone: usuario.telefone || '',
        });
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (id) => {
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        // Atualiza a lista após salvar
        fetch(`${API_URL}/usuarios`)
            .then(res => res.json())
            .then(data => setUsuarios(data));
        setUsuarioEditando(null);
    };

    const handleCancel = () => {
        setUsuarioEditando(null);
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow p-6">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Usuários Cadastrados</h1>
            <table className="w-full border">
                <thead>
                    <tr className="bg-blue-50">
                        <th className="p-2 border">Foto</th>
                        <th className="p-2 border">Nome</th>
                        <th className="p-2 border">E-mail</th>
                        <th className="p-2 border">Telefone</th>
                        <th className="p-2 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.id} className="hover:bg-blue-50">
                            <td className="p-2 border text-center">
                                {u.foto ? (
                                    <img
                                        src={`data:image/jpeg;base64,${u.foto}`}
                                        alt={u.nome}
                                        className="w-10 h-10 rounded-full object-cover mx-auto"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-400 mx-auto">
                                        👤
                                    </div>
                                )}
                            </td>
                            <td className="p-2 border">
                                {usuarioEditando === u.id ? (
                                    <input
                                        type="text"
                                        name="nome"
                                        value={form.nome}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    u.nome
                                )}
                            </td>
                            <td className="p-2 border">
                                {usuarioEditando === u.id ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    u.email || '-'
                                )}
                            </td>
                            <td className="p-2 border">
                                {usuarioEditando === u.id ? (
                                    <input
                                        type="text"
                                        name="telefone"
                                        value={form.telefone}
                                        onChange={handleFormChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    u.telefone || '-'
                                )}
                            </td>
                            <td className="p-2 border text-center">
                                {usuarioEditando === u.id ? (
                                    <>
                                        <button
                                            className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                                            onClick={() => handleSave(u.id)}
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                                            onClick={handleCancel}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        onClick={() => handleEditClick(u)}
                                    >
                                        Editar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {usuarios.length === 0 && (
                <div className="text-center text-gray-400 mt-6">Nenhum usuário cadastrado.</div>
            )}
        </div>
    );
}