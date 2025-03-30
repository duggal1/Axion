"use client";

import { SUPPORTED_LANGUAGES } from "@/constants/countries";
import {Plus } from "lucide-react";
import { useState } from "react";
import Container from "../global/container";
import { cn } from "@/lib";

const LanguageSupport = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="relative flex flex-col items-center justify-center max-w-5xl py-20 mx-auto">
            {/* Background elements */}
            <div className="absolute inset-0  pointer-events-none"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-3/5 h-14 lg:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full -rotate-12 blur-[10rem] -z-10"></div>
            
            <Container>
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-medium !leading-snug mb-6">
                        Axion: Trusted and Used in <span className="font-serif italic">86+ Countries</span>
                    </h2>

                    {/* Worldwide reach stats
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-4 mb-10">
                        {[{ icon: Globe, count: "86+", text: "Powering businesses worldwide" },
                          { icon: Users, count: "58+", text: "Trusted by industry leaders" }].map((stat, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                                    <stat.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-serif font-bold text-gray-900">{stat.count}</span>
                                    <span className="text-sm text-gray-600 font-serif">{stat.text}</span>
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>
            </Container>

            {/* Language Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto pt-6 relative w-full">
                {SUPPORTED_LANGUAGES.map((language, idx) => (
                    <div
                        key={language.code}
                        className="relative"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {hoveredIndex === idx && (
                            <div className="absolute inset-0 bg-white rounded-xl blur-md opacity-70 -z-10 animate-pulse"></div>
                        )}
                        
                        <Container
                            delay={0.05 * idx}
                            className={cn(
                                "flex items-center space-x-3 p-3 rounded-xl transition-all duration-300",
                                hoveredIndex === idx
                                    ? "bg-white shadow-lg scale-105 text-gray-900 border border-gray-100"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            <span className={cn("text-2xl transition-all duration-300", hoveredIndex === idx ? "scale-125" : "")}>{language.flag}</span>
                            <span className="text-base lg:text-lg font-serif">{language.name}</span>
                        </Container>
                    </div>
                ))}

                {/* More Languages Placeholder */}
                <div
                    className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(999)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <span className={cn("flex items-center justify-center w-8 h-8 rounded-full bg-gray-100", hoveredIndex === 999 ? "bg-blue-100" : "")}
                    >
                        <Plus size={16} className={cn("transition-all duration-300", hoveredIndex === 999 ? "text-blue-600" : "text-gray-600")} />
                    </span>
                    <span className="text-base lg:text-lg font-serif">And more</span>
                </div>
            </div>
        </div>
    );
};

export default LanguageSupport;