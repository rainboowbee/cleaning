import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LeadStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Получить все заявки
export async function GET() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(leads);
}

// Обновить статус заявки
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, status, name, phone, comment } = data;
  if (!id) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }
  const updateData: Record<string, unknown> = {};
  if (status && Object.values(LeadStatus).includes(status)) updateData.status = status;
  if (typeof name === "string") updateData.name = name;
  if (typeof phone === "string") updateData.phone = phone;
  if (typeof comment === "string") updateData.comment = comment;
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Нет данных для обновления" }, { status: 400 });
  }
  const lead = await prisma.lead.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(lead);
}

// Удалить заявку
export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
  }
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 