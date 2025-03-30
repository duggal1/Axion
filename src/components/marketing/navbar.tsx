import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Icons from "../global/icons";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";
import MobileMenu from "./mobile-menu";
import { useAuth } from '@clerk/nextjs'

const Navbar = () => {
    const { isSignedIn } = useAuth()
    
    return (
        <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-sm w-full h-16">
            <Wrapper className="h-full">
                <div className="flex justify-between items-center h-full">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Icons.icon className="w-6" />
                            <span className="hidden lg:block font-semibold text-xl">
                                Vetra
                            </span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <ul className="flex items-center gap-8">
                            {NAV_LINKS.map((link, index) => (
                                <li key={index} className="font-medium text-sm -1 link">
                                    <Link href={link.href}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="#" className="hidden lg:block">
                            <Button variant="blue">
                                Get Started
                            </Button>
                        </Link>
                        <MobileMenu isSignedIn={isSignedIn} />
                    </div>
                </div>
            </Wrapper>
        </header>
    )
};

export default Navbar
