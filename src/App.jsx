import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import HorseDataTable from "./pages/HorseDataTable";
import PlansPage from "./pages/PlansPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CustomerAgreementPage from "./pages/CustomerAgreementPage";
import RealPedigreePage from "./pages/RealPedigreePage";
import HypotheticalPedigreePage from "./pages/HypotheticalPedigreePage";
import Dashboard from "./pages/DashboardPage";
import LoginModal from "./components/LoginModal";

const App = () => {
  return (
    <Router>
      <LoginModal />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/horses" element={<HorseDataTable />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="/customeragreement" element={<CustomerAgreementPage />} />
        <Route path="/realpedigree" element={<RealPedigreePage />} />
        <Route path="/hypotheticalpedigree" element={<HypotheticalPedigreePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
