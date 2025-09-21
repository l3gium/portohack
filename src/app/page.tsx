"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getDados");
        const json = await res.json();
        setData(json.data); // pega o array "data" do JSON
      } catch (err) {
        console.error("Erro ao chamar webhook:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        📊 <span className="ml-2">Dashboard Unificado</span>
      </h1>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl shadow-md bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">Navio</th>
              <th className="px-4 py-3">ETA (Agência)</th>
              <th className="px-4 py-3">Autorização (AP)</th>
              <th className="px-4 py-3">Status Praticagem</th>
              <th className="px-4 py-3">Eventos Críticos</th>
            </tr>
          </thead>
          <tbody>
            {data.map((navio, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-gray-800">
                  {navio.identificadorNavio}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {navio.agenciaMaritima?.dataEnvioInformacoes
                    ? new Date(
                        navio.agenciaMaritima.dataEnvioInformacoes
                      ).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      navio.autoridadePortuaria?.statusAutorizacao ===
                      "autorizado"
                        ? "bg-green-100 text-green-700"
                        : navio.autoridadePortuaria?.statusAutorizacao ===
                          "pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {navio.autoridadePortuaria?.statusAutorizacao || "-"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      navio.praticagem?.status === "realizada"
                        ? "bg-green-100 text-green-700"
                        : navio.praticagem?.status === "pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {navio.praticagem?.status || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {[
                    navio.agenciaMaritima?.statusDocumentacao,
                    navio.autoridadePortuaria?.observacoes,
                    navio.praticagem?.observacoes,
                  ]
                    .filter(Boolean)
                    .join(" | ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Métricas resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {[
          { valor: "34%", desc: "ETA alterados nas últimas 24h" },
          { valor: "30min", desc: "Tempo médio solicitação → autorização" },
          { valor: "1h15min", desc: "Tempo médio de manobra" },
          { valor: "2", desc: "Eventos críticos ativos" },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl shadow-md text-center hover:shadow-lg transition"
          >
            <p className="text-3xl font-extrabold text-indigo-600">
              {item.valor}
            </p>
            <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Linha do tempo */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Linha do Tempo</h2>
        <div className="flex items-center space-x-6">
          {["ETA", "Autorização", "Praticagem", "Rebocadores"].map((etapa, i) => (
            <div key={i} className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-indigo-500 shadow-md"></div>
              <span className="ml-2 text-sm text-gray-700">{etapa}</span>
              {i < 3 && (
                <div className="w-16 h-[2px] bg-gray-300 mx-2 rounded"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
