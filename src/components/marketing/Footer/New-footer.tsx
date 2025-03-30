import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-32 lg:mt-36 bg-black text-white font-serif lg:rounded-t-[45px] px-4 lg:px-[60px] pt-[55px] pb-[50px] shadow-lg">
      <section className="flex flex-col lg:flex-row gap-12 justify-between items-center lg:items-end">
        <div className="">
          <Image
            src="/icons/axion-logo.png"
            alt="Axion.ai logo"
            width={60}
            height={60}
          />
        </div>
        <nav className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 list-none">
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex text-gray-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-violet-400 after:transition-all after:duration-300 group-hover:after:w-full"
            >
              About us
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex text-gray-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-violet-400 after:transition-all after:duration-300 group-hover:after:w-full"
            >
              Services
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex text-gray-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-violet-400 after:transition-all after:duration-300 group-hover:after:w-full"
            >
              Use Cases
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex text-gray-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-violet-400 after:transition-all after:duration-300 group-hover:after:w-full"
            >
              Pricing
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex text-gray-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-violet-400 after:transition-all after:duration-300 group-hover:after:w-full"
            >
              Blog
            </a>
          </li>
        </nav>

        {/* Social media icons for large screens */}
        <div className="hidden lg:flex gap-4">
          <a href="https://github.com/duggal1" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="24" height="24">
              <path fill="#00020c" fillRule="evenodd" d="m60,12c0-4.42-3.58-8-8-8H12c-4.42,0-8,3.58-8,8v40c0,4.42,3.58,8,8,8h40c4.42,0,8-3.58,8-8V12h0Z"></path>
              <path fill="#fff" fillRule="evenodd" d="m26.73,47.67c0,1.1-.01,2.3-.01,3.4,0,.26-.13.51-.34.67-.21.16-.49.2-.74.13-8.4-2.7-14.49-10.58-14.49-19.87,0-11.51,9.34-20.85,20.85-20.85s20.85,9.34,20.85,20.85c0,9.28-6.08,17.15-14.46,19.85-.25.08-.53.03-.74-.13-.21-.16-.34-.4-.34-.67-.02-2.45-.03-5.34-.03-6.65s-1.28-2.39-1.28-2.39c0,0,9.45-1.16,9.45-9.34,0-5.19-2.06-6.94-2.06-6.94.44-1.86.38-3.63-.1-5.31-.07-.24-.31-.4-.56-.38-2.01.18-3.85.91-5.52,2.24,0,0-2.95-.81-5.2-.81h0c-2.25,0-5.2.81-5.2.81-1.67-1.32-3.52-2.06-5.52-2.24-.25-.02-.49.14-.56.38-.48,1.68-.54,3.45-.11,5.31,0,0-2.05,1.75-2.05,6.94,0,8.18,9.45,9.34,9.45,9.34,0,0-1.28,1.08-1.28,2.39v.3c-.72.26-1.7.5-2.8.43-2.99-.2-3.39-3.42-4.62-3.94-.9-.38-1.78-.43-2.45-.37-.2.02-.36.16-.41.35-.05.19.02.39.18.51.81.55,1.89,1.33,2.19,1.9.81,1.52,2.06,3.93,3.67,4.19,1.96.32,3.36.13,4.25-.12h0Z"></path>
            </svg>
          </a>
          <a href="https://x.com/harshitduggal5" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" style={{shapeRendering:"geometricPrecision", textRendering:"geometricPrecision"}} width="24" height="24" viewBox="0 0 7640 7640">
              <g>
                <rect width="7620" height="7620" x="10" y="10" rx="1690" ry="1690" style={{stroke:"#000", strokeWidth:"20", fill:"#000"}}></rect>
                <g>
                  <path d="M4316 3394l1933 -2258 -452 0 -1688 1960 -1356 -1960 -452 0 -677 0 -73 0 -379 0 2051 2987 -2051 2381 481 0 1779 -2077 1426 2077 80 0 401 0 648 0 153 0 328 0 -2152 -3110zm-2440 -1894l675 0 1301 1894 -369 428 -1607 -2322zm3211 4640l-1396 -2016 367 -429 1679 2445 -650 0z" style={{fill:"#fff"}}></path>
                </g>
              </g>
            </svg>
          </a>
          <a href="mailto:harshitduggal29@gmail.com" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 141.7 141.7" width="24" height="24" viewBox="0 0 141.7 141.7">
              <path fill="#4285f4" d="M24.3,111.3h17.2V69.6L16.9,51.3V104C16.9,108,20.2,111.3,24.3,111.3z"></path>
              <path fill="#34a853" d="M100.3,111.3h17.2c4.1,0,7.4-3.3,7.4-7.4V51.3l-24.5,18.4V111.3z"></path>
              <path fill="#fbbc04" d="M100.3,37.8v31.9l24.5-18.4v-9.8c0-9.1-10.4-14.3-17.7-8.8L100.3,37.8z"></path>
              <path fill="#ea4335" fillRule="evenodd" d="M41.4,69.6V37.8l29.4,22.1l29.4-22.1v31.9L70.9,91.7L41.4,69.6z" clipRule="evenodd"></path>
              <path fill="#c5221f" d="M16.9,41.4v9.8l24.5,18.4V37.8l-6.9-5.2C27.3,27.2,16.9,32.4,16.9,41.4z"></path>
            </svg>
          </a>
          <a href="https://linkedin.com/in/hashitduggal" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 72 72">
              <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g>
                  <rect width="72" height="72" x="0" y="0" fill="#117EB8" rx="4"></rect>
                  <path fill="#FFF" d="M13.139 27.848h9.623V58.81h-9.623V27.848zm4.813-15.391c3.077 0 5.577 2.5 5.577 5.577 0 3.08-2.5 5.581-5.577 5.581a5.58 5.58 0 1 1 0-11.158zm10.846 15.39h9.23v4.231h.128c1.285-2.434 4.424-5 9.105-5 9.744 0 11.544 6.413 11.544 14.75V58.81h-9.617V43.753c0-3.59-.066-8.209-5-8.209-5.007 0-5.776 3.911-5.776 7.95V58.81h-9.615V27.848z"></path>
                </g>
              </g>
            </svg>
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-10 lg:gap-6 lg:flex-row justify-between mt-16">
        <div className="flex flex-col gap-4 lg:gap-3 lg:justify-between text-gray-300 text-center lg:text-start backdrop-blur-sm bg-gray-900/30 p-6 rounded-2xl">
          <h3 className="font-bold inline mb-4 lg:mb-2">
            <span className="bg-deepviolet px-3 py-1 rounded-lg text-white">Contact us</span>
          </h3>
          <p className="hover:text-white transition-colors">Email: info@axion.ai</p>
          <p className="hover:text-white transition-colors">Phone: 555-567-8901</p>
          <p className="hover:text-white transition-colors">
            Address: 1234 Main St <br />
            Moonstone City, Stardust State 12345
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white px-8 py-10 rounded-2xl shadow-xl border border-gray-800">
          <h3 className="text-xl font-semibold mb-6 text-center text-black">Stay Updated</h3>
          <form className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/80 border-gray-400 px-5 py-4 rounded-xl border text-white/5 w-full focus:ring-2 focus:ring-deepviolet focus:outline-none font-serif"
            />
            <button className="bg-black hover:bg-violet-700 px-6 py-4 rounded-xl w-full md:w-auto whitespace-nowrap transition-all duration-300  text-white font-medium">
              Subscribe
            </button>
          </form>
          <p className="text-gray-900 text-sm mt-4 text-center">Join our newsletter for AI insights and updates</p>
        </div>
      </section>

      {/* Social media icons for small screens */}
      <div className="lg:hidden flex justify-center gap-4 mt-12">
        <a href="https://github.com/duggal1" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="24" height="24">
            <path fill="#00020c" fillRule="evenodd" d="m60,12c0-4.42-3.58-8-8-8H12c-4.42,0-8,3.58-8,8v40c0,4.42,3.58,8,8,8h40c4.42,0,8-3.58,8-8V12h0Z"></path>
            <path fill="#fff" fillRule="evenodd" d="m26.73,47.67c0,1.1-.01,2.3-.01,3.4,0,.26-.13.51-.34.67-.21.16-.49.2-.74.13-8.4-2.7-14.49-10.58-14.49-19.87,0-11.51,9.34-20.85,20.85-20.85s20.85,9.34,20.85,20.85c0,9.28-6.08,17.15-14.46,19.85-.25.08-.53.03-.74-.13-.21-.16-.34-.4-.34-.67-.02-2.45-.03-5.34-.03-6.65s-1.28-2.39-1.28-2.39c0,0,9.45-1.16,9.45-9.34,0-5.19-2.06-6.94-2.06-6.94.44-1.86.38-3.63-.1-5.31-.07-.24-.31-.4-.56-.38-2.01.18-3.85.91-5.52,2.24,0,0-2.95-.81-5.2-.81h0c-2.25,0-5.2.81-5.2.81-1.67-1.32-3.52-2.06-5.52-2.24-.25-.02-.49.14-.56.38-.48,1.68-.54,3.45-.11,5.31,0,0-2.05,1.75-2.05,6.94,0,8.18,9.45,9.34,9.45,9.34,0,0-1.28,1.08-1.28,2.39v.3c-.72.26-1.7.5-2.8.43-2.99-.2-3.39-3.42-4.62-3.94-.9-.38-1.78-.43-2.45-.37-.2.02-.36.16-.41.35-.05.19.02.39.18.51.81.55,1.89,1.33,2.19,1.9.81,1.52,2.06,3.93,3.67,4.19,1.96.32,3.36.13,4.25-.12h0Z"></path>
          </svg>
        </a>
        <a href="https://x.com/harshitduggal5" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" style={{shapeRendering:"geometricPrecision", textRendering:"geometricPrecision"}} width="24" height="24" viewBox="0 0 7640 7640">
            <g>
              <rect width="7620" height="7620" x="10" y="10" rx="1690" ry="1690" style={{stroke:"#000", strokeWidth:"20", fill:"#000"}}></rect>
              <g>
                <path d="M4316 3394l1933 -2258 -452 0 -1688 1960 -1356 -1960 -452 0 -677 0 -73 0 -379 0 2051 2987 -2051 2381 481 0 1779 -2077 1426 2077 80 0 401 0 648 0 153 0 328 0 -2152 -3110zm-2440 -1894l675 0 1301 1894 -369 428 -1607 -2322zm3211 4640l-1396 -2016 367 -429 1679 2445 -650 0z" style={{fill:"#fff"}}></path>
              </g>
            </g>
          </svg>
        </a>
        <a href="mailto:harshitduggal29@gmail.com" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 141.7 141.7" width="24" height="24" viewBox="0 0 141.7 141.7">
            <path fill="#4285f4" d="M24.3,111.3h17.2V69.6L16.9,51.3V104C16.9,108,20.2,111.3,24.3,111.3z"></path>
            <path fill="#34a853" d="M100.3,111.3h17.2c4.1,0,7.4-3.3,7.4-7.4V51.3l-24.5,18.4V111.3z"></path>
            <path fill="#fbbc04" d="M100.3,37.8v31.9l24.5-18.4v-9.8c0-9.1-10.4-14.3-17.7-8.8L100.3,37.8z"></path>
            <path fill="#ea4335" fillRule="evenodd" d="M41.4,69.6V37.8l29.4,22.1l29.4-22.1v31.9L70.9,91.7L41.4,69.6z" clipRule="evenodd"></path>
            <path fill="#c5221f" d="M16.9,41.4v9.8l24.5,18.4V37.8l-6.9-5.2C27.3,27.2,16.9,32.4,16.9,41.4z"></path>
          </svg>
        </a>
        <a href="https://linkedin.com/in/hashitduggal" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 p-2 rounded-full hover:bg-deepviolet hover:scale-110 transition-all duration-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 72 72">
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
              <g>
                <rect width="72" height="72" x="0" y="0" fill="#117EB8" rx="4"></rect>
                <path fill="#FFF" d="M13.139 27.848h9.623V58.81h-9.623V27.848zm4.813-15.391c3.077 0 5.577 2.5 5.577 5.577 0 3.08-2.5 5.581-5.577 5.581a5.58 5.58 0 1 1 0-11.158zm10.846 15.39h9.23v4.231h.128c1.285-2.434 4.424-5 9.105-5 9.744 0 11.544 6.413 11.544 14.75V58.81h-9.617V43.753c0-3.59-.066-8.209-5-8.209-5.007 0-5.776 3.911-5.776 7.95V58.81h-9.615V27.848z"></path>
              </g>
            </g>
          </svg>
        </a>
      </div>

      <hr className="mt-12 border-gray-800" />
      <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Axion.ai. All Rights Reserved.
        </p>

        <div className="flex gap-6">
          <a
            href="#!"
            className="hover:text-white transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Privacy Policy
          </a>
          <a
            href="#!"
            className="hover:text-white transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
