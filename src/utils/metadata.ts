/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from "next";

interface MetadataProps {
    title?: string;
    description?: string;
    icons?: Metadata["icons"];
    noIndex?: boolean;
    keywords?: string[];
    author?: string;
    twitterHandle?: string;
    type?: "website" | "article" | "profile";
    locale?: string;
    alternates?: Record<string, string>;
    publishedTime?: string;
    modifiedTime?: string;
}

export const generateMetadata = ({
    title = `Axion - The Most Advanced AI-Agentic Sales Agent for Enterprises`,
    description = `Axion is the leading AI-agentic sales automation platform that replaces entire sales teams. From prospecting to closing deals, Axion handles every aspect of sales, ensuring maximum revenue with minimal human effort. Automate, optimize, and dominate sales with Axion today.`,
    icons = [
        {
            rel: "icon",
            url: "/icons/axion-logo.png",
            media: "(prefers-color-scheme: light)",
        },
        {
            rel: "icon",
            url: "/icons/axion-logo.png",
            media: "(prefers-color-scheme: dark)",
        },
    ],
    noIndex = false,
    keywords = [
        "AI sales automation",
        "enterprise sales AI",
        "AI sales agent",
        "autonomous sales assistant",
        "AI-powered sales team",
        "AI prospecting",
        "lead conversion AI",
        "sales workflow automation",
        "business revenue AI",
        "digital sales agent"
    ],
    author = process.env.NEXT_PUBLIC_AUTHOR_NAME,
    type = "website",
}: MetadataProps = {}): Metadata => {
    const metadataBase = new URL(process.env.NEXT_PUBLIC_APP_URL || "https://axion-ai.vercel.app");

    return {
        metadataBase,
        title: {
            template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
            default: title
        },
        description,
        keywords,
        authors: [{ name: author }],
        creator: author,
        publisher: process.env.NEXT_PUBLIC_APP_NAME,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        icons,
    };
};
