

"use client"



import { DownloadIcon, FilterIcon, TrendingUpIcon } from "lucide-react";
import Container from "../global/container";
import { Button } from "../ui/button";
import { MagicCard } from "../ui/magic-card";
import { useEffect, useState, useRef } from "react";

// Custom hook for animated number counting
const useAnimatedCounter = (initialValue, min, max) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const interval = setInterval(() => {
            // Generate a random value within the range
            const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
            setValue(newValue);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [min, max]);

    return value;
};

// Custom hook for animated percentage
const useAnimatedPercentage = (initialValue, min, max) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const interval = setInterval(() => {
            // Generate a random percentage
            const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
            setValue(newValue);
        }, 3500); // Slightly different timing for visual variety

        return () => clearInterval(interval);
    }, [min, max]);

    return value;
};

// Animated number component with smooth transition
const AnimatedNumber = ({ value, prefix = "", suffix = "", className = "" }) => {
    const prevValue = useRef(value);
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const animationDuration = 1500; // 1.5 seconds
        const framesPerSecond = 60;
        const totalFrames = animationDuration / 1000 * framesPerSecond;
        const increment = (value - prevValue.current) / totalFrames;

        let currentFrame = 0;
        let currentValue = prevValue.current;

        const animationInterval = setInterval(() => {
            currentFrame++;
            currentValue += increment;

            if (currentFrame >= totalFrames) {
                clearInterval(animationInterval);
                setDisplayValue(value);
                prevValue.current = value;
            } else {
                setDisplayValue(Math.round(currentValue));
            }
        }, 1000 / framesPerSecond);

        return () => clearInterval(animationInterval);
    }, [value]);

    // Format number with commas
    const formattedValue = displayValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
        <span className={`transition-all duration-300 ${className}`}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
};

const Analysis = () => {
    // Campaign Insights data with animations
    const revenue = useAnimatedCounter(12834, 11000, 15000);
    const revenueGrowth = useAnimatedPercentage(25, 18, 32);

    // Campaign data with animations
    const [campaigns, setCampaigns] = useState([
        { name: "Sales", status: "Active", reach: 45, roi: 32 },
        { name: "Emails", status: "Done", reach: 28, roi: 18 },
        { name: "Ads", status: "Active", reach: 62, roi: 45 },
    ]);

    // Audience metrics with animations
    const audienceTotal = useAnimatedCounter(84392, 80000, 90000);
    const engagementRate = useAnimatedPercentage(12, 8, 16);

    // Audience channels with animations
    const [channels, setChannels] = useState([
        { channel: "Social", users: 32, sessions: 45, rate: 3.2 },
        { channel: "Email", users: 28, sessions: 36, rate: 4.5 },
        { channel: "Direct", users: 15, sessions: 22, rate: 5.1 },
    ]);

    // Update campaign data periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setCampaigns(prev => prev.map(campaign => ({
                ...campaign,
                reach: Math.floor(Math.random() * 40) + 25, // 25-65K
                roi: Math.floor(Math.random() * 30) + 15, // 15-45%
            })));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Update channel data periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setChannels(prev => prev.map(channel => ({
                ...channel,
                users: Math.floor(Math.random() * 25) + 15, // 15-40K
                sessions: Math.floor(Math.random() * 30) + 20, // 20-50K
                rate: (Math.random() * 4 + 2).toFixed(1), // 2.0-6.0%
            })));
        }, 4500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center w-full py-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug">
                        AI-Powered Marketing <br /><span className="font-subheading italic">dashboard</span>
                    </h2>
                    <p className="text-base md:text-lg text-accent-foreground/80 mt-4">
                        Real-time insights into your marketing performance with our AI agent for sales and marketing analytics.
                    </p>
                </div>
            </Container>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative w-full">

                <Container delay={0.2}>
                    <div className="rounded-2xl bg-background/40 relative border border-border/50">
                        <MagicCard
                            gradientFrom="#38bdf8"
                            gradientTo="#3b82f6"
                            gradientColor="rgba(59,130,246,0.1)"
                            className="p-4 lg:p-8 w-full overflow-hidden"
                        >
                            <div className="absolute bottom-0 right-0 bg-blue-500 w-1/4 h-1/4 blur-[8rem] z-20"></div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">
                                    Campaign Insights
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Track your campaign performance with AI-driven insights.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <div className="text-3xl font-semibold">
                                                <AnimatedNumber value={revenue} prefix="$" />
                                            </div>
                                            <div className="text-sm text-green-500 flex items-center gap-1 mt-2">
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
                                        <div className="grid grid-cols-4 text-sm text-muted-foreground py-2">
                                            <div>Campaign</div>
                                            <div>Status</div>
                                            <div>Reach</div>
                                            <div>ROI</div>
                                        </div>
                                        {campaigns.map((campaign) => (
                                            <div key={campaign.name} className="grid grid-cols-4 text-sm py-2 border-t border-border/50">
                                                <div>{campaign.name}</div>
                                                <div>{campaign.status}</div>
                                                <div className="transition-all duration-500">
                                                    <AnimatedNumber value={campaign.reach} suffix="K" />
                                                </div>
                                                <div className="font-semibold transition-all duration-500">
                                                    <AnimatedNumber value={campaign.roi} prefix="+" suffix="%" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>
                </Container>

                <Container delay={0.2}>
                    <div className="rounded-2xl bg-background/40 relative border border-border/50">
                        <MagicCard
                            gradientFrom="#38bdf8"
                            gradientTo="#3b82f6"
                            gradientColor="rgba(59,130,246,0.1)"
                            className="p-4 lg:p-8 w-full overflow-hidden"
                        >
                            <div className="absolute bottom-0 right-0 bg-sky-500 w-1/4 h-1/4 blur-[8rem] z-20"></div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">
                                    Audience Metrics
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    AI-powered analysis of audience behavior and engagement patterns.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <div className="text-3xl font-semibold">
                                                <AnimatedNumber value={audienceTotal} />
                                            </div>
                                            <div className="text-sm text-green-500 flex items-center gap-1 mt-2">
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
                                        <div className="grid grid-cols-4 text-sm text-muted-foreground py-2">
                                            <div>Channel</div>
                                            <div>Users</div>
                                            <div>Sessions</div>
                                            <div>Conv. Rate</div>
                                        </div>
                                        {channels.map((metric) => (
                                            <div key={metric.channel} className="grid grid-cols-4 text-sm py-2 border-t border-border/50">
                                                <div>{metric.channel}</div>
                                                <div className="transition-all duration-500">
                                                    <AnimatedNumber value={metric.users} suffix="K" />
                                                </div>
                                                <div className="transition-all duration-500">
                                                    <AnimatedNumber value={metric.sessions} suffix="K" />
                                                </div>
                                                <div className="font-semibold transition-all duration-500">
                                                    <AnimatedNumber value={metric.rate} suffix="%" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>
                </Container>
            </div>
        </div>
    )
};

export default Analysis;
