"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, memo } from "react";
import { SendHorizontal, Smile, Paperclip } from "lucide-react";
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
      <div className="flex-shrink-0 rounded-full w-5 h-5 overflow-hidden">
        <Image src={avatar} width={20} height={20} alt="AI Avatar" className="w-full h-full object-cover" />
      </div>
    )}
    <div
      className={`max-w-[80%] px-3 py-2 text-xs font-serif rounded-lg shadow-sm ${
        isUser 
          ? "bg-gradient-to-br from-white to-slate-50 text-gray-800 border border-gray-200" 
          : "bg-gradient-to-br from-[#7b24ff] to-[#6822e7] text-[#ffffff]"
      }`}
    >
      {text}
    </div>
    {isUser && (
      <div className="flex-shrink-0 rounded-full w-5 h-5 overflow-hidden">
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
  
  // Maintain a fixed height for the message container to fill the card better
  const containerHeight = 400; // Increased height to fill the 500px card

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
    <div className="flex flex-col h-full font-serif">
      <div className="flex justify-between items-center mb-3">
        <h3 className="flex items-center gap-1.5 font-serif text-gray-700 text-xs">
          <motion.span 
            className="bg-green-500 rounded-full w-2 h-2"
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(34, 197, 94, 0)", "0px 0px 6px rgba(34, 197, 94, 0.6)", "0px 0px 0px rgba(34, 197, 94, 0)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Live Chat</span>
        </h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 px-2 py-0.5 rounded-full"
        >
          <motion.span 
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-1.5 h-1.5"
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(99, 102, 241, 0)", "0px 0px 4px rgba(99, 102, 241, 0.5)", "0px 0px 0px rgba(99, 102, 241, 0)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 font-serif font-medium text-[9px] text-transparent">Connected</span>
        </motion.div>
      </div>

      <div
        ref={messageContainerRef}
        className="flex-grow bg-gradient-to-b from-gray-50 to-white shadow-sm mb-3 p-3 pr-1 border border-gray-100 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
        style={{ height: containerHeight, maxHeight: containerHeight }}
      >
        <div className="flex flex-col justify-end min-h-full">
          {userText && <Message text={userText} isUser={true} avatar={userAvatar} />}
          {aiText && <Message text={aiText} isUser={false} avatar={aiAvatar} />}
          {isStreaming && (
            <div className="flex items-start gap-1.5">
              <div className="flex-shrink-0 rounded-full w-5 h-5 overflow-hidden">
                <Image src={aiAvatar} width={20} height={20} alt="AI Avatar" className="w-full h-full object-cover" />
              </div>
              <motion.div 
                className="inline-flex items-center gap-0.5 bg-gradient-to-r from-[#F9F5FF] to-[#F5EFFF] shadow-sm px-2 py-1 rounded-lg max-w-fit font-serif"
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(105, 48, 195, 0)", "0px 0px 8px rgba(105, 48, 195, 0.15)", "0px 0px 0px rgba(105, 48, 195, 0)"] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span
                  className="inline-block bg-gradient-to-r from-[#7b24ff] to-[#6a1bff] rounded-full w-1 h-1"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
                <motion.span
                  className="inline-block bg-gradient-to-r from-[#7b24ff] to-[#6930C3] rounded-full w-1 h-1"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="inline-block bg-gradient-to-r from-[#6930C3] to-[#6930C3] rounded-full w-1 h-1"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-gray-100 border-t">
        <div className="relative">
          <input
            type="text"
            className="bg-gradient-to-br from-white to-gray-50 shadow-sm py-2.5 pr-8 pl-3 border border-gray-100 rounded-lg focus:outline-none focus:ring-[#6930C3] focus:ring-1 w-full font-serif text-gray-700 placeholder:text-gray-400 text-xs"
            placeholder="Type your message..."
            disabled
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ 
              backgroundColor: '#5b1baa',
              boxShadow: "0px 2px 8px rgba(105, 48, 195, 0.3)" 
            }}
            className="top-1/2 right-2 absolute bg-gradient-to-br from-[#7b24ff] to-[#6930C3] shadow-md p-1 rounded-md text-white transition-colors -translate-y-1/2 duration-200"
            disabled
          >
            <SendHorizontal size={14} />
          </motion.button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm p-1 rounded-md cursor-pointer"
            >
              <Smile className="w-3.5 h-3.5 text-gray-500" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm p-1 rounded-md cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5 text-gray-500" />
            </motion.div>
          </div>
          <div className="font-serif text-[9px] text-gray-400">
            Powered by <span className="bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium text-transparent">Axion AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}