
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerData {
  id: number;
  name: string | null;
  whatsapp: string | null;
  messages: string | null;
  message_id: number | null;
  created_at: string;
  talking: boolean | null;
  stage: string | null;
  prev_msg: string | null;
  finish: boolean | null;
}

const STAGE_NAMES = {
  'rapport_inicial': 'Contato Inicial',
  'apresentacao_produto': 'Apresentação do Produto',
  'validacao_dores_e_culpas': 'Validação de Dores e Culpas',
  'pitch_direto': 'Pitch Direto',
  'quebra_de_objecao': 'Quebra de Objeções'
};

// Mock revenue per conversion for calculation
const REVENUE_PER_CONVERSION = 150;

export const useCustomerData = () => {
  return useQuery({
    queryKey: ['customer-data'],
    queryFn: async () => {
      console.log('Fetching customer data from Supabase...');
      const { data, error } = await supabase
        .from('HORSE')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customer data:', error);
        throw error;
      }

      console.log('Customer data fetched:', data);
      return data as CustomerData[];
    },
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customer-stats'],
    queryFn: async () => {
      console.log('Calculating customer statistics...');
      const { data, error } = await supabase
        .from('HORSE')
        .select('*');

      if (error) {
        console.error('Error fetching customer data for stats:', error);
        throw error;
      }

      const totalUsers = data.length;
      const conversions = data.filter(item => item.finish === true).length;
      const conversionRate = totalUsers > 0 ? (conversions / totalUsers) * 100 : 0;
      const currentlyTalking = data.filter(item => item.talking === true).length;
      
      // Calculate average message count
      const messageCounts = data
        .filter(item => item.message_id !== null)
        .map(item => item.message_id || 0);
      const avgMessages = messageCounts.length > 0 
        ? messageCounts.reduce((a, b) => a + b, 0) / messageCounts.length 
        : 0;

      console.log('Calculated stats:', {
        totalUsers,
        conversions,
        conversionRate,
        currentlyTalking,
        avgMessages
      });

      return {
        totalUsers,
        conversions,
        conversionRate: conversionRate.toFixed(1),
        currentlyTalking,
        avgMessages: avgMessages.toFixed(1)
      };
    },
  });
};

export const useDailyInteractions = () => {
  return useQuery({
    queryKey: ['daily-interactions'],
    queryFn: async () => {
      console.log('Fetching daily interactions...');
      const { data, error } = await supabase
        .from('HORSE')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching daily interactions:', error);
        throw error;
      }

      // Group by date
      const dailyData = data.reduce((acc: Record<string, number>, item) => {
        const date = new Date(item.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(dailyData)
        .map(([date, interactions]) => ({
          date,
          interactions
        }))
        .slice(-30); // Last 30 days

      console.log('Daily interactions data:', chartData);
      return chartData;
    },
  });
};

export const useDailyRevenue = () => {
  return useQuery({
    queryKey: ['daily-revenue'],
    queryFn: async () => {
      console.log('Calculating daily revenue...');
      const { data, error } = await supabase
        .from('HORSE')
        .select('created_at, finish')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching data for revenue calculation:', error);
        throw error;
      }

      // Group conversions by date and calculate revenue
      const dailyRevenue = data.reduce((acc: Record<string, number>, item) => {
        if (item.finish === true) {
          const date = new Date(item.created_at).toLocaleDateString();
          acc[date] = (acc[date] || 0) + REVENUE_PER_CONVERSION;
        }
        return acc;
      }, {});

      const chartData = Object.entries(dailyRevenue)
        .map(([date, revenue]) => ({
          date,
          revenue
        }))
        .slice(-30); // Last 30 days

      console.log('Daily revenue data:', chartData);
      return chartData;
    },
  });
};

export const useStageAnalysis = () => {
  return useQuery({
    queryKey: ['stage-analysis'],
    queryFn: async () => {
      console.log('Analyzing stages...');
      const { data, error } = await supabase
        .from('HORSE')
        .select('stage');

      if (error) {
        console.error('Error fetching stage data:', error);
        throw error;
      }

      // Count by stage
      const stageCounts = data.reduce((acc: Record<string, number>, item) => {
        const stage = item.stage || 'Unknown';
        const displayName = STAGE_NAMES[stage as keyof typeof STAGE_NAMES] || stage;
        acc[displayName] = (acc[displayName] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(stageCounts)
        .map(([question, count]) => ({
          question,
          count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 stages

      console.log('Stage analysis data:', chartData);
      return chartData;
    },
  });
};
