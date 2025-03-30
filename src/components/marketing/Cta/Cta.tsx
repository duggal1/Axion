"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib";
import { DIcons } from "dicons";
import { useAnimate } from "framer-motion";

import { Button, buttonVariants } from "@/components/ui/button";

import { HighlighterItem, HighlightGroup, Particles } from "@/components/ui/highlighter";

export function Ctas() {
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    animate(
      [
        ["#pointer", { left: 200, top: 60 }, { duration: 0 }],
        ["#javascript", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 50, top: 102 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#javascript", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#react-js", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 224, top: 170 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#react-js", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#typescript", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 88, top: 198 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#typescript", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#next-js", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 200, top: 60 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#next-js", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      },
    );
  }, [animate]);
  return (
    <section className="relative mx-auto mb-20 mt-6 max-w-5xl font-serif">
           <HighlightGroup className="group h-full">
        <div
          className="group/item h-full md:col-span-6 lg:col-span-12"
          data-aos="fade-down"
        >
          <HighlighterItem className="rounded-3xl p-6">
            <div className="relative z-20 h-full overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-white to-violet-50 font-serif shadow-lg dark:border-violet-800/30 dark:bg-black dark:from-black dark:to-violet-950/20">
              <Particles
                className="absolute inset-0 -z-10 opacity-20 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-40"
                quantity={200}
                color="#d946ef"
                vy={-0.2}
              />
              <div className="flex justify-center">
                <div className="flex h-full flex-col justify-center gap-10 p-4 md:h-[300px] md:flex-row">
                  <div
                    className="relative mx-auto h-[270px] w-[300px] md:h-[270px] md:w-[300px]"
                    ref={scope}
                  >
                    <DIcons.Designali className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-violet-700 dark:text-violet-400" />
                    <div
                      id="next-js"
                      className="absolute bottom-12 left-14 rounded-3xl border border-violet-400 bg-purple-600  px-2 py-1.5 text-xs font-serif text-white/90 opacity-50 shadow-sm dark:border-violet-700 dark:bg-slate-800 dark:text-violet-300"
                    >
                      UI-UX
                    </div>
                    <div
                      id="react-js"
                      className="absolute left-2 top-20 rounded-3xl border border-violet-400 bg-purple-600 px-2 py-1.5 text-xs font-serif text-white opacity-50 shadow-sm dark:border-violet-700 dark:bg-slate-800 dark:text-violet-300"
                    >
                      Graphic Design
                    </div>
                    <div
                      id="typescript"
                      className="absolute bottom-20 right-1 rounded-3xl border border-violet-400 bg-purple-600 px-2 py-1.5 text-xs font-serif text-white/90 opacity-50 shadow-sm dark:border-violet-700 dark:bg-slate-800 dark:text-violet-300"
                    >
                      Web Application
                    </div>
                    <div
                      id="javascript"
                      className="absolute right-12 top-10 rounded-3xl border border-violet-400 bg-purple-600 px-2 py-1.5 text-xs font-serif text-white/90 opacity-50 shadow-sm dark:border-violet-700 dark:bg-slate-800 dark:text-violet-300"
                    >
                      Branding
                    </div>

                    <div id="pointer" className="absolute">
                      <svg
                        width="16.8"
                        height="18.2"
                        viewBox="0 0 12 13"
                        className="fill-pink-500"
                        stroke="white"
                        strokeWidth="1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                        />
                      </svg>
                      <span className="relative -top-1 left-3 rounded-3xl bg-gradient-to-bl from-violet-600  to-pink-500 px-2 py-1 text-xs font-serif text-white shadow-sm">
                        Axion
                      </span>
                    </div>
                  </div>

                  <div className="-mt-20 flex h-full flex-col justify-center p-2 md:-mt-4 md:ml-10 md:w-[400px]">
                    <div className="flex flex-col items-center">
                      <h3 className="mt-6 pb-1 font-serif">
                        <span className="text-gray-900 text-3xl">
                          Axion
                        </span>
                      </h3>
                    </div>
                    <p className="mb-4 text-center text-gray-600 dark:text-violet-300">
                      An AI agent for teams that handles sales tasks and work of as many as 15 people
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link
                        href={"https://cal.com/duggalji/15min"}
                        target="_blank"
                      >
                        <Button className="bg-gradient-to-r from-black to-gray-950 px-6 font-serif text-white shadow-md transition-all hover:from-black/70 hover:to-gray-800 hover:shadow-lg dark:from-violet-600 dark:to-pink-500 dark:hover:from-violet-700 dark:hover:to-pink-600">Book a call</Button>
                      </Link>
                      <Link
                        href="mailto:harshitduggal29@gmail.com"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "icon",
                          }),
                          "border-violet-300 text-violet-700 hover:border-pink-400 hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white dark:border-violet-700 dark:text-pink-400"
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <DIcons.Mail strokeWidth={1.5} className="h-5 w-5" />
                        </span>
                      </Link>
                      <Link
                        href="https://wa.me/917678432186"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "icon",
                          }),
                          "border-violet-300 text-violet-700 hover:border-pink-400 hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white dark:border-violet-700 dark:text-pink-400"
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <DIcons.WhatsApp
                            strokeWidth={1.5}
                            className="h-4 w-4"
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HighlighterItem>
        </div>
      </HighlightGroup>
    </section>
  );
};