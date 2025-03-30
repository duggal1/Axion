import React from 'react';

interface Props {
    children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
    return (
        <main className="relative bg-gray-50 w-full min-h-screen font-serif">
            <div className="top-0 left-0 absolute flex justify-center pt-8 w-full">
                <div className="text-center">
                    <h1 className="font-serif font-semibold text-gray-900 text-3xl">Axion</h1>
                    <p className="mt-1 text-gray-500 text-sm">Secure authentication</p>
                </div>
            </div>
            
            {children}
            
            <footer className="bottom-0 left-0 absolute pb-4 w-full text-gray-500 text-xs text-center">
                © {new Date().getFullYear()} Axion. All rights reserved.
            </footer>
        </main>
    );
};

export default AuthLayout

