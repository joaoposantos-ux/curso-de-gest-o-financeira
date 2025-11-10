import React, { useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import NotasAlunoDragDrop from "./NotasAlunoDragDrop";

export default function NotasAlunoToggle() {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-end">
        {aberto && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-4 mr-2 animate-fade-in w-[350px] max-w-[90vw]">
            <NotasAlunoDragDrop />
          </div>
        )}
        <button
          className="bg-blue-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-blue-800 transition focus:outline-none"
          onClick={() => setAberto(a => !a)}
          title={aberto ? "Fechar anotações" : "Abrir anotações"}
        >
          {aberto ? <FaChevronRight size={22} /> : <FaChevronLeft size={22} />}
        </button>
      </div>
    </div>
  );
}
