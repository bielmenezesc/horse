import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  ChartLine,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
import {
  useCustomerStats,
  useDailyInteractions,
  useDailyRevenue,
  useFunnelData,
} from "@/hooks/useCustomerData";

const KPICard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  isLoading = false,
}) => (
  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-white/80">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-white/60" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <div className="text-sm text-white/60">Carregando...</div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-white tracking-tight">
            {value}
          </div>
          <p
            className={`text-xs ${
              trend === "up" ? "text-green-400" : "text-red-400"
            } flex items-center mt-1 font-medium`}
          >
            {trend === "up" ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {change}
          </p>
        </>
      )}
    </CardContent>
  </Card>
);

const Index = () => {
  const { data: customerStats, isLoading: statsLoading } = useCustomerStats();
  const { data: dailyInteractions, isLoading: interactionsLoading } =
    useDailyInteractions();
  const { data: dailyRevenue, isLoading: revenueLoading } = useDailyRevenue();
  // const { data: funnelData, isLoading: funnelLoading } = useFunnelData();

  // Updated funnel data with Brazilian Portuguese stages
  // const funnelData = [
  //   { stage: "Contato Inicial", count: 1000, percentage: 100, dropRate: null },
  //   {
  //     stage: "Apresentação do Produto",
  //     count: 850,
  //     percentage: 85.0,
  //     dropRate: 15.0,
  //   },
  //   {
  //     stage: "Validação de Dores e Culpas",
  //     count: 720,
  //     percentage: 72.0,
  //     dropRate: 15.3,
  //   },
  //   { stage: "Pitch", count: 580, percentage: 58.0, dropRate: 19.4 },
  //   {
  //     stage: "Quebra de Objeções",
  //     count: 140,
  //     percentage: 14.0,
  //     dropRate: 75.9,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header with Centered Logo and Left-aligned Text */}
        <div>
          <div className="text-center mb-6 mt-20">
            <img
              src="/lovable-uploads/3145b3b9-1486-44fc-9a8b-b1582dbea4ea.png"
              alt="Horse Logo"
              className="w-[30vw] h-auto mx-auto"
            />
          </div>
          <div className="text-left mt-20">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Bem vindo, equipe Horse!
            </h1>
            <p className="text-white/60 text-lg">
              Métricas de Desempenho do Atendimento ao Cliente com IA
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total de Usuários"
            value={customerStats?.totalUsers?.toLocaleString() || "0"}
            change="Dados em tempo real"
            icon={Users}
            trend="up"
            isLoading={statsLoading}
          />
          <KPICard
            title="Taxa de Conversão"
            value={`${customerStats?.conversionRate || "0"}%`}
            change={`${customerStats?.conversions || 0} conversões`}
            icon={ChartLine}
            trend="up"
            isLoading={statsLoading}
          />
          <KPICard
            title="Média de Mensagens por Usuário"
            value={customerStats?.avgMessages || "0"}
            change="Profundidade média de interação"
            icon={MessageSquare}
            trend="up"
            isLoading={statsLoading}
          />
          <KPICard
            title="Atualmente Ativos"
            value={customerStats?.currentlyTalking?.toString() || "0"}
            change="Usuários em conversa"
            icon={Users}
            trend="up"
            isLoading={statsLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Interactions Chart */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-semibold tracking-tight">
                Interações Diárias
              </CardTitle>
              <CardDescription className="text-white/60">
                Número de usuários que contataram o sistema por dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interactionsLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-white/60" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyInteractions}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.6)"
                      className="text-xs"
                    />
                    <YAxis stroke="rgba(255,255,255,0.6)" className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="interactions"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      dot={{ fill: "#FFFFFF", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#FFFFFF", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Daily Revenue Chart */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-semibold tracking-tight">
                Receita Diária
              </CardTitle>
              <CardDescription className="text-white/60">
                Receita de conversões por dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-white/60" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyRevenue}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.6)"
                      className="text-xs"
                    />
                    <YAxis stroke="rgba(255,255,255,0.6)" className="text-xs" />
                    <Tooltip
                      formatter={(value) => [`${value}`, "Conversões"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count" // alterado de "revenue" para "count"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Support Funnel */}
        {/* <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-semibold tracking-tight">
              Funil de Atendimento ao Cliente
            </CardTitle>
            <CardDescription className="text-white/60">
              Jornada do usuário através do processo de suporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {funnelData.map((item, index) => (
                <div key={item.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.stage}</span>
                    <span className="text-white/80">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  {item.dropRate && (
                    <div className="text-red-400 text-sm font-medium">
                      {item.dropRate}% taxa de abandono
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Performance Summary */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-semibold tracking-tight">
              Resumo de Desempenho
            </CardTitle>
            <CardDescription className="text-white/60">
              Principais indicadores de desempenho do seu banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center h-[100px]">
                <Loader2 className="h-8 w-8 animate-spin text-white/60" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {customerStats?.conversionRate}%
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Taxa de Conversão
                  </div>
                  <div className="text-xs text-green-400 mt-1 font-medium">
                    {customerStats?.conversions} conversões totais
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {customerStats?.totalUsers}
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Total de Usuários
                  </div>
                  <div className="text-xs text-green-400 mt-1 font-medium">
                    No seu banco de dados
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {customerStats?.avgMessages}
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Média de Mensagens
                  </div>
                  <div className="text-xs text-green-400 mt-1 font-medium">
                    Por conversa
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
