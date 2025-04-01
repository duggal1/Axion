"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  PhoneIcon,
  Settings2Icon,
  HistoryIcon,
  ClockIcon,
  VolumeIcon,
  ArrowLeftIcon,
  SquareIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { vapiService } from '@/lib/vapi-client'
import { VoicePreview } from '@/components/agent/voice-preview'

interface Agent {
  id: string
  name: string
  description?: string
  firstMessage: string
  systemPrompt: string
  voiceId: string
  languageModel: string
  createdAt: string
  updatedAt: string
}

interface CallLog {
  id: string
  agentId: string
  userId: string
  startTime: string
  endTime?: string
  duration?: number
  status: string
}

export default function AgentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [agent, setAgent] = useState<Agent | null>(null)
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [callLoading, setCallLoading] = useState(false)
  const [activeCallId, setActiveCallId] = useState<string | null>(null)
  const [vapiKeySet, setVapiKeySet] = useState(false)
  
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/agents/${id}`)
        if (!response.ok) throw new Error('Failed to fetch agent')
        
        const data = await response.json()
        setAgent(data.agent)
        
        // Check for Vapi API key in localStorage
        const apiKey = localStorage.getItem('vapi_api_key')
        if (apiKey) {
          vapiService.init(apiKey)
          setVapiKeySet(true)
        }
        
        // Fetch call logs
        fetchCallLogs()
      } catch (error) {
        console.error('Error fetching agent:', error)
        toast.error('Failed to load agent details')
      } finally {
        setLoading(false)
      }
    }
    
    const fetchCallLogs = async () => {
      try {
        const response = await fetch(`/api/calls?agentId=${id}`)
        if (!response.ok) throw new Error('Failed to fetch call logs')
        
        const data = await response.json()
        setCallLogs(data.calls || [])
      } catch (error) {
        console.error('Error fetching call logs:', error)
        toast.error('Failed to load call history')
      }
    }
    
    fetchAgent()
  }, [id])
  
  const startCall = async () => {
    if (!agent) return
    
    if (!vapiKeySet) {
      const apiKey = prompt('Please enter your Vapi API key:')
      if (!apiKey) return
      
      vapiService.init(apiKey)
      localStorage.setItem('vapi_api_key', apiKey)
      setVapiKeySet(true)
    }
    
    try {
      setCallLoading(true)
      const callResponse = await vapiService.startCall({
        assistantId: id,
        userId: 'web-user',
        metadata: {
          source: 'web-interface',
          timestamp: new Date().toISOString()
        }
      })
      
      setActiveCallId(callResponse.callId)
      toast.success('Call started successfully')
      
      // Also log the call in our database
      await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentId: id,
          callId: callResponse.callId,
          status: 'active'
        })
      })
      
    } catch (error) {
      console.error('Error starting call:', error)
      toast.error('Failed to start call')
    } finally {
      setCallLoading(false)
    }
  }
  
  const endCall = async () => {
    if (!activeCallId) return
    
    try {
      await vapiService.endCall(activeCallId)
      toast.success('Call ended')
      setActiveCallId(null)
      
      // Update call status in database
      await fetch(`/api/calls/${activeCallId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'completed',
          endTime: new Date().toISOString()
        })
      })
      
      // Refresh call logs
      const response = await fetch(`/api/calls?agentId=${id}`)
      if (response.ok) {
        const data = await response.json()
        setCallLogs(data.calls || [])
      }
      
    } catch (error) {
      console.error('Error ending call:', error)
      toast.error('Failed to end call')
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-primary border-t-2 border-solid rounded-full w-6 h-6 animate-spin"></div>
        <span className="ml-2">Loading agent details...</span>
      </div>
    )
  }
  
  if (!agent) {
    return (
      <div className="p-6">
        <h1 className="mb-4 font-semibold text-xl">Agent not found</h1>
        <Button onClick={() => router.push('/agents')}>
          <ArrowLeftIcon className="mr-2 w-4 h-4" /> Back to Agents
        </Button>
      </div>
    )
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const getVoiceName = (voiceId: string) => {
    const voiceMap: Record<string, string> = {
      'EXAVITQu4vr4xnSDxMaL': 'Rachel (Female)',
      'pNInz6obpgDQGcFmaJgB': 'Adam (Male)',
      'yoZ06aMxZJJ28mfd3POQ': 'Sam (Neutral)',
      'jBpfuIE2acCO8z3wKNLl': 'Emily (Female)',
      'onwK4e9ZLuTAKqWW3q2T': 'Michael (Male)'
    }
    
    return voiceMap[voiceId] || voiceId
  }
  
  return (
    <div className="mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/agents')}
            className="mr-4"
          >
            <ArrowLeftIcon className="mr-2 w-4 h-4" />
            Back
          </Button>
          <h1 className="font-semibold text-2xl">{agent.name}</h1>
          {agent.description && (
            <p className="ml-4 text-muted-foreground">{agent.description}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/agents/${id}/edit`)}>
            <Settings2Icon className="mr-2 w-4 h-4" />
            Edit
          </Button>
          
          {activeCallId ? (
            <Button variant="destructive" onClick={endCall}>
              <SquareIcon className="mr-2 w-4 h-4" />
              End Call
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={startCall} 
              disabled={callLoading}
            >
              {callLoading ? (
                <>
                  <div className="mr-2 border-current border-t-2 border-solid rounded-full w-4 h-4 animate-spin"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <PhoneIcon className="mr-2 w-4 h-4" />
                  Start Test Call
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Agent Details</TabsTrigger>
          <TabsTrigger value="calls">Call History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="gap-6 grid md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Core settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-1 font-medium">First Message</h3>
                  <p className="bg-secondary/50 p-3 rounded-md text-sm">
                    &ldquo;{agent.firstMessage}&rdquo;
                  </p>
                </div>
                
                <div>
                  <h3 className="mb-1 font-medium">System Prompt</h3>
                  <p className="bg-secondary/50 p-3 rounded-md text-sm whitespace-pre-wrap">
                    {agent.systemPrompt}
                  </p>
                </div>
                
                <div>
                  <h3 className="mb-1 font-medium">Language Model</h3>
                  <p className="text-sm">
                    {agent.languageModel === 'gpt-4' 
                      ? 'GPT-4' 
                      : agent.languageModel === 'gpt-3.5-turbo'
                        ? 'GPT-3.5 Turbo'
                        : 'Google Gemini'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Voice Configuration</CardTitle>
                <CardDescription>
                  Voice settings and test options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-1 font-medium">Voice</h3>
                  <div className="flex items-center">
                    <VolumeIcon className="mr-2 w-4 h-4" />
                    <span>{getVoiceName(agent.voiceId)}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-1 font-medium">Voice Test</h3>
                  <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground text-sm">
                      Test the voice by making a call or listening to a sample
                    </p>
                    <div className="flex items-center gap-2">
                      <VoicePreview voiceId={agent.voiceId} autoDownload={true} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-muted-foreground text-xs">
                  Created: {formatDate(agent.createdAt)}
                  {agent.updatedAt !== agent.createdAt && 
                    ` • Updated: ${formatDate(agent.updatedAt)}`}
                </p>
              </CardFooter>
            </Card>
          </div>
          
          {activeCallId && (
            <Card className="mt-6 border-primary/50">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center text-primary">
                  <PhoneIcon className="mr-2 w-5 h-5" />
                  Active Call
                </CardTitle>
                <CardDescription>
                  Call ID: {activeCallId}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-medium">Status:</span>
                      <span className="text-green-500 text-sm">Active</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Started:</span>
                      <span className="text-sm">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={endCall}>
                    <SquareIcon className="mr-2 w-4 h-4" />
                    End Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="calls">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>
                Record of previous calls with this agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {callLogs.length === 0 ? (
                <div className="p-4 text-muted-foreground text-center">
                  No call history found for this agent.
                </div>
              ) : (
                <div className="space-y-1">
                  {callLogs.map((call) => (
                    <div
                      key={call.id}
                      className="flex justify-between items-center hover:bg-secondary/50 p-3 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="font-medium">Call ID:</span>
                          <span className="text-sm">{call.id.substring(0, 8)}...</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Started:</span>
                          <span className="text-sm">{formatDate(call.startTime)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">Duration:</span>
                          <span className="flex items-center text-sm">
                            <ClockIcon className="mr-1 w-3 h-3" />
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          call.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : call.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                        }`}>
                          {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                        </span>
                        <Button variant="ghost" size="sm">
                          <HistoryIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 