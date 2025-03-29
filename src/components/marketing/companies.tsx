import Container from "../global/container";

import { LogoCarousels } from "./Companies/companies";

const Companies = () => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full py-20 mt-16 companies overflow-hidden">
            <Container>
<LogoCarousels/>

        
            </Container>
            </div>
        
    )
};

export default Companies
