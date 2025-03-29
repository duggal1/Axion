
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Mic, ChevronUp, BarChart3, Activity, Volume2, VolumeX } from "lucide-react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

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

    // Toggle mute state
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // Apply mute state to audio element if it exists
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
      console.log("Audio muted state set to:", newMutedState);

      // If we're unmuting and audio context is suspended, resume it
      if (!newMutedState && audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(err => {
          console.error("Failed to resume audio context:", err);
          setPermissionError(true);
        });
      }

      // If unmuting and paused, try to play
      if (!newMutedState && audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Failed to play on unmute:", err);
            setPermissionError(true);
          });
        }
      }
    } else {
      console.log("Audio element not yet initialized");
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
    <div className="flex flex-col h-full">
      {/* Ultra modern header with sleek design */}
      <div className="flex justify-between items-center mb-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-xs bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">Live Call</h3>
          {/* Enhanced audio control button with prominent interactive states */}
          <button
            type="button"
            onClick={toggleMute}
            className={`flex justify-center items-center p-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
              isMuted
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
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
          <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-0.5 rounded-full shadow-sm">
            <span className="font-medium text-[9px] bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{callStats.quality}% Quality</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Modern audio visualizer with clean design */}
        <div className="relative flex flex-1 justify-center items-center bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md">
          {/* Subtle background gradient */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: activeSpeaker === "agent"
                ? "radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.3), transparent 80%)"
                : "radial-gradient(circle at 70% 50%, rgba(249, 115, 22, 0.3), transparent 80%)"
            }}
          />

          {!isCallStarted && (
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center bg-white/95">
              {/* Animated background sound wave when not started */}
              <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none overflow-hidden">
                <div className="flex justify-center items-end gap-[2px]">
                  {Array.from({ length: 60 }).map((_, index) => {
                    // Create a smooth wave pattern
                    const baseHeight = Math.sin(index * 0.15) * 10 + 15;
                    const randomOffset = Math.random() * 5;
                    const height = baseHeight + randomOffset;
                    const delay = index * 0.02 % 0.5;

                    return (
                      <div
                        key={index}
                        className="rounded-t-full"
                        style={{
                          width: "3px",
                          height: `${height}px`,
                          background: `linear-gradient(to top,
                            rgba(129, 140, 248, 0.4),
                            rgba(99, 102, 241, 0.6),
                            rgba(79, 70, 229, 0.8))`,
                          boxShadow: `0 0 4px rgba(99, 102, 241, 0.3)`,
                          animation: `waveAnimation 2s ease-in-out infinite`,
                          animationDelay: `${delay}s`
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <style jsx>{`
                @keyframes waveAnimation {
                  0%, 100% { transform: scaleY(1); }
                  50% { transform: scaleY(1.2); }
                }
              `}</style>



<button
  type="button"
  onClick={startCall}
  className={`relative flex items-center gap-2 px-6 py-3 text-white rounded-full shadow-lg transition-all 
              hover:shadow-xl z-10 bg-gradient-to-bl from-amber-500 via-pink-500 to-violet-600 animate-gradient`}
>
  <Mic className="w-5 h-5" />
  <span className="text-sm font-medium">Listen to Live Call</span>
</button>
              <p className="mt-3 text-sm text-gray-400 font-medium z-10">Click to enable audio playback</p>
            </div>
          )}

          {/* Permission error message with clean styling */}
          {permissionError && (
            <div className="absolute top-3 z-30 mx-auto bg-red-50 border border-red-100 text-red-600 py-2 px-4 rounded-lg text-xs shadow-md">
              Browser blocked autoplay. Click the mute/unmute button to try again.
            </div>
          )}

          {/* Ultra modern waveform with extreme gradient effects */}
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            <div className="flex justify-center items-end h-24 gap-[2px]">
              {waveform.map((height, index) => {
                // Dynamic height calculation with smooth curve
                const position = index / waveform.length;
                const amplitudeMultiplier = 1 - 0.4 * Math.pow(Math.abs(position - 0.5) * 2, 2);
                const finalHeight = height * amplitudeMultiplier;

                // Extreme gradient effects for sound wave based on active speaker
                const gradient = activeSpeaker === "agent"
                  ? `linear-gradient(to top,
                      rgba(129, 140, 248, 0.6),
                      rgba(99, 102, 241, 0.8),
                      rgba(79, 70, 229, 1),
                      rgba(67, 56, 202, 1))`
                  : `linear-gradient(to top,
                      rgba(251, 146, 60, 0.6),
                      rgba(249, 115, 22, 0.8),
                      rgba(234, 88, 12, 1),
                      rgba(194, 65, 12, 1))`;

                return (
                  <div
                    key={index}
                    className="rounded-full"
                    style={{
                      width: "3px",
                      height: `${finalHeight}px`,
                      background: gradient,
                      boxShadow: activeSpeaker === "agent"
                        ? `0 0 6px rgba(99, 102, 241, 0.5), 0 0 2px rgba(79, 70, 229, 0.8)`
                        : `0 0 6px rgba(249, 115, 22, 0.5), 0 0 2px rgba(234, 88, 12, 0.8)`,
                      transition: "height 0.2s ease-out"
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Call participants container with clean design */}
          <div className="z-10 flex justify-center items-center gap-10">
            {/* AI Agent Avatar */}
            <div className="flex flex-col items-center">
              <div
                className={`relative flex justify-center items-center rounded-full w-14 h-14 overflow-hidden shadow-md ${
                  activeSpeaker === "agent" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                }`}
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

                {/* Modern gradient background for agent */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, #818CF8, #6366F1, #4F46E5)`,
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="font-medium text-xs text-indigo-600">Axion AI</span>

                {activeSpeaker === "agent" ? (
                  <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-full">
                    <Activity className="w-2 h-2 text-indigo-600" />
                    <span className="font-medium text-[8px] text-indigo-600">Speaking</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                    <BarChart3 className="w-2 h-2 text-gray-500" />
                    <span className="font-medium text-[8px] text-gray-500">Listening</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Connection Indicator with clean styling */}
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center bg-white p-1.5 border border-gray-100 rounded-full shadow-sm">
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex justify-center mt-2 h-14">
                <div
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
              <div
                className={`relative flex justify-center items-center rounded-full w-14 h-14 overflow-hidden shadow-md ${
                  activeSpeaker === "customer" ? "ring-2 ring-orange-100 ring-offset-2" : ""
                }`}
              >
                {/* Customer image with modern styling */}
                <Image
                  src="https://images.unsplash.com/photo-1526510747491-58f928ec870f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Customer"
                  className="absolute w-full h-full object-cover z-10"
                  height={20}
                  width={20}
                />

                {/* Subtle overlay for customer */}
                <div
                  className="absolute inset-0 z-20 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, #fb923c, #f97316, #ea580c)`,
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="font-medium text-xs text-orange-600">Customer</span>

                {activeSpeaker === "customer" ? (
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                    <Activity className="w-2 h-2 text-orange-600" />
                    <span className="font-medium text-[8px] text-orange-600">Speaking</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                    <BarChart3 className="w-2 h-2 text-gray-500" />
                    <span className="font-medium text-[8px] text-gray-500">Listening</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio file indicator with clean design */}
          <div className="absolute bottom-2 right-2 bg-white rounded-full px-3 py-1 text-[9px] font-medium border border-gray-100 shadow-sm">
            <span className={activeSpeaker === "agent" ? "text-indigo-600" : "text-orange-600"}>
              {AUDIO_SEQUENCE[currentAudioIndex].file.replace('.mp3', '')}
            </span>
          </div>
        </div>

        {/* Call Metrics with clean design */}
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