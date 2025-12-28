import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HorseDataTable from './pages/HorseDataTable';
import PlansPage from './pages/PlansPage';
import RealPedigreePage from './pages/RealPedigreePage';
import HypotheticalPedigreePage from './pages/HypotheticalPedigreePage';
import LoginModal from './components/LoginModal'; 

const App = () => {
  return (
    <Router>
      <LoginModal />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/horses" element={<HorseDataTable />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/realpedigree" element={<RealPedigreePage />} />
        <Route path="/hypotheticalpedigree" element={<HypotheticalPedigreePage />} />
      </Routes>
    </Router>
  );
};

export default App;