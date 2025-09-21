"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getDados");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Erro ao chamar webhook:", err);
      }
    };

    fetchData();
  }, []);

  // Métricas simples
  const totalNavios = data.length;
  const criticos = data.filter(
    (n) =>
      n.praticagem?.status === "pendente" ||
      n.praticagem?.status === "cancelada" ||
      n.praticagem?.motivoIntercorrencia
  ).length;

  const etaAlterados = 0; // mock — você pode calcular comparando ETA inicial x atualizado
  const tempoMedioSolicAut = "N/A";
  const tempoMedioManobra = "N/A";

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard Unificado</h1>

      {/* Cards de métricas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-2xl font-bold">{etaAlterados}%</p>
          <p className="text-gray-600 text-sm">ETA alterados nas últimas 24h</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-2xl font-bold">{tempoMedioSolicAut}</p>
          <p className="text-gray-600 text-sm">
            Tempo médio entre solicitação e autorização
          </p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-2xl font-bold">{tempoMedioManobra}</p>
          <p className="text-gray-600 text-sm">Tempo médio de manobra</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center col-span-3">
          <p className="text-2xl font-bold">{criticos}</p>
          <p className="text-gray-600 text-sm">Eventos críticos ativos</p>
        </div>
      </div>

      {/* Tabela resumida com eventos */}
      <div className="bg-white shadow rounded p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Eventos Críticos</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Navio</th>
              <th className="p-2">ETA (Agência)</th>
              <th className="p-2">Autorização (AP)</th>
              <th className="p-2">Status Praticagem</th>
              <th className="p-2">Eventos Críticos</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter(
                (n) =>
                  n.praticagem?.status === "pendente" ||
                  n.praticagem?.status === "cancelada" ||
                  n.praticagem?.motivoIntercorrencia
              )
              .map((navio, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 font-medium">{navio.identificadorNavio}</td>
                  <td className="p-2">{navio.agenciaMaritima?.dataEnvioInformacoes ?? "—"}</td>
                  <td className="p-2">
                    {navio.autoridadePortuaria?.statusAutorizacao ?? "—"}
                  </td>
                  <td className="p-2">
                    {navio.praticagem?.status ?? "—"}
                  </td>
                  <td className="p-2 text-red-600">
                    {navio.praticagem?.motivoIntercorrencia ??
                      navio.autoridadePortuaria?.motivoIntercorrencia ??
                      "—"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Linha do tempo */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Linha do Tempo</h2>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-gray-800 rounded-full mb-2"></div>
            <p className="text-xs">Solicitação de Acesso</p>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-gray-800 rounded-full mb-2"></div>
            <p className="text-xs">Autorização de Acesso</p>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-gray-800 rounded-full mb-2"></div>
            <p className="text-xs">Manobra de Entrada</p>
          </div>
        </div>
      </div>
    </main>
  );
}
