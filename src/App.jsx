import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HorseDataTable from './pages/HorseDataTable';
// Import your modal component
import LoginModal from './components/LoginModal'; 

const App = () => {
  return (
    <Router>
      {/* Placing the Modal here allows it to listen for events 
          globally regardless of which route is active.
      */}
      <LoginModal />

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