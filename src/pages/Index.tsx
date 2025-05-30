import { useCustomerData, useCustomerStats, useDailyInteractions, useDailyRevenue, useStageAnalysis } from '@/hooks/useCustomerData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import UserMenu from '@/components/UserMenu';

const Index = () => {
  const { data: customerData, isLoading, error } = useCustomerData();
  const { data: customerStats } = useCustomerStats();
  const { data: dailyInteractions } = useDailyInteractions();
  const { data: dailyRevenue } = useDailyRevenue();
  const { data: stageAnalysis } = useStageAnalysis();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with User Menu */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
            <p className="text-lg text-gray-600">Monitor your customer interactions and conversions</p>
          </div>
          <UserMenu />
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Customers</CardTitle>
              <CardDescription>Number of unique customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customerStats?.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Conversions</CardTitle>
              <CardDescription>Number of successful conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customerStats?.conversions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>Percentage of customers converted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customerStats?.conversionRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currently Talking</CardTitle>
              <CardDescription>Number of customers currently engaged</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customerStats?.currentlyTalking}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avg. Messages</CardTitle>
              <CardDescription>Average messages per customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customerStats?.avgMessages}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily Interactions</CardTitle>
              <CardDescription>Number of interactions per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyInteractions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="interactions" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue</CardTitle>
              <CardDescription>Revenue generated per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Stages</CardTitle>
              <CardDescription>Distribution of customers across stages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stageAnalysis} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
