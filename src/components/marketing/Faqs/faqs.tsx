"use client"

import {Tag} from "../Integartion/tag";
import {useState, useRef} from "react";
import { motion} from "framer-motion";

const FAQS = [
    {
      question: "How is Layers different from other design tools?",
      answer: "Unlike traditional design tools, Layers prioritizes speed and simplicity without sacrificing power. Our intelligent interface adapts to your workflow, reducing clicks and keeping you in your creative flow."
    },
    {
      question: "Is there a learning curve?",
      answer: "Layers is designed to feel intuitive from day one. Most designers are productive within hours, not weeks. We also provide interactive tutorials and comprehensive documentation to help you get started."
    },
    {
      question: "How do you handle version control?",
      answer: "Every change in Layers is automatically saved and versioned. You can review history, restore previous versions, and create named versions for important milestones."
    },
    {
      question: "Can I work offline?",
      answer: "Yes! Layers includes a robust offline mode. Changes sync automatically when you're back online, so you can keep working anywhere."
    },
    {
      question: "How does Layers handle collaboration?",
      answer: "Layers is built for collaboration. You can invite team members to your projects, share feedback, and work together in real-time."
    },
]

export function FAQSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggleFAQ = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <section className="py-24">
      <div className="container flex flex-col items-center justify-center">
        <Tag>Faqs</Tag>
        <h2 className="text-6xl font-medium text-center max-w-xl mt-6 dark:text-white text-gray-800">
          Questions? We&apos;ve got <span className="text-violet-700">answers</span>
        </h2>
        <div className="mt-12 flex flex-col gap-6 max-w-3xl w-full">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="dark:bg-neutral-900 bg-white rounded-2xl border dark:border-foreground/10 border-gray-300 p-6 cursor-pointer shadow-sm hover:shadow-md will-change-transform"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg dark:text-white text-gray-900">{faq.question}</h3>
                <motion.div
                  initial={false}
                  animate={{ 
                    rotate: selectedIndex === index ? 45 : 0,
                    scale: selectedIndex === index ? 1.05 : 1
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 350, 
                    damping: 25, 
                    mass: 0.5
                  }}
                  style={{ 
                    transformOrigin: "center",
                    willChange: "transform"
                  }}
                  className="w-6 h-6 flex items-center justify-center text-violet-600 relative"
                >
                  <span className="absolute w-4 h-0.5 bg-current rounded-full transform-gpu"></span>
                  <span className="absolute w-0.5 h-4 bg-current rounded-full transform-gpu"></span>
                </motion.div>
              </div>
              <div 
                className="overflow-hidden" 
                style={{ 
                  height: selectedIndex === index ? contentRefs.current[index]?.scrollHeight + 'px' : '0px',
                  opacity: selectedIndex === index ? 1 : 0,
                  marginTop: selectedIndex === index ? '16px' : '0px',
                  transition: 'height 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-in-out, margin-top 0.2s ease-in-out',
                  willChange: "height, opacity, margin-top",
                  transform: 'translateZ(0)'
                }}
              >
                <div ref={el => contentRefs.current[index] = el}>
                  <p className="dark:text-muted-foreground  leading-relaxed text-gray-500 text-primary-foreground/10">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}