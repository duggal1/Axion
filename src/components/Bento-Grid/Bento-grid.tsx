"use client";

import { useEffect, useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { LiveCall } from "./components/LiveCall";
import { ChatAnimation } from "./components/ChatAnimation";
// import { WorldMap } from "./components/WorldMap";
import { StatsCard } from "./components/StatsCard";
//Wip in progess update the ui of the recharts 

interface ChartDataPoint {
  name: string;
  value: number;
  efficiency: number;
}

const BentoGrid = () =>  {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Modern color palette for the chart
  const chartColors = useMemo(() => ({
    primary: "#6366F1", // Indigo
    secondary: "#A855F7", // Purple
    accent: "#F43F5E", // Rose
    background: "#FFFFFF",
    surface: "#F8FAFC",
    border: "#E2E8F0",
    textPrimary: "#0F172A",
    textSecondary: "#64748B"
  }), []);

  useEffect(() => {
    // Generate initial data with smoother curve
    const generateData = () => {
      // Create a base pattern for more natural-looking data
      const basePattern = Array.from({ length: 12 }, (_, i) => {
        const x = i / 11;
        // Base sine wave with some randomness
        return {
          name: `Day ${i + 1}`,
          value: Math.sin(x * Math.PI) * 30 + 60 + (Math.random() * 10 - 5),
          efficiency: Math.cos(x * Math.PI * 0.5) * 20 + 70 + (Math.random() * 8 - 4),
        };
      });
      
      return basePattern;
    };

    setChartData(generateData());

    // Update data with smooth transitions every 3 seconds
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastDay = parseInt(newData[newData.length - 1].name.split(' ')[1]);
        
        // Calculate new values that follow the trend
        const lastValue = newData[newData.length - 1].value;
        const lastEfficiency = newData[newData.length - 1].efficiency;
        
        // Create smooth transitions from previous values
        const newValue = Math.max(20, Math.min(100, lastValue + (Math.random() * 10 - 5)));
        const newEfficiency = Math.max(50, Math.min(100, lastEfficiency + (Math.random() * 8 - 4)));
        
        newData.push({
          name: `Day ${lastDay + 1}`,
          value: newValue,
          efficiency: newEfficiency,
        });
        return newData;
      });
    }, 2000); // Slightly faster updates for more dynamic feel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div
          className="mb-4 font-serif text-gray-900 sm:text-3xl md:text-4xl text-6xl lg:text-6xl text-center leading-snug tracking-tight"
        >
          Axion AI Sales Agent
        </div>

        <div className="gap-2 grid grid-cols-2 md:grid-cols-2 auto-rows-fr">
          {/* Top Row - First Card: Live Call Demo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white shadow-sm p-3 border border-[#a8a8ac] rounded-lg h-[500px]"
          >
            <LiveCall />
          </motion.div>

          {/* Top Row - Second Card: Sales Performance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="bg-white shadow-sm p-3 border border-[#b4b4b8] rounded-lg h-[500px]"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900 text-sm tracking-wide">Sales Performance</h3>
              <div className="flex space-x-3">
                <div className="flex items-center">
                  <motion.div 
                    className="bg-indigo-600 mr-1.5 rounded-full w-2 h-2"
                    animate={{ 
                      boxShadow: ["0px 0px 0px rgba(99, 102, 241, 0)", "0px 0px 8px rgba(99, 102, 241, 0.5)", "0px 0px 0px rgba(99, 102, 241, 0)"] 
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <span className="text-gray-500 text-xs">Sales</span>
                </div>
                <div className="flex items-center">
                  <motion.div 
                    className="bg-purple-500 mr-1.5 rounded-full w-2 h-2"
                    animate={{ 
                      boxShadow: ["0px 0px 0px rgba(168, 85, 247, 0)", "0px 0px 8px rgba(168, 85, 247, 0.5)", "0px 0px 0px rgba(168, 85, 247, 0)"] 
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  />
                  <span className="text-gray-500 text-xs">Efficiency</span>
                </div>
              </div>
            </div>

            <div className="h-[430px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                      <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColors.secondary} stopOpacity={0.2}/>
                      <stop offset="100%" stopColor={chartColors.secondary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="salesLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366F1"/>
                      <stop offset="100%" stopColor="#818CF8"/>
                    </linearGradient>
                    <linearGradient id="efficiencyLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#A855F7"/>
                      <stop offset="100%" stopColor="#C084FC"/>
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="1 6"
                    stroke="rgba(0,0,0,0.02)"
                    horizontal={true}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#CBD5E1"
                    tick={{ fill: '#94A3B8', fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 10, right: 10 }}
                    minTickGap={15}
                  />

                  <YAxis
                    stroke="#CBD5E1"
                    tick={{ fill: '#94A3B8', fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    tickCount={5}
                    domain={[0, 'dataMax + 10']}
                    minTickGap={20}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 shadow-lg backdrop-blur-sm p-2 border border-gray-100 rounded-lg">
                            <p className="font-medium text-[10px] text-gray-700">{payload[0].payload.name}</p>
                            <div className="flex flex-col gap-1 mt-1">
                              <p className="text-[9px] text-indigo-600">
                                <span className="font-medium">Sales:</span> {payload[0].value?.toFixed(1)}
                              </p>
                              <p className="text-[9px] text-purple-600">
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
                    stroke="url(#salesLine)"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                    activeDot={{ 
                      r: 5, 
                      fill: "#6366F1", 
                      strokeWidth: 2, 
                      stroke: "#fff",
                      filter: "url(#glow)"
                    }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />

                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stroke="url(#efficiencyLine)"
                    strokeWidth={2.5}
                    fill="url(#efficiencyGradient)"
                    activeDot={{ 
                      r: 5, 
                      fill: "#A855F7", 
                      strokeWidth: 2, 
                      stroke: "#fff",
                      filter: "url(#glow)"
                    }}
                    animationDuration={1800}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center pt-2 pb-1">
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 mr-2 px-2 py-0.5 rounded-full font-medium text-[10px] text-white"
                >
                  +24%
                </motion.div>
                <span className="text-[10px] text-gray-500">vs last week</span>
              </div>
              <div className="text-[10px] text-gray-500">
                Last updated: Today
              </div>
            </div>
          </motion.div>

          {/* Bottom Row - First Card: Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="bg-white shadow-sm p-3 border border-[#a3a3a6] rounded-lg h-[500px]"
          >
            <StatsCard />
          </motion.div>

          {/* Bottom Row - Second Card: Chat Demo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="bg-white shadow-sm p-3 border border-[#909092] rounded-lg h-[500px]"
          >
            <ChatAnimation />
          </motion.div>
        </div>
      </div>
    </div>
  );
}


export default BentoGrid;