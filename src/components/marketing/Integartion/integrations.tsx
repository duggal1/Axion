"use client"

import {Tag} from "./tag";
import figmaIcon from "@/assets/figma-logo.svg";
import notionIcon from "@/assets/notion-logo.svg";
import slackIcon from "@/assets/slack-logo.svg";
import relumeIcon from "@/assets/relume-logo.svg";
import framerIcon from "@/assets/framer-logo.svg";
import githubIcon from "@/assets/github-logo.svg";
import Image from "next/image";
import {cn} from "@/lib";
import {motion} from "framer-motion";
import {Fragment} from "react";

const INTEGRATIONS = [
  {name: "Figma", icon: figmaIcon, description: "Figma is a collaborative interface design tool."},
  {name: "Notion", icon: notionIcon, description: "Notion is an all-in-one workspace for notes and docs."},
  {name: "Slack", icon: slackIcon, description: "Slack is a powerful communication platform."},
  {name: "Relume", icon: relumeIcon, description: "Relume is a no-code website builder and design system."},
  {name: "Framer", icon: framerIcon, description: "Framer is a professional website prototyping tool."},
  {name: "GitHub", icon: githubIcon, description: "GitHub is the leading platform for code collaboration"}
]

type IntegrationType = typeof INTEGRATIONS

interface IntegrationColumnProps {
  integrations: IntegrationType
  className?: string
  reverseAnimation?: boolean
}

function IntegrationColumn({integrations, className, reverseAnimation}: IntegrationColumnProps) {
  return (
    <motion.div
      initial={{y: reverseAnimation ? "-50%" : 0}}
      animate={{y: reverseAnimation ? 0 : "-50%"}}
      transition={{duration: 15, ease: "linear", repeat: Infinity}}
      className={cn("flex flex-col gap-4", className)}
    >
      {Array.from({length: 2}).map((_, index) => (
        <Fragment key={index}>
          {integrations.map((integration) => (
            <div key={integration.name} className="bg-neutral-50 border rounded-3xl p-6">
              <div className="flex justify-center">
                <Image src={integration.icon} alt={integration.name} className="size-24"/>
              </div>
              <h3 className="text-3xl font-serif text-center mt-6">{integration.name}</h3>
              <p className="text-center text-foreground/50 mt-2 text-balance">{integration.description}</p>
            </div>
          ))}
        </Fragment>
      ))}
    </motion.div>
  )
}

 const IntegrationsSection = () => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 items-center lg:gap-16">
          <section className="max-md:flex max-md:flex-col max-md:items-center max-md:justify-center">
            <Tag>Integrations</Tag>
            <h2 className="text-6xl font-serif mt-6 max-md:text-center text-balance">
              Plays well with <span className="text-violet-700">others</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 text-balance max-md:text-center">
              Layers seamlessly connects with your favorite tools, making it
              easy to plug into any workflow and collaborate across platforms.
            </p>
          </section>
          <section>
            <div
              className="h-[400px] lg:h-[800px] grid md:grid-cols-2 gap-4 mt-8 lg:mt-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
              <IntegrationColumn
                integrations={INTEGRATIONS}
              />
              <IntegrationColumn
                integrations={INTEGRATIONS.slice().reverse()}
                className="max-md:hidden"
                reverseAnimation={true}
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}


export default IntegrationsSection;