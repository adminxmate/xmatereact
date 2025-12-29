import React from "react";
import { Link } from "react-router-dom"; // import Link

const Footer = () => {
  return (
    <>
      <footer
        id="main-footer"
        className="bg-gradient-to-b from-gray-900 to-black p-0 text-[12px] text-gray-500 mt-auto"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-b border-gray-800">
          <div className="pt-3 pb-4 mx-auto w-full max-w-[480px]">
            <div className="flex flex-wrap justify-center items-center">
              <div className="sm:w-1/4 flex flex-wrap justify-center text-center p-8">
                <figure className="w-14 h-14 flex flex-col items-center justify-center bg-[#111]">
                  <img
                    src="/logo-light-150.png"
                    alt="X-MATE"
                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition"
                  />
                  <figcaption>
                    <Link to="/" className="text-white lowercase">
                      xmate.com.au
                    </Link>
                  </figcaption>
                </figure>
              </div>
              <div className="sm:w-3/4 p-8 sm:pt-1">
                <h5 className="text-white text-center text-lg sm:text-left mb-2">
                  Help-us :
                </h5>
                <ul className="flex flex-wrap justify-center sm:justify-start gap-4 mb-6">
                  <li>
                    <Link to="/" className="hover:text-gray-300">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacypolicy" className="hover:text-gray-300">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/customeragreement" className="hover:text-gray-300">
                      Customer Agreement
                    </Link>
                  </li>
                </ul>
                <ul className="flex justify-center sm:justify-start gap-4">
                  <li>
                    <Link
                      to="/plans"
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-2 bg-black mt-3">
          <p className="text-center text-white text-sm mb-0">
            © Copyright xmate 2025, Designed &amp; Powered by xmate.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
