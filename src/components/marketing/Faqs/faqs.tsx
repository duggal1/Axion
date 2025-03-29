"use client";

import { useState } from "react";

const Faqs = () => {
  const [activeSection, setActiveSection] = useState<number | null>(1);

  const toggleSection = (section: number) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Data for accordion sections
  const faqSections = [
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

  return (
    <section className="pt-24 sm:pt-36 px-4">
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start sm:gap-10">
        <h2 className="bg-green text-3xl font-bold p-2 rounded-sm">
          Our Working Process
        </h2>
        <p className="max-w-xs">
          Step-by-Step Guide to Achieving Your Business Goals
        </p>
      </div>

      {faqSections.map((section) => (
        <div
          key={section.id}
          className={`${
            activeSection === section.id ? "bg-green" : "bg-gray"
          } border border-b-4 text-black px-8 sm:px-[60px] py-3 rounded-[45px] mt-4 ${section.id === 1 ? "sm:mt-16" : "sm:mt-8"}`}
        >
          <div
            className="flex justify-between items-center py-7 cursor-pointer"
            onClick={() => toggleSection(section.id)}
          >
            <h3 className="flex font-medium">
              <span className="text-3xl sm:text-6xl mr-3 sm:mr-6 font-extrabold">
                {section.number}
              </span>
              <span className="text-xl sm:text-3xl self-center">
                {section.title}
              </span>
            </h3>
            <button
              className="flex justify-center items-center border rounded-full w-10 h-10 bg-white transition-all duration-300 hover:bg-green-100 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(section.id);
              }}
              aria-label={activeSection === section.id ? "Collapse section" : "Expand section"}
            >
              {activeSection === section.id ? (
                <span className="text-2xl font-bold" aria-hidden="true">−</span>
              ) : (
                <span className="text-2xl font-bold" aria-hidden="true">+</span>
              )}
            </button>
          </div>
          {activeSection === section.id && (
            <div className="py-7 border-t">
              <p>{section.content}</p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Faqs;