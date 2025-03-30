"use client"

import {Tag} from "../Integartion/tag";
import {useState, useRef} from "react";
import { motion} from "framer-motion";

const FAQS = [
  {
    question: "How is Axion different from other sales and marketing tools?",
    answer: "Axion is an advanced AI sales agent designed for enterprise teams. Unlike traditional tools, Axion autonomously manages sales for teams of up to 25, handling lead generation, outreach, and CRM integration—all powered by an agentic AI model."
  },
  {
    question: "Is there a learning curve?",
    answer: "Axion is built to be intuitive. Most teams start seeing results within hours, not weeks. We provide interactive tutorials and comprehensive documentation to help you get started quickly."
  },
  {
    question: "Does Axion offer a free trial?",
    answer: "Yes! We offer a 7-day free trial so you can experience Axion’s full capabilities before committing."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer refunds within the first 7 days of purchase. After that, we do not process refunds."
  },
  {
    question: "Is Axion a trusted solution?",
    answer: "Yes! Axion is trusted by leading companies like Figma, Bubble, ClickUp, Notion, Discord, Resend, and more."
  },
  {
    question: "What features does Axion include?",
    answer: "Axion provides powerful sales automation, including:\n- AI lead generation (5,000 leads/mo)\n- Multi-channel outreach (email, SMS, social - 10,000 contacts/mo)\n- CRM integration (Salesforce, HubSpot, etc.)\n- Social automation (10 channels)\n- AI-generated sales content (20,000 words/mo)\n- Predictive sales forecasting\n- Call & email intelligence\n- 15 team seats\n- 24/7 chat support"
  }
];

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
        <h2 className="text-6xl font-serif text-center max-w-xl mt-6 dark:text-white text-gray-800">
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
                <h3 className="font-medium text-lg dark:text-white font-serif text-gray-900">{faq.question}</h3>
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
                  <p className="dark:text-muted-foreground  font-medium leading-relaxed text-gray-600">
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