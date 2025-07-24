"use client";
import { useEffect, useState } from "react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

type FurnitureItem = { name: string; count: number };
type Lead = {
  id: number;
  name: string;
  phone: string;
  contactType: "PHONE" | "WHATSAPP" | "TELEGRAM";
  status: "PENDING" | "PROCESSED";
  createdAt: string;
  serviceType?: string;
  area?: number;
  rooms?: number;
  hasPets?: boolean;
  trashRemoval?: boolean;
  comment?: string;
  furniture?: FurnitureItem[];
};

export default function AdminPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", comment: "" });
  const [editLoading, setEditLoading] = useState(false);

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

  // Метрики
  const totalLeads = leads.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const leadsToday = leads.filter(lead => new Date(lead.createdAt) >= today).length;
  const processedLeads = leads.filter(lead => lead.status === "PROCESSED").length;
  const pendingLeads = leads.filter(lead => lead.status === "PENDING").length;

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

  // Удаление заявки
  async function deleteLead(id: number) {
    if (!confirm("Удалить заявку?")) return;
    const res = await fetch(`/api/admin/leads?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchLeads();
    }
  }

  // Открыть модалку редактирования
  function openEditModal(lead: Lead) {
    setEditLead(lead);
    setEditForm({
      name: lead.name,
      phone: lead.phone,
      comment: lead.comment || ""
    });
  }

  // Закрыть модалку
  function closeEditModal() {
    setEditLead(null);
  }

  // Обработчик изменения полей
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Пока без PATCH-запроса
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditLoading(true);
    if (!editLead) return;
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editLead.id,
        name: editForm.name,
        phone: editForm.phone,
        comment: editForm.comment
      })
    });
    setEditLoading(false);
    if (res.ok) {
      fetchLeads();
      closeEditModal();
    }
  }

  // Конфиг колонок для разных услуг
  const serviceColumns: { [key: string]: { key: string; label: string; render?: (lead: Lead) => string }[] } = {
    "Клининг": [
      { key: "area", label: "Площадь" },
      { key: "rooms", label: "Комнат" },
      { key: "hasPets", label: "Животные", render: (l: Lead) => l.hasPets === true ? "Да" : l.hasPets === false ? "Нет" : "-" },
      { key: "trashRemoval", label: "Вывоз мусора", render: (l: Lead) => l.trashRemoval === true ? "Да" : l.trashRemoval === false ? "Нет" : "-" },
      { key: "comment", label: "Комментарий" },
    ],
    "Химчистка мебели": [
      { key: "furniture", label: "Мебель", render: (l: Lead) => {
        if (Array.isArray(l.furniture) && l.furniture.length > 0) {
          let result = '';
          for (const item of l.furniture) {
            result += `${item.name} ${item.count} шт, `;
          }
          return result.slice(0, -2); // убираем последнюю запятую
        }
        return '-';
      } },
      { key: "comment", label: "Комментарий" },
    ],
    "Покос травы": [
      { key: "area", label: "Площадь (сотки)" },
      { key: "trashRemoval", label: "Вывоз мусора", render: (l: Lead) => l.trashRemoval === true ? "Да" : l.trashRemoval === false ? "Нет" : "-" },
      { key: "comment", label: "Комментарий" },
    ],
    "Дезинсекция": [
      { key: "rooms", label: "Комнат" },
      { key: "comment", label: "Комментарий" },
    ],
    "Акарицидная обработка": [
      { key: "area", label: "Площадь (сотки)" },
      { key: "comment", label: "Комментарий" },
    ],
    "Дезинфекция": [
      { key: "comment", label: "Комментарий" },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Заявки на уборку</h1>
      {/* Метрики */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="bg-blue-50 rounded-xl px-6 py-4 shadow text-blue-800 min-w-[180px]">
          <div className="text-lg font-semibold">Всего заявок</div>
          <div className="text-2xl font-bold">{totalLeads}</div>
        </div>
        <div className="bg-green-50 rounded-xl px-6 py-4 shadow text-green-800 min-w-[180px]">
          <div className="text-lg font-semibold">Новых сегодня</div>
          <div className="text-2xl font-bold">{leadsToday}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl px-6 py-4 shadow text-yellow-800 min-w-[180px]">
          <div className="text-lg font-semibold">В ожидании</div>
          <div className="text-2xl font-bold">{pendingLeads}</div>
        </div>
        <div className="bg-gray-50 rounded-xl px-6 py-4 shadow text-gray-800 min-w-[180px]">
          <div className="text-lg font-semibold">Обработано</div>
          <div className="text-2xl font-bold">{processedLeads}</div>
        </div>
      </div>
      {loading ? (
        <div>Загрузка заявок...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : leads.length === 0 ? (
        <div>Заявок нет</div>
      ) : (
        <React.Fragment>
          {Object.keys(serviceColumns).map(service => {
            const filtered = leads.filter(l => l.serviceType === service);
            if (filtered.length === 0) return null;
            const columns = serviceColumns[service];
            return (
              <div key={service} className="mb-12">
                <h2 className="text-xl font-bold mb-2 text-blue-700">{service}</h2>
                <div className="overflow-x-auto rounded-2xl shadow-lg border border-blue-100 bg-white">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead className="sticky top-0 z-10 bg-blue-50">
                      <tr>
                        <th className="p-3 border-b font-bold text-blue-800">ID</th>
                        <th className="p-3 border-b font-bold text-blue-800">Имя</th>
                        <th className="p-3 border-b font-bold text-blue-800">Телефон</th>
                        <th className="p-3 border-b font-bold text-blue-800">Связь</th>
                        {columns.map(col => (
                          <th key={col.key} className="p-3 border-b font-bold text-blue-800">{col.label}</th>
                        ))}
                        <th className="p-3 border-b font-bold text-blue-800">Статус</th>
                        <th className="p-3 border-b font-bold text-blue-800">Дата</th>
                        <th className="p-3 border-b font-bold text-blue-800">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {filtered.map((lead, idx) => (
                          <motion.tr
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={`text-center transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
                          >
                            <td className="border-b p-2 font-mono text-xs text-gray-500">{lead.id}</td>
                            <td className="border-b p-2 font-semibold text-blue-900">{lead.name}</td>
                            <td className="border-b p-2">{lead.phone}</td>
                            <td className="border-b p-2">
                              <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                                {lead.contactType}
                              </span>
                            </td>
                            {columns.map(col => (
                              <td key={col.key} className="border-b p-2 max-w-[160px] truncate" title={col.render ? col.render(lead) : (lead[col.key as keyof Lead]?.toString() || "-")}>
                                {col.render ? col.render(lead) : (lead[col.key as keyof Lead]?.toString() ?? "-")}
                              </td>
                            ))}
                            <td className="border-b p-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${lead.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                {lead.status === "PENDING" ? "В ожидании" : "Обработано"}
                              </span>
                            </td>
                            <td className="border-b p-2 whitespace-nowrap text-xs text-gray-500">{new Date(lead.createdAt).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}</td>
                            <td className="border-b p-2 flex flex-col gap-2 items-center min-w-[120px]">
                              {lead.status === "PENDING" ? (
                                <button
                                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
                                  onClick={() => changeStatus(lead.id, "PROCESSED")}
                                >
                                  Отметить как обработано
                                </button>
                              ) : (
                                <button
                                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 w-full"
                                  onClick={() => changeStatus(lead.id, "PENDING")}
                                >
                                  Вернуть в ожидание
                                </button>
                              )}
                              <button
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
                                onClick={() => openEditModal(lead)}
                              >
                                Редактировать
                              </button>
                              <button
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-full"
                                onClick={() => deleteLead(lead.id)}
                              >
                                Удалить
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      )}
      {/* Модальное окно редактирования */}
      {editLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative flex flex-col gap-4"
          >
            <button type="button" className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-blue-600" onClick={closeEditModal}>&times;</button>
            <h2 className="text-xl font-bold mb-2 text-blue-700">Редактировать заявку #{editLead.id}</h2>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-blue-900">Имя</span>
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-blue-900">Телефон</span>
              <input
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-blue-900">Комментарий</span>
              <textarea
                name="comment"
                value={editForm.comment}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 min-h-[60px]"
              />
            </label>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold disabled:opacity-50"
                disabled={editLoading}
              >
                {editLoading ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 font-semibold"
                onClick={closeEditModal}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 