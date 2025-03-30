

"use client"



import { DownloadIcon, FilterIcon, TrendingUpIcon } from "lucide-react";
import Container from "../global/container";
import { Button } from "../ui/button";
import { MagicCard } from "../ui/magic-card";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

// Define types for better performance and type safety
type CampaignType = {
    name: string;
    status: string;
    reach: number;
    roi: number;
};

type ChannelType = {
    channel: string;
    users: number;
    sessions: number;
    rate: number;
};

interface AnimatedNumberProps {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    duration?: number;
}

// Optimized hook for animated number counting with proper types
const useAnimatedCounter = (initialValue: number, min: number, max: number, interval: number = 2000): number => {
    const [value, setValue] = useState<number>(initialValue);
    const animationRef = useRef<number | null>(null);
    const lastUpdateTime = useRef<number>(Date.now());

    // Use RAF for smoother animations
    const updateValue = useCallback(() => {
        const now = Date.now();
        const elapsed = now - lastUpdateTime.current;

        if (elapsed >= interval) {
            // Generate a random value within the range
            const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
            setValue(newValue);
            lastUpdateTime.current = now;
        }

        animationRef.current = requestAnimationFrame(updateValue);
    }, [min, max, interval]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(updateValue);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [updateValue]);

    return value;
};

// Optimized hook for animated percentage with proper types
const useAnimatedPercentage = (initialValue: number, min: number, max: number, interval: number = 2500): number => {
    return useAnimatedCounter(initialValue, min, max, interval);
};

// Optimized animated number component with smooth transition using RAF
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    value,
    prefix = "",
    suffix = "",
    className = "",
    duration = 800
}) => {
    const prevValue = useRef<number>(value);
    const [displayValue, setDisplayValue] = useState<number>(value);
    const startTime = useRef<number>(0);
    const animationRef = useRef<number | null>(null);

    const animateValue = useCallback((timestamp: number) => {
        if (!startTime.current) {
            startTime.current = timestamp;
        }

        const progress = timestamp - startTime.current;
        const percentage = Math.min(progress / duration, 1);

        // Use easeOutQuad for smoother animation
        const easeOutValue = percentage < 0.5
            ? 2 * percentage * percentage
            : 1 - Math.pow(-2 * percentage + 2, 2) / 2;

        const currentValue = prevValue.current + (value - prevValue.current) * easeOutValue;

        setDisplayValue(Math.round(currentValue));

        if (percentage < 1) {
            animationRef.current = requestAnimationFrame(animateValue);
        } else {
            setDisplayValue(value);
            prevValue.current = value;
            startTime.current = 0;
        }
    }, [value, duration]);

    useEffect(() => {
        if (value !== prevValue.current) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            animationRef.current = requestAnimationFrame(animateValue);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [value, animateValue]);

    // Memoize formatted value to prevent unnecessary re-renders
    const formattedValue = useMemo(() => {
        return displayValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, [displayValue]);

    return (
        <span className={`will-change-contents ${className}`}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
};

const Analysis: React.FC = () => {
    // Campaign Insights data with animations - optimized intervals
    const revenue = useAnimatedCounter(12834, 11000, 15000, 2800);
    const revenueGrowth = useAnimatedPercentage(25, 18, 32, 3200);

    // Campaign data with animations
    const [campaigns, setCampaigns] = useState<CampaignType[]>([
        { name: "Sales", status: "Active", reach: 45, roi: 32 },
        { name: "Emails", status: "Done", reach: 28, roi: 18 },
        { name: "Ads", status: "Active", reach: 62, roi: 45 },
    ]);

    // Audience metrics with animations - staggered intervals for better performance
    const audienceTotal = useAnimatedCounter(84392, 80000, 90000, 3000);
    const engagementRate = useAnimatedPercentage(12, 8, 16, 3400);

    // Audience channels with animations
    const [channels, setChannels] = useState<ChannelType[]>([
        { channel: "Social", users: 32, sessions: 45, rate: 3.2 },
        { channel: "Email", users: 28, sessions: 36, rate: 4.5 },
        { channel: "Direct", users: 15, sessions: 22, rate: 5.1 },
    ]);

    // Update campaign data using RAF for smoother animations
    useEffect(() => {
        let lastUpdateTime = Date.now();
        let animationFrameId: number;

        const updateCampaigns = () => {
            const now = Date.now();
            const elapsed = now - lastUpdateTime;

            if (elapsed >= 3700) { // Slightly longer interval to reduce CPU usage
                setCampaigns(prev => prev.map(campaign => ({
                    ...campaign,
                    reach: Math.floor(Math.random() * 40) + 25, // 25-65K
                    roi: Math.floor(Math.random() * 30) + 15, // 15-45%
                })));
                lastUpdateTime = now;
            }

            animationFrameId = requestAnimationFrame(updateCampaigns);
        };

        animationFrameId = requestAnimationFrame(updateCampaigns);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Update channel data using RAF with staggered timing
    useEffect(() => {
        let lastUpdateTime = Date.now();
        let animationFrameId: number;

        const updateChannels = () => {
            const now = Date.now();
            const elapsed = now - lastUpdateTime;

            if (elapsed >= 4100) { // Staggered from campaign updates
                setChannels(prev => prev.map(channel => ({
                    ...channel,
                    users: Math.floor(Math.random() * 25) + 15, // 15-40K
                    sessions: Math.floor(Math.random() * 30) + 20, // 20-50K
                    rate: parseFloat((Math.random() * 4 + 2).toFixed(1)), // 2.0-6.0%
                })));
                lastUpdateTime = now;
            }

            animationFrameId = requestAnimationFrame(updateChannels);
        };

        animationFrameId = requestAnimationFrame(updateChannels);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Memoize campaign rows for better performance
    const campaignRows = useMemo(() => {
        return campaigns.map((campaign) => (
            <div key={campaign.name} className="grid grid-cols-4 text-sm py-2 border-t border-border/50">
                <div>{campaign.name}</div>
                <div>{campaign.status}</div>
                <div className="will-change-contents">
                    <AnimatedNumber value={campaign.reach} suffix="K" duration={600} />
                </div>
                <div className="font-semibold will-change-contents">
                    <AnimatedNumber value={campaign.roi} prefix="+" suffix="%" duration={600} />
                </div>
            </div>
        ));
    }, [campaigns]);

    // Memoize channel rows for better performance
    const channelRows = useMemo(() => {
        return channels.map((metric) => (
            <div key={metric.channel} className="grid grid-cols-4 text-sm py-2 border-t border-border/50">
                <div>{metric.channel}</div>
                <div className="will-change-contents">
                    <AnimatedNumber value={metric.users} suffix="K" duration={600} />
                </div>
                <div className="will-change-contents">
                    <AnimatedNumber value={metric.sessions} suffix="K" duration={600} />
                </div>
                <div className="font-semibold will-change-contents">
                    <AnimatedNumber value={metric.rate} suffix="%" duration={600} />
                </div>
            </div>
        ));
    }, [channels]);

    return (
        <div className="relative flex flex-col items-center justify-center w-full py-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium font-serif !leading-snug">
                        AI-Powered Sales & Marketing Agent
                    </h2>
                    <p className="text-xl md:text-xl text-accent-foreground/80  text-gray-600 italic mt-4">
                        Your AI agent for sales and marketing handling sales operations for up to 20 teams with real-time insights and automation.
                    </p>
                </div>
            </Container>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative w-full">
                <Container delay={0.2}>
                    <div className="rounded-2xl bg-background/40 relative border border-border/50">
                    <MagicCard
    gradientFrom="#ae00ff"
    gradientTo="#4b0082"
    gradientColor="rgba(75, 0, 130, 0.1)"
    className="p-4 lg:p-8 w-full overflow-hidden"
>
                            <div className="absolute bottom-0 right-0 bg-violet-600 w-1/4 h-1/4 blur-[8rem] z-20"></div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold font-serif  ">
                                    AI-Driven Sales Performance
                                </h3>
                                <p className="text-sm text-muted-foreground font-serif  ">
                                    Track your campaign performance with AI-driven insights.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <div className="text-3xl font-semibold font-serif  will-change-contents">
                                                <AnimatedNumber value={revenue} prefix="$" />
                                            </div>
                                            <div className="text-sm font-serif  text-emerald-600 flex items-center gap-1 mt-2">
                                                <TrendingUpIcon className="w-4 h-4" />
                                                <AnimatedNumber value={revenueGrowth} suffix="%" /> from last month
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost">
                                                <FilterIcon className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost">
                                                <DownloadIcon className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="grid grid-cols-4 text-sm font-serif  text-muted-foreground py-2">
                                            <div>Campaign</div>
                                            <div>Status</div>
                                            <div>Reach</div>
                                            <div>ROI</div>
                                        </div>
                                        {campaignRows}
                                    </div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>
                </Container>

                <Container delay={0.2}>
                    <div className="rounded-2xl bg-background/40 relative border border-border/50">
                    <MagicCard
    gradientFrom="#ae00ff"
    gradientTo="#4b0082"
    gradientColor="rgba(75, 0, 130, 0.1)"
    className="p-4 lg:p-8 w-full overflow-hidden"
>
       
                            <div className="absolute bottom-0 right-0 bg-violet-600 w-1/4 h-1/4 blur-[8rem] z-20"></div>
                            <div className="space-y-4">
                                <h3 className="text-xl  font-serif font-semibold">
                                    AI-Powered Audience Analytics
                                </h3>
                                <p className="text-sm font-serif  text-muted-foreground">
                                    AI-powered analysis of audience behavior and engagement patterns.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <div className="text-3xl font-semibold  font-serif  will-change-contents">
                                                <AnimatedNumber value={audienceTotal} />
                                            </div>
                                            <div className="text-sm text-emerald-600 flex items-center gap-1 mt-2">
                                                <TrendingUpIcon className="w-4 h-4" />
                                                <AnimatedNumber value={engagementRate} suffix="%" /> engagement rate
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost">
                                                <FilterIcon className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost">
                                                <DownloadIcon className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Audience Table */}
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-4 font-serif  text-sm text-muted-foreground py-2">
                                            <div>Channel</div>
                                            <div>Users</div>
                                            <div>Sessions</div>
                                            <div>Conv. Rate</div>
                                        </div>
                                        {channelRows}
                                    </div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Analysis;
