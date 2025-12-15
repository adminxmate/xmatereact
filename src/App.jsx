import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HorseDataTable from './pages/HorseDataTable';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Route: Shows the search page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Database Route: Shows the table with Edit/Delete */}
        <Route path="/horses" element={<HorseDataTable />} />
      </Routes>
    </Router>
  );
};

export default App;