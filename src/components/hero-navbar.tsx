'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib'
import MobileMenu from './marketing/mobile-menu'
import { NAV_LINKS } from '@/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import Image from 'next/image'

export const HeroNavbar = () => {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const isMobile = useIsMobile()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 w-full z-50 font-serif">
            <nav className="w-full px-2 font-serif">
                <div className={cn(
                    'mx-auto mt-4 max-w-6xl px-6 transition-all duration-300 lg:px-12',
                    isScrolled && 'bg-white/90 max-w-5xl rounded-full border border-gray-100 shadow-sm backdrop-blur-lg lg:px-8'
                )}>
                    <div className="relative flex items-center justify-between py-3 lg:py-3 font-serif">
                        <div className="flex items-center">
                            <Link href="/">
                                <Image
                                    src="/icons/axion-logo.png"
                                    alt="Logo"
                                    width={40} // Set the desired width of your logo image here
                                    height={40} // Set the desired height of your logo image here
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
                                            className="text-gray-600 hover:text-gray-900  font-serif block duration-150 transition-shadow hover:shadow-md relative group">
                                            <span>{item.name}</span>
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden lg:block">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-serif">
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                            </div>
                            <div className="hidden lg:block">
                                <Button
                                    asChild
                                    size="sm"
                                    className="rounded-lg bg-gradient-to-r from-violet-700 to-violet-600 hover:from-violet-800 hover:to-violet-600 text-white shadow-sm hover:shadow-md transition-all font-serif">
                                    <Link href="#" className="flex items-center gap-1.5">
                                        <span>Get Started</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>
                            {isMobile && <MobileMenu />}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default HeroNavbar