import { useEffect, useState } from "react";
import type { DailySalesDataType, AnalyticsDataType } from "../types";
import { handleAxiosError } from "../utils/errorHandler";
import axios from "../config/axios";
import { DollarSign, Loader, Package, ShoppingCart, Users } from "lucide-react";
import AnalyticsCard from "./AnalyticsCard";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType>({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [dailySalesData, setDailySalesData] = useState<DailySalesDataType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/analytics");
        setAnalyticsData(res.data.analyticsData);
        setDailySalesData(res.data.dailySalesData);
      } catch (error) {
        handleAxiosError(error, "Error in getAnalytics Data,AnalyticsTab.tsx");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);


  if (loading) {
    return (
      <div className="h-full w-full">
        <div className="flex justify-center mt-5">
          <Loader className="size-8 animate-spin stroke-3 text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full h-full max-w-7xl px-4 sm:px-8 mx-auto p-4 sm:p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 place-items-center">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#D1D5DB" />
            <YAxis yAxisId="left" stroke="#D1D5DB" domain={[0, "auto"]} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#D1D5DB"
              domain={[0, "auto"]}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#22c55e"
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default AnalyticsTab;
