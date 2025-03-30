// import BentoGrid from "@/components/Bento-Grid/Bento-grid";
import Wrapper from "@/components/global/wrapper";
import Analysis from "@/components/marketing/analysis";
import Companies from "@/components/marketing/companies";
import CTA from "@/components/marketing/cta";
import { FAQSection } from "@/components/marketing/Faqs/faqs";
import FeaturesCloud from "@/components/marketing/Feature/Feature-Cloud";
// import Features from "@/components/marketing/features";
import Hero from "@/components/marketing/hero";
import IntegrationsSection from "@/components/marketing/Integartion/integrations";
// import Integration from "@/components/marketing/integration";
import LanguageSupport from "@/components/marketing/lang-support";
import Pricing from "@/components/marketing/pricing";
import { TryAxion } from "@/components/marketing/Try-Axion/TryAxion";

const HomePage = () => {
    return (
        <Wrapper className="py-20 relative">
            <Hero />
            <Companies />
            {/* <Features /> */}
            {/* <BentoGrid/> */}
            <Analysis />
            <FeaturesCloud/>
            <TryAxion/>
            {/* <Integration /> */}
            <Pricing />
            <FAQSection/>
        
            <IntegrationsSection/>
            <LanguageSupport />
            <CTA />
           
        </Wrapper>
    )
};

export default HomePage
