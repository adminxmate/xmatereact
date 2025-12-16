import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black py-10 px-10 text-[12px] text-gray-500 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 flex items-center justify-center bg-[#111] overflow-hidden">
            <img 
              src="/logo-light-150.png" 
              alt="X-MATE" 
              className="w-full h-full object-contain opacity-80 hover:opacity-100 transition" 
            />
          </div>
          <span className="font-bold text-white uppercase tracking-widest text-[10px]">xmate.com.au</span>
        </div>
        
        <div className="text-center md:text-right mt-4 md:mt-0">
           <p className="tracking-wide">© Copyright xmate 2025</p>
           <p className="mt-1 text-gray-600 uppercase text-[10px]">Designed & Powered by xmate</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;