import React from "react";

const Footer = () => {
  return (
    <>
      <footer id="main-footer" className="bg-black p-0 text-[12px] text-gray-500 mt-auto">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-b  border-gray-800">
          <div class="pt-3 pb-4 mx-auto w-full max-w-[480px]">
            <div class="flex flex-wrap justify-center items-center h-32 ">
              <div class="sm:w-1/4 flex flex-wrap justify-center text-center p-8">
                <figure class="w-14 h-14 flex flex-col items-center justify-center bg-[#111]">
                  <img src="/logo-light-150.png" alt="X-MATE" className="w-full h-full object-contain opacity-80 hover:opacity-100 transition" />
                  <figcaption>
                    <a href="/" class="text-white lowercase">
                      xmate.com.au
                    </a>
                  </figcaption>
                </figure>
              </div>
              <div class="sm:w-3/4 p-8">
                <h5 class="text-white text-center text-lg sm:text-left mb-2">Help us:</h5>
                <ul class="flex flex-wrap justify-center sm:justify-start gap-4 mb-6">
                  <li>
                    <a href="/" class="hover:text-gray-300">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/privacypolicy" class="hover:text-gray-300">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/customeragreement" class="hover:text-gray-300">
                      Customer Agreement
                    </a>
                  </li>
                </ul>
                <ul class="flex justify-center sm:justify-start gap-4">
                  <li>
                    <a href="#" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white">
                      More Info
                    </a>
                  </li>
                  <li>
                    <a href="/contact" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full py-2 bg-black mt-3">
          <p class="text-center text-white text-sm mb-0">© Copyright xmate 2025, Designed &amp; Powered by xmate.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
