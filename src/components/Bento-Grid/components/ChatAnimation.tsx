"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, memo } from "react";
import { SendHorizontal } from "lucide-react";

const conversations = [
  {
    user: "Hi, I'm interested in your product.",
    ai: "Hello! I'd be happy to help you learn more about our enterprise solutions. We specialize in providing cutting-edge AI-powered tools that can transform your business operations.",
  },
  {
    user: "What makes your solution different?",
    ai: "Our AI-powered platform stands out through its advanced real-time analytics, personalized recommendations, and seamless integration capabilities.",
  },
  {
    user: "That sounds interesting. What about pricing?",
    ai: "We offer flexible pricing plans tailored to your business needs. Our enterprise solutions include full platform access and dedicated support.",
  },
];

// Memoized message component for better performance
const Message = memo(({ text, isUser }: { text: string; isUser: boolean }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-1.5`}>
    <div
      className={`max-w-[85%] px-2 py-1.5 text-xs rounded-lg ${
        isUser 
          ? "bg-[#F5F5F7] text-[#333]" 
          : "bg-[#F9F5FF] text-[#6930C3]"
      }`}
    >
      {text}
    </div>
  </div>
));

Message.displayName = "Message";

export function ChatAnimation() {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef<boolean>(false);
  
  // Maintain a fixed height for the message container to prevent layout shifts
  const containerHeight = 130;

  // Character-by-character streaming for more natural effect
  const streamText = async (text: string, setter: (text: string) => void) => {
    let currentText = "";
    streamingRef.current = true;
    setIsStreaming(true);
    
    // Randomize the delay slightly to simulate natural typing
    const getRandomDelay = () => Math.floor(Math.random() * 4) + 4; // 4-8ms
    
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setter(currentText);
      
      // Use more randomized delays to make it feel more natural
      await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    }
    
    streamingRef.current = false;
    setIsStreaming(false);
  };

  useEffect(() => {
    const runConversation = async () => {
      // Reset texts
      setUserText("");
      setAiText("");
      
      // User message
      await streamText(conversations[currentConversation].user, setUserText);
      
      // Small pause before AI response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // AI message
      await streamText(conversations[currentConversation].ai, setAiText);
      
      // Wait before next conversation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to next conversation
      setCurrentConversation((prev) => (prev + 1) % conversations.length);
    };

    if (!streamingRef.current) {
      runConversation();
    }
  }, [currentConversation]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [userText, aiText]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 font-medium text-[#333] text-xs">Live Chat</h3>
      
      <div 
        ref={messageContainerRef} 
        className="flex-grow pr-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent" 
        style={{ height: containerHeight, maxHeight: containerHeight }}
      >
        <div className="flex flex-col justify-end min-h-full">
          {userText && <Message text={userText} isUser={true} />}
          {aiText && <Message text={aiText} isUser={false} />}
          {isStreaming && (
            <div className="inline-flex items-center gap-1 bg-[#F9F5FF] px-2 py-1 rounded-lg max-w-fit text-[#6930C3] text-xs">
              <motion.span 
                className="inline-block bg-[#6a1bff] rounded-full w-1 h-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.span 
                className="inline-block bg-[#6930C3] rounded-full w-1 h-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span 
                className="inline-block bg-[#6930C3] rounded-full w-1 h-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-[#F5F5F7] border-t">
        <div className="relative">
          <input 
            type="text" 
            className="bg-[#F9FAFB] py-1.5 pr-8 pl-2 border border-[#F5F5F7] rounded-lg focus:outline-none focus:ring-[#6930C3] focus:ring-1 w-full text-[#333] placeholder:text-[#999] text-xs"
            placeholder="Type your message..."
            disabled
          />
          <button 
            className="top-1/2 right-2 absolute bg-[#000000] disabled:opacity-50 p-0.5 rounded-md text-white -translate-y-1/2"
            disabled
          >
            <SendHorizontal size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}