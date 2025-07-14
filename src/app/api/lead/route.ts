import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ContactType } from "@prisma/client";
import nodemailer from "nodemailer";
import axios from "axios";

const prisma = new PrismaClient();

function isValidPhone(phone: string) {
  return /^\+?\d{10,15}$/.test(phone);
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, contactType } = await req.json();
    if (!name || !phone || !contactType) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Некорректный номер телефона" }, { status: 400 });
    }
    if (!Object.values(ContactType).includes(contactType)) {
      return NextResponse.json({ error: "Некорректный способ связи" }, { status: 400 });
    }

    // Сохраняем заявку в БД
    await prisma.lead.create({
      data: { name, phone, contactType },
    });

    // Email уведомление
    const {
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_TO,
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID,
    } = process.env;

    if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS && EMAIL_TO) {
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT) || 465,
        secure: true,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: `Клининговая компания <${EMAIL_USER}>`,
        to: EMAIL_TO,
        subject: "Новая заявка на уборку",
        text: `Имя: ${name}\nТелефон: ${phone}\nСвязь: ${contactType}`,
      });
    }

    // Telegram уведомление
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = `Новая заявка на уборку!\nИмя: ${name}\nТелефон: ${phone}\nСвязь: ${contactType}`;
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
} 