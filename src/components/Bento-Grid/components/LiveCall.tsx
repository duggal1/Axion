/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { Mic, CircleUser, ChevronUp, BarChart3, Activity, Volume2, VolumeX } from "lucide-react";
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

  // Generate waveform based on audio
  useAnimationFrame((time) => {
    // Update waveform at a lower frequency (every 2 frames)
    if (frameRef.current % 2 === 0) {
      // Create more dynamic waveform based on active speaker
      const baseHeight = activeSpeaker === "agent" ? 18 : 22;
      const variance = activeSpeaker === "agent" ? 15 : 18;

      const newWaveform = Array.from({ length: 48 }, () =>
        Math.random() * variance + baseHeight
      );
      setWaveform(newWaveform);
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
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-[#333] text-xs">Live Call</h3>
          {/* Audio control button - made larger and more clickable */}
          <button
            type="button"
            onClick={toggleMute}
            className={`flex justify-center items-center p-1.5 rounded-full transition-colors cursor-pointer ${
              isMuted
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700'
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
          <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
            <span className="font-medium text-[8px] text-green-600">{callStats.quality}% Quality</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Modern Audio Visualizer */}
        <div className="relative flex flex-1 justify-center items-center bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          {!isCallStarted && (
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center bg-white bg-opacity-90">
              <button
                type="button"
                onClick={startCall}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-colors"
              >
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">Start Call</span>
              </button>
              <p className="mt-2 text-xs text-gray-500">Click to enable audio playback</p>
            </div>
          )}

          {/* Permission error message */}
          {permissionError && (
            <div className="absolute top-2 left-0 right-0 mx-auto z-30 bg-red-50 border border-red-200 text-red-600 py-1 px-3 rounded-md text-xs w-fit">
              Browser blocked autoplay. Click the mute/unmute button to try again.
            </div>
          )}

          {/* Super modern waveform */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="flex justify-center items-end gap-[1px] h-16">
              {waveform.map((height, index) => {
                // Create a dynamic, organic pattern
                const finalHeight = Math.sin(index * 0.2) * 8 + height;

                // Advanced gradient definition based on active speaker
                const gradient = activeSpeaker === "agent"
                  ? `linear-gradient(to top, #6366F120, #6366F180, #4F46E5)`
                  : `linear-gradient(to top, #F9731620, #F97316A0, #EA580C)`;

                return (
                  <motion.div
                    key={index}
                    className="rounded-t-full"
                    style={{
                      width: "1.5px",
                      height: `${finalHeight}px`,
                      background: gradient,
                      boxShadow: '0 0 2px rgba(99, 102, 241, 0.2)'
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
                ? "radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.05), transparent 70%)"
                : "radial-gradient(circle at 70% 50%, rgba(249, 115, 22, 0.05), transparent 70%)"
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Audio file indicator */}
          <div className="absolute bottom-1 right-1 bg-white bg-opacity-90 rounded-full px-2 py-0.5 text-[8px] font-medium text-gray-600 border border-gray-100 shadow-sm">
            <span className={`${activeSpeaker === "agent" ? "text-indigo-600" : "text-orange-600"}`}>
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