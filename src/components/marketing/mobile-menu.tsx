"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/constants";
import { ArrowRight, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
    isSignedIn?: boolean;
}

const MobileMenu = ({ isSignedIn }: MobileMenuProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="lg:hidden z-50 hover:bg-gray-100 rounded-full transition-colors">
                    <Menu className="w-5 h-5 text-gray-700" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="z-50 bg-white/95 shadow-xl backdrop-blur-xl pt-12 border-l w-full sm:w-[320px]">
                <SheetHeader className="mb-10">
                    <div className="flex justify-between items-center">
                        <div className="bg-gray-200 rounded-full w-10 h-0.5"></div>
                        <div className="font-medium text-gray-500 text-sm">Menu</div>
                        <div className="bg-gray-200 rounded-full w-10 h-0.5"></div>
                    </div>
                </SheetHeader>
                <nav className="flex flex-col">
                    {NAV_LINKS.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="group flex justify-between items-center py-4 border-gray-100 border-b text-gray-800 hover:text-black transition-colors"
                        >
                            <span className="font-medium text-base">{link.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-all group-hover:translate-x-1" />
                        </Link>
                    ))}

                    <div className="space-y-4 mt-10">
                        {isSignedIn ? (
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-violet-600 hover:from-blue-600 to-indigo-600 hover:to-violet-600 shadow-md hover:shadow-lg rounded-xl w-full text-white transition-all">
                                <Link href="/dashboard" className="flex justify-center items-center gap-2">
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="hover:bg-gray-50 border-gray-200 rounded-xl w-full text-gray-700 hover:text-black transition-colors">
                                    <Link href="/auth/signin">
                                        <span>Login</span>
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-violet-600 hover:from-blue-600 to-indigo-600 hover:to-violet-600 shadow-md hover:shadow-lg rounded-xl w-full text-white transition-all">
                                    <Link href="/auth/signup" className="flex justify-center items-center gap-2">
                                        <span>Get Started</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="mt-10 pt-6 border-gray-100 border-t">
                        <div className="flex justify-center items-center gap-6">
                            <Link href="#" className="text-gray-500 hover:text-gray-800 text-xs transition-colors">Terms</Link>
                            <Link href="#" className="text-gray-500 hover:text-gray-800 text-xs transition-colors">Privacy</Link>
                            <Link href="#" className="text-gray-500 hover:text-gray-800 text-xs transition-colors">Contact</Link>
                        </div>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    )
};

export default MobileMenu
