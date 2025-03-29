/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
"use client";

import { cn } from "@/lib";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    
    // Set canvas width to be wider than the viewport to ensure full coverage
    w = ctx.canvas.width = window.innerWidth * 1.2;
    h = ctx.canvas.height = window.innerHeight;
    
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth * 1.2;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    
    render();
  };

  const waveColors = colors ?? [
    "#aa00ff",
    "#d400ff",
    "#fb00ff",
    "#cf78e3",
    "#8f0a94",
  ];

  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      
      // Start and end well outside the viewport
      const startX = -w * 0.2;
      const endX = w * 1.2;
      
      ctx.moveTo(startX, h * 0.5);
      for (x = startX; x < endX; x += 5) {
        // Fixed the syntax error with proper operators
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      
      ctx.lineTo(endX, h * 0.5);
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    ctx.fillStyle = backgroundFill || "white";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // Support for Safari browsers
    setIsSafari(
      typeof window !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <canvas
        className="z-0 absolute inset-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
          // Position the canvas to cover the entire viewport with some overflow
          left: "-10%",
          width: "120%",
          transform: "translateX(0)", // Force hardware acceleration
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};