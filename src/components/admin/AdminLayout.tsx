import { AdminSidebar } from "./AdminSidebar";
import { UserMenu } from "./UserMenu";
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
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex justify-end items-center">
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
