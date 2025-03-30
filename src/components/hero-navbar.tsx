'use client'
import Link from 'next/link'
import { ArrowRight, ZapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib'
import MobileMenu from './marketing/mobile-menu'
import { NAV_LINKS } from '@/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'

export const HeroNavbar = () => {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const isMobile = useIsMobile()
    const { isSignedIn } = useAuth()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="top-0 left-0 z-50 fixed w-full font-serif">
            <nav className="px-2 w-full font-serif">
                <div className={cn(
                    'mx-auto mt-4 max-w-6xl px-6 transition-all duration-300 lg:px-12',
                    isScrolled && 'bg-white/90 max-w-5xl rounded-full border border-gray-100 shadow-sm backdrop-blur-lg lg:px-8'
                )}>
                    <div className="relative flex justify-between items-center py-3 lg:py-3 font-serif">
                        <div className="flex items-center">
                            <Link href="/">
                                <Image
                                    src="/icons/axion-logo.png"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    priority
                                    className="mr-4"
                                />
                            </Link>
                        </div>

                        <div className="hidden lg:block">
                            <ul className="flex gap-8 text-sm">
                                {NAV_LINKS.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="group block relative hover:shadow-md font-serif text-gray-600 hover:text-gray-900 transition-shadow duration-150">
                                            <span>{item.name}</span>
                                            <span className="bottom-0 left-0 absolute bg-gray-900 w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            {isSignedIn ? (
                                <div className="hidden lg:block">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-gradient-to-r from-violet-700 hover:from-violet-800 to-violet-600 hover:to-violet-600 shadow-sm hover:shadow-md rounded-lg font-serif text-white transition-all">
                                        <Link href="/dashboard" className="flex items-center gap-1.5">
                                            <span>Dashboard</span>
                                            <ZapIcon className=" ml-1  size-3.5 fill-white text-white" />
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden lg:block">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-gray-100 rounded-lg font-serif text-gray-700 hover:text-gray-900 transition-colors">
                                            <Link href="/auth/signin">
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="hidden lg:block">
                                        <Button
                                            asChild
                                            size="sm"
                                            className="bg-gradient-to-r from-violet-700 hover:from-violet-800 to-violet-600 hover:to-violet-600 shadow-sm hover:shadow-md rounded-lg font-serif text-white transition-all">
                                            <Link href="/auth/signup" className="flex items-center gap-1.5">
                                                <span>Get Started</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                            {isMobile && <MobileMenu isSignedIn={isSignedIn} />}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default HeroNavbar