import Container from "@/components/global/container";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from 'next/link';

export const metadata = generateMetadata({
    title: "404",
    description: "The page you're looking for doesn't exist or has been moved.",
    noIndex: true,
});

const NotFoundPage = () => {
    return (
        <main className="relative flex flex-col items-center justify-center px-4 h-dvh">
            <Wrapper>
                <Container className="flex flex-col items-center justify-center mx-auto py-16">
                    <div className="flex items-center justify-center h-full flex-col">
                        <span className="text-sm px-3.5 py-1 rounded-md bg-gradient-to-br from-violet-600 to-blue-500 text-neutral-50 custom-shadow">
                            404
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mt-5">
                        This page is currently <br/> under construction 🚧
                        </h1>
                        <p className="text-lg md:text-lg text-gray-500 font-serif leading-tight mt-5 text-center mx-auto max-w-xl">
                        we are building something great here! Please check back soon while we finish up.
                        </p>
                        <Link href="/">
                            <Button variant="subtle" className="mt-8 hover:bg-gradient-to-r from-violet-600 to-blue-500 hover:text-white">
                                <ArrowLeftIcon className="size-4 hover:text-white" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </Container>
            </Wrapper>
        </main>
    )
};

export default NotFoundPage;
