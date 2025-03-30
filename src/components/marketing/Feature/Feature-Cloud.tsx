/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Logo } from '@/components/logo'
import { Activity, Globe as GlobeIcon, MessageSquare, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
// Import Globe component for 3D globe visualization
import { Globe } from './globe'
// Define custom animations
// We'll add a style tag to define our custom animations
const CustomAnimations = () => (
    <style jsx global>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
  
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
  
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards, fadeInUp 0.4s ease-out forwards;
      }
  
      .bg-gradient-radial {
        background-image: radial-gradient(var(--tw-gradient-stops));
      }
    `}</style>
  )

// Define types for our components
interface Point {
  x: number
  y: number
}

interface Connection {
  start: Point
  end: Point
  progress: number
}

interface Message {
  id: number
  type: 'incoming' | 'outgoing'
  text: string
  time: string
}

interface AnimatedCounterProps {
  target: number
  suffix?: string
  label?: string
}

interface ChartDataItem {
  month: string
  desktop: number
  mobile: number
}

export default function FeaturesCloud() {
    return (
        <section className="px-4 py-16 md:py-32 bg-white font-serif">
            <CustomAnimations />
            <div className="mx-auto grid max-w-5xl border rounded-xl shadow-sm md:grid-cols-2 overflow-hidden">
                <div className="group relative transition-all duration-500 hover:bg-gray-50/80">
                    <div className="p-6 sm:p-12 relative z-10">
                        <span className="text-zinc-500 flex items-center gap-2 font-medium">
                            <Globe className="size-4 text-indigo-600" />
                            <span className="bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
                                Autonomous Lead Generation
                            </span>
                        </span>

                        <p className="mt-8 text-2xl font-semibold leading-tight">
                            AI agents that autonomously identify and qualify high-value prospects across global markets.
                        </p>

                        <div className="mt-4 inline-flex items-center text-sm text-indigo-600 font-medium">
                            <span>Learn more</span>
                            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div aria-hidden className="relative">
                        <div className="absolute inset-0 z-10 m-auto size-fit">
                            <div className="rounded-lg bg-white z-10 relative flex size-fit w-fit items-center gap-2 border px-3 py-1.5 text-xs font-medium shadow-sm animate-pulse">
                                <span className="text-lg">🤖</span> AI agent closed $1.2M deal in Tokyo
                            </div>
                            {/* <div className="rounded-lg bg-white absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-sm"></div> */}
                        </div>

                        <div className="relative overflow-hidden h-[200px]">
                            <div className=" z-10 absolute inset-0 "></div>
                            <Globe className="top-28" />
                        
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden border-t bg-white p-6 sm:p-12 md:border-0 md:border-l group relative transition-all duration-500 hover:bg-gray-50/80">
                    <div className="relative z-10">
                        <span className="text-zinc-500 flex items-center gap-2 font-medium">
                            <MessageSquare className="size-4 text-indigo-600" />
                            <span className="bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
                                Hyper-Personalized Outreach
                            </span>
                        </span>

                        <p className="my-6 text-2xl font-semibold leading-tight">
                            AI-driven conversations that adapt in real-time across email, voice, and messaging channels.
                        </p>

                        <div className="mb-4 inline-flex items-center text-sm text-indigo-600 font-medium">
                            <span>Learn more</span>
                            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                    <div aria-hidden className="flex flex-col gap-4">
                        <AnimatedChatMessages />
                    </div>
                </div>
                <div className="col-span-full border-t bg-gray-50/50 py-8">
                    <AnimatedMetric />
                </div>
                <div className="relative col-span-full border-t">
                    <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
                        <span className="text-zinc-500 flex items-center gap-2 font-medium">
                            <Activity className="size-4 text-indigo-600" />
                            <span className="bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
                                Revenue Intelligence
                            </span>
                        </span>

                        <p className="my-6 text-2xl font-semibold leading-tight">
                            Real-time analytics that predict deal outcomes and optimize sales strategies.
                            <span className="text-zinc-500"> Maximize conversion rates and revenue.</span>
                        </p>

                        <div className="inline-flex items-center text-sm text-indigo-600 font-medium">
                            <span>View dashboard</span>
                            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                    <AnimatedRevenueChart />
                </div>
            </div>
        </section>
    )
}

// 3D Globe Component with endless motion
// This replaces the static map with a more engaging 3D visualization
const AnimatedGlobeMap = () => {
    // Extremely optimized configuration for maximum performance
    const globeConfig = {
        width: 600, // Smaller size for better performance
        height: 600, // Smaller size for better performance
        devicePixelRatio: 1.0, // Minimum for extreme performance
        phi: 0,
        theta: 0.3,
        dark: 0,
        diffuse: 0.4,
        mapSamples: 8000, // Reduced for better performance
        mapBrightness: 1.2,
        baseColor: [1, 1, 1],
        markerColor: [99/255, 102/255, 241/255], // Indigo color
        glowColor: [1, 1, 1],
        markers: [
            // Reduced number of markers for better performance
            { location: [40.7128, -74.006], size: 0.1 },  // New York
            { location: [51.5074, -0.1278], size: 0.09 },  // London
            { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
            { location: [1.3521, 103.8198], size: 0.07 },  // Singapore
            { location: [-23.5505, -46.6333], size: 0.07 }, // São Paulo
        ],
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Add a subtle glow effect behind the globe */}
            <div
                className="absolute inset-0 bg-gradient-radial from-indigo-100/30 to-transparent"
                style={{
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: '50%',
                    width: '150%',
                    height: '150%',
                    zIndex: 0
                }}
            />

            {/* The 3D Globe with endless rotation */}
            <Globe
                config={globeConfig}
                className="z-10"
            />

            {/* Add a notification that appears to float over the globe */}
            <div
                className="absolute top-1/4 right-1/4 z-20 transform -translate-y-1/2 translate-x-1/2"
                style={{
                    animation: 'float 6s ease-in-out infinite'
                }}
            >
                <div className="rounded-lg bg-white flex items-center gap-2 border px-3 py-1.5 text-xs font-medium shadow-md">
                    <span className="text-lg">🤖</span> AI agent closed $1.2M deal in Tokyo
                </div>
            </div>

            {/* Add floating animation */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(-50%) translateX(50%) translateZ(0); }
                    50% { transform: translateY(-60%) translateX(45%) translateZ(0); }
                    100% { transform: translateY(-50%) translateX(50%) translateZ(0); }
                }
            `}</style>
        </div>
    )
}

// Animated Chat Messages Component
const AnimatedChatMessages = () => {
    // Optimized image URLs with smaller sizes for better performance
    const clientAvatarUrl = "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=70&w=150&auto=format&fit=crop"
    const axionAvatarUrl = "https://raw.githubusercontent.com/duggal1/Axion/refs/heads/main/public/icons/axion-logo.png"

    // Pre-define all messages to avoid state changes and re-renders
    const allMessages: Message[] = [
        {
            id: 1,
            type: 'incoming',
            text: "I need an AI solution to boost our sales team performance. What makes your agentic AI different?",
            time: 'Yesterday'
        },
        {
            id: 2,
            type: 'outgoing',
            text: 'Our agentic AI sales platform autonomously qualifies leads, personalizes outreach, and closes deals with 4.2x higher conversion rates.',
            time: '10:46 AM'
        },
        {
            id: 3,
            type: 'incoming',
            text: "That's exactly what we need. How quickly can we see results?",
            time: '10:53 AM'
        },
        {
            id: 4,
            type: 'outgoing',
            text: 'Most clients see significant pipeline growth within 14 days of deployment. Our AI agents work 24/7 across all time zones.',
            time: '10:55 AM'
        },
        {
            id: 5,
            type: 'incoming',
            text: "Impressive! Let's schedule a live demo with our sales leadership team.",
            time: '11:02 AM'
        }
    ]

    // Minimal state for maximum performance
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Check for reduced motion preference
    const prefersReducedMotion = useReducedMotion()

    // State for streaming text
    const [currentIncomingText, setCurrentIncomingText] = useState("")
    const [currentOutgoingText, setCurrentOutgoingText] = useState("")
    const [activeMessageIndex, setActiveMessageIndex] = useState(0)
    const streamingRef = useRef<boolean>(false)

    // EXTREME speed streaming (900+ tokens per second)
    // Hyper-optimized for maximum performance
    const streamText = async (text: string, setter: (text: string) => void) => {
        let currentText = "";
        streamingRef.current = true;
        setIsTyping(true);

        // For 900+ tokens per second, we need extremely fast streaming with no delays
        // Use larger chunks and minimal state updates
        const chunkSize = 8; // Stream 8 characters at once for maximum speed

        // Use requestAnimationFrame for smoother performance than setTimeout
        const streamChunk = async (index: number) => {
            if (index >= text.length) {
                streamingRef.current = false;
                setIsTyping(false);
                return;
            }

            // Get next chunk
            const end = Math.min(index + chunkSize, text.length);
            const chunk = text.substring(index, end);
            currentText += chunk;

            // Update state only on animation frame for better performance
            setter(currentText);

            // Use requestAnimationFrame for next chunk - smoother than setTimeout
            requestAnimationFrame(() => streamChunk(end));
        };

        // Start streaming with requestAnimationFrame
        requestAnimationFrame(() => streamChunk(0));
    };

    // Hyper-optimized animation loop for maximum performance
    const animateConversation = async () => {
        if (streamingRef.current) return;

        // If user prefers reduced motion, show all messages immediately
        if (prefersReducedMotion) {
            // Just show the final state
            setCurrentIncomingText(allMessages[0].text);
            setCurrentOutgoingText(allMessages[1].text);
            return;
        }

        // Reset texts
        setCurrentIncomingText("");
        setCurrentOutgoingText("");

        // Get current message pair - safely
        const pairIndex = Math.floor(activeMessageIndex % Math.floor(allMessages.length / 2));
        const incomingIndex = pairIndex * 2;
        const outgoingIndex = pairIndex * 2 + 1;

        // Safely get messages with fallbacks
        const incomingMsg = incomingIndex < allMessages.length ? allMessages[incomingIndex] : allMessages[0];
        const outgoingMsg = outgoingIndex < allMessages.length ? allMessages[outgoingIndex] : allMessages[1];

        // Show incoming message with typing indicator - extremely fast
        await streamText(incomingMsg.text, setCurrentIncomingText);

        // Minimal pause before AI response
        await new Promise(resolve => setTimeout(resolve, 150));

        // Show outgoing message with typing indicator - extremely fast
        await streamText(outgoingMsg.text, setCurrentOutgoingText);

        // Shorter wait before next conversation for faster cycling
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Move to next conversation pair
        setActiveMessageIndex(prev => prev + 1);
    };

    // Start animation on mount and handle cleanup
    useEffect(() => {
        // Small delay to ensure component is fully mounted
        const timer = setTimeout(() => {
            if (!streamingRef.current) {
                animateConversation();
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            streamingRef.current = false;
        };
    }, [activeMessageIndex, prefersReducedMotion]);

    // Render the current conversation - fixed to prevent undefined errors
    const renderConversation = () => {
        // Safely calculate indices and get messages
        const pairIndex = Math.floor(activeMessageIndex % Math.floor(allMessages.length / 2));
        const incomingIndex = pairIndex * 2;
        const outgoingIndex = pairIndex * 2 + 1;

        // Safely get messages with fallbacks
        const incomingMsg = incomingIndex < allMessages.length ? allMessages[incomingIndex] : allMessages[0];
        const outgoingMsg = outgoingIndex < allMessages.length ? allMessages[outgoingIndex] : allMessages[1];

        return (
            <>
                {currentIncomingText && (
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                <Image
                                    src={clientAvatarUrl}
                                    alt="Client"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <span className="text-zinc-500 text-xs">{incomingMsg?.time || "Just now"}</span>
                        </div>
                        <div className="rounded-xl bg-white mt-1.5 w-4/5 border p-3 text-xs shadow-sm">
                            {currentIncomingText}
                        </div>
                    </div>
                )}

                {currentOutgoingText && (
                    <div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-zinc-500 text-xs">{outgoingMsg?.time || "Just now"}</span>
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                <Image
                                    src={axionAvatarUrl}
                                    alt="Axion Team"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="rounded-xl mb-1 ml-auto w-4/5 bg-blue-600 p-3 text-xs text-white shadow-sm">
                            {currentOutgoingText}
                        </div>
                    </div>
                )}
            </>
        );
    };

    // Function to render typing indicator - optimized for performance
    const renderTypingIndicator = (isIncoming: boolean) => {
        return (
            <div
                className={`flex items-center gap-2 ${isIncoming ? '' : 'justify-end'}`}
                style={{ transform: 'translateZ(0)' }} // Hardware acceleration
            >
                {isIncoming && (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <Image
                            src={clientAvatarUrl}
                            alt="Client"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
                <div className={`${isIncoming ? 'bg-white border' : 'bg-blue-600'} px-4 py-2 rounded-full inline-flex shadow-sm`}>
                    <span className="flex gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isIncoming ? 'bg-zinc-400' : 'bg-white'} animate-pulse`} style={{ animationDuration: '0.8s', animationDelay: '-0.3s' }}></span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isIncoming ? 'bg-zinc-400' : 'bg-white'} animate-pulse`} style={{ animationDuration: '0.8s', animationDelay: '-0.15s' }}></span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isIncoming ? 'bg-zinc-400' : 'bg-white'} animate-pulse`} style={{ animationDuration: '0.8s' }}></span>
                    </span>
                </div>
                {!isIncoming && (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <Image
                            src={axionAvatarUrl}
                            alt="Axion Team"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 overflow-hidden h-[300px]" ref={containerRef} style={{ transform: 'translateZ(0)' }}>
            <div
                className="transition-all duration-200 ease-out animate-fadeIn"
                style={{
                    transform: 'translateZ(0)', // Hardware acceleration
                    willChange: 'transform, opacity', // Hint to browser for optimization
                    backfaceVisibility: 'hidden', // Additional performance optimization
                    perspective: 1000, // Improves animation smoothness
                    contain: 'content', // Additional performance optimization
                }}
            >
                {/* Render the streaming conversation */}
                {renderConversation()}

                {/* Typing indicator - only show when actively typing */}
                {isTyping && renderTypingIndicator(currentIncomingText && !currentOutgoingText)}
            </div>
        </div>
    )
}

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', label = '' }: AnimatedCounterProps) => {
    const [count, setCount] = useState<number>(0)
    const countRef = useRef<number>(0)
    const frameRef = useRef<number>(0)

    useEffect(() => {
        // Reset count when target changes
        setCount(0)
        countRef.current = 0

        // Use requestAnimationFrame for smoother animation
        const startTime = performance.now()
        const duration = 2000 // 2 seconds

        const animate = (currentTime: number) => {
            // Calculate progress (0 to 1)
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Apply easing function for smoother animation
            // Cubic easing out function: progress = 1 - Math.pow(1 - progress, 3)
            const easedProgress = 1 - Math.pow(1 - progress, 3)

            // Calculate current count value
            const currentCount = easedProgress * target

            // Only update state if value has changed significantly
            if (Math.abs(currentCount - countRef.current) > 0.5) {
                countRef.current = currentCount
                setCount(Math.floor(currentCount))
            }

            // Continue animation if not complete
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate)
            } else {
                // Ensure final value is exactly the target
                setCount(target)
            }
        }

        // Start animation
        frameRef.current = requestAnimationFrame(animate)

        // Cleanup
        return () => {
            cancelAnimationFrame(frameRef.current)
        }
    }, [target])

    return (
        <div className="flex flex-col items-center">
            <span className="flex items-baseline">
                {count}{suffix}
            </span>
            {label && <span className="text-xl text-zinc-600 mt-2">{label}</span>}
        </div>
    )
}

// Animated Metric Component with endless loop
// Optimized for performance and respects reduced motion preferences
const AnimatedMetric = () => {
    const [count, setCount] = useState(0)
    const targetValue = 98.5
    const frameRef = useRef<number>(0)
    const prefersReducedMotion = useReducedMotion()

    // Throttle updates to improve performance
    const throttleRef = useRef<number>(0)
    const throttleTime = 50 // ms between updates

    useEffect(() => {
        // If reduced motion is preferred, just show the final value
        if (prefersReducedMotion) {
            setCount(targetValue)
            return
        }

        let startTime: number | null = null
        const duration = 5000 // 5 seconds for full animation

        const animate = (timestamp: number) => {
            // Throttle updates
            if (timestamp - throttleRef.current < throttleTime) {
                frameRef.current = requestAnimationFrame(animate)
                return
            }

            throttleRef.current = timestamp

            if (!startTime) startTime = timestamp
            const progress = (timestamp - startTime) / duration

            if (progress < 1) {
                // Use cubic easing for smoother animation
                const easedProgress = 1 - Math.pow(1 - Math.min(progress, 1), 3)
                setCount(targetValue * easedProgress)
                frameRef.current = requestAnimationFrame(animate)
            } else {
                // Reset animation
                setCount(0)
                startTime = null
                frameRef.current = requestAnimationFrame(animate)
            }
        }

        // Small delay to ensure component is fully mounted
        const timer = setTimeout(() => {
            frameRef.current = requestAnimationFrame(animate)
        }, 100)

        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(frameRef.current)
        }
    }, [prefersReducedMotion])

    return (
        <div className="text-center">
            <p className="text-4xl font-semibold lg:text-7xl">{count.toFixed(1)}%</p>
            <p className="text-zinc-500 mt-2">AI-driven conversion rate</p>
        </div>
    )
}

// Chart data and configuration with 2025 modern color palette
const chartConfig = {
    desktop: {
        label: 'Conversions',
        color: '#6366F1', // Modern indigo
    },
    mobile: {
        label: 'Engagement',
        color: '#8B5CF6', // Modern violet
    },
} satisfies ChartConfig

// Initial chart data with more realistic sales metrics
const initialChartData: ChartDataItem[] = [
    { month: 'Jan', desktop: 156, mobile: 324 },
    { month: 'Feb', desktop: 189, mobile: 412 },
    { month: 'Mar', desktop: 226, mobile: 452 },
    { month: 'Apr', desktop: 305, mobile: 510 },
    { month: 'May', desktop: 356, mobile: 626 },
    { month: 'Jun', desktop: 450, mobile: 800 },
]

// Helper function to smoothly transition between values
const smoothTransition = (
    currentValue: number,
    targetValue: number,
    step: number = 0.1
): number => {
    if (Math.abs(currentValue - targetValue) < step) {
        return targetValue
    }
    return currentValue + (targetValue - currentValue) * step
}

// Ultra-modern 2025 Revenue Chart Component with sleek animations
// Optimized for performance and respects reduced motion preferences
const AnimatedRevenueChart = () => {
    const [chartData, setChartData] = useState<ChartDataItem[]>(initialChartData)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const targetValuesRef = useRef<{[key: string]: {desktop: number, mobile: number}}>({})
    const frameRef = useRef<number>(0)
    const animationPhaseRef = useRef<number>(0)
    const prefersReducedMotion = useReducedMotion()

    // Throttle function to limit how often we update state
    const throttleRef = useRef<number>(0)
    const throttleTime = 30 // ms between updates (about 30fps instead of 60fps)

    useEffect(() => {
        // Initialize target values with more dynamic patterns
        const initialTargets = chartData.reduce((acc, item) => {
            acc[item.month] = {
                desktop: item.desktop,
                mobile: item.mobile
            }
            return acc
        }, {} as {[key: string]: {desktop: number, mobile: number}})

        targetValuesRef.current = initialTargets

        // If user prefers reduced motion, just set static data and return
        if (prefersReducedMotion) {
            // Apply a single subtle wave to make the chart look more natural
            // but don't animate it continuously
            const staticData = initialChartData.map((item, index) => {
                const baseDesktop = item.desktop
                const baseMobile = item.mobile

                // Add a subtle wave pattern (static)
                const desktopWave = Math.sin(index * 0.5) * (baseDesktop * 0.05)
                const mobileWave = Math.cos(index * 0.3) * (baseMobile * 0.05)

                return {
                    ...item,
                    desktop: baseDesktop + desktopWave,
                    mobile: baseMobile + mobileWave
                }
            })

            setChartData(staticData)
            return
        }

        // Function to create wave-like patterns in the data
        const createWavePattern = () => {
            const phase = animationPhaseRef.current
            animationPhaseRef.current = (phase + 0.03) % (Math.PI * 2) // Slower animation

            const months = Object.keys(targetValuesRef.current)

            months.forEach((month, index) => {
                const currentValues = targetValuesRef.current[month]
                const baseDesktop = initialChartData[index % initialChartData.length].desktop
                const baseMobile = initialChartData[index % initialChartData.length].mobile

                // Create smooth wave patterns with different frequencies
                // Reduced amplitude for more subtle animation
                const desktopWave = Math.sin(phase + index * 0.5) * (baseDesktop * 0.1)
                const mobileWave = Math.cos(phase + index * 0.3) * (baseMobile * 0.08)

                targetValuesRef.current[month] = {
                    desktop: baseDesktop + desktopWave,
                    mobile: baseMobile + mobileWave
                }
            })
        }

        // Function to animate chart data with fluid motion
        const animateChart = (timestamp: number) => {
            // Throttle updates to improve performance
            if (timestamp - throttleRef.current < throttleTime) {
                frameRef.current = requestAnimationFrame(animateChart)
                return
            }

            throttleRef.current = timestamp

            // Update wave pattern
            createWavePattern()

            setChartData(prevData => {
                const newData = prevData.map((item, index) => {
                    const target = targetValuesRef.current[item.month]
                    if (!target) return item

                    // Faster transitions for more fluid animation
                    const newDesktop = smoothTransition(item.desktop, target.desktop, 0.08)
                    const newMobile = smoothTransition(item.mobile, target.mobile, 0.08)

                    return {
                        ...item,
                        desktop: newDesktop,
                        mobile: newMobile
                    }
                })

                return newData
            })

            frameRef.current = requestAnimationFrame(animateChart)
        }

        // Start animation with a small delay to ensure component is fully mounted
        const timer = setTimeout(() => {
            frameRef.current = requestAnimationFrame(animateChart)
        }, 100)

        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(frameRef.current)
        }
    }, [prefersReducedMotion])

    // Custom dot component for enhanced visual appeal
    const CustomDot = (props: any) => {
        const { cx, cy, index, dataKey } = props
        const isHovered = index === hoverIndex
        const color = dataKey === 'desktop' ? '#6366F1' : '#8B5CF6'

        return (
            <g>
                {/* Glow effect */}
                {isHovered && (
                    <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="none"
                        stroke={color}
                        strokeOpacity={0.3}
                        strokeWidth={2}
                    />
                )}
                {/* Main dot */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5 : 0}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{
                        transition: 'r 0.2s ease-out',
                    }}
                />
            </g>
        )
    }

    // Custom tooltip content
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-lg">
                    <p className="text-xs font-medium text-gray-800 mb-1">{label}</p>
                    <div className="space-y-1">
                        <p className="text-xs flex items-center">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                            <span className="text-gray-600">Conversions:</span>
                            <span className="ml-1 font-medium">{payload[0].value.toFixed(0)}</span>
                        </p>
                        <p className="text-xs flex items-center">
                            <span className="w-2 h-2 rounded-full bg-violet-500 mr-2"></span>
                            <span className="text-gray-600">Engagement:</span>
                            <span className="ml-1 font-medium">{payload[1].value.toFixed(0)}</span>
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    onMouseMove={(e) => {
                        if (e.activeTooltipIndex !== undefined) {
                            setHoverIndex(e.activeTooltipIndex)
                        }
                    }}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <defs>
                        {/* Enhanced gradients for 2025 look */}
                        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.01} />
                        </linearGradient>

                        {/* Sleek line gradients */}
                        <linearGradient id="lineDesktop" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#4F46E5" />
                            <stop offset="100%" stopColor="#6366F1" />
                        </linearGradient>
                        <linearGradient id="lineMobile" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>

                        {/* Filter for glow effects */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Ultra-modern grid */}
                    <CartesianGrid
                        vertical={false}
                        horizontal={true}
                        stroke="rgba(203, 213, 225, 0.3)"
                        strokeDasharray="3 6"
                    />

                    {/* Custom tooltip */}
                    <ChartTooltip
                        content={<CustomTooltip />}
                        cursor={{
                            stroke: '#E2E8F0',
                            strokeWidth: 1,
                            strokeDasharray: '4 4'
                        }}
                    />

                    {/* Sleek areas */}
                    <Area
                        type="monotone"
                        dataKey="mobile"
                        stroke="url(#lineMobile)"
                        strokeWidth={3}
                        fill="url(#fillMobile)"
                        dot={false}
                        activeDot={(props) => <CustomDot {...props} />}
                        isAnimationActive={false} // We're handling animation manually
                    />
                    <Area
                        type="monotone"
                        dataKey="desktop"
                        stroke="url(#lineDesktop)"
                        strokeWidth={3}
                        fill="url(#fillDesktop)"
                        dot={false}
                        activeDot={(props) => <CustomDot {...props} />}
                        isAnimationActive={false} // We're handling animation manually
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}