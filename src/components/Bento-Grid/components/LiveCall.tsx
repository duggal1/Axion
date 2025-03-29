/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {  ChevronUp, BarChart3, Activity, Volume2, VolumeX, Headphones } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define audio file sequence
const AUDIO_SEQUENCE = [
  { file: "client-convo-1.mp3", speaker: "customer" },
  { file: "agent-convo-1.mp3", speaker: "agent" },
  { file: "client-convo-2.mp3", speaker: "customer" },
  { file: "agent-convo-2.mp3", speaker: "agent" },
  { file: "client-convo-3.mp3", speaker: "customer" },
  { file: "agent-convo-3.mp3", speaker: "agent" },
  { file: "client-convo-4.mp3", speaker: "customer" },
  { file: "agent-convo-4.mp3", speaker: "agent" },
];

export function LiveCall() {
  const [waveform, setWaveform] = useState<number[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<"agent" | "customer">("customer");
  const [isMuted, setIsMuted] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  // Create a single audio context for the entire conversation
  const initializeAudioContext = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        // Create AudioContext on user interaction
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      return true;
    } catch (err) {
      console.error("Failed to initialize audio context:", err);
      setPermissionError(true);
      return false;
    }
  }, []);

  // Load all audio files at once and chain them together
  const setupAudioChain = useCallback(async () => {
    if (!audioContextRef.current) return false;

    try {
      console.log("Setting up audio chain");
      const audioContext = audioContextRef.current;

      // Start with the first audio
      const firstAudio = AUDIO_SEQUENCE[0];

      if (!audioRef.current) {
        // Create new audio element
        audioRef.current = new Audio();
        audioRef.current.src = `/audio/${firstAudio.file}`;
        audioRef.current.muted = isMuted;
        audioRef.current.crossOrigin = "anonymous";

        // Connect the audio element to the audio context
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(audioContext.destination);

        // Set up the ended event to change to the next audio in sequence
        audioRef.current.addEventListener('ended', () => {
          // Get the current index from state to ensure we're using the latest value
          setCurrentAudioIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % AUDIO_SEQUENCE.length;
            console.log(`Audio ended, moving from index ${prevIndex} to ${nextIndex}`);

            // Update active speaker based on the next audio
            setActiveSpeaker(AUDIO_SEQUENCE[nextIndex].speaker as "agent" | "customer");

            // Change source and play
            if (audioRef.current) {
              // Wait a short delay before loading and playing the next audio
              // This prevents the AbortError from interrupted play requests
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.src = `/audio/${AUDIO_SEQUENCE[nextIndex].file}`;
                  audioRef.current.muted = isMuted;

                  // Use the existing user interaction permission to play next audio
                  const playPromise = audioRef.current.play();

                  if (playPromise !== undefined) {
                    playPromise.catch(error => {
                      console.error("Playback error:", error);
                      setPermissionError(true);
                    });
                  }
                }
              }, 50);
            }

            return nextIndex;
          });
        });
      } else {
        // Reset existing audio
        audioRef.current.src = `/audio/${firstAudio.file}`;
        audioRef.current.muted = isMuted;
      }

      // Initial play (will be triggered by user interaction)
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        await playPromise;
        console.log("Audio chain started successfully");
        setPermissionError(false);
        return true;
      }

    } catch (err) {
      console.error("Error setting up audio chain:", err);
      setPermissionError(true);
    }
    
    return false;
  }, [isMuted]);

  // Start the call - this will be triggered by user interaction
  const startCall = useCallback(() => {
    console.log("Starting call...");
    setIsCallStarted(true);
    setPermissionError(false);

    // Initialize audio context with user gesture
    if (initializeAudioContext()) {
      // Set up and start the audio chain
      setupAudioChain();
    }
  }, [initializeAudioContext, setupAudioChain]);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    console.log("Toggle mute clicked, current state:", isMuted);

    // If call not started, start it first
    if (!isCallStarted) {
      startCall();
      setIsMuted(false);
      return;
    }

    // Toggle mute state
    setIsMuted(prevState => {
      const newMutedState = !prevState;
      
      // Apply mute state to audio element if it exists
      if (audioRef.current) {
        // Just update the muted state - no need to restart playback
        audioRef.current.muted = newMutedState;
        console.log("Audio muted state set to:", newMutedState);

        // If we're unmuting and audio context is suspended, resume it
        if (!newMutedState && audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(err => {
            console.error("Failed to resume audio context:", err);
            setPermissionError(true);
          });
        }
      } else {
        console.log("Audio element not yet initialized");
      }
      
      return newMutedState;
    });
  }, [isCallStarted, startCall]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => {
          console.error("Error closing audio context:", err);
        });
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate optimized waveform with less frequent updates
  useEffect(() => {
    let frameCount = 0;
    const updateWaveform = (time: number) => {
      // Update waveform at a lower frequency (every 4 frames) for better performance
      if (frameCount % 4 === 0) {
        const waveCount = 40; // Reduced number of bars for better performance

        // Create modern dynamic waveform based on active speaker
        const baseAmplitude = activeSpeaker === "agent" ? 18 : 22;
        const variance = activeSpeaker === "agent" ? 15 : 18;
        const phase = time / 1000; // Time-based phase for animation

        const newWaveform = Array.from({ length: waveCount }, (_, i) => {
          // Simplified waveform calculation for better performance
          const position = i / waveCount;
          const primaryWave = Math.sin(position * Math.PI * 4 + phase) * variance * 0.5;

          // Combine waves with base amplitude and minimal randomness
          return baseAmplitude + primaryWave + (Math.random() * 2);
        });

        setWaveform(newWaveform);
      }

      frameCount++;
      animationRef.current = requestAnimationFrame(updateWaveform);
    };

    animationRef.current = requestAnimationFrame(updateWaveform);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeSpeaker]);

  // Generate call stats with precise values for modern UI
  const callStats = {
    time: "02:45",
    quality: Math.floor(Math.random() * 20 + 80)
  };

  return (
    <div className="flex flex-col h-full font-serif">
      {/* Modern header with sleek design */}
      <div className="flex justify-between items-center bg-white shadow-sm mb-3 px-3 py-2 border border-gray-100 rounded-lg">
        <div className="flex items-center gap-3">
          <h3 className="bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 font-serif text-transparent text-xs">Live Call</h3>
          
          {/* Enhanced audio control button with prominent interactive states */}
          <motion.button
            type="button"
            onClick={toggleMute}
            whileHover={{ scale: 1.05, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.95 }}
            className={`flex justify-center items-center p-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
              isMuted
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 hover:from-indigo-100 hover:to-indigo-200'
            }`}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[10px] text-gray-500">{callStats.time}</span>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm px-2 py-0.5 rounded-full"
          >
            <span className="bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 font-serif text-[9px] text-transparent">{callStats.quality}% Quality</span>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Modern audio visualizer with clean design */}
        <div className="relative flex flex-1 justify-center items-center bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-100 rounded-xl overflow-hidden">
          {/* Subtle background gradient */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: activeSpeaker === "agent"
                ? "radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.4), transparent 80%)"
                : "radial-gradient(circle at 70% 50%, rgba(249, 115, 22, 0.4), transparent 80%)"
            }}
          />

          <AnimatePresence>
            {!isCallStarted && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="z-20 absolute inset-0 flex flex-col justify-center items-center bg-white/50 backdrop-blur-md"
              >
                {/* Enhanced animated background sound wave when not started */}
                <div className="absolute inset-0 flex justify-center items-center opacity-30 overflow-hidden pointer-events-none">
                  <div className="flex justify-center items-end gap-[2px]">
                    {Array.from({ length: 80 }).map((_, index) => {
                      // Create a smooth wave pattern with more variance
                      const baseHeight = Math.sin(index * 0.1) * 15 + 25;
                      const randomOffset = Math.random() * 8;
                      const height = baseHeight + randomOffset;
                      const delay = index * 0.01 % 0.8;
                      const width = 2 + Math.random() * 2;

                      return (
                        <motion.div
                          key={index}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: [`${height * 0.8}px`, `${height}px`, `${height * 0.9}px`],
                            opacity: [0.7, 1, 0.8]
                          }}
                          transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: delay
                          }}
                          className="rounded-t-full"
                          style={{
                            width: `${width}px`,
                            background: `linear-gradient(to top,
                              rgba(129, 140, 248, 0.4),
                              rgba(99, 102, 241, 0.6),
                              rgba(79, 70, 229, 0.8))`,
                            boxShadow: `0 0 6px rgba(99, 102, 241, 0.4)`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={startCall}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 35px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="z-10 relative flex items-center gap-2 bg-gradient-to-bl from-amber-500 via-pink-500 to-violet-600 shadow-xl px-8 py-4 rounded-full text-white"
                  style={{
                    backgroundSize: "300% 300%",
                    animation: "gradientAnimation 4s linear infinite"
                  }}
                >
                  <Headphones className="w-5 h-5" />
                  <span className="font-serif font-medium text-sm">Listen to Live Call</span>
                  
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-amber-400 via-pink-400 to-violet-500 opacity-50 blur-md rounded-full"></div>
                </motion.button>
                <p className="z-10 mt-4 font-serif font-medium text-gray-600 text-sm">Click to enable audio playback</p>

                <style jsx>{`
                  @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                `}</style>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Permission error message with clean styling */}
          <AnimatePresence>
            {permissionError && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="top-3 z-30 absolute bg-red-50 shadow-lg mx-auto px-5 py-2.5 border border-red-100 rounded-lg font-serif text-red-600 text-xs"
              >
                Browser blocked autoplay. Click the mute/unmute button to try again.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ultra modern waveform with extreme gradient effects */}
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            <div className="flex justify-center items-end gap-[1px] h-32">
              {waveform.map((height, index) => {
                // Dynamic height calculation with smooth curve
                const position = index / waveform.length;
                const amplitudeMultiplier = 1 - 0.3 * Math.pow(Math.abs(position - 0.5) * 2, 2);
                const finalHeight = height * amplitudeMultiplier;

                // Ultra modern gradient for sound wave based on active speaker with enhanced colors
                const gradient = activeSpeaker === "agent"
                  ? `linear-gradient(to top,
                      rgba(129, 140, 248, 0.7),
                      rgba(99, 102, 241, 0.85),
                      rgba(79, 70, 229, 1),
                      rgba(67, 56, 202, 1))`
                  : `linear-gradient(to top,
                      rgba(251, 146, 60, 0.7),
                      rgba(249, 115, 22, 0.85),
                      rgba(234, 88, 12, 1),
                      rgba(194, 65, 12, 1))`;

                // Determine if this is a primary or secondary bar for varied styling
                const isPrimary = index % 3 === 0;
                const barWidth = isPrimary ? "4px" : "2.5px";
                const marginRight = index % 4 === 0 ? "1.5px" : "0.5px";
                
                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ 
                      height: finalHeight,
                      opacity: [0.7, 0.9, 0.7],
                      scale: isPrimary ? [1, 1.05, 1] : [1, 1.02, 1],
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 10,
                      opacity: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.02 % 0.5
                      }
                    }}
                    className="backdrop-blur-sm rounded-full"
                    style={{
                      width: barWidth,
                      background: gradient,
                      boxShadow: activeSpeaker === "agent"
                        ? `0 0 10px rgba(99, 102, 241, 0.6), 0 0 4px rgba(79, 70, 229, 0.9)`
                        : `0 0 10px rgba(249, 115, 22, 0.6), 0 0 4px rgba(234, 88, 12, 0.9)`,
                      marginRight: marginRight,
                      filter: `saturate(1.2) brightness(1.05)`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Improved glass reflection effect for waveform */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="top-0 absolute inset-x-0 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-[1px] h-16"></div>
            <div className="bottom-0 absolute inset-x-0 bg-gradient-to-t from-white/30 to-transparent backdrop-blur-[1px] h-10"></div>
            {/* Side lighting effects */}
            <div className="left-0 absolute inset-y-0 bg-gradient-to-r from-white/20 to-transparent w-16"></div>
            <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-white/20 to-transparent w-16"></div>
          </div>

          {/* Call participants container with clean design */}
          <div className="z-10 flex justify-center items-center gap-10">
            {/* AI Agent Avatar */}
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`relative flex justify-center items-center rounded-full w-16 h-16 overflow-hidden shadow-md ${
                  activeSpeaker === "agent" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                }`}
              >
                {/* Agent image */}
                <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                  <Image
                    src="https://raw.githubusercontent.com/duggal1/Axion/refs/heads/main/public/icons/axion-logo.png"
                    alt="Axion AI Agent"
                    className="z-10 w-10 h-10 object-contain"
                    height={10}
                    width={10}
                  />
                </div>

                {/* Modern gradient background for agent */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, #3B82F6, #8B5CF6, #93C5FD)`,
                  }}
                />
              </motion.div>

              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="font-serif font-medium text-indigo-600 text-xs">Axion AI</span>

                {activeSpeaker === "agent" ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-full"
                  >
                    <Activity className="w-2 h-2 text-indigo-600" />
                    <span className="font-serif font-medium text-[8px] text-indigo-600">Speaking</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full"
                  >
                    <BarChart3 className="w-2 h-2 text-gray-500" />
                    <span className="font-serif font-medium text-[8px] text-gray-500">Listening</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Middle Connection Indicator with clean styling */}
            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ 
                  y: [0, -3, 0],
                  boxShadow: ["0px 0px 0px rgba(0,0,0,0.1)", "0px 4px 8px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0.1)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center items-center bg-white shadow-sm p-1.5 border border-gray-100 rounded-full"
              >
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </motion.div>

              <div className="flex justify-center mt-2 h-14">
                <motion.div
                  animate={{ 
                    boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 8px rgba(99,102,241,0.5)", "0px 0px 0px rgba(0,0,0,0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="rounded-full w-1"
                  style={{
                    height: "70%",
                    background: "linear-gradient(to bottom, #6366f1, #f97316)"
                  }}
                />
              </div>
            </div>

            {/* Customer Avatar */}
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`relative flex justify-center items-center rounded-full w-16 h-16 overflow-hidden shadow-md ${
                  activeSpeaker === "customer" ? "ring-2 ring-orange-100 ring-offset-2" : ""
                }`}
              >
                {/* Customer image with modern styling */}
                <Image
                  src="https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Customer"
                  className="z-10 absolute w-full h-full object-cover"
                  height={20}
                  width={20}
                />

                {/* Subtle overlay for customer */}
                <div
                  className="z-20 absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, #3B82F6, #8B5CF6, #93C5FD)`,
                  }}
                />
              </motion.div>

              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="font-serif font-medium text-orange-600 text-xs">Customer</span>

                {activeSpeaker === "customer" ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full"
                  >
                    <Activity className="w-2 h-2 text-orange-600" />
                    <span className="font-serif font-medium text-[8px] text-orange-600">Speaking</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full"
                  >
                    <BarChart3 className="w-2 h-2 text-gray-500" />
                    <span className="font-serif font-medium text-[8px] text-gray-500">Listening</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Audio file indicator with sleek design */}
          <div className="right-2 bottom-2 absolute bg-white/90 shadow-sm backdrop-blur-sm px-3 py-1 border border-gray-100 rounded-full font-serif font-medium text-[9px]">
            <span className={activeSpeaker === "agent" ? "text-indigo-600" : "text-orange-600"}>
              {AUDIO_SEQUENCE[currentAudioIndex].file.replace('.mp3', '')}
            </span>
          </div>
        </div>

        {/* Call Metrics with modern design */}
        <div className="gap-1.5 grid grid-cols-3 mt-2">
          {[
            { label: 'Sentiment', value: '92%', color: 'bg-indigo-50 text-indigo-600', gradient: 'from-indigo-600 to-indigo-500' },
            { label: 'Engagement', value: '87%', color: 'bg-blue-50 text-blue-600', gradient: 'from-blue-600 to-blue-500' },
            { label: 'Conversion', value: '76%', color: 'bg-green-50 text-green-600', gradient: 'from-green-600 to-green-500' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col items-center bg-gradient-to-br from-white to-gray-50 shadow-sm p-1.5 border border-gray-100 rounded-md"
            >
              <div className={`px-2 py-0.5 rounded-full mb-0.5 ${metric.color}`}>
                <span className={`font-serif font-medium text-[8px] bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>{metric.value}</span>
              </div>
              <span className="font-serif text-[7px] text-gray-500">{metric.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}