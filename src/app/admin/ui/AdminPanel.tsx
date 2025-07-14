"use client";
import { useEffect, useState } from "react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  contactType: "PHONE" | "WHATSAPP" | "TELEGRAM";
  status: "PENDING" | "PROCESSED";
  createdAt: string;
};

export default function AdminPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch("/api/admin/leads");
    if (res.ok) {
      setLeads(await res.json());
      setError("");
    } else {
      setError("Ошибка загрузки заявок");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function changeStatus(id: number, status: "PENDING" | "PROCESSED") {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      fetchLeads();
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Заявки на уборку</h1>
      {loading ? (
        <div>Загрузка заявок...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : leads.length === 0 ? (
        <div>Заявок нет</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Имя</th>
              <th className="p-2 border">Телефон</th>
              <th className="p-2 border">Связь</th>
              <th className="p-2 border">Статус</th>
              <th className="p-2 border">Дата</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="text-center">
                <td className="border p-2">{lead.id}</td>
                <td className="border p-2">{lead.name}</td>
                <td className="border p-2">{lead.phone}</td>
                <td className="border p-2">{lead.contactType}</td>
                <td className="border p-2">
                  {lead.status === "PENDING" ? "В ожидании" : "Обработано"}
                </td>
                <td className="border p-2">{new Date(lead.createdAt).toLocaleString()}</td>
                <td className="border p-2">
                  {lead.status === "PENDING" ? (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => changeStatus(lead.id, "PROCESSED")}
                    >
                      Отметить как обработано
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => changeStatus(lead.id, "PENDING")}
                    >
                      Вернуть в ожидание
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 