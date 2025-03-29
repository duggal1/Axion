"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/constants";
import { ArrowRight, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";

const MobileMenu = () => {
    return (
        <Sheet>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="lg:hidden z-50 rounded-full hover:bg-gray-100 transition-colors">
                    <Menu className="h-5 w-5 text-gray-700" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[320px] pt-12 bg-white/95 backdrop-blur-xl z-50 border-l shadow-xl">
                <SheetHeader className="mb-10">
                    <div className="flex items-center justify-between">
                        <div className="h-0.5 w-10 bg-gray-200 rounded-full"></div>
                        <div className="text-sm font-medium text-gray-500">Menu</div>
                        <div className="h-0.5 w-10 bg-gray-200 rounded-full"></div>
                    </div>
                </SheetHeader>
                <nav className="flex flex-col">
                    {NAV_LINKS.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="group flex items-center justify-between py-4 border-b border-gray-100 text-gray-800 hover:text-black transition-colors"
                        >
                            <span className="text-base font-medium">{link.name}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))}

                    <div className="mt-10 space-y-4">
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full rounded-xl border-gray-200 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors">
                            <Link href="#">
                                <span>Login</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-blue-600 hover:to-violet-600 text-white shadow-md hover:shadow-lg transition-all">
                            <Link href="#" className="flex items-center justify-center gap-2">
                                <span>Get Started</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-6">
                            <Link href="#" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Terms</Link>
                            <Link href="#" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Privacy</Link>
                            <Link href="#" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Contact</Link>
                        </div>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    )
};

export default MobileMenu
