/* eslint-disable @next/next/no-img-element */
"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import HeroVideoDialog from '../magicui/hero-video-dialog'
import HeroNavbar from '../hero-navbar'


const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export default function Hero() {
  
  
  return (
    <>
<HeroNavbar /> 
      <main className="overflow-hidden -mt-10">
        <div
          aria-hidden
          className="hidden lg:block isolate absolute inset-0 opacity-65 contain-strict">
          <div className="top-0 left-0 absolute bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)] rounded-full w-140 h-320 -rotate-45 -translate-y-87.5" />
          <div className="top-0 left-0 absolute bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] rounded-full w-60 h-320 -rotate-45 [translate:5%_-50%]" />
          <div className="top-0 left-0 absolute bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] w-60 h-320 -rotate-45 -translate-y-87.5" />
        </div>
        <section>
          <div className="relative pt-32 md:pt-44">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="-z-20 absolute inset-0 -mt-12">
              <img
                src="https://res.cloudinary.com/dg4jhba5c/image/upload/v1741605538/night-background_ni3vqb.jpg"
                alt="background"
                className="hidden dark:block top-56 lg:top-32 -z-20 absolute inset-x-0"
                width="3276"
                height="4095"
              />
            </AnimatedGroup>
            <div className="-z-10 absolute inset-0 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto px-6 max-w-7xl">
              <div className="sm:mx-auto lg:mt-0 lg:mr-auto text-center">
           
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="group flex items-center gap-4 bg-muted hover:bg-background shadow-md shadow-violet-600 hover:shadow-violet-900 dark:shadow-zinc-950 mx-auto p-1 pl-4 border dark:border-t-white/5 dark:hover:border-t-border rounded-full w-fit transition-colors duration-300">
                    <span className="text-foreground  font-serif text-sm">Get AI Sales on Autopilot</span>
                    <span className="block bg-gray-600 dark:bg-zinc-700 dark:border-background border-l w-0.5 h-4"></span>
                    <div className="bg-background group-hover:bg-muted rounded-full size-6 overflow-hidden duration-500">
                      <div className="flex w-12 -translate-x-1/2 group-hover:translate-x-0 duration-500 ease-in-out">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>
                

                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mt-8 text-balance font-serif text-6xl md:text-6xl lg:mt-16 xl:text-6xl">
                             AI Sales Agent That Finds, Engages & Closes Deals for You
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl font-serif text-balance text-lg">
                                Axion handles prospecting, outreach, and follow-ups—fully automated. Get 5,000+ high-quality leads/month, book more calls, and close deals faster. No manual work. Just results.
                                </TextEffect>

                               
                  
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                               
                              
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="#link">
                                                <span className="text-nowrap font-serif">Start Building</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="ghost"
                                            className="h-10.5 rounded-xl px-5">
                                            <Link href="#link">
                                                <span className="text-nowrap hover:text-gray-500 font-serif">Request a demo</span>
                                            </Link>
                                        </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        
                        </div>
         
         
            
            {/* Video Dialog replacing the images */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-10">
              <div className="mx-auto px-6 max-w-6xl">
                <HeroVideoDialog
                  className="dark:hidden block"
                  animationStyle="from-center"
                  videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                  thumbnailAlt="Hero Video"
                />
                <HeroVideoDialog
                  className="hidden dark:block"
                  animationStyle="from-center"
                  videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                  thumbnailAlt="Hero Video"
                />
              </div>
            </AnimatedGroup>
   
        </section> 
        
        {/* <section className="bg-background pt-16 pb-16 md:pb-32">
          <div className="group relative m-auto px-6 max-w-5xl">
            <div className="z-10 absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 duration-500">
              <Link
                href="/"
                className="block hover:opacity-75 text-sm duration-150">
                <span> Meet Our Customers</span>
                <ChevronRight className="inline-block ml-1 size-3" />
              </Link>
            </div>
            <div className="gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-14 grid grid-cols-4 group-hover:opacity-50 group-hover:blur-xs mx-auto mt-12 max-w-2xl transition-all duration-500">
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-5"
                  src="https://html.tailus.io/blocks/customers/nvidia.svg"
                  alt="Nvidia Logo"
                  height="20"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-4"
                  src="https://html.tailus.io/blocks/customers/column.svg"
                  alt="Column Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-4"
                  src="https://html.tailus.io/blocks/customers/github.svg"
                  alt="GitHub Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-5"
                  src="https://html.tailus.io/blocks/customers/nike.svg"
                  alt="Nike Logo"
                  height="20"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-5"
                  src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                  alt="Lemon Squeezy Logo"
                  height="20"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-4"
                  src="https://html.tailus.io/blocks/customers/laravel.svg"
                  alt="Laravel Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-7"
                  src="https://html.tailus.io/blocks/customers/lilly.svg"
                  alt="Lilly Logo"
                  height="28"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="dark:invert mx-auto w-fit h-6"
                  src="https://html.tailus.io/blocks/customers/openai.svg"
                  alt="OpenAI Logo"
                  height="24"
                  width="auto"
                />
              </div>
            </div>
        //   </div>
        // </section> */}
      </main>
    </>
  )
}