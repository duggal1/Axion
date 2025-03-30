/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Logo } from '@/components/logo'
import { Activity, Globe, MessageSquare, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import DottedMap from 'dotted-map'

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
                            <div className="rounded-lg bg-white absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-sm"></div>
                        </div>

                        <div className="relative overflow-hidden h-[240px]">
                            <div className="bg-gradient-radial z-10 absolute inset-0 from-transparent to-white to-75%"></div>
                            <AnimatedGlobeMap />
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

// Create a dotted map instance
const map = new DottedMap({ height: 55, grid: 'diagonal' })
const mapPoints = map.getPoints()

// Static Dotted Map Component (no animations)
const AnimatedGlobeMap = () => {
    const viewBox = `0 0 120 60`
    return (
        <svg viewBox={viewBox} style={{ background: 'white' }}>
            {/* Dots for the map */}
            {mapPoints.map((point, index) => (
                <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={0.15}
                    fill="#e5e7eb"
                    opacity={0.4}
                />
            ))}

            {/* Add some static highlighted points for visual interest */}
            {mapPoints.filter((_, i) => i % 12 === 0).map((point, index) => (
                <circle
                    key={`highlight-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={0.35}
                    fill="#2563eb"
                    opacity={0.9}
                />
            ))}
        </svg>
    )
}

// Animated Chat Messages Component
const AnimatedChatMessages = () => {
    // Client avatar URL
    const clientAvatarUrl = "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    // Axion team avatar URL
    const axionAvatarUrl = "https://images.unsplash.com/photo-1508835277982-1c1b0e205603?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

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

    // Use a counter to control which messages are visible
    const [visibleCount, setVisibleCount] = useState<number>(1)
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number>(0)
    const isAnimatingRef = useRef<boolean>(false)

    // Function to handle the animation loop with ultra-fast streaming
    const animateMessages = () => {
        if (isAnimatingRef.current) return

        isAnimatingRef.current = true
        let currentIndex = 1 // Start from the second message

        const showNextMessage = () => {
            if (currentIndex >= allMessages.length) {
                // Reset after showing all messages
                setTimeout(() => {
                    setVisibleCount(1)
                    setIsTyping(false)
                    currentIndex = 1
                    setTimeout(() => {
                        isAnimatingRef.current = false
                        animateMessages()
                    }, 800) // Faster reset
                }, 2000) // Shorter pause at the end
                return
            }

            // Show typing indicator
            setIsTyping(true)

            // Ultra-fast typing time for streaming effect (800-900 tokens per second)
            // This is approximately 1ms per character for extremely fast streaming
            const typingTime = Math.min(150, allMessages[currentIndex].text.length * 1)

            setTimeout(() => {
                // Hide typing indicator and show the message
                setIsTyping(false)
                setVisibleCount(currentIndex + 1)

                // Move to next message
                currentIndex++

                // Schedule next message with a much shorter pause
                setTimeout(showNextMessage, 300) // Faster transition between messages
            }, typingTime)
        }

        // Start the sequence
        setTimeout(showNextMessage, 800) // Faster initial start
    }

    // Start animation on mount and handle cleanup
    useEffect(() => {
        animateMessages()

        return () => {
            isAnimatingRef.current = false
            cancelAnimationFrame(animationRef.current)
        }
    }, [])

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

    // Get visible messages
    const visibleMessages = allMessages.slice(0, visibleCount)

    return (
        <div className="flex flex-col gap-4 overflow-hidden h-[300px]" ref={containerRef} style={{ transform: 'translateZ(0)' }}>
            {visibleMessages.map((message, index) => (
                <div
                    key={message.id}
                    className={`transition-all duration-200 ease-out ${
                        index === visibleMessages.length - 1 ? 'animate-fadeIn' : ''
                    }`}
                    style={{
                        transform: 'translateZ(0)', // Hardware acceleration
                        willChange: 'transform, opacity', // Hint to browser for optimization
                        backfaceVisibility: 'hidden', // Additional performance optimization
                        perspective: 1000 // Improves animation smoothness
                    }}
                >
                    {message.type === 'incoming' ? (
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
                                <span className="text-zinc-500 text-xs">{message.time}</span>
                            </div>
                            <div className="rounded-xl bg-white mt-1.5 w-4/5 border p-3 text-xs shadow-sm">
                                {message.text}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-zinc-500 text-xs">{message.time}</span>
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
                                {message.text}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Typing indicator */}
            {isTyping && renderTypingIndicator(visibleCount % 2 === 0)}
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
const AnimatedMetric = () => {
    const [count, setCount] = useState(0)
    const targetValue = 98.5
    const frameRef = useRef<number>(0)

    useEffect(() => {
        let startTime: number | null = null
        const duration = 5000 // 5 seconds for full animation

        const animate = (timestamp: number) => {
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

        frameRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameRef.current)
    }, [])

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
const AnimatedRevenueChart = () => {
    const [chartData, setChartData] = useState<ChartDataItem[]>(initialChartData)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const targetValuesRef = useRef<{[key: string]: {desktop: number, mobile: number}}>({})
    const frameRef = useRef<number>(0)
    const animationPhaseRef = useRef<number>(0)

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

        // Function to create wave-like patterns in the data
        const createWavePattern = () => {
            const phase = animationPhaseRef.current
            animationPhaseRef.current = (phase + 0.05) % (Math.PI * 2)

            const months = Object.keys(targetValuesRef.current)

            months.forEach((month, index) => {
                const currentValues = targetValuesRef.current[month]
                const baseDesktop = initialChartData[index % initialChartData.length].desktop
                const baseMobile = initialChartData[index % initialChartData.length].mobile

                // Create smooth wave patterns with different frequencies
                const desktopWave = Math.sin(phase + index * 0.5) * (baseDesktop * 0.15)
                const mobileWave = Math.cos(phase + index * 0.3) * (baseMobile * 0.12)

                targetValuesRef.current[month] = {
                    desktop: baseDesktop + desktopWave,
                    mobile: baseMobile + mobileWave
                }
            })
        }

        // Function to animate chart data with fluid motion
        const animateChart = () => {
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

        // Start animation immediately
        frameRef.current = requestAnimationFrame(animateChart)

        return () => {
            cancelAnimationFrame(frameRef.current)
        }
    }, [])

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