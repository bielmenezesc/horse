
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, ChartLine, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from "recharts";
import { useCustomerStats, useDailyInteractions, useDailyRevenue } from "@/hooks/useCustomerData";

const KPICard = ({ title, value, change, icon: Icon, trend, isLoading = false }) => (
  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
      <Icon className="h-4 w-4 text-white/60" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <div className="text-sm text-white/60">Loading...</div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
          <p className={`text-xs ${trend === 'up' ? 'text-green-400' : 'text-red-400'} flex items-center mt-1 font-medium`}>
            {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {change}
          </p>
        </>
      )}
    </CardContent>
  </Card>
);

const Index = () => {
  const { data: customerStats, isLoading: statsLoading } = useCustomerStats();
  const { data: dailyInteractions, isLoading: interactionsLoading } = useDailyInteractions();
  const { data: dailyRevenue, isLoading: revenueLoading } = useDailyRevenue();

  // Mock data for the funnel based on the image
  const funnelData = [
    { stage: "Initial Contact", count: 1000, percentage: 100, dropRate: null },
    { stage: "Question Asked", count: 850, percentage: 85.0, dropRate: 15.0 },
    { stage: "Response Provided", count: 720, percentage: 72.0, dropRate: 15.3 },
    { stage: "Issue Resolved", count: 580, percentage: 58.0, dropRate: 19.4 },
    { stage: "Handover to Human", count: 140, percentage: 14.0, dropRate: 75.9 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header with Logo */}
        <div className="text-center py-8">
          <img 
            src="/lovable-uploads/5432fca3-8b1f-443a-a7db-a6b24e28a19c.png" 
            alt="ALIACODE"
            className="w-[30vw] h-auto mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-white/60 text-lg">AI Customer Service Performance Metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Users"
            value={customerStats?.totalUsers?.toLocaleString() || "0"}
            change="Real-time data"
            icon={Users}
            trend="up"
            isLoading={statsLoading}
          />
          <KPICard
            title="Conversion Rate"
            value={`${customerStats?.conversionRate || "0"}%`}
            change={`${customerStats?.conversions || 0} conversions`}
            icon={ChartLine}
            trend="up"
            isLoading={statsLoading}
          />
          <KPICard
            title="Avg Messages per User"
            value={customerStats?.avgMessages || "0"}
            change="Average interaction depth"
            icon={MessageSquare}
            trend="up"
            isLoading={statsLoading}
          />
          <KPICard
            title="Currently Active"
            value={customerStats?.currentlyTalking?.toString() || "0"}
            change="Users in conversation"
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
              <CardTitle className="text-white font-semibold tracking-tight">Daily Interactions</CardTitle>
              <CardDescription className="text-white/60">
                Number of users who contacted the system by day
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
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" className="text-xs" />
                    <YAxis stroke="rgba(255,255,255,0.6)" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interactions" 
                      stroke="#FFFFFF" 
                      strokeWidth={2}
                      dot={{ fill: '#FFFFFF', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Daily Revenue Chart */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-semibold tracking-tight">Daily Revenue</CardTitle>
              <CardDescription className="text-white/60">
                Revenue from conversions by day
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
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" className="text-xs" />
                    <YAxis stroke="rgba(255,255,255,0.6)" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }} 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Support Funnel */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-semibold tracking-tight">Customer Support Funnel</CardTitle>
            <CardDescription className="text-white/60">
              User journey through the support process
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
                      {item.dropRate}% drop-off rate
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-semibold tracking-tight">Performance Summary</CardTitle>
            <CardDescription className="text-white/60">
              Key performance indicators from your database
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
                  <div className="text-3xl font-bold text-white tracking-tight">{customerStats?.conversionRate}%</div>
                  <div className="text-sm text-white/60 mt-1">Conversion Rate</div>
                  <div className="text-xs text-green-400 mt-1 font-medium">{customerStats?.conversions} total conversions</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl font-bold text-white tracking-tight">{customerStats?.totalUsers}</div>
                  <div className="text-sm text-white/60 mt-1">Total Users</div>
                  <div className="text-xs text-green-400 mt-1 font-medium">In your database</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-3xl font-bold text-white tracking-tight">{customerStats?.avgMessages}</div>
                  <div className="text-sm text-white/60 mt-1">Avg Messages</div>
                  <div className="text-xs text-green-400 mt-1 font-medium">Per conversation</div>
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
