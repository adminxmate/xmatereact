import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import LoadingFallback from "./components/LoadingFallback";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const HorseDataTable = React.lazy(() => import("./pages/HorseDataTable"));
const PlansPage = React.lazy(() => import("./pages/PlansPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage"));
const CustomerAgreementPage = React.lazy(() => import("./pages/CustomerAgreementPage"));
const RealPedigreePage = React.lazy(() => import("./pages/RealPedigreePage"));
const HypotheticalPedigreePage = React.lazy(() => import("./pages/HypotheticalPedigreePage"));
const Dashboard = React.lazy(() => import("./pages/DashboardPage"));

import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

const App = () => {
  return (
    <GlobalErrorBoundary>
      <Router>
        <LoginModal />
        <SignupModal />      
        <ForgotPasswordModal />       
        <ResetPasswordModal /> 
        
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </Router>
    </GlobalErrorBoundary>
  );
};

export default App;
