
// import Navbar from "@/components/marketing/navbar";
import Footer from '@/components/marketing/Footer/New-footer';
import React from 'react';

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <>
            {/* <Navbar /> */}
            <main className="z-40 relative mx-auto w-full">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default MarketingLayout
