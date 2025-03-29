import { cn } from "@/lib/";
import {HTMLAttributes} from "react";

export function Tag({className, children, ...props}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("inline-flex border border-violet-400 gap-2 text-violet-700 px-3 py-1 rounded-full items-center uppercase", className)} {...props}>
      <span>&#10038;</span>
      <span className="text-sm">{children}</span>
    </div>
  )
}