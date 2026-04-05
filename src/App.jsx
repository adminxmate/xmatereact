import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import LoadingFallback from "./components/LoadingFallback";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";

// Custom wrapper for React.lazy to automatically reload the page on chunk loading failures
// This prevents errors where users with stale indexed html try to fetch a chunk that's been removed in a recent deployment
const lazyWithRetry = (componentImport) =>
  React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem("page-has-been-force-refreshed") || "false"
    );
    try {
      const component = await componentImport();
      window.sessionStorage.setItem("page-has-been-force-refreshed", "false");
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem("page-has-been-force-refreshed", "true");
        window.location.reload();
      }
      throw error;
    }
  });

const LandingPage = lazyWithRetry(() => import("./pages/LandingPage"));
const HorseDataTable = lazyWithRetry(() => import("./pages/HorseDataTable"));
const PlansPage = lazyWithRetry(() => import("./pages/PlansPage"));
const ContactPage = lazyWithRetry(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazyWithRetry(() => import("./pages/PrivacyPolicyPage"));
const CustomerAgreementPage = lazyWithRetry(() => import("./pages/CustomerAgreementPage"));
const RealPedigreePage = lazyWithRetry(() => import("./pages/RealPedigreePage"));
const HypotheticalPedigreePage = lazyWithRetry(() => import("./pages/HypotheticalPedigreePage"));
const Dashboard = lazyWithRetry(() => import("./pages/DashboardPage"));

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
