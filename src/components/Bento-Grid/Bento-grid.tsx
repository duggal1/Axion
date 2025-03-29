"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LiveCall } from "./components/LiveCall";
import { ChatAnimation } from "./components/ChatAnimation";
import { WorldMap } from "./components/WorldMap";
import { StatsCard } from "./components/StatsCard";


interface ChartDataPoint {
  name: string;
  value: number;
  efficiency: number;
}

const BentoGrid = () =>  {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Generate initial data
    const generateData = () => Array.from({ length: 12 }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20,
      efficiency: Math.floor(Math.random() * 50) + 50,
    }));

    setChartData(generateData());

    // Update data every 3 seconds
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastDay = parseInt(newData[newData.length - 1].name.split(' ')[1]);
        newData.push({
          name: `Day ${lastDay + 1}`,
          value: Math.floor(Math.random() * 100) + 20,
          efficiency: Math.floor(Math.random() * 50) + 50,
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#FCFCFD] p-3 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="bg-clip-text bg-gradient-to-r from-[#5E60CE] via-[#6930C3] to-[#7400B8] mb-4 font-bold text-transparent text-2xl text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Axion AI Sales Agent
        </motion.h2>
        
        <div className="gap-3 grid grid-cols-12 auto-rows-[minmax(100px,auto)]">
          {/* Live Call Demo */}
          <motion.div 
            className="col-span-12 md:col-span-8 row-span-2 bg-white shadow-sm p-3 border border-[#F5F5F7] rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LiveCall />
          </motion.div>

          <motion.div 
            className="col-span-12 md:col-span-4 bg-white shadow-none p-6 border-0 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-medium text-gray-900 text-sm tracking-wide">Sales Performance</h3>
              <div className="flex space-x-3">
                <div className="flex items-center">
                  <div className="bg-indigo-600 mr-1.5 rounded-full w-2 h-2"></div>
                  <span className="text-gray-500 text-xs">Sales</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-500 mr-1.5 rounded-full w-2 h-2"></div>
                  <span className="text-gray-500 text-xs">Efficiency</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                {/* Ultra-minimal grid */}
                <CartesianGrid 
                  strokeDasharray="1 6" 
                  stroke="rgba(0,0,0,0.02)" 
                  horizontal={true}
                  vertical={false}
                />
                
                {/* Clean, minimal axes */}
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
                  tickCount={3}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  minTickGap={20}
                />
                
                {/* Modern tooltip */}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    fontSize: '11px',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ fontSize: '11px', padding: '2px 0', color: '#64748B' }}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px', fontSize: '10px', color: '#334155' }}
                  cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
                  wrapperStyle={{ outline: 'none' }}
                />
                
                {/* Sleek area charts */}
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                  activeDot={{ r: 4, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={1000}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#A855F7"
                  strokeWidth={2}
                  fill="url(#efficiencyGradient)"
                  activeDot={{ r: 4, fill: "#A855F7", strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="flex justify-between items-center mt-4">
              <div className="font-medium text-gray-900 text-xs">
                <span className="text-indigo-600">+24%</span> vs last week
              </div>
              <div className="text-gray-500 text-xs">
                Last updated: Today
              </div>
            </div>
          </motion.div>

          {/* Chat Demo */}
          <motion.div 
            className="col-span-12 md:col-span-4 bg-white shadow-sm p-3 border border-[#F5F5F7] rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ChatAnimation />
          </motion.div>

          {/* Globe */}
          <motion.div 
            className="relative col-span-12 md:col-span-8 bg-gradient-to-br from-white to-indigo-50/30 shadow-sm p-4 border border-[#F5F5F7] rounded-lg"
            style={{ height: '300px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-[#333] text-xs">Global Reach</h3>
              <div className="flex gap-1 text-[8px] text-gray-500">
                <span className="bg-indigo-50 px-1.5 py-0.5 rounded-full text-indigo-600">3 Active Calls</span>
                <span className="bg-gray-50 px-1.5 py-0.5 rounded-full text-gray-600">12 Countries</span>
              </div>
            </div>
            
            <div className="relative w-full h-[250px]">
            <WorldMap 
              dots={[
                { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: 51.5074, lng: -0.1278 } },
                { start: { lat: -33.8688, lng: 151.2093 }, end: { lat: 35.6762, lng: 139.6503 } },
                { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: 22.3193, lng: 114.1694 } }
              ]}
            />
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            className="col-span-12 md:col-span-4 bg-white shadow-sm p-3 border border-[#F5F5F7] rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <StatsCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}


export default BentoGrid;