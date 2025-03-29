/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { Mic, CircleUser, ChevronUp, BarChart3, Activity } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function LiveCall() {
  const [waveform, setWaveform] = useState<number[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<"agent" | "customer">("agent");
  const frameRef = useRef(0);
  
  // More efficient animation with useAnimationFrame
  useAnimationFrame((time) => {
    // Update waveform at a lower frequency (every 2 frames)
    if (frameRef.current % 2 === 0) {
      const newWaveform = Array.from({ length: 48 }, () => Math.random() * 20 + 2);
      setWaveform(newWaveform);
    }
    
    // Switch active speaker every 150 frames (about 2.5 seconds)
    if (frameRef.current % 150 === 0) {
      setActiveSpeaker(prev => prev === "agent" ? "customer" : "agent");
    }
    
    frameRef.current += 1;
  });

  // Generate call stats
  const callStats = {
    time: "02:45",
    quality: Math.floor(Math.random() * 20 + 80)
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-[#333] text-xs">Live Call</h3>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[10px] text-gray-500">{callStats.time}</span>
          <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
            <span className="font-medium text-[8px] text-green-600">{callStats.quality}% Quality</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        {/* Modern Audio Visualizer */}
        <div className="relative flex flex-1 justify-center items-center bg-gradient-to-r from-[#F5F7FF] via-white to-[#F5F7FF] border border-[#F0F0F5] rounded-lg overflow-hidden">
          {/* Super modern waveform */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="flex justify-center items-end gap-[1px] h-16">
              {waveform.map((height, index) => {
                // Create a dynamic, organic pattern
                const finalHeight = Math.sin(index * 0.2) * 8 + height;
                
                // Advanced gradient definition based on active speaker
                const gradient = activeSpeaker === "agent" 
                  ? `linear-gradient(to top, #6366F150, #6930C390, #5E60CE)` 
                  : `linear-gradient(to top, #F8717150, #F59E0B90, #F97316)`;
                
                return (
                  <motion.div
                    key={index}
                    className="rounded-t-full"
                    style={{
                      width: "1.5px",
                      height: `${finalHeight}px`,
                      background: gradient,
                      boxShadow: '0 0 2px rgba(99, 102, 241, 0.3)'
                    }}
                    animate={{
                      height: `${finalHeight}px`,
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 0.15,
                      ease: "easeOut"
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Call participants container */}
          <div className="z-10 flex justify-center items-center gap-6">
            {/* AI Agent Avatar */}
            <div className="flex flex-col items-center">
              <div 
                className={`relative flex justify-center items-center rounded-full w-10 h-10 overflow-hidden shadow-md ${
                  activeSpeaker === "agent" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                }`}
              >
                {/* Ultra modern gradient for agent - Stylish monochrome blue-violet */}
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, #818CF8, #6366F1, #4F46E5)`,
                    backgroundSize: "200% 200%"
                  }}
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <CircleUser className="drop-shadow-md w-5 h-5 text-white" />
                
                {activeSpeaker === "agent" && (
                  <motion.div
                    className="absolute inset-0 bg-indigo-500 opacity-10"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              
              <div className="flex flex-col items-center gap-0.5 mt-1">
                <span className="font-medium text-[8px] text-gray-800">Axion AI</span>
                
                {activeSpeaker === "agent" ? (
                  <div className="flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Activity className="w-1.5 h-1.5 text-indigo-600" />
                    </motion.div>
                    <span className="font-medium text-[6px] text-indigo-600">Speaking</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-full">
                    <BarChart3 className="w-1.5 h-1.5 text-gray-500" />
                    <span className="font-medium text-[6px] text-gray-500">Listening</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Middle Connection Indicator */}
            <div className="flex flex-col items-center">
              <motion.div 
                className="flex justify-center items-center bg-white shadow-sm p-1 border border-gray-100 rounded-full"
                animate={{ 
                  y: [0, -3, 0],
                  boxShadow: [
                    "0 1px 2px rgba(0,0,0,0.05)",
                    "0 4px 6px rgba(0,0,0,0.1)",
                    "0 1px 2px rgba(0,0,0,0.05)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronUp className="w-3 h-3 text-gray-400" />
              </motion.div>
              
              <div className="flex justify-center mt-1 h-10">
                <motion.div 
                  className="rounded-full w-0.5"
                  style={{
                    background: "linear-gradient(to bottom, #6366F1, #F97316)"
                  }}
                  animate={{
                    height: ["60%", "90%", "60%"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
            
            {/* Customer Avatar */}
            <div className="flex flex-col items-center">
              <div 
                className={`relative flex justify-center items-center rounded-full w-10 h-10 overflow-hidden shadow-md ${
                  activeSpeaker === "customer" ? "ring-2 ring-orange-500 ring-offset-2" : ""
                }`}
              >
                {/* Ultra modern gradient for customer - Stylish monochrome orange */}
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, #FCD34D, #F97316, #EA580C)`,
                    backgroundSize: "200% 200%"
                  }}
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                
                <CircleUser className="drop-shadow-md w-5 h-5 text-white" />
                
                {activeSpeaker === "customer" && (
                  <motion.div
                    className="absolute inset-0 bg-orange-500 opacity-10"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              
              <div className="flex flex-col items-center gap-0.5 mt-1">
                <span className="font-medium text-[8px] text-gray-800">Customer</span>
                
                {activeSpeaker === "customer" ? (
                  <div className="flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded-full">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Activity className="w-1.5 h-1.5 text-orange-600" />
                    </motion.div>
                    <span className="font-medium text-[6px] text-orange-600">Speaking</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-full">
                    <BarChart3 className="w-1.5 h-1.5 text-gray-500" />
                    <span className="font-medium text-[6px] text-gray-500">Listening</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Dynamic background pulse effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: activeSpeaker === "agent" 
                ? "radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.08), transparent 70%)"
                : "radial-gradient(circle at 70% 50%, rgba(249, 115, 22, 0.08), transparent 70%)"
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        {/* Call Metrics */}
        <div className="gap-1.5 grid grid-cols-3 mt-2">
          {[
            { label: 'Sentiment', value: '92%', color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Engagement', value: '87%', color: 'bg-blue-50 text-blue-600' },
            { label: 'Conversion', value: '76%', color: 'bg-green-50 text-green-600' }
          ].map((metric) => (
            <div 
              key={metric.label}
              className="flex flex-col items-center bg-white p-1.5 border border-gray-100 rounded-md"
            >
              <div className={`px-2 py-0.5 rounded-full mb-0.5 ${metric.color}`}>
                <span className="font-medium text-[8px]">{metric.value}</span>
              </div>
              <span className="text-[7px] text-gray-500">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}