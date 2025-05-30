import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart, Users, MessageSquare, ChevronDown, ChevronUp, CircleArrowDown, CircleArrowUp, ChartLine, CalendarDays, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell, BarChart as RechartsBarChart, Bar } from "recharts";
import { useHorseData, useHorseStats, useDailyInteractions, useStageAnalysis } from "@/hooks/useHorseData";

// Mock data for daily revenue (keeping this as you didn't mention revenue in your database)
const dailyRevenueData = [
  { date: "Day 1", revenue: 1250 },
  { date: "Day 2", revenue: 1560 },
  { date: "Day 3", revenue: 945 },
  { date: "Day 4", revenue: 2005 },
  { date: "Day 5", revenue: 1780 },
  { date: "Day 6", revenue: 1445 },
  { date: "Day 7", revenue: 2225 },
  { date: "Day 8", revenue: 1990 },
  { date: "Day 9", revenue: 1835 },
  { date: "Day 10", revenue: 2115 },
  { date: "Day 11", revenue: 2280 },
  { date: "Day 12", revenue: 1945 },
  { date: "Day 13", revenue: 2505 },
  { date: "Day 14", revenue: 2335 },
  { date: "Day 15", revenue: 2615 },
  { date: "Day 16", revenue: 2170 },
  { date: "Day 17", revenue: 1945 },
  { date: "Day 18", revenue: 2835 },
  { date: "Day 19", revenue: 2445 },
  { date: "Day 20", revenue: 2060 },
  { date: "Day 21", revenue: 3170 },
  { date: "Day 22", revenue: 2890 },
  { date: "Day 23", revenue: 2225 },
  { date: "Day 24", revenue: 2560 },
  { date: "Day 25", revenue: 2945 },
  { date: "Day 26", revenue: 3115 },
  { date: "Day 27", revenue: 2835 },
  { date: "Day 28", revenue: 3490 },
  { date: "Day 29", revenue: 3225 },
  { date: "Day 30", revenue: 3560 }
];

// Mock data for funnel (will be calculated from your data later)
const funnelData = [
  { name: "Initial Contact", value: 1000, fill: "#3B82F6" },
  { name: "Question Asked", value: 850, fill: "#60A5FA" },
  { name: "Response Provided", value: 720, fill: "#93C5FD" },
  { name: "Issue Resolved", value: 580, fill: "#BFDBFE" },
  { name: "Handover to Human", value: 140, fill: "#EF4444" }
];

const AppSidebar = () => {
  const menuItems = [
    { title: "Overview", icon: BarChart, active: true },
    { title: "Analytics", icon: ChartLine, active: false },
    { title: "User Insights", icon: Users, active: false },
    { title: "Reports", icon: CalendarDays, active: false },
    { title: "Conversations", icon: MessageSquare, active: false }
  ];

  return (
    <Sidebar className="border-r border-gray-800">
      <SidebarContent className="bg-gray-900">
        <SidebarGroup>
          <div className="px-4 py-6 border-b border-gray-800">
            <img 
              src="/lovable-uploads/74fe763e-1084-41fb-98c5-4119c49496f0.png" 
              alt="ALIACODE"
              className="h-8 w-auto mb-2"
            />
            <p className="text-sm text-gray-400">AI Insights Dashboard</p>
          </div>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${item.active ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-gray-800'} transition-colors duration-200`}
                  >
                    <a href="#" className="flex items-center space-x-3 px-4 py-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const KPICard = ({ title, value, change, icon: Icon, trend, isLoading = false }) => (
  <Card className="bg-gray-900 border-gray-800 hover:bg-gray-850 transition-colors duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <div className="text-sm text-gray-400">Loading...</div>
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
  const { data: horseStats, isLoading: statsLoading } = useHorseStats();
  const { data: dailyInteractions, isLoading: interactionsLoading } = useDailyInteractions();
  const { data: stageAnalysis, isLoading: stageLoading } = useStageAnalysis();

  return (
    <div className="min-h-screen bg-gray-950">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                  <p className="text-gray-400 mt-1">AI Customer Service Performance Metrics</p>
                </div>
                <SidebarTrigger className="text-white hover:bg-gray-800" />
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Total Users"
                  value={horseStats?.totalUsers?.toLocaleString() || "0"}
                  change="Real-time data"
                  icon={Users}
                  trend="up"
                  isLoading={statsLoading}
                />
                <KPICard
                  title="Conversion Rate"
                  value={`${horseStats?.conversionRate || "0"}%`}
                  change={`${horseStats?.conversions || 0} conversions`}
                  icon={ChartLine}
                  trend="up"
                  isLoading={statsLoading}
                />
                <KPICard
                  title="Avg Messages per User"
                  value={horseStats?.avgMessages || "0"}
                  change="Average interaction depth"
                  icon={MessageSquare}
                  trend="up"
                  isLoading={statsLoading}
                />
                <KPICard
                  title="Currently Active"
                  value={horseStats?.currentlyTalking?.toString() || "0"}
                  change="Users in conversation"
                  icon={BarChart}
                  trend="up"
                  isLoading={statsLoading}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Interactions Chart */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-semibold tracking-tight">Daily Interactions</CardTitle>
                    <CardDescription className="text-gray-400">
                      Number of users who contacted the system by day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {interactionsLoading ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyInteractions}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" className="text-xs" />
                          <YAxis stroke="#9CA3AF" className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#111827', 
                              border: '1px solid #374151',
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

                {/* Daily Revenue Chart (keeping mock data) */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-semibold tracking-tight">Daily Revenue</CardTitle>
                    <CardDescription className="text-gray-400">
                      Revenue attributed to the automation system by day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dailyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" className="text-xs" />
                        <YAxis stroke="#9CA3AF" className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#111827', 
                            border: '1px solid #374151',
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
                  </CardContent>
                </Card>
              </div>

              {/* Funnel and Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Support Funnel (keeping mock data for now) */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-semibold tracking-tight">Customer Support Funnel</CardTitle>
                    <CardDescription className="text-gray-400">
                      User journey through the support process
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {funnelData.map((stage, index) => {
                        const percentage = index === 0 ? 100 : ((stage.value / funnelData[0].value) * 100);
                        const dropoffRate = index > 0 ? (((funnelData[index-1].value - stage.value) / funnelData[index-1].value) * 100) : 0;
                        
                        return (
                          <div key={stage.name} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-300 font-medium">{stage.name}</span>
                              <div className="text-right">
                                <span className="text-white font-semibold">{stage.value.toLocaleString()}</span>
                                <span className="text-gray-400 ml-2">({percentage.toFixed(1)}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300" 
                                style={{ 
                                  width: `${percentage}%`, 
                                  backgroundColor: index === funnelData.length - 1 ? '#EF4444' : '#FFFFFF'
                                }}
                              />
                            </div>
                            {index > 0 && (
                              <div className="text-xs text-red-400 font-medium">
                                {dropoffRate.toFixed(1)}% drop-off rate
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* User Stage Analysis */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-semibold tracking-tight">Stage Analysis</CardTitle>
                    <CardDescription className="text-gray-400">
                      Distribution of users across different stages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stageLoading ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-3">Top Stages</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <RechartsBarChart data={stageAnalysis} layout="horizontal">
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis type="number" stroke="#9CA3AF" className="text-xs" />
                              <YAxis dataKey="question" type="category" stroke="#9CA3AF" width={100} className="text-xs" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#111827', 
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                  color: '#fff',
                                  fontSize: '12px'
                                }} 
                              />
                              <Bar dataKey="count" fill="#FFFFFF" />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white tracking-tight">
                              {horseStats?.currentlyTalking || 0}
                            </div>
                            <div className="text-xs text-gray-400">Currently Talking</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white tracking-tight">
                              {horseStats?.conversions || 0}
                            </div>
                            <div className="text-xs text-gray-400">Total Conversions</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Metrics */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white font-semibold tracking-tight">Performance Summary</CardTitle>
                  <CardDescription className="text-gray-400">
                    Key performance indicators from your database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="flex items-center justify-center h-[100px]">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gray-850 rounded-lg border border-gray-800">
                        <div className="text-3xl font-bold text-white tracking-tight">{horseStats?.conversionRate}%</div>
                        <div className="text-sm text-gray-400 mt-1">Conversion Rate</div>
                        <div className="text-xs text-green-400 mt-1 font-medium">{horseStats?.conversions} total conversions</div>
                      </div>
                      <div className="text-center p-4 bg-gray-850 rounded-lg border border-gray-800">
                        <div className="text-3xl font-bold text-white tracking-tight">{horseStats?.totalUsers}</div>
                        <div className="text-sm text-gray-400 mt-1">Total Users</div>
                        <div className="text-xs text-green-400 mt-1 font-medium">In your database</div>
                      </div>
                      <div className="text-center p-4 bg-gray-850 rounded-lg border border-gray-800">
                        <div className="text-3xl font-bold text-white tracking-tight">{horseStats?.avgMessages}</div>
                        <div className="text-sm text-gray-400 mt-1">Avg Messages</div>
                        <div className="text-xs text-green-400 mt-1 font-medium">Per conversation</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
