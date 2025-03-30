import Container from "./global/container";

/* eslint-disable @next/next/no-img-element */
export default function TestimonialsSection() {
    return (

        <Container delay={0.3}>
      <section className="py-16 md:py-32 w-full ">
        <div className="max-w-max px-6">
        <Container delay={0.5}>
          <div className="bg-white/80 p-12  border border-gray-300 rounded-xl shadow-md w-full">
            <blockquote className="text-center space-y-6">
              <p className="text-3xl font-serif text-gray-700 leading-relaxed max-w-5xl mx-auto">
                "Axion has revolutionized our <span className='text-blue-600 font-bold'>sales process</span>
                —handling what used to take a team of 20 agents with precision and speed. It’s like having the future of sales, today."
              </p>
  
              <div className="flex items-center justify-center gap-6 mt-8 w-full">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://www.pngplay.com/wp-content/uploads/13/Tesla-Logo-PNG-HD-Quality.png"
                  alt="Tesla Logo"
                />
                <div className="text-center">
                  <cite className="text-2xl font-semibold text-gray-900">John Doe</cite>
                  <p className="text-lg text-gray-600">CTO, Axion AI</p>
                </div>
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1529068955484-37b935de18f6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Person"
                />
              </div>
            </blockquote>
   
          </div>
          </Container>
        </div>
      </section>
      </Container>
    );
}