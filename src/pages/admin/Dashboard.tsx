import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PermissionGuard } from "@/components/admin/PermissionGuard";
import { mockStats, mockSolicitacoes, mockClientes, mockChartData } from "@/lib/mockData";
import { DollarSign, FileText, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function Dashboard() {
  const recentSolicitacoes = mockSolicitacoes.slice(0, 5);
  const recentClientes = mockClientes.slice(0, 5);

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
            <StatsCard
              title="Total de Solicitações"
              value={mockStats.totalSolicitacoes}
              icon={FileText}
              iconColor="text-blue-600"
            />
          </PermissionGuard>
          
          <PermissionGuard module="dashboard" action="viewStatsCard_clientes">
            <StatsCard
              title="Clientes Ativos"
              value={mockStats.clientesAtivos}
              icon={Users}
              iconColor="text-green-600"
            />
          </PermissionGuard>
          
          <PermissionGuard module="dashboard" action="viewStatsCard_produtos">
            <StatsCard
              title="Produtos Cadastrados"
              value={mockStats.produtos}
              icon={Package}
              iconColor="text-purple-600"
            />
          </PermissionGuard>
          
          <PermissionGuard module="dashboard" action="viewStatsCard_receita">
            <StatsCard
              title="Receita Total"
              value={`R$ ${mockStats.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              iconColor="text-brand-yellow"
            />
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
                  <BarChart data={mockChartData.solicitacoesPorMes}>
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
                      data={mockChartData.solicitacoesPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, total }) => `${status}: ${total}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {mockChartData.solicitacoesPorStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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
                      data={mockChartData.pagamentosPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, total }) => `${status}: ${total}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {mockChartData.pagamentosPorStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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
                        <TableCell className="font-medium">#{solicitacao.id}</TableCell>
                        <TableCell>{solicitacao.cliente}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
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
