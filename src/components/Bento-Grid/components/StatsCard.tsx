"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, PhoneCall, Activity } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

export function StatsCard() {
  const [stats, setStats] = useState({
    users: 2945,
    calls: 1234,
    conversion: 89
  });

  // Generate chart data
  const [chartData, setChartData] = useState<Array<{name: string, value: number, efficiency: number}>>([]);

  // Modern color palette
  const chartColors = useMemo(() => ({
    primary: "#3B82F6", // Blue
    secondary: "#8B5CF6", // Violet
    accent: "#F43F5E", // Rose
    background: "#FFFFFF",
    surface: "#F8FAFC",
    border: "#E2E8F0",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    success: "#10B981"
  }), []);

  useEffect(() => {
    // Generate initial data
    const generateData = () => Array.from({ length: 10 }, (_, i) => ({
      name: `${i + 1}`,
      value: Math.floor(Math.random() * 35) + 50,
      efficiency: Math.floor(Math.random() * 25) + 65,
    }));

    setChartData(generateData());

    const interval = setInterval(() => {
      // Update stats with smooth increments
      setStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 15),
        calls: prev.calls + Math.floor(Math.random() * 7),
        conversion: Math.min(100, prev.conversion + (Math.random() * 1.5 - 0.5))
      }));

      // Update chart data with smooth animation
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          name: String(parseInt(prev[prev.length-1].name) + 1),
          value: Math.min(100, Math.max(40, prev[prev.length-1].value + (Math.random() * 14 - 7))),
          efficiency: Math.min(100, Math.max(55, prev[prev.length-1].efficiency + (Math.random() * 10 - 5))),
        });
        return newData;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 font-medium text-[#333] text-xs">Performance</h3>
      
      <div className="flex flex-col flex-1 gap-2">
        {/* Main Stat */}
        <div className="flex items-center bg-[#F9FAFB] p-2 border border-[#F5F5F7] rounded-lg">
          <motion.div 
            className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 mr-2 rounded-lg w-8 h-8"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              background: ["linear-gradient(135deg, #3B82F6, #1D4ED8)", 
                          "linear-gradient(135deg, #8B5CF6, #4F46E5)",
                          "linear-gradient(135deg, #3B82F6, #1D4ED8)"] 
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Activity size={14} className="text-white" />
          </motion.div>
          <div>
            <span className="block font-medium text-[9px] text-gray-500">Conversion Rate</span>
            <div className="flex items-center">
              <motion.span 
                key={stats.conversion.toFixed(1)}
                className="mr-1 font-bold text-gray-800 text-base"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {stats.conversion.toFixed(1)}%
              </motion.span>
              <div className="flex items-center bg-green-50 px-1 py-0.5 rounded-full">
                <TrendingUp size={8} className="mr-0.5 text-green-500" />
                <span className="font-semibold text-[8px] text-green-600">+2.4%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="overflow-hidden">
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientArea1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.2}/>
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientArea2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.secondary} stopOpacity={0.2}/>
                  <stop offset="100%" stopColor={chartColors.secondary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientLine1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={chartColors.primary}/>
                  <stop offset="100%" stopColor={chartColors.accent}/>
                </linearGradient>
                <linearGradient id="gradientLine2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={chartColors.secondary}/>
                  <stop offset="100%" stopColor={chartColors.accent}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 7, fill: chartColors.textSecondary }}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 7, fill: chartColors.textSecondary }}
                domain={[0, 100]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="url(#gradientLine1)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradientArea1)"
                activeDot={{ 
                  r: 3, 
                  fill: 'white', 
                  stroke: chartColors.primary, 
                  strokeWidth: 2
                }}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              <Area 
                type="monotone" 
                dataKey="efficiency" 
                stroke="url(#gradientLine2)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradientArea2)"
                activeDot={{ 
                  r: 3, 
                  fill: 'white', 
                  stroke: chartColors.secondary, 
                  strokeWidth: 2
                }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats Row */}
        <div className="gap-2 grid grid-cols-2">
          <motion.div 
            className="bg-white shadow-sm p-2 border border-[#F5F5F7] rounded-lg overflow-hidden"
            whileHover={{ translateY: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg w-6 h-6"
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(59,130,246,0.2)", "0px 0px 8px rgba(59,130,246,0.3)", "0px 0px 0px rgba(59,130,246,0.2)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users size={12} className="text-white" />
              </motion.div>
              <div>
                <span className="block font-medium text-[8px] text-gray-500">Active Users</span>
                <motion.div 
                  key={stats.users}
                  className="font-bold text-gray-800 text-xs"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {stats.users.toLocaleString()}
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white shadow-sm p-2 border border-[#F5F5F7] rounded-lg overflow-hidden"
            whileHover={{ translateY: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="flex justify-center items-center bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg w-6 h-6"
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(139,92,246,0.2)", "0px 0px 8px rgba(139,92,246,0.3)", "0px 0px 0px rgba(139,92,246,0.2)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <PhoneCall size={12} className="text-white" />
              </motion.div>
              <div>
                <span className="block font-medium text-[8px] text-gray-500">Total Calls</span>
                <motion.div 
                  key={stats.calls}
                  className="font-bold text-gray-800 text-xs"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {stats.calls.toLocaleString()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}