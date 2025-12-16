import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-black/10">
      <div 
        className="cursor-pointer flex items-center" 
        onClick={() => navigate('/')}
      >
        <img 
          src="/logo-light-50.png" 
          alt="X-MATE Logo" 
          className="h-10 w-auto object-contain"
          onError={(e) => { e.target.style.display='none'; }}
        />
        <span className="text-2xl font-black italic tracking-tighter ml-2">X-MATE</span>
      </div>
      <div className="flex gap-6 text-[13px] font-bold">
        <button onClick={() => navigate('/')} className="text-[#e23e44]">HOME</button>
        <button onClick={() => navigate('/horses')} className="hover:text-gray-400">DATABASE</button>
        <button className="hover:text-gray-400 uppercase">Pricing</button>
        <button className="hover:text-gray-400 uppercase">Signup</button>
        <button className="hover:text-gray-400 uppercase">Login</button>
      </div>
    </nav>
  );
};

export default Header;