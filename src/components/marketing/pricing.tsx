"use client";

import { PLANS } from "@/constants";
import { PLAN } from "@/constants/plans";
import { cn } from "@/lib";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import Container from "../global/container";
import { Button } from "../ui/button";

type Plan = "monthly" | "annually";

const Pricing = () => {
    const [billPlan, setBillPlan] = useState<Plan>("monthly");

    const handleSwitch = () => {
        setBillPlan((prev) => (prev === "monthly" ? "annually" : "monthly"));
    };

    return (
        <div className="relative flex flex-col items-center justify-center max-w-5xl py-20 mx-auto">
            {/* Background gradient for white mode */}
            <div className="absolute inset-0 pointer-events-none"></div>

            <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
                <Container>
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl lg:text-5xl font-serif font-medium !leading-snug mt-6">
                            Find the right plan that suits <br className="hidden lg:block" /> <span className="font-serif italic">your needs</span>
                        </h2>
                        <p className="text-base md:text-base text-center text-gray-500 mt-6 font-serif">
                            Transform your marketing with AI-powered automation. Create campaigns faster, generate better content, and make smarter decisions in minutes.
                        </p>
                    </div>
                </Container>

                <Container delay={0.2}>
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        <span className="text-base font-medium font-serif">Monthly</span>
                        <button
                            onClick={handleSwitch}
                            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
                            aria-label={`Switch to ${billPlan === "monthly" ? "annually" : "monthly"} billing`}
                        >
                            <div className="w-14 h-7 transition rounded-full shadow-sm outline-none bg-gradient-to-r from-blue-400 to-blue-600"></div>
                            <div
                                className={cn(
                                    "absolute inline-flex items-center justify-center w-5 h-5 transition-all duration-300 ease-in-out top-1 left-1 rounded-full bg-white shadow-md",
                                    billPlan === "annually" ? "translate-x-7" : "translate-x-0"
                                )}
                            />
                        </button>
                        <span className="text-base font-medium font-serif">Annually</span>
                        <span className="ml-1 text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Save 30%</span>
                    </div>
                </Container>
            </div>

            <div className="grid w-full grid-cols-1 md:grid-cols-3 pt-12 lg:pt-16 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {PLANS.map((plan, idx) => (
                    <Container key={idx} delay={0.1 * idx + 0.2}>
                        <PlanCard key={plan.id} plan={plan} billPlan={billPlan} />
                    </Container>
                ))}
            </div>
        </div>
    );
};

const PlanCard = ({ plan, billPlan }: { plan: PLAN, billPlan: Plan }) => {
    // Calculate monthly price and savings
    const monthlyPrice = plan.monthlyPrice;
    const annualPrice = plan.annuallyPrice;
    const annualMonthlyEquivalent = Math.round(annualPrice / 12);
    const savingsAmount = Math.round(monthlyPrice * 12 - annualPrice);
    const savingsPercentage = Math.round((1 - (annualPrice / (monthlyPrice * 12))) * 100);

    const isProfessional = plan.id === "professional";

    return (
        <div
            className={cn(
                "flex flex-col relative rounded-2xl transition-all items-start w-full border overflow-hidden h-full bg-white shadow-sm hover:shadow-md transition-all duration-300",
                isProfessional
                    ? "border-blue-400 shadow-blue-100/50 scale-105 z-10"
                    : "border-gray-200 hover:border-gray-300"
            )}
        >
            {/* Professional plan highlight */}
            {isProfessional && (
                <>
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    <div className="absolute -top-5 -right-5 size-24 bg-blue-500 rotate-45"></div>
                    <div className="absolute top-2 right-2 z-10">
                        <span className="bg-white text-blue-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                            Most Popular
                        </span>
                    </div>
                </>
            )}

            <div className={cn(
                "p-6 flex flex-col items-start w-full relative",
                isProfessional ? "bg-gradient-to-b from-blue-50 to-white" : ""
            )}>
                <h2 className="font-serif font-semibold text-xl text-gray-900">
                    {plan.title}
                </h2>

                <div className="mt-4 flex items-baseline">
                    <h3 className="text-3xl font-serif font-bold md:text-4xl text-gray-900">
                        <NumberFlow
                            value={billPlan === "monthly" ? plan.monthlyPrice : annualMonthlyEquivalent}
                            suffix="/mo"
                            format={{
                                currency: "USD",
                                style: "currency",
                                currencySign: "standard",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                                currencyDisplay: "narrowSymbol"
                            }}
                        />
                    </h3>

                    {billPlan === "annually" && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                            ${monthlyPrice}/mo
                        </span>
                    )}
                </div>

                {billPlan === "annually" && (
                    <div className="mt-1 text-sm text-green-600 font-medium">
                        Save ${savingsAmount}/year ({savingsPercentage}% off)
                    </div>
                )}

                <p className="text-sm md:text-base text-gray-600 mt-3 font-serif">
                    {plan.desc}
                </p>
            </div>

            <div className="flex flex-col items-start w-full px-6 py-4">
                <Button
                    size="lg"
                    variant={isProfessional ? "blue" : "outline"}
                    className={cn(
                        "w-full font-serif shadow-sm",
                        isProfessional
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            : "hover:bg-gray-50"
                    )}
                >
                    {plan.buttonText}
                </Button>

                <div className="h-8 overflow-hidden w-full mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={billPlan}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="text-sm text-center text-gray-500 mt-3 mx-auto block font-serif"
                        >
                            {billPlan === "monthly" ? (
                                "Billed monthly"
                            ) : (
                                `Billed annually at $${annualPrice}`
                            )}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex flex-col items-start w-full p-6 mt-2 gap-y-3 flex-grow">
                <span className="text-base font-medium text-gray-900 mb-2 font-serif">
                    Includes:
                </span>
                {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className={cn(
                            "flex items-center justify-center rounded-full p-0.5 mt-0.5",
                            isProfessional ? "bg-green-100" : "bg-green-50"
                        )}>
                            <CheckIcon className={cn(
                                "size-4",
                                isProfessional ? "text-green-600" : "text-green-500"
                            )} />
                        </div>
                        <span className="text-gray-700 font-serif">{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
