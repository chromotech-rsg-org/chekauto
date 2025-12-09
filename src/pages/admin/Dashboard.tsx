import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PermissionGuard } from "@/components/admin/PermissionGuard";
import { DollarSign, FileText, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSolicitacoes: 0,
    clientesAtivos: 0,
    produtos: 0,
    receita: 0,
  });
  const [chartData, setChartData] = useState({
    solicitacoesPorMes: [],
    solicitacoesPorStatus: [],
    pagamentosPorStatus: [],
  });
  const [recentSolicitacoes, setRecentSolicitacoes] = useState<any[]>([]);
  const [recentClientes, setRecentClientes] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar estatísticas
      const [solicitacoesRes, clientesRes, produtosRes, pagamentosRes] = await Promise.all([
        supabase.from("solicitacoes").select("*", { count: "exact" }),
        supabase.from("clientes").select("*", { count: "exact" }),
        supabase.from("produtos").select("*", { count: "exact" }),
        supabase.from("pagamentos").select("valor, status"),
      ]);

      // Calcular receita total de pagamentos confirmados/recebidos
      const receita = pagamentosRes.data?.reduce((acc, p) => {
        if (p.status === "CONFIRMED" || p.status === "RECEIVED") {
          return acc + Number(p.valor);
        }
        return acc;
      }, 0) || 0;

      setStats({
        totalSolicitacoes: solicitacoesRes.count || 0,
        clientesAtivos: clientesRes.count || 0,
        produtos: produtosRes.count || 0,
        receita,
      });

      // Buscar solicitações recentes com relacionamentos
      const { data: solicitacoes } = await supabase
        .from("solicitacoes")
        .select(`
          *,
          cliente:clientes(nome, cpf_cnpj),
          produto:produtos(nome),
          pagamento:pagamentos(status, valor)
        `)
        .order("criado_em", { ascending: false })
        .limit(5);

      setRecentSolicitacoes(solicitacoes || []);

      // Buscar clientes recentes
      const { data: clientes } = await supabase
        .from("clientes")
        .select("*")
        .order("criado_em", { ascending: false })
        .limit(5);

      setRecentClientes(clientes || []);

      // Preparar dados para gráficos
      // Solicitações por status
      const statusCount: Record<string, number> = {};
      solicitacoesRes.data?.forEach((s: any) => {
        statusCount[s.status || "pendente"] = (statusCount[s.status || "pendente"] || 0) + 1;
      });

      const solicitacoesPorStatus = Object.entries(statusCount).map(([status, total]) => ({
        status,
        total,
      }));

      // Pagamentos por status
      const pagamentosStatusCount: Record<string, number> = {};
      pagamentosRes.data?.forEach((p: any) => {
        pagamentosStatusCount[p.status] = (pagamentosStatusCount[p.status] || 0) + 1;
      });

      const pagamentosPorStatus = Object.entries(pagamentosStatusCount).map(([status, total]) => ({
        status,
        total,
      }));

      // Solicitações por mês (últimos 6 meses)
      const solicitacoesPorMes = await calculateSolicitacoesPorMes(solicitacoesRes.data || []);

      setChartData({
        solicitacoesPorMes,
        solicitacoesPorStatus,
        pagamentosPorStatus,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSolicitacoesPorMes = (solicitacoes: any[]) => {
    const monthsCount: Record<string, number> = {};
    const now = new Date();
    
    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      monthsCount[monthKey] = 0;
    }

    // Contar solicitações por mês
    solicitacoes.forEach((s) => {
      const date = new Date(s.criado_em);
      const monthKey = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      if (monthsCount.hasOwnProperty(monthKey)) {
        monthsCount[monthKey]++;
      }
    });

    return Object.entries(monthsCount).map(([mes, total]) => ({ mes, total }));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema ChekAuto</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PermissionGuard module="dashboard" action="viewStatsCard_solicitacoes">
            {loading ? (
              <Skeleton className="h-[120px]" />
            ) : (
              <StatsCard
                title="Total de Solicitações"
                value={stats.totalSolicitacoes}
                icon={FileText}
                iconColor="text-blue-600"
              />
            )}
          </PermissionGuard>
          
          <PermissionGuard module="dashboard" action="viewStatsCard_clientes">
            {loading ? (
              <Skeleton className="h-[120px]" />
            ) : (
              <StatsCard
                title="Clientes Ativos"
                value={stats.clientesAtivos}
                icon={Users}
                iconColor="text-green-600"
              />
            )}
          </PermissionGuard>
          
          <PermissionGuard module="dashboard" action="viewStatsCard_produtos">
            {loading ? (
              <Skeleton className="h-[120px]" />
            ) : (
              <StatsCard
                title="Produtos Cadastrados"
                value={stats.produtos}
                icon={Package}
                iconColor="text-purple-600"
              />
            )}
          </PermissionGuard>
          
          <PermissionGuard module="dashboard" action="viewStatsCard_receita">
            {loading ? (
              <Skeleton className="h-[120px]" />
            ) : (
              <StatsCard
                title="Receita Total"
                value={`R$ ${stats.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={DollarSign}
                iconColor="text-brand-yellow"
              />
            )}
          </PermissionGuard>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PermissionGuard module="dashboard" action="viewChart_solicitacoesMes">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.solicitacoesPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#F0BA1D" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </PermissionGuard>

          <PermissionGuard module="dashboard" action="viewChart_solicitacoesStatus">
            <Card>
              <CardHeader>
                <CardTitle>Status das Solicitações</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.solicitacoesPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, total }) => `${status}: ${total}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {chartData.solicitacoesPorStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={["#F0BA1D", "#3B82F6", "#10B981", "#EF4444"][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </PermissionGuard>

          <PermissionGuard module="dashboard" action="viewChart_pagamentoStatus">
            <Card>
              <CardHeader>
                <CardTitle>Status de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.pagamentosPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, total }) => `${status}: ${total}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {chartData.pagamentosPorStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={["#10B981", "#F0BA1D", "#EF4444", "#6B7280"][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </PermissionGuard>
        </div>

        {/* Tables */}
        <div className="grid gap-4 md:grid-cols-2">
          <PermissionGuard module="dashboard" action="viewTable_ultimasSolicitacoes">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Solicitações</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSolicitacoes.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell className="font-medium">#{solicitacao.id.substring(0, 8)}</TableCell>
                        <TableCell>{solicitacao.cliente?.nome || 'N/A'}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status || 'pendente'} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </PermissionGuard>

          <PermissionGuard module="dashboard" action="viewTable_clientesRecentes">
            <Card>
              <CardHeader>
                <CardTitle>Clientes Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{cliente.email}</TableCell>
                        <TableCell>
                          <StatusBadge status={cliente.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </PermissionGuard>
        </div>
      </div>
    </AdminLayout>
  );
}
