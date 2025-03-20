import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import NotFound from "./pages/NotFound";
import DirectAccess from "./pages/DirectAccess";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LearnerPage from "./pages/LearnerPage";
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem('isAdminLoggedIn') === 'true');

  useEffect(() => {
    // Check if admin is logged in on component mount
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAdminLoggedIn(loggedIn);
    console.log('useEffect in App.tsx: isAdminLoggedIn set to', loggedIn); // ADDED: Log in useEffect
  }, []);

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('isAdminLoggedIn', 'true');
    console.log('handleLogin in App.tsx: isAdminLoggedIn set to true, localStorage updated'); // ADDED: Log in handleLogin
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
    console.log('handleLogout in App.tsx: isAdminLoggedIn set to false, localStorage updated'); // ADDED: Log in handleLogout
  };

  console.log('App.tsx render: isAdminLoggedIn is', isAdminLoggedIn); // ADDED: Log before rendering routes

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={isAdminLoggedIn ? (
                <Layout onLogout={handleLogout}>
                  <Dashboard />
                </Layout>
              ) : (
                <>
                  {console.log('Navigating to /login because isAdminLoggedIn is false')}
                  <Navigate to="/login" replace />
                </>
              )}
            />
            <Route
              path="/courses"
              element={isAdminLoggedIn ? (
                <Layout onLogout={handleLogout}>
                  <Courses />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/courses/:id"
              element={isAdminLoggedIn ? (
                <Layout onLogout={handleLogout}>
                  <CourseDetail />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/employees"
              element={isAdminLoggedIn ? (
                <Layout onLogout={handleLogout}>
                  <Employees />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/employees/:id"
              element={isAdminLoggedIn ? (
                <Layout onLogout={handleLogout}>
                  <EmployeeDetail />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route path="/access/:token" element={<DirectAccess />} />
            <Route path="/learner/:employeeId" element={<LearnerPage />} />
            <Route path="/learner" element={<LearnerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
