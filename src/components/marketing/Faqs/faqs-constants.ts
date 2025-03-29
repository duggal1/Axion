// src/data/faqData.ts

export interface FAQItem {
    id: number;
    number: string; // "01", "02", etc.
    title: string;
    content: string;
  }
  
  export const faqData: FAQItem[] = [
    {
      id: 1,
      number: "01",
      title: "Consultation",
      content: "Discuss your business goals and objectives, target audience, and current marketing efforts to tailor our services to meet your specific requirements."
    },
    {
      id: 2,
      number: "02",
      title: "Research and Strategy Development",
      content: "Conduct thorough market research to understand your target audience and develop a strategic plan to achieve your business objectives."
    },
    {
      id: 3,
      number: "03",
      title: "Implementation",
      content: "Execute the strategic plan by implementing marketing campaigns, content creation, and other necessary actions."
    },
    {
      id: 4,
      number: "04",
      title: "Monitoring and Optimization",
      content: "Continuously monitor the performance of your marketing efforts and make data-driven optimizations to improve results."
    },
    {
      id: 5,
      number: "05",
      title: "Reporting and Communication",
      content: "Provide regular reports and communicate insights to keep you informed about the progress and success of your marketing initiatives."
    },
    {
      id: 6,
      number: "06",
      title: "Continual Improvement",
      content: "Stay ahead of the curve by continuously refining and improving your marketing strategies to adapt to changing market conditions."
    }
  ];