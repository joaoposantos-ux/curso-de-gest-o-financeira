import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaChartLine, FaClock } from 'react-icons/fa';
import NotasAlunoToggle from './NotasAlunoToggle';

const modulos = [
	{
		id: 1,
		titulo: 'Fundamentos da Administração Financeira',
		descricao: 'Conceitos, evolução e papel do gestor financeiro.',
		icon: FaBook,
		duracao: '2-3 horas'
	},
	{
		id: 2,
		titulo: 'Análise e Planejamento Financeiro',
		descricao: 'Demonstrações contábeis e índices financeiros.',
		icon: FaChartLine,
		duracao: '3-4 horas'
	},
	{
		id: 3,
		titulo: 'Gestão do Capital de Giro',
		descricao: 'Administração de caixa, contas a receber e estoques.',
		icon: FaBook,
		duracao: '2-3 horas'
	},
	{
		id: 4,
		titulo: 'Matemática Financeira Aplicada',
		descricao: 'Juros, valor do dinheiro no tempo e ferramentas.',
		icon: FaBook,
		duracao: '2-3 horas'
	},
	{
		id: 5,
		titulo: 'Avaliação de Investimentos',
		descricao: 'VPL, TIR, Payback e análise de risco.',
		icon: FaChartLine,
		duracao: '3-4 horas'
	},
	{
		id: 6,
		titulo: 'Custo e Estrutura de Capital',
		descricao: 'WACC, alavancagem e estrutura de capital.',
		icon: FaChartLine,
		duracao: '3-4 horas'
	}
];

export default function HomeCurso() {
	const [progresso, setProgresso] = useState({});
	const [atualizar, setAtualizar] = useState(0);
	const usuario = JSON.parse(localStorage.getItem('usuario'));
	const API_URL = import.meta.env.VITE_API_URL;

	useEffect(() => {
		async function fetchProgresso() {
			if (!usuario) {
				console.error('Usuário não encontrado');
				return;
			}
			
			const urlApi = `${API_URL}/quiz/progresso?usuario_id=${usuario.id}`;
			console.log('Buscando progresso em:', urlApi);
			
			try {
				const res = await fetch(urlApi, {
					headers: { 
						'Bypass-Tunnel-Reminder': 'true'
					}
				});
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				
				const data = await res.json();
				console.log('Dados de progresso recebidos:', data);
				
				const prog = {};
				data.forEach(p => {
					prog[p.modulo_id] = { acertos: p.acertos, total: p.total };
				});
				setProgresso(prog);
				console.log('Progresso atualizado:', prog);
			} catch (error) {
				console.error('Erro ao buscar progresso:', error);
			}
		}
		fetchProgresso();
	}, [usuario, API_URL, atualizar]);

	// Cálculo do progresso geral do aluno (Baseado em 6 módulos)
	const totalModulos = 6;
	const modulosConcluidos = Object.keys(progresso).length;
	const percent = Math.round((modulosConcluidos / totalModulos) * 100);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex flex-col items-center py-12 px-4">
			{/* Header Principal */}
			<div className="w-full max-w-6xl mb-12">
				<div className="bg-gradient-to-r from-gray-800 to-slate-800 rounded-2xl shadow-2xl p-10 text-white border border-gray-700">
					<h1 className="text-5xl font-bold mb-4">Curso de Gestão Financeira</h1>
					<p className="text-gray-300 text-lg">Módulos completos com conteúdo profissional e avaliações práticas</p>
				</div>
			</div>

			{/* Grid de Módulos */}
			<div className="w-full max-w-6xl mb-12">
				<h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
					<FaBook /> Módulos Disponíveis
				</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modulos.map(modulo => {
						const prog = progresso[modulo.id];
						const percentModulo = prog && prog.total > 0 ? Math.round((prog.acertos / prog.total) * 100) : 0;
						const completo = prog && prog.total > 0 && prog.acertos === prog.total;
						const IconComponent = modulo.icon;

						// Força o card do módulo 3 a ser igual aos demais
						return (
							<Link key={modulo.id} to={`/modulo/${modulo.id}`} className="no-underline group">
								<div className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer h-full border border-gray-200`}> {/* Remove destaque especial */}
									{/* Header do Card */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center gap-3">
											<div className="p-3 rounded-lg bg-gray-100">
												<IconComponent className="text-xl text-gray-700" />
											</div>
											<div className="flex-1">
												<h3 className="font-semibold text-gray-800 text-sm leading-tight">{modulo.titulo}</h3>
											</div>
										</div>
									</div>

									{/* Descrição */}
									<p className="text-gray-600 text-sm mb-4">{modulo.descricao}</p>

									{/* Duração */}
									<div className="text-xs text-gray-500 flex items-center gap-2 mb-4">
										<FaClock className="text-xs" />
										{modulo.duracao}
									</div>

									{/* Barra de Progresso */}
									<div>
										<div className="flex justify-between items-center mb-2">
											<span className="text-xs font-semibold text-gray-600">Progresso</span>
											<span className="text-xs font-bold text-gray-700">{percentModulo}%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
											<div 
												className="h-2 rounded-full transition-all duration-300 bg-gray-600"
												style={{ width: `${percentModulo}%` }}
											/>
										</div>
										<div className="text-xs text-gray-500 mt-1 text-right">
											{prog ? `${prog.acertos}/${prog.total} questões` : 'Não iniciado'}
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>

			{/* Info Footer */}
			<div className="w-full max-w-6xl bg-gray-800 rounded-xl p-6 text-center text-gray-300 text-sm border border-gray-700 mb-12">
				💡 <strong>Dica:</strong> Complete todos os módulos para obter a declaração de conclusão do curso. Acesse "Área do Aluno" para acompanhar seu progresso detalhado.
			</div>

			{/* Footer Profissional */}
			<footer className="bg-slate-800 text-white text-center py-4 mt-12 border-t border-slate-700">
				<p className="text-sm">© 2025 Curso de Gestão Financeira. Todos os dados são reservados e confidenciais.</p>
				<p className="text-xs text-slate-400 mt-1">Acesso restrito a usuários autorizados.</p>
				<div className="mt-4">
					<a href="/termos" className="text-blue-400 hover:text-blue-300 text-xs">Termos de Uso</a> |
					<a href="/privacidade" className="text-blue-400 hover:text-blue-300 text-xs">Política de Privacidade</a> |
					<a href="/contato" className="text-blue-400 hover:text-blue-300 text-xs">Contato</a>
				</div>
				<div className="mt-2 text-xs text-slate-400">
					<p>Email: suporte@gestaofinanceira.com</p>
					<p>Telefone: (11) 1234-5678</p>
				</div>
			</footer>

			{/* Notas flutuantes */}
			<NotasAlunoToggle />
		</div>
	);
}
