"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, PhoneCall, Activity } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

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
    // Generate initial data with smoother curve
    const generateData = () => {
      const basePattern = Array.from({ length: 10 }, (_, i) => {
        const x = i / 9;
        return {
          name: `${i + 1}`,
          value: Math.sin(x * Math.PI) * 20 + 60 + (Math.random() * 8 - 4),
          efficiency: Math.cos(x * Math.PI * 0.7) * 15 + 70 + (Math.random() * 6 - 3),
        };
      });
      return basePattern;
    };

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
        const lastValue = prev[prev.length-1].value;
        const lastEfficiency = prev[prev.length-1].efficiency;
        
        newData.push({
          name: String(parseInt(prev[prev.length-1].name) + 1),
          value: Math.min(100, Math.max(40, lastValue + (Math.random() * 14 - 7))),
          efficiency: Math.min(100, Math.max(55, lastEfficiency + (Math.random() * 10 - 5))),
        });
        return newData;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full font-serif">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800 text-sm">Performance Metrics</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-0.5 rounded-full"
        >
          <motion.span 
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-1.5 h-1.5"
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 4px rgba(59, 130, 246, 0.5)", "0px 0px 0px rgba(59, 130, 246, 0)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 font-medium text-[9px] text-transparent">Live Data</span>
        </motion.div>
      </div>

      <div className="flex flex-col flex-1 gap-4">
        {/* Main Stat */}
        <motion.div 
          whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex items-center bg-gradient-to-br from-[#F9FAFB] to-white p-3 border border-[#F5F5F7] rounded-lg"
        >
          <motion.div
            className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 mr-3 rounded-lg w-10 h-10"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: ["0px 0px 0px rgba(59,130,246,0.2)", "0px 0px 12px rgba(59,130,246,0.4)", "0px 0px 0px rgba(59,130,246,0.2)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Activity size={16} className="text-white" />
          </motion.div>
          <div>
            <span className="block font-medium text-gray-500 text-xs">Conversion Rate</span>
            <div className="flex items-center">
              <motion.span
                key={stats.conversion.toFixed(1)}
                className="mr-2 font-bold text-gray-800 text-xl"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {stats.conversion.toFixed(1)}%
              </motion.span>
              <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-1.5 py-0.5 rounded-full">
                <TrendingUp size={10} className="mr-0.5 text-green-500" />
                <span className="bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 font-semibold text-[10px] text-transparent">+2.4%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <div className="flex-grow overflow-hidden">
          <ResponsiveContainer width="100%" height={280}>
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
                  <stop offset="100%" stopColor="#60A5FA"/>
                </linearGradient>
                <linearGradient id="gradientLine2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={chartColors.secondary}/>
                  <stop offset="100%" stopColor="#A78BFA"/>
                </linearGradient>
                <filter id="chartGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8, fill: chartColors.textSecondary, fontFamily: 'serif' }}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8, fill: chartColors.textSecondary, fontFamily: 'serif' }}
                domain={[0, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/90 shadow-lg backdrop-blur-sm p-2 border border-gray-100 rounded-lg font-serif">
                        <p className="font-medium text-[10px] text-gray-700">{payload[0].payload.name}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-[9px] text-indigo-600">
                            <span className="font-medium">Value:</span> {payload[0].value?.toFixed(1)}
                          </p>
                          <p className="text-[9px] text-violet-600">
                            <span className="font-medium">Efficiency:</span> {payload[1].value?.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: '#E2E8F0', strokeWidth: 1, strokeDasharray: '3 3' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#gradientLine1)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#gradientArea1)"
                activeDot={{ 
                  r: 5, 
                  fill: "#3B82F6", 
                  strokeWidth: 2, 
                  stroke: "#fff",
                  filter: "url(#chartGlow)"
                }}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="url(#gradientLine2)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#gradientArea2)"
                activeDot={{ 
                  r: 5, 
                  fill: "#8B5CF6", 
                  strokeWidth: 2, 
                  stroke: "#fff",
                  filter: "url(#chartGlow)"
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
            className="bg-gradient-to-br from-white to-[#FAFBFF] shadow-sm p-3 border border-[#F5F5F7] rounded-lg overflow-hidden"
            whileHover={{ translateY: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg w-8 h-8"
                animate={{
                  boxShadow: ["0px 0px 0px rgba(59,130,246,0.2)", "0px 0px 8px rgba(59,130,246,0.3)", "0px 0px 0px rgba(59,130,246,0.2)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users size={14} className="text-white" />
              </motion.div>
              <div>
                <span className="block font-medium text-[9px] text-gray-500">Active Users</span>
                <motion.div
                  key={stats.users}
                  className="font-bold text-gray-800 text-sm"
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
            className="bg-gradient-to-br from-white to-[#FAFBFF] shadow-sm p-3 border border-[#F5F5F7] rounded-lg overflow-hidden"
            whileHover={{ translateY: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="flex justify-center items-center bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg w-8 h-8"
                animate={{
                  boxShadow: ["0px 0px 0px rgba(139,92,246,0.2)", "0px 0px 8px rgba(139,92,246,0.3)", "0px 0px 0px rgba(139,92,246,0.2)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <PhoneCall size={14} className="text-white" />
              </motion.div>
              <div>
                <span className="block font-medium text-[9px] text-gray-500">Total Calls</span>
                <motion.div
                  key={stats.calls}
                  className="font-bold text-gray-800 text-sm"
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

        {/* Legend */}
        <div className="flex justify-center gap-4 pt-2">
          <div className="flex items-center">
            <motion.div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 mr-1.5 rounded-full w-2 h-2"
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(59,130,246,0)", "0px 0px 6px rgba(59,130,246,0.5)", "0px 0px 0px rgba(59,130,246,0)"] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-gray-500">Revenue</span>
          </div>
          <div className="flex items-center">
            <motion.div 
              className="bg-gradient-to-r from-violet-400 to-violet-600 mr-1.5 rounded-full w-2 h-2"
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(139,92,246,0)", "0px 0px 6px rgba(139,92,246,0.5)", "0px 0px 0px rgba(139,92,246,0)"] 
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <span className="text-[10px] text-gray-500">Efficiency</span>
          </div>
        </div>
      </div>
    </div>
  );
}