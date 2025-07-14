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
  const { id, status } = await req.json();
  if (!id || !Object.values(LeadStatus).includes(status)) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }
  const lead = await prisma.lead.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(lead);
} 