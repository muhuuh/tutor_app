import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { ExerciseForge } from "./pages/ExerciseForge";
import { Home } from "./pages/Landingpage/Home";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/company/Contact";
import { Header } from "./components/Header";
import { PrivateRoute } from "./components/PrivateRoute";
import { About } from "./pages/company/About";
import { FAQ } from "./pages/FAQ";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SubscriptionSuccess } from "./pages/SubscriptionSuccess";
import { Subscription } from "./pages/Subscription";
import CookieBanner from "./components/CookieBanner";
import { Privacy } from "./pages/Privacy";
import "./i18n";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/auth" element={<Navigate to="/signup" replace />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/tools/homework-corrections"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tools/exercise-forge"
          element={
            <PrivateRoute>
              <ExerciseForge />
            </PrivateRoute>
          }
        />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/company/about" element={<About />} />
        <Route path="/company/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route element={<ProtectedRoute />}>
          {/* Your existing protected routes */}
        </Route>
      </Routes>
      <Toaster position="top-right" />
      <CookieBanner />
    </Router>
  );
}

export default App;
