
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { Mic, CircleUser, ChevronUp, BarChart3, Activity, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";

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
  const frameRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Create a single audio context for the entire conversation
  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      // Create AudioContext on user interaction
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Load all audio files at once and chain them together
  const setupAudioChain = useCallback(async () => {
    if (!audioContextRef.current) return;

    try {
      console.log("Setting up audio chain");
      const audioContext = audioContextRef.current;

      // Start with the first audio
      const firstAudio = AUDIO_SEQUENCE[0];

      if (!audioRef.current) {
        audioRef.current = new Audio(`/audio/${firstAudio.file}`);
        audioRef.current.muted = false;

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
              audioRef.current.src = `/audio/${AUDIO_SEQUENCE[nextIndex].file}`;

              // Use the existing user interaction permission to play next audio
              const playPromise = audioRef.current.play();

              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error("Playback error:", error);
                  setPermissionError(true);
                });
              }
            }

            return nextIndex;
          });
        });
      }

      // Initial play (will be triggered by user interaction)
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Audio chain started successfully");
          setPermissionError(false);
        }).catch(error => {
          console.error("Initial playback error:", error);
          setPermissionError(true);
        });
      }

    } catch (err) {
      console.error("Error setting up audio chain:", err);
      setPermissionError(true);
    }
  }, []);

  // Start the call - this will be triggered by user interaction
  const startCall = useCallback(() => {
    console.log("Starting call...");
    setIsCallStarted(true);
    setPermissionError(false);
    
    // Initialize audio context with user gesture
    initializeAudioContext();
    
    // Set up and start the audio chain
    setupAudioChain();
    
  }, [initializeAudioContext, setupAudioChain]);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    console.log("Toggle mute clicked, current state:", isMuted);

    // If call not started, start it first
    if (!isCallStarted) {
      startCall();
      return;
    }

    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;
      
      // If we're unmuting and audio context is suspended, resume it
      if (!newMutedState && audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(err => {
          console.error("Failed to resume audio context:", err);
          setPermissionError(true);
        });
      }
      
      // If unmuting and paused, try to play
      if (!newMutedState && audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.error("Failed to play on unmute:", err);
          setPermissionError(true);
        });
      }
    }
  }, [isMuted, isCallStarted, startCall]);

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
    };
  }, []);

  // Generate dynamic waveform with awesome effects
  useAnimationFrame((time) => {
    // Update waveform at a lower frequency (every 2 frames)
    if (frameRef.current % 2 === 0) {
      const waveCount = 80; // More bars for smoother waves
      
      // Create ultra-modern dynamic waveform based on active speaker
      const baseAmplitude = activeSpeaker === "agent" ? 18 : 22;
      const variance = activeSpeaker === "agent" ? 15 : 18;
      const frequency = activeSpeaker === "agent" ? 0.12 : 0.15;
      const phase = time / 1000; // Time-based phase for animation
      
      const newWaveform = Array.from({ length: waveCount }, (_, i) => {
        // Complex waveform with multiple sine waves for organic feel
        const position = i / waveCount;
        const primaryWave = Math.sin(position * Math.PI * 4 + phase) * variance * 0.5;
        const secondaryWave = Math.sin(position * Math.PI * 8 + phase * 1.5) * variance * 0.3;
        const tertiaryWave = Math.sin(position * Math.PI * 16 + phase * 0.7) * variance * 0.2;
        
        // Combine waves with base amplitude and add randomness for natural look
        return baseAmplitude + primaryWave + secondaryWave + tertiaryWave + (Math.random() * 3);
      });
      
      setWaveform(newWaveform);
    }

    frameRef.current += 1;
  });

  // Generate call stats with precise values for modern UI
  const callStats = {
    time: "02:45",
    quality: Math.floor(Math.random() * 20 + 80)
  };

  return (
    <div className="flex flex-col h-full">
      {/* Ultra modern header with glass effect */}
      <div className="flex justify-between items-center mb-2 px-1 backdrop-blur-sm bg-white/70 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-xs bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Live Call</h3>
          {/* Audio control button with modern interactive states */}
          <button
            type="button"
            onClick={toggleMute}
            className={`flex justify-center items-center p-2 rounded-full transition-all duration-300 cursor-pointer ${
              isMuted
                ? 'bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 hover:shadow-md'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 hover:shadow-md'
            }`}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[10px] text-gray-500">{callStats.time}</span>
          <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-50 px-2 py-0.5 rounded-full shadow-sm">
            <span className="font-medium text-[9px] bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{callStats.quality}% Quality</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Ultra modern audio visualizer with glass effect and smooth gradients */}
        <div className="relative flex flex-1 justify-center items-center bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl overflow-hidden shadow-lg">
          {/* Dynamic background gradient */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{
              background: activeSpeaker === "agent"
                ? "radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.3), transparent 80%)"
                : "radial-gradient(circle at 70% 50%, rgba(249, 115, 22, 0.3), transparent 80%)"
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-5" />

          {!isCallStarted && (
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center backdrop-blur-sm bg-white/80">
              <motion.button
                type="button"
                onClick={startCall}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-full shadow-lg transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Mic className="w-5 h-5" />
                <span className="text-sm font-medium">Start Audio</span>
              </motion.button>
              <p className="mt-3 text-xs text-gray-500 font-medium">Click to enable audio playback</p>
              
              {/* Background waveform when audio not playing */}
              <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
                <div className="flex justify-center items-end gap-[2px]">
                  {Array.from({ length: 80 }).map((_, index) => {
                    const height = Math.sin(index * 0.15) * 10 + 5;
                    
                    return (
                      <motion.div
                        key={index}
                        className="rounded-t-full bg-gradient-to-t from-indigo-200 via-indigo-400 to-indigo-600"
                        style={{
                          width: "2px",
                          height: `${height}px`,
                          opacity: 0.7
                        }}
                        animate={{
                          height: [`${height}px`, `${height + Math.random() * 5}px`, `${height}px`],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.02
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Permission error message with modern styling */}
          {permissionError && (
            <motion.div 
              className="absolute top-3 z-30 mx-auto bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-red-600 py-2 px-4 rounded-lg text-xs shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Browser blocked autoplay. Click the mute/unmute button to try again.
            </motion.div>
          )}

          {/* Ultra modern waveform with advanced gradient effects */}
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            <div className="flex justify-center items-end h-24 gap-[1px]">
              {waveform.map((height, index) => {
                // Dynamic height calculation with organic feel
                const position = index / waveform.length;
                const amplitudeMultiplier = 1 - 0.4 * Math.pow(Math.abs(position - 0.5) * 2, 2); // Parabolic amplitude
                const finalHeight = height * amplitudeMultiplier;
                
                // Advanced dynamic gradient based on active speaker
                const gradient = activeSpeaker === "agent"
                  ? `linear-gradient(to top, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.6) 50%, rgba(79, 70, 229, 0.9))`
                  : `linear-gradient(to top, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.6) 50%, rgba(234, 88, 12, 0.9))`;
                
                // Subtle glow effect
                const glowColor = activeSpeaker === "agent" ? "rgba(99, 102, 241, 0.5)" : "rgba(249, 115, 22, 0.5)";
                
                return (
                  <motion.div
                    key={index}
                    className="rounded-full backdrop-blur-sm"
                    style={{
                      width: "1.5px",
                      height: `${finalHeight}px`,
                      background: gradient,
                      boxShadow: `0 0 3px ${glowColor}`,
                    }}
                    animate={{
                      height: [`${finalHeight}px`, `${finalHeight * (0.8 + Math.random() * 0.4)}px`, `${finalHeight}px`],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut",
                      delay: index * 0.01 % 0.2
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Call participants container with modern glass card effect */}
          <div className="z-10 flex justify-center items-center gap-10">
            {/* AI Agent Avatar */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`relative flex justify-center items-center rounded-full w-14 h-14 overflow-hidden shadow-xl ${
                  activeSpeaker === "agent" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                animate={activeSpeaker === "agent" ? {
                  boxShadow: ["0 10px 15px -3px rgba(79, 70, 229, 0.3)", "0 15px 25px -5px rgba(79, 70, 229, 0.5)", "0 10px 15px -3px rgba(79, 70, 229, 0.3)"]
                } : {}}
                transition={{ duration: 2, repeat: activeSpeaker === "agent" ? Infinity : 0 }}
              >
                {/* Agent image */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <Image 
                    src="https://raw.githubusercontent.com/duggal1/Axion/refs/heads/main/public/icons/axion-logo.png" 
               
                   
                    alt="Axion AI Agent" 
                    className="w-10 h-10 object-contain z-10"
                    height={10}
                    width={10}
                  />
                </div>

                {/* Ultra modern gradient background for agent */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, #818CF8, #6366F1, #4F46E5)`,
                    backgroundSize: "400% 400%"
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {activeSpeaker === "agent" && (
                  <motion.div
                    className="absolute inset-0 bg-indigo-500 opacity-10"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="font-medium text-xs bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Axion AI</span>

                {activeSpeaker === "agent" ? (
                  <motion.div 
                    className="flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-indigo-50 px-2 py-1 rounded-full shadow-sm"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Activity className="w-2 h-2 text-indigo-600" />
                    </motion.div>
                    <span className="font-medium text-[8px] text-indigo-600">Speaking</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full shadow-sm">
                    <BarChart3 className="w-2 h-2 text-gray-500" />
                    <span className="font-medium text-[8px] text-gray-500">Listening</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Connection Indicator with futuristic styling */}
            <div className="flex flex-col items-center">
              <motion.div
                className="flex justify-center items-center bg-white/90 backdrop-blur-sm p-1.5 border border-gray-100 rounded-full shadow-md"
                animate={{
                  y: [0, -4, 0],
                  boxShadow: [
                    "0 2px 4px rgba(0,0,0,0.05)",
                    "0 8px 16px rgba(0,0,0,0.1)",
                    "0 2px 4px rgba(0,0,0,0.05)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </motion.div>

              <div className="flex justify-center mt-2 h-14">
                <motion.div
                  className="rounded-full w-1"
                  style={{
                    background: "linear-gradient(to bottom, rgba(99, 102, 241, 0.8), rgba(249, 115, 22, 0.8))"
                  }}
                  animate={{
                    height: ["60%", "90%", "60%"],
                    boxShadow: [
                      "0 0 3px rgba(99, 102, 241, 0.3), 0 0 3px rgba(249, 115, 22, 0.3)",
                      "0 0 8px rgba(99, 102, 241, 0.5), 0 0 8px rgba(249, 115, 22, 0.5)",
                      "0 0 3px rgba(99, 102, 241, 0.3), 0 0 3px rgba(249, 115, 22, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Customer Avatar */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`relative flex justify-center items-center rounded-full w-14 h-14 overflow-hidden shadow-xl ${
                  activeSpeaker === "customer" ? "ring-2 ring-orange-500 ring-offset-2" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                animate={activeSpeaker === "customer" ? {
                  boxShadow: ["0 10px 15px -3px rgba(234, 88, 12, 0.3)", "0 15px 25px -5px rgba(234, 88, 12, 0.5)", "0 10px 15px -3px rgba(234, 88, 12, 0.3)"]
                } : {}}
                transition={{ duration: 2, repeat: activeSpeaker === "customer" ? Infinity : 0 }}
              >
                {/* Customer image with modern styling */}
                <Image
                  src="https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Customer" 
                  className="absolute w-full h-full object-cover z-10"
                height={20}
                width={20}
                />

                {/* Gradient overlay for customer */}
                <motion.div
                  className="absolute inset-0 z-20 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, rgba(251, 146, 60, 0.7), rgba(249, 115, 22, 0.7), rgba(234, 88, 12, 0.7))`,
                    backgroundSize: "400% 400%"
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />

                {activeSpeaker === "customer" && (
                  <motion.div
                    className="absolute inset-0 z-30 bg-orange-500 opacity-10"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="font-medium text-xs bg-gradient-to-r from-orange-700 to-orange-500 bg-clip-text text-transparent">Customer</span>

                {activeSpeaker === "customer" ? (
                  <motion.div 
                    className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-orange-50 px-2 py-1 rounded-full shadow-sm"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Activity className="w-2 h-2 text-orange-600" />
                    </motion.div>
                    <span className="font-medium text-[8px] text-orange-600">Speaking</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full shadow-sm">
                    <BarChart3 className="w-2 h-2 text-gray-500" />
                    <span className="font-medium text-[8px] text-gray-500">Listening</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic background pulse effect with multi-layered gradients */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: activeSpeaker === "agent"
                ? "radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.2), transparent 70%), radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.1), transparent 70%)"
                : "radial-gradient(circle at 70% 50%, rgba(249, 115, 22, 0.2), transparent 70%), radial-gradient(circle at 30% 30%, rgba(234, 88, 12, 0.1), transparent 70%)"
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Audio file indicator with glass morphism effect */}
          <div className="absolute bottom-2 right-2 backdrop-blur-md bg-white/70 rounded-full px-3 py-1 text-[9px] font-medium border border-gray-100 shadow-md">
            <span className={`${
              activeSpeaker === "agent" 
                ? "bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent"
            }`}>
              {AUDIO_SEQUENCE[currentAudioIndex].file.replace('.mp3', '')}
            </span>
          </div>
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
              className="flex flex-col items-center bg-white p-1.5 border border-gray-100 rounded-md shadow-sm"
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