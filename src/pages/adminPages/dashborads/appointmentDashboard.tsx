import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/utils/axiosClient";

interface AppointmentsAreaChartProps {
  selectedPeriod: "yearly" | "monthly" | "daily";
}

const AppointmentsAreaChart: React.FC<AppointmentsAreaChartProps> = ({
  selectedPeriod,
}) => {
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl">
          <p className="font-bold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className="font-semibold text-gray-700 mt-2">
            Total Appointments:{" "}
            {payload.reduce((sum, entry) => sum + entry.value, 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  const fetchData = async (period: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/admin/dash-appointment?period=${period}`
      );
      const data = response?.data?.appointmentData;

      let formattedData;
      if (period === "yearly") {
        formattedData = data.map((item: any) => ({
          name: item._id,
          onlineAppointments: item.onlineCount,
          offlineAppointments: item.offlineCount,
          totalAppointments: item.onlineCount + item.offlineCount,
        }));
      } else if (period === "monthly") {
        formattedData = data.map((item: any) => ({
          name: item.month,
          onlineAppointments: item.onlineCount,
          offlineAppointments: item.offlineCount,
          totalAppointments: item.onlineCount + item.offlineCount,
        }));
      } else if (period === "daily") {
        formattedData = data.map((item: any) => ({
          name: item._id,
          onlineAppointments: item.onlineCount,
          offlineAppointments: item.offlineCount,
          totalAppointments: item.onlineCount + item.offlineCount,
        }));
      }
      setAppointmentData(formattedData);
    } catch (error) {
      setError("Failed to fetch appointment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Dynamic Y-axis calculation
  const maxOnline = Math.max(
    ...appointmentData.map((d) => d.onlineAppointments || 0)
  );
  const maxOffline = Math.max(
    ...appointmentData.map((d) => d.offlineAppointments || 0)
  );
  const maxTotal = Math.max(maxOnline, maxOffline);
  
  // Determine the appropriate Y-axis configuration based on the period
  const getYAxisConfig = () => {
    switch (selectedPeriod) {
      case 'yearly':
        return {
          domain: [0, Math.ceil(maxTotal * 1.2)],
          interval: 'preserveStartEnd',
          label: 'Appointments per Year'
        };
      case 'monthly':
        return {
          domain: [0, Math.ceil(maxTotal * 1.2)],
          interval: 0,
          label: 'Appointments per Month'
        };
      case 'daily':
        return {
          domain: [0, Math.ceil(maxTotal * 1.2)],
          interval: 0,
          label: 'Appointments per Day'
        };
      default:
        return {
          domain: [0, Math.ceil(maxTotal * 1.2)],
          interval: 'preserveStartEnd',
          label: 'Appointments'
        };
    }
  };

  const yAxisConfig = getYAxisConfig();

  return (
    <div className="bg-white w-7/12 space-y-4 p-6 shadow-xl rounded-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">
          Appointments Breakdown ({selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})
        </h3>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={appointmentData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="colorOnlineAppointments"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="colorOfflineAppointments"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            label={{ 
              value: selectedPeriod === 'yearly' ? 'Years' : 
                     selectedPeriod === 'monthly' ? 'Months' : 'Days', 
              position: 'insideBottom', 
              offset: -10 
            }}
          />
          <YAxis
            domain={yAxisConfig.domain}
            interval={yAxisConfig.interval}
            label={{ 
              value: yAxisConfig.label, 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) =>
              value === "onlineAppointments"
                ? "Online Appointments"
                : "Offline Appointments"
            }
          />
          <Area
            type="monotone"
            dataKey="onlineAppointments"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#colorOnlineAppointments)"
          />
          <Area
            type="monotone"
            dataKey="offlineAppointments"
            stroke="#10B981"
            fillOpacity={1}
            fill="url(#colorOfflineAppointments)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentsAreaChart;