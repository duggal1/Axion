"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlayIcon, PauseIcon, RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { vapiService } from '@/lib/vapi-client'

interface VoicePreviewProps {
  voiceId: string
  compact?: boolean
  autoDownload?: boolean
  onPlayStart?: () => void
  onPlayEnd?: () => void
}

export function VoicePreview({
  voiceId,
  compact = false,
  autoDownload = false,
  onPlayStart,
  onPlayEnd
}: VoicePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])
  
  // Auto-download if requested
  useEffect(() => {
    if (autoDownload) {
      downloadSample()
    }
  }, [autoDownload, voiceId])
  
  const togglePlayback = async () => {
    if (isPlaying && audioRef.current) {
      // Stop playing
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      onPlayEnd?.()
      return
    }
    
    try {
      setIsLoading(true)
      // Get sample URL using vapiService
      const sampleUrl = await vapiService.getVoiceSampleUrl(voiceId)
      
      // Create and play audio
      const audio = new Audio(sampleUrl)
      
      audio.onended = () => {
        setIsPlaying(false)
        onPlayEnd?.()
      }
      
      audio.oncanplaythrough = () => {
        setIsLoading(false)
      }
      
      audio.onerror = () => {
        toast.error('Failed to play voice sample')
        setIsPlaying(false)
        setIsLoading(false)
        onPlayEnd?.()
      }
      
      await audio.play()
      audioRef.current = audio
      setIsPlaying(true)
      onPlayStart?.()
    } catch (error) {
      console.error('Error playing voice sample:', error)
      toast.error('Failed to play voice sample')
      setIsPlaying(false)
      setIsLoading(false)
    }
  }
  
  const downloadSample = async () => {
    try {
      setIsDownloading(true)
      
      // Call endpoint to download or create the sample
      const response = await fetch(`/api/vapi/voice-samples/download?voiceId=${voiceId}`)
      
      if (!response.ok) {
        throw new Error('Failed to download voice sample')
      }
      
      const data = await response.json()
      
      if (data.status === 'downloaded') {
        toast.success('Voice sample downloaded')
      }
    } catch (error) {
      console.error('Error downloading voice sample:', error)
      toast.error('Failed to download voice sample')
    } finally {
      setIsDownloading(false)
    }
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={compact ? "icon" : "sm"}
        className={compact ? "h-8 w-8" : ""}
        disabled={isLoading}
        onClick={togglePlayback}
      >
        {isLoading ? (
          <div className="border-primary border-t-2 border-solid rounded-full w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <>
            <PauseIcon className="w-4 h-4" />
            {!compact && <span className="ml-2">Stop</span>}
          </>
        ) : (
          <>
            <PlayIcon className="w-4 h-4" />
            {!compact && <span className="ml-2">Play</span>}
          </>
        )}
      </Button>
      
      {!compact && (
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          disabled={isDownloading}
          onClick={downloadSample}
          title="Refresh voice sample"
        >
          {isDownloading ? (
            <div className="border-primary border-t-2 border-solid rounded-full w-4 h-4 animate-spin" />
          ) : (
            <RefreshCwIcon className="w-3 h-3" />
          )}
        </Button>
      )}
    </div>
  )
} 