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
                <div className="group relative transition-all duration-500 hover:bg-blue-50/30">
                    <div className="p-6 sm:p-12 relative z-10">
                        <span className="text-zinc-500 flex items-center gap-2 font-medium">
                            <Globe className="size-4 text-blue-500" />
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Global Client Acquisition
                            </span>
                        </span>

                        <p className="mt-8 text-2xl font-semibold leading-tight">
                            Enterprise-grade AI agent system identifying qualified leads worldwide.
                        </p>

                        <div className="mt-4 inline-flex items-center text-sm text-blue-600 font-medium">
                            <span>Learn more</span>
                            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div aria-hidden className="relative">
                        <div className="absolute inset-0 z-10 m-auto size-fit">
                            <div className="rounded-lg bg-white z-10 relative flex size-fit w-fit items-center gap-2 border px-3 py-1.5 text-xs font-medium shadow-lg shadow-blue-900/5 animate-pulse">
                                <span className="text-lg">💼</span> Enterprise deal closed in Singapore
                            </div>
                            <div className="rounded-lg bg-white absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-blue-900/5"></div>
                        </div>

                        <div className="relative overflow-hidden h-[240px]">
                            <div className="bg-gradient-radial z-10 absolute inset-0 from-transparent to-white to-75%"></div>
                            <AnimatedGlobeMap />
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden border-t bg-zinc-50/50 p-6 sm:p-12 md:border-0 md:border-l group relative transition-all duration-500 hover:bg-blue-50/30">
                    <div className="relative z-10">
                        <span className="text-zinc-500 flex items-center gap-2 font-medium">
                            <MessageSquare className="size-4 text-blue-500" />
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Omnichannel Communication
                            </span>
                        </span>

                        <p className="my-6 text-2xl font-semibold leading-tight">
                            Seamlessly engage prospects across email, voice, and messaging platforms.
                        </p>

                        <div className="mb-4 inline-flex items-center text-sm text-blue-600 font-medium">
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
                <div className="relative col-span-full border-t">
                    <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
                        <span className="text-zinc-500 flex items-center gap-2 font-medium">
                            <Activity className="size-4 text-blue-500" />
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Activity Monitoring
                            </span>
                        </span>

                        <p className="my-6 text-2xl font-semibold leading-tight">
                            Monitor your application&apos;s activity in real-time.
                            <span className="text-zinc-500"> Instantly identify and resolve issues.</span>
                        </p>

                        <div className="inline-flex items-center text-sm text-blue-600 font-medium">
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

// Enhanced Dotted Map Component with animations
const AnimatedGlobeMap = () => {
    const [connections, setConnections] = useState<Connection[]>([])
    const [activePoints, setActivePoints] = useState<{[key: string]: boolean}>({})
    const pointsRef = useRef<Point[]>([])
    const frameRef = useRef<number>(0)

    useEffect(() => {
        // Convert dotted map points to our format
        const formattedPoints: Point[] = mapPoints.map(point => ({
            x: point.x,
            y: point.y
        }))

        pointsRef.current = formattedPoints

        // Create random connections between points
        const newConnections: Connection[] = []
        for (let i = 0; i < 15; i++) {
            const start = Math.floor(Math.random() * formattedPoints.length)
            const end = Math.floor(Math.random() * formattedPoints.length)
            newConnections.push({
                start: formattedPoints[start],
                end: formattedPoints[end],
                progress: 0
            })
        }
        setConnections(newConnections)

        // Set some points as active (highlighted)
        const initialActivePoints: {[key: string]: boolean} = {}
        for (let i = 0; i < formattedPoints.length; i++) {
            if (i % 12 === 0) {
                initialActivePoints[`${i}`] = true
            }
        }
        setActivePoints(initialActivePoints)

        // Animate connections - using requestAnimationFrame for smoother animation
        let lastTime = 0

        const animate = (time: number) => {
            if (!lastTime) lastTime = time
            const delta = time - lastTime

            // Only update if enough time has passed (throttling for performance)
            if (delta > 20) { // Faster updates for smoother animation
                lastTime = time

                // Update connections
                setConnections(prev => prev.map(conn => {
                    // Smoother progress increment
                    const newProgress = conn.progress + 0.004
                    if (newProgress > 1) {
                        // Generate a new connection
                        const start = Math.floor(Math.random() * pointsRef.current.length)
                        const end = Math.floor(Math.random() * pointsRef.current.length)
                        return {
                            start: pointsRef.current[start],
                            end: pointsRef.current[end],
                            progress: 0
                        }
                    }
                    return { ...conn, progress: newProgress }
                }))

                // Occasionally update active points
                if (Math.random() < 0.05) {
                    setActivePoints(prev => {
                        const newActive = { ...prev }
                        const pointIndex = Math.floor(Math.random() * pointsRef.current.length)
                        newActive[`${pointIndex}`] = !newActive[`${pointIndex}`]
                        return newActive
                    })
                }
            }

            frameRef.current = requestAnimationFrame(animate)
        }

        frameRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(frameRef.current)
        }
    }, [])

    const viewBox = `0 0 120 60`
    return (
        <svg viewBox={viewBox} style={{ background: 'white' }}>
            {/* Dots for the map */}
            {mapPoints.map((point, index) => (
                <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={activePoints[`${index}`] ? 0.35 : 0.15}
                    fill={activePoints[`${index}`] ? "#2563eb" : "#e5e7eb"}
                    opacity={activePoints[`${index}`] ? 0.9 : 0.4}
                    className={activePoints[`${index}`] ? "animate-pulse" : ""}
                />
            ))}

            {/* Animated connections */}
            {connections.map((conn, index) => {
                const x1 = conn.start.x
                const y1 = conn.start.y
                const x2 = conn.end.x
                const y2 = conn.end.y

                // Calculate current position with cubic easing
                const easeProgress = 1 - Math.pow(1 - conn.progress, 3)
                const currentX = x1 + (x2 - x1) * easeProgress
                const currentY = y1 + (y2 - y1) * easeProgress

                return (
                    <g key={index}>
                        <line
                            x1={x1}
                            y1={y1}
                            x2={currentX}
                            y2={currentY}
                            stroke="#3b82f6"
                            strokeWidth="0.2"
                            strokeDasharray="0.5 0.5"
                            opacity="0.7"
                        />
                        <circle
                            cx={currentX}
                            cy={currentY}
                            r="0.4"
                            fill="#3b82f6"
                            opacity="0.9"
                        />
                    </g>
                )
            })}

            {/* Add some highlight effects */}
            {connections.slice(0, 5).map((conn, index) => {
                const midX = (conn.start.x + conn.end.x) / 2
                const midY = (conn.start.y + conn.end.y) / 2

                return (
                    <circle
                        key={`glow-${index}`}
                        cx={midX}
                        cy={midY}
                        r="1.5"
                        fill="url(#blueGlow)"
                        opacity="0.2"
                    />
                )
            })}

            {/* Gradient definitions */}
            <defs>
                <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
            </defs>
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
            text: "I'm interested in your enterprise AI solution. What ROI can we expect?",
            time: 'Yesterday'
        },
        {
            id: 2,
            type: 'outgoing',
            text: 'Our clients typically see 3.7x ROI within the first quarter of implementation.',
            time: '10:46 AM'
        },
        {
            id: 3,
            type: 'incoming',
            text: "That's impressive. How quickly can we deploy this?",
            time: '10:53 AM'
        },
        {
            id: 4,
            type: 'outgoing',
            text: 'Axion can be fully integrated within 2 weeks with our enterprise onboarding team.',
            time: '10:55 AM'
        },
        {
            id: 5,
            type: 'incoming',
            text: "Perfect! Let's schedule a demo with our executive team.",
            time: '11:02 AM'
        }
    ]

    // Use a counter to control which messages are visible
    const [visibleCount, setVisibleCount] = useState<number>(1)
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number>(0)
    const isAnimatingRef = useRef<boolean>(false)

    // Function to handle the animation loop
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
                    }, 1000)
                }, 3000)
                return
            }

            // Show typing indicator
            setIsTyping(true)

            // Shorter typing time for better performance
            const typingTime = Math.min(600, allMessages[currentIndex].text.length * 10)

            setTimeout(() => {
                // Hide typing indicator and show the message
                setIsTyping(false)
                setVisibleCount(currentIndex + 1)

                // Move to next message
                currentIndex++

                // Schedule next message with a shorter pause
                setTimeout(showNextMessage, 800)
            }, typingTime)
        }

        // Start the sequence
        setTimeout(showNextMessage, 1000)
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
        <div className="flex flex-col gap-4 overflow-hidden h-[300px]" ref={containerRef}>
            {visibleMessages.map((message, index) => (
                <div
                    key={message.id}
                    className={`transition-all duration-300 ease-out ${
                        index === visibleMessages.length - 1 ? 'animate-fadeIn' : ''
                    }`}
                    style={{
                        transform: 'translateZ(0)', // Hardware acceleration
                        willChange: 'transform, opacity' // Hint to browser for optimization
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

// Chart data and configuration
const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: '#2563eb',
    },
    mobile: {
        label: 'Mobile',
        color: '#60a5fa',
    },
} satisfies ChartConfig

// Initial chart data
const initialChartData: ChartDataItem[] = [
    { month: 'May', desktop: 56, mobile: 224 },
    { month: 'June', desktop: 56, mobile: 224 },
    { month: 'January', desktop: 126, mobile: 252 },
    { month: 'February', desktop: 205, mobile: 410 },
    { month: 'March', desktop: 200, mobile: 126 },
    { month: 'April', desktop: 400, mobile: 800 },
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

// Enhanced Monitoring Chart Component with smooth animations
const AnimatedRevenueChart = () => {
    const [chartData, setChartData] = useState<ChartDataItem[]>(initialChartData)
    const targetValuesRef = useRef<{[key: string]: {desktop: number, mobile: number}}>({})
    const frameRef = useRef<number>(0)

    useEffect(() => {
        // Initialize target values
        const initialTargets = chartData.reduce((acc, item) => {
            acc[item.month] = {
                desktop: item.desktop,
                mobile: item.mobile
            }
            return acc
        }, {} as {[key: string]: {desktop: number, mobile: number}})

        targetValuesRef.current = initialTargets

        // Function to update target values periodically
        const updateTargetValues = () => {
            // Randomly select 1-3 months to update
            const updateCount = Math.floor(Math.random() * 3) + 1
            const months = Object.keys(targetValuesRef.current)

            for (let i = 0; i < updateCount; i++) {
                const randomMonthIndex = Math.floor(Math.random() * months.length)
                const month = months[randomMonthIndex]

                // Generate new target values with some relationship to previous values
                const currentValues = targetValuesRef.current[month]
                const desktopChange = (Math.random() - 0.5) * 100 // -50 to +50
                const mobileChange = (Math.random() - 0.5) * 200 // -100 to +100

                targetValuesRef.current[month] = {
                    desktop: Math.max(50, currentValues.desktop + desktopChange),
                    mobile: Math.max(100, currentValues.mobile + mobileChange)
                }
            }
        }

        // Function to animate chart data towards target values
        const animateChart = () => {
            setChartData(prevData => {
                // Check if any values need updating
                let hasChanges = false

                const newData = prevData.map(item => {
                    const target = targetValuesRef.current[item.month]
                    if (!target) return item

                    const newDesktop = smoothTransition(item.desktop, target.desktop, 0.03)
                    const newMobile = smoothTransition(item.mobile, target.mobile, 0.03)

                    // Check if this item has changed
                    if (Math.abs(newDesktop - item.desktop) > 0.1 || Math.abs(newMobile - item.mobile) > 0.1) {
                        hasChanges = true
                        return {
                            ...item,
                            desktop: newDesktop,
                            mobile: newMobile
                        }
                    }

                    return item
                })

                return hasChanges ? newData : prevData
            })

            frameRef.current = requestAnimationFrame(animateChart)
        }

        // Start animation
        frameRef.current = requestAnimationFrame(animateChart)

        // Set up interval to update target values
        const intervalId = setInterval(updateTargetValues, 4000)

        return () => {
            clearInterval(intervalId)
            cancelAnimationFrame(frameRef.current)
        }
    }, [])

    return (
        <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 0,
                        right: 0,
                    }}>
                    <defs>
                        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                            <stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                            <stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f1f1f1" />
                    <ChartTooltip
                        active
                        cursor={false}
                        content={<ChartTooltipContent className="bg-white shadow-lg border" />}
                    />
                    <Area
                        strokeWidth={2}
                        dataKey="mobile"
                        type="stepBefore"
                        fill="url(#fillMobile)"
                        fillOpacity={0.1}
                        stroke="var(--color-mobile)"
                        stackId="a"
                        isAnimationActive={false} // We're handling animation manually
                    />
                    <Area
                        strokeWidth={2}
                        dataKey="desktop"
                        type="stepBefore"
                        fill="url(#fillDesktop)"
                        fillOpacity={0.1}
                        stroke="var(--color-desktop)"
                        stackId="a"
                        isAnimationActive={false} // We're handling animation manually
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}