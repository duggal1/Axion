import Container from "@/components/global/container";
import { Sparkles } from "./Sparkles";

export function TryAxion() {
  return (
    <Container delay={0.6}>
    <div className="h-screen w-full overflow-hidden bg-white">
      <div className="mx-auto mt-40 w-full max-w-2xl">
        <div className="text-center font-serif">
          <span className="text-5xl font-light tracking-tight text-violet-900">
            Try and build your most advanced
          </span>
          <br />
          <span className="text-5xl font-light tracking-tight mt-2">
            agentic AI sales agent for enterprise
          </span>
        </div>
      </div>
      <div className="relative -mt-24 h-96 w-full overflow-hidden [mask-image:radial-gradient(60%_60%,white,transparent)]">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8B008B,#9400D3,transparent_65%)] before:opacity-50 before:blur-sm" />
        <div className="absolute -left-1/2 top-1/2 aspect-[1/0.6] z-10 w-[200%] rounded-[100%] border-t border-zinc-900/10 bg-white" />
        <Sparkles
          density={2000}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_90%)]"
          color={"#000000"}
        />
      </div>
    </div>
    </Container>
  );
}