import { AdminSidebar } from "./AdminSidebar";
import { useEffect } from "react";
import { clearNonSupabaseStorage } from "@/lib/localStorage";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  useEffect(() => {
    // Limpa qualquer cache local da aplicação (preserva sessão do Supabase)
    clearNonSupabaseStorage();
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
