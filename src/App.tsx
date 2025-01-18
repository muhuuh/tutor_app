import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { ExerciseForge } from './pages/ExerciseForge';
import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Header } from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tools/homework-corrections" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/tools/exercise-forge" element={
            <PrivateRoute>
              <ExerciseForge />
            </PrivateRoute>
          } />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </>
  );
}

export default App;