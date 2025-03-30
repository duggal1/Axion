import { TestimonialsMarquee } from "./Testimonies";

export default function Testimonials() {
  return (
    <main className="min-h-screen w-full dark:bg-gray-950">
      <section className="py-20">
        <div className="mx-auto px-4 text-center">
          <h1 className="font-serif text-6xl leading-none tracking-tight text-gray-950 dark:text-white">
            What Our Customers Say
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-medium text-xl leading-snug tracking-tight text-gray-500 dark:text-gray-400">
            Axion is revolutionizing enterprise sales with advanced AI that seamlessly replaces entire teams, automating workflows, optimizing outreach, and closing deals with unmatched efficiency.
          </p>
        </div>
      </section>
      
      <div className="w-full overflow-hidden">
        <TestimonialsMarquee />
      </div>
    </main>
  );
}