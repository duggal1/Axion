"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, memo } from "react";
import { SendHorizontal } from "lucide-react";
import Image from "next/image";

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
const Message = memo(({ text, isUser, avatar }: { text: string; isUser: boolean; avatar: string }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 items-end gap-1.5`}>
    {!isUser && (
      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
        <Image src={avatar} width={20} height={20} alt="AI Avatar" className="w-full h-full object-cover" />
      </div>
    )}
    <div
      className={`max-w-[80%] px-3 py-2 text-xs rounded-lg shadow-sm ${
        isUser 
          ? "bg-white text-gray-900 border border-gray-200" 
          : "bg-[#7b24ff] text-[#ffffff]"
      }`}
    >
      {text}
    </div>
    {isUser && (
      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
        <Image src={avatar} width={20} height={20} alt="User Avatar" className="w-full h-full object-cover" />
      </div>
    )}
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
  
  // Avatars
  const userAvatar = "https://images.unsplash.com/photo-1603384699007-50799748fc45?q=80&w=2545&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const aiAvatar = "https://raw.githubusercontent.com/duggal1/Axion/refs/heads/main/public/icons/axion-logo.png";
  
  // Maintain a fixed height for the message container to prevent layout shifts
  const containerHeight = 130;

  // Much faster character-by-character streaming (600-700 tokens per minute)
  const streamText = async (text: string, setter: (text: string) => void) => {
    let currentText = "";
    streamingRef.current = true;
    setIsStreaming(true);
    
    // For 600-700 tokens per minute, we need roughly 10-12 characters per second
    // This is approximately 1 character every 100ms
    const streamInterval = 1; // 1ms for extremely fast streaming
    
    // Stream in chunks for better performance and realistic fast typing
    const chunkSize = 3; // Stream 3 characters at once
    
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.substring(i, i + chunkSize);
      currentText += chunk;
      setter(currentText);
      
      await new Promise(resolve => setTimeout(resolve, streamInterval));
    }
    
    streamingRef.current = false;
    setIsStreaming(false);
  };

  useEffect(() => {
    const runConversation = async () => {
      // Reset texts
      setUserText("");
      setAiText("");
      
      // User message - very fast
      await streamText(conversations[currentConversation].user, setUserText);
      
      // Small pause before AI response
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // AI message - very fast
      await streamText(conversations[currentConversation].ai, setAiText);
      
      // Wait before next conversation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    <div className="flex flex-col h-full bg-gray-50 rounded-xl p-3 shadow-sm">
      <h3 className="mb-2 font-medium text-gray-700 text-xs flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Live Chat
      </h3>
      
      <div 
        ref={messageContainerRef} 
        className="flex-grow pr-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent bg-white rounded-lg p-2" 
        style={{ height: containerHeight, maxHeight: containerHeight }}
      >
        <div className="flex flex-col justify-end min-h-full">
          {userText && <Message text={userText} isUser={true} avatar={userAvatar} />}
          {aiText && <Message text={aiText} isUser={false} avatar={aiAvatar} />}
          {isStreaming && (
            <div className="flex items-start gap-1.5">
              <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                <Image src={aiAvatar} width={20} height={20} alt="AI Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="inline-flex items-center gap-0.5 bg-[#F9F5FF] px-2 py-1 rounded-lg max-w-fit text-[#6930C3] text-xs shadow-sm">
                <motion.span 
                  className="inline-block bg-[#6a1bff] rounded-full w-1 h-1"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
                <motion.span 
                  className="inline-block bg-[#6930C3] rounded-full w-1 h-1"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span 
                  className="inline-block bg-[#6930C3] rounded-full w-1 h-1"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-gray-100 border-t">
        <div className="relative">
          <input 
            type="text" 
            className="bg-white py-2 pr-8 pl-3 border border-gray-100 rounded-lg focus:outline-none focus:ring-[#6930C3] focus:ring-1 w-full text-gray-700 placeholder:text-gray-400 text-xs shadow-sm"
            placeholder="Type your message..."
            disabled
          />
          <button 
            className="top-1/2 right-2 absolute bg-[#6930C3] hover:bg-[#5b1baa] disabled:opacity-70 p-1 rounded-md text-white -translate-y-1/2 transition-colors duration-200 shadow-sm"
            disabled
          >
            <SendHorizontal size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}