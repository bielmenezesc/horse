import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  rapport_inicial: "Contato Inicial",
  apresentacao_produto: "Apresentação do Produto",
  validacao_dores_e_culpas: "Validação de Dores e Culpas",
  pitch_direto: "Pitch Direto",
  quebra_de_objecao: "Quebra de Objeções",
};

// Mock revenue per conversion for calculation
const REVENUE_PER_CONVERSION = 150;

export const useCustomerData = () => {
  return useQuery({
    queryKey: ["customer-data"],
    queryFn: async () => {
      console.log("Fetching customer data from Supabase...");
      const { data, error } = await supabase
        .from("HORSE")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customer data:", error);
        throw error;
      }

      console.log("Customer data fetched:", data);
      return data as CustomerData[];
    },
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ["customer-stats"],
    queryFn: async () => {
      console.log("Calculating customer statistics...");
      const { data, error } = await supabase.from("HORSE").select("*");

      if (error) {
        console.error("Error fetching customer data for stats:", error);
        throw error;
      }

      const totalUsers = data.length;
      const conversions = data.filter((item) => item.finish === true).length;
      const conversionRate =
        totalUsers > 0 ? (conversions / totalUsers) * 100 : 0;
      const currentlyTalking = data.filter(
        (item) => item.talking === true
      ).length;

      // Calculate average message count
      const messageCounts = data
        .filter((item) => item.message_id !== null)
        .map((item) => item.message_id || 0);
      const avgMessages =
        messageCounts.length > 0
          ? messageCounts.reduce((a, b) => a + b, 0) / messageCounts.length
          : 0;

      console.log("Calculated stats:", {
        totalUsers,
        conversions,
        conversionRate,
        currentlyTalking,
        avgMessages,
      });

      return {
        totalUsers,
        conversions,
        conversionRate: conversionRate.toFixed(1),
        currentlyTalking,
        avgMessages: avgMessages.toFixed(1),
      };
    },
  });
};

export const useDailyInteractions = () => {
  return useQuery({
    queryKey: ["daily-interactions"],
    queryFn: async () => {
      console.log("Fetching daily interactions...");
      const { data, error } = await supabase
        .from("HORSE")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching daily interactions:", error);
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
          interactions,
        }))
        .slice(-30); // Last 30 days

      console.log("Daily interactions data:", chartData);
      return chartData;
    },
  });
};

export const useDailyRevenue = () => {
  return useQuery({
    queryKey: ["daily-revenue"],
    queryFn: async () => {
      console.log("Calculating daily conversion count...");
      const { data, error } = await supabase
        .from("HORSE")
        .select("created_at, finish")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching data for conversion count:", error);
        throw error;
      }

      // Group conversions by date and count them
      const dailyConversions = data.reduce(
        (acc: Record<string, number>, item) => {
          if (item.finish === true) {
            const date = new Date(item.created_at).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        },
        {}
      );

      const chartData = Object.entries(dailyConversions)
        .map(([date, count]) => ({
          date,
          count,
        }))
        .slice(-30); // Last 30 days

      console.log("Daily conversion count data:", chartData);
      return chartData;
    },
  });
};

export const useStageAnalysis = () => {
  return useQuery({
    queryKey: ["stage-analysis"],
    queryFn: async () => {
      console.log("Analyzing stages...");
      const { data, error } = await supabase.from("HORSE").select("stage");

      if (error) {
        console.error("Error fetching stage data:", error);
        throw error;
      }

      // Count by stage
      const stageCounts = data.reduce((acc: Record<string, number>, item) => {
        const stage = item.stage || "Unknown";
        const displayName =
          STAGE_NAMES[stage as keyof typeof STAGE_NAMES] || stage;
        acc[displayName] = (acc[displayName] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(stageCounts)
        .map(([question, count]) => ({
          question,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 stages

      console.log("Stage analysis data:", chartData);
      return chartData;
    },
  });
};

const STAGE_LABELS: Record<string, string> = {
  rapport_inicial: "Contato Inicial",
  apresentacao_produto: "Apresentação do Produto",
  validacao_dores_e_culpas: "Validação de Dores e Culpas",
  pitch_direto: "Pitch",
  quebra_de_objecao: "Quebra de Objeções",
};

const STAGE_ORDER = [
  "rapport_inicial",
  "apresentacao_produto",
  "validacao_dores_e_culpas",
  "pitch_direto",
  "quebra_de_objecao",
];

export const useFunnelData = () => {
  return useQuery({
    queryKey: ["funnel-data"],
    queryFn: async () => {
      const { data, error } = await supabase.from("HORSE").select("stage");

      if (error) {
        console.error("Erro ao buscar estágios do funil:", error);
        throw error;
      }

      console.log(data);

      // Conta quantos usuários há por estágio
      const stageCounts: Record<string, number> = {};

      // Garante que data é um array e cada item tem stage como string
      for (const item of data || []) {
        const stage = item?.stage;

        if (typeof stage === "string" && STAGE_ORDER.includes(stage)) {
          console.log("AAAAAAAA");
          stageCounts[stage] = (stageCounts[stage] || 0) + 1;
        }
      }

      console.log("stageCounts: " + stageCounts);

      const firstStage = STAGE_ORDER[0];
      const totalFirstStage = stageCounts[firstStage] || 0;

      const funnelData = STAGE_ORDER.map((stage, index) => {
        const count = stageCounts[stage] || 0;
        const percentage =
          totalFirstStage > 0
            ? +((count / totalFirstStage) * 100).toFixed(1)
            : 0;

        let dropRate: number | null = null;
        if (index > 0) {
          const prevStage = STAGE_ORDER[index - 1];
          const prevCount = stageCounts[prevStage] || 0;

          if (prevCount > 0) {
            // const drop = ((prevCount - count) / prevCount) * 100;
            dropRate = parseFloat(
              (((prevCount - count) / prevCount) * 100).toFixed(1)
            );
          }
          if (count === 0) {
            dropRate = null;
          }
        }

        return {
          stage: STAGE_LABELS[stage],
          count,
          percentage,
          dropRate,
        };
      });

      console.log("funnelData:", JSON.stringify(funnelData, null, 2));

      return funnelData;
    },
  });
};
