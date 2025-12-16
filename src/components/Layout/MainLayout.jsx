import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#333538] text-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;