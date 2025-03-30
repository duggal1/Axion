'use client'
import Link from 'next/link'
import { Logo } from './logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib'
import MobileMenu from './marketing/mobile-menu'
import { NAV_LINKS } from '@/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@clerk/nextjs'
// updated 
const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
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
        <header>
            <nav
                data-state={menuState && 'active'}
                className="z-20 fixed px-2 w-full">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap justify-between items-center gap-6 lg:gap-0 py-3 lg:py-4">
                        <div className="flex justify-between w-full lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            {isMobile ? (
                                <MobileMenu isSignedIn={isSignedIn} />
                            ) : (
                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="lg:hidden block z-20 relative -m-2.5 -mr-4 p-2.5 cursor-pointer">
                                    <Menu className="in-data-[state=active]:opacity-0 m-auto size-6 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 duration-200" />
                                    <X className="absolute inset-0 opacity-0 in-data-[state=active]:opacity-100 m-auto size-6 -rotate-180 in-data-[state=active]:rotate-0 scale-0 in-data-[state=active]:scale-100 duration-200" />
                                </button>
                            )}
                        </div>

                        <div className="hidden lg:block top-0 right-0 absolute m-auto size-fit">
                            <ul className="flex gap-8 text-sm">
                                {NAV_LINKS.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="block text-muted-foreground duration-150 hover:text-accent-foreground">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="hidden in-data-[state=active]:block lg:flex lg:in-data-[state=active]:flex flex-wrap md:flex-nowrap justify-end items-center lg:gap-6 space-y-8 lg:space-y-0 bg-background lg:bg-transparent dark:lg:bg-transparent shadow-2xl shadow-zinc-300/20 lg:shadow-none dark:shadow-none lg:m-0 mb-6 p-6 lg:p-0 border lg:border-transparent rounded-3xl w-full lg:w-fit">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="block text-muted-foreground duration-150 hover:text-accent-foreground">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex sm:flex-row flex-col sm:gap-3 space-y-3 sm:space-y-0 w-full md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="#">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
