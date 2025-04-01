"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/cn"
import { format } from "date-fns"
import {
  CalendarIcon,
  Filter as FilterIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Phone as PhoneIcon
} from "lucide-react"

export interface CallFilterProps {
  onFilterChange: (filters: CallFilters) => void
  className?: string
}

export interface CallFilters {
  dateRange: {
    from: Date | null
    to: Date | null
  }
  status: string[] // "completed" | "failed" | "inProgress" | "missed" | "all"
  minDuration: number | null // in seconds
  maxDuration: number | null // in seconds
}

export function CallFilter({ onFilterChange, className }: CallFilterProps) {
  const [filters, setFilters] = useState<CallFilters>({
    dateRange: {
      from: null,
      to: null
    },
    status: ["all"],
    minDuration: null,
    maxDuration: null
  })
  
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isDurationOpen, setIsDurationOpen] = useState(false)
  
  const handleStatusChange = (value: string) => {
    const newStatus = value === "all" ? ["all"] : ["all"].includes(filters.status[0]) ? [value] : 
      filters.status.includes(value) 
        ? filters.status.filter(s => s !== value)
        : [...filters.status, value]
    
    const updatedFilters = {
      ...filters,
      status: newStatus.length ? newStatus : ["all"]
    }
    
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  const handleDateChange = (range: { from: Date | null; to: Date | null }) => {
    const updatedFilters = {
      ...filters,
      dateRange: range
    }
    
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  const handleDurationChange = (type: "min" | "max", value: string) => {
    const durationInSeconds = value === "" ? null : parseInt(value) * 60 // Convert minutes to seconds
    
    const updatedFilters = {
      ...filters,
      [type === "min" ? "minDuration" : "maxDuration"]: durationInSeconds
    }
    
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  const clearFilters = () => {
    const resetFilters: CallFilters = {
      dateRange: {
        from: null,
        to: null
      },
      status: ["all"],
      minDuration: null,
      maxDuration: null
    }
    
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }
  
  const isFiltered = filters.dateRange.from || filters.dateRange.to || 
                    !filters.status.includes("all") || 
                    filters.minDuration !== null || 
                    filters.maxDuration !== null
  
  // Generate the filter summary text
  const filterSummary = () => {
    const parts: string[] = []
    
    if (filters.dateRange.from && filters.dateRange.to) {
      parts.push(`${format(filters.dateRange.from, "MMM d")} - ${format(filters.dateRange.to, "MMM d")}`)
    } else if (filters.dateRange.from) {
      parts.push(`From ${format(filters.dateRange.from, "MMM d")}`)
    } else if (filters.dateRange.to) {
      parts.push(`Until ${format(filters.dateRange.to, "MMM d")}`)
    }
    
    if (!filters.status.includes("all")) {
      parts.push(`${filters.status.length} statuses`)
    }
    
    if (filters.minDuration !== null || filters.maxDuration !== null) {
      const durationParts: string[] = []
      if (filters.minDuration !== null) {
        durationParts.push(`>${filters.minDuration / 60}m`)
      }
      if (filters.maxDuration !== null) {
        durationParts.push(`<${filters.maxDuration / 60}m`)
      }
      parts.push(durationParts.join(" "))
    }
    
    return parts.length > 0 ? parts.join(", ") : "All calls"
  }
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* Date Range Filter */}
      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "pl-3 text-left font-normal",
              filters.dateRange.from && "border-blue-300 bg-blue-50 text-blue-900"
            )}
          >
            <CalendarIcon className="mr-2 w-4 h-4" />
            {filters.dateRange.from ? (
              filterSummary().split(",")[0]
            ) : (
              "Select dates"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={filters.dateRange.from || undefined}
            selected={{
              from: filters.dateRange.from || undefined,
              to: filters.dateRange.to || undefined
            }}
            onSelect={(range) => handleDateChange({
              from: range?.from || null,
              to: range?.to || null
            })}
          />
          <div className="p-3 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                handleDateChange({from: null, to: null})
                setIsDateOpen(false)
              }}
            >
              Clear dates
            </Button>
          </div>
        </PopoverContent>
      </Popover>
  
      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "pl-3 text-left font-normal",
              !filters.status.includes("all") && "border-blue-300 bg-blue-50 text-blue-900"
            )}
          >
            <CheckCircleIcon className="mr-2 w-4 h-4" />
            {filters.status.includes("all") ? "Any status" : `${filters.status.length} statuses`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="space-y-2">
            <div className="font-medium">Status</div>
            <div className="gap-2 grid">
              <div className="gap-1 grid grid-cols-1">
                <Button
                  variant={filters.status.includes("all") ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("all")}
                >
                  All
                </Button>
                <Button
                  variant={filters.status.includes("completed") ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("completed")}
                  className="justify-start"
                >
                  <CheckCircleIcon className="mr-2 w-4 h-4 text-green-500" />
                  Completed
                </Button>
                <Button
                  variant={filters.status.includes("failed") ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("failed")}
                  className="justify-start"
                >
                  <XCircleIcon className="mr-2 w-4 h-4 text-red-500" />
                  Failed
                </Button>
                <Button
                  variant={filters.status.includes("inProgress") ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("inProgress")}
                  className="justify-start"
                >
                  <PhoneIcon className="mr-2 w-4 h-4 text-blue-500" />
                  In Progress
                </Button>
                <Button
                  variant={filters.status.includes("missed") ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("missed")}
                  className="justify-start"
                >
                  <AlertTriangleIcon className="mr-2 w-4 h-4 text-amber-500" />
                  Missed
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
  
      {/* Duration Filter */}
      <Popover open={isDurationOpen} onOpenChange={setIsDurationOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "pl-3 text-left font-normal",
              (filters.minDuration !== null || filters.maxDuration !== null) && 
              "border-blue-300 bg-blue-50 text-blue-900"
            )}
          >
            <ClockIcon className="mr-2 w-4 h-4" />
            {filters.minDuration !== null || filters.maxDuration !== null 
              ? "Duration filtered" 
              : "Any duration"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="space-y-4">
            <div className="font-medium">Call Duration (minutes)</div>
            
            <div className="gap-2 grid">
              <div className="gap-2 grid grid-cols-2">
                <div className="space-y-1">
                  <span className="text-sm">Minimum</span>
                  <Select 
                    onValueChange={(value) => handleDurationChange("min", value)}
                    value={filters.minDuration !== null ? (filters.minDuration / 60).toString() : ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="1">1 min</SelectItem>
                      <SelectItem value="2">2 min</SelectItem>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="10">10 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm">Maximum</span>
                  <Select 
                    onValueChange={(value) => handleDurationChange("max", value)}
                    value={filters.maxDuration !== null ? (filters.maxDuration / 60).toString() : ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="1">1 min</SelectItem>
                      <SelectItem value="2">2 min</SelectItem>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="10">10 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Clear filters button */}
      {isFiltered && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
          className="text-gray-500"
        >
          Clear filters
        </Button>
      )}
    </div>
  )
} 