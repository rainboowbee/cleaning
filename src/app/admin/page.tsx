import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPanel from "./ui/AdminPanel";

export default async function AdminPage() {
  // Basic Auth через cookie (установим через отдельную страницу входа)
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("admin_auth")?.value === process.env.ADMIN_PASSWORD;
  if (!isAuth) redirect("/admin/login");
  return <AdminPanel />;
} 