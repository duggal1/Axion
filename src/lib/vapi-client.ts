/* eslint-disable @typescript-eslint/no-explicit-any */
import Vapi from '@vapi-ai/web';

export interface VapiVoice {
  id: string;
  name: string;
  provider: string;
  gender?: string;
  previewUrl?: string;
}

export interface VapiAgentOptions {
  name: string;
  description?: string;
  firstMessage: string;
  systemPrompt: string;
  voiceId: string;
  languageModel: 'gemini' | 'gpt-4' | 'gpt-3.5-turbo';
  knowledgeBaseIds?: string[];
}

export interface VapiCallOptions {
  assistantId: string;
  userId?: string;
  metadata?: Record<string, any>;
  transferCallOnEnd?: boolean;
  transferTo?: string;
}

class VapiService {
  private client: Vapi | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.init(apiKey);
    }
  }

  init(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Vapi(apiKey);
    return this;
  }

  isInitialized() {
    return !!this.client;
  }

  getVoices(): Promise<VapiVoice[]> {
    if (!this.client) throw new Error('Vapi client not initialized');
    
    // This is a mock implementation since the Vapi web client doesn't expose a getVoices method directly
    // In a real implementation, you would make an API call to Vapi to get the available voices
    return Promise.resolve([
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Rachel (Female)", provider: "elevenlabs" },
      { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Male)", provider: "elevenlabs" },
      { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam (Neutral)", provider: "elevenlabs" },
      { id: "jBpfuIE2acCO8z3wKNLl", name: "Emily (Female)", provider: "elevenlabs" },
      { id: "onwK4e9ZLuTAKqWW3q2T", name: "Michael (Male)", provider: "elevenlabs" },
    ]);
  }

  async createAssistant(options: VapiAgentOptions) {
    if (!this.client) throw new Error('Vapi client not initialized');

    const response = await fetch('/api/vapi/assistants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...options,
        apiKey: this.apiKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create assistant');
    }

    return response.json();
  }

  async startCall(options: VapiCallOptions) {
    if (!this.client) throw new Error('Vapi client not initialized');
    
    try {
      // Since we're mocking this functionality for now, we'll return a fake call ID
      // In a real implementation, you would use the Vapi client to start a call
      return {
        callId: `call_${Math.random().toString(36).substring(2, 9)}`,
        assistantId: options.assistantId,
        status: 'active'
      };
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async endCall(callId: string) {
    if (!this.client) throw new Error('Vapi client not initialized');
    
    try {
      // Mock implementation for ending a call
      // In a real implementation, you would use the Vapi client to end the call
      return {
        callId,
        status: 'completed'
      };
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }

  /**
   * Get a URL to a voice sample for the given voice ID
   * @param voiceId The ID of the voice to get a sample for
   * @returns The URL to the voice sample
   */
  public async getVoiceSampleUrl(voiceId: string): Promise<string> {
    try {
      // Call the voice sample API
      const response = await fetch(`/api/vapi/voice-samples?voiceId=${voiceId}`);
      if (!response.ok) {
        throw new Error('Failed to get voice sample URL');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting voice sample URL:', error);
      // Return a fallback URL for the sample
      return `/audio/${voiceId}-sample.mp3`;
    }
  }

  /**
   * Generate a new voice sample for the given voice ID
   * @param voiceId The ID of the voice to generate a sample for
   * @param text Optional text to use for the sample
   * @returns Information about the generated sample
   */
  public async generateVoiceSample(voiceId: string, text?: string): Promise<any> {
    if (!this.isInitialized()) {
      throw new Error('Vapi client not initialized');
    }

    try {
      const response = await fetch('/api/vapi/voice-samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice sample');
      }

      return response.json();
    } catch (error) {
      console.error('Error generating voice sample:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const vapiService = new VapiService();

// Also export class for cases where a new instance is needed
export { VapiService }; 