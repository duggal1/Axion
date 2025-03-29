import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-32 lg:mt-36 bg-black text-white lg:rounded-t-[45px] px-4 lg:px-[60px] pt-[55px] pb-[50px] shadow-lg">
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
              className="group-hover:text-violet-400 transition-all duration-300 flex hover:underline text-gray-200"
            >
              About us
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex hover:underline text-gray-200"
            >
              Services
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex hover:underline text-gray-200"
            >
              Use Cases
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex hover:underline text-gray-200"
            >
              Pricing
            </a>
          </li>
          <li className="group block">
            <a
              href="#!"
              className="group-hover:text-violet-400 transition-all duration-300 flex hover:underline text-gray-200"
            >
              Blog
            </a>
          </li>
        </nav>

        {/* Social media icons for large screens */}
        <div className="hidden lg:flex gap-4">
          <a href="#!" className="bg-gray-800 p-2 rounded-full hover:bg-deepviolet transition-all duration-300">
            <Image
              src={"/linkedin.svg"}
              alt="LinkedIn"
              width={24}
              height={24}
            />
          </a>
          <a href="#!" className="bg-gray-800 p-2 rounded-full hover:bg-deepviolet transition-all duration-300">
            <Image
              src={"/facebook.svg"}
              alt="Facebook"
              width={24}
              height={24}
            />
          </a>
          <a href="#!" className="bg-gray-800 p-2 rounded-full hover:bg-deepviolet transition-all duration-300">
            <Image
              src={"/twitter.svg"}
              alt="Twitter"
              width={24}
              height={24}
            />
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

        <div className="bg-gradient-to-br from-gray-900 to-black px-8 py-10 rounded-2xl shadow-xl border border-gray-800">
          <h3 className="text-xl font-semibold mb-6 text-center text-white">Stay Updated</h3>
          <form className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-gray-800 border-gray-700 px-5 py-4 rounded-xl border text-white w-full focus:ring-2 focus:ring-deepviolet focus:outline-none"
            />
            <button className="bg-deepviolet hover:bg-violet-700 px-6 py-4 rounded-xl w-full md:w-auto whitespace-nowrap transition-all duration-300 font-medium">
              Subscribe
            </button>
          </form>
          <p className="text-gray-400 text-sm mt-4 text-center">Join our newsletter for AI insights and updates</p>
        </div>
      </section>

      {/* Social media icons for small screens */}
      <div className="lg:hidden flex justify-center gap-4 mt-12">
        <a href="#!" className="bg-gray-800 p-2 rounded-full hover:bg-deepviolet transition-all duration-300">
          <Image
            src={"/linkedin.svg"}
            alt="LinkedIn"
            width={24}
            height={24}
          />
        </a>
        <a href="#!" className="bg-gray-800 p-2 rounded-full hover:bg-deepviolet transition-all duration-300">
          <Image
            src={"/facebook.svg"}
            alt="Facebook"
            width={24}
            height={24}
          />
        </a>
        <a href="#!" className="bg-gray-800 p-2 rounded-full hover:bg-deepviolet transition-all duration-300">
          <Image
            src={"/twitter.svg"}
            alt="Twitter"
            width={24}
            height={24}
          />
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
            className="hover:text-white hover:underline transition-all duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#!"
            className="hover:text-white hover:underline transition-all duration-300"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
