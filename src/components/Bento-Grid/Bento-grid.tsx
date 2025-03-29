"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
    <div className="p-3 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div
          className=" mb-4 font-serif text-gray-900   lg:text-6xl text-6xl md:text-4xl sm:text-3xl leading-snug tracking-tight text-center "
        >
          Axion AI Sales Agent
        </div>

        <div className="gap-4 grid grid-cols-2 md:grid-cols-2 auto-rows-fr">
          {/* Top Row - First Card: Live Call Demo */}
          <div
            className="bg-white shadow-sm p-3 border border-[#F5F5F7] rounded-lg h-[300px]"
          >
            <LiveCall />
          </div>

          {/* Top Row - Second Card: Sales Performance */}
          <div
            className="bg-white shadow-sm p-3 border border-[#F5F5F7] rounded-lg h-[300px]"
          >
            <div className="flex justify-between items-center mb-3">
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

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
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
                    tickCount={3}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    minTickGap={20}
                  />

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
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="font-medium text-gray-900 text-xs">
                <span className="text-indigo-600">+24%</span> vs last week
              </div>
              <div className="text-gray-500 text-xs">
                Last updated: Today
              </div>
            </div>
          </div>

          <div
            className="bg-white shadow-sm p-3 border border-[#F5F5F7] rounded-lg h-[300px]"
          >
            <StatsCard />
          </div>

          {/* Bottom Row - First Card: Chat Demo */}
          <div
            className="bg-white shadow-sm p-3 border border-[#F5F5F7] rounded-lg h-[300px]"
          >
            <ChatAnimation />
          </div>

          {/* Bottom Row - Second Card: Stats Card */}
          
        </div>
      </div>
    </div>
  );
}


export default BentoGrid;