/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { cn } from "@/lib/"
import { CheckIcon } from "lucide-react"

export interface StepperProps {
  activeStep: number
  children: React.ReactNode
  className?: string
}

interface StepProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function Stepper({ activeStep, children, className }: StepperProps) {
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[]
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = activeStep === index
          const isCompleted = activeStep > index
          
          return (
            <React.Fragment key={index}>
              <div className={cn(
                "relative flex items-center justify-center",
                isCompleted ? "text-white" : isActive ? "text-blue-600" : "text-gray-400"
              )}>
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all z-10",
                  isCompleted
                    ? "bg-blue-600 border-blue-600" 
                    : isActive 
                    ? "bg-white border-blue-600"
                    : "bg-white border-gray-300"
                )}>
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5 text-white" />
                  ) : step.props.icon ? (
                    <div className={isActive ? "text-blue-600" : "text-gray-400"}>
                      {step.props.icon}
                    </div>
                  ) : (
                    <span className={isActive ? "text-blue-600" : "text-gray-500"}>
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div className={cn(
                  "absolute top-12 w-max text-center transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0 sm:opacity-100"
                )}>
                  <div className={cn(
                    "font-medium text-sm",
                    isCompleted || isActive ? "text-gray-900" : "text-gray-500"
                  )}>
                    {step.props.title}
                  </div>
                  {step.props.description && (
                    <div className="hidden sm:block text-gray-500 text-xs">
                      {step.props.description}
                    </div>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-auto border-t-2 transition-colors",
                  isCompleted ? "border-blue-600" : "border-gray-300",
                )}></div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export function Step({ title, description, icon, className }: StepProps) {
  return <></>
} 