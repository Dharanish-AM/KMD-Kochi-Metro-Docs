import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import DepartmentPanel from "./pages/DepartmentPanel";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import { UsersPage } from "./pages/UsersPage";
import { ProfilePage } from "./pages/ProfilePage"
import { NotificationsPage } from "./pages/NotificationsPage"
import { SettingsPage } from "./pages/SettingsPage";
import { DepartmentsPage } from "./pages/DepartmentsPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { AllUsersPage } from "./pages/AllUsersPage";
import ImportantPointsPage from "./pages/ImportantPointsPage";
import ChatAssistantPage from "./pages/ChatAssistantPage";
import { RagSearchPage } from "./pages/RagSearchPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Index /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute adminOnly={true}><DepartmentsPage /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute adminOnly={true}><DocumentsPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute adminOnly={true}><AllUsersPage /></ProtectedRoute>} />
            <Route path="/important-points" element={<ProtectedRoute adminOnly={true}><ImportantPointsPage /></ProtectedRoute>} />
            <Route path="/rag-search" element={<ProtectedRoute adminOnly={true}><RagSearchPage /></ProtectedRoute>} />
            <Route path="/chat-assistant" element={<ProtectedRoute adminOnly={true}><ChatAssistantPage /></ProtectedRoute>} />
            <Route path="/department/:departmentName" element={<ProtectedRoute><DepartmentPanel /></ProtectedRoute>} />
            <Route path="/users/:departmentId" element={<ProtectedRoute adminOnly={true}><UsersPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          
            <Route path="/operations-maintenance" element={<ProtectedRoute><DepartmentDashboard department="Operations & Maintenance" /></ProtectedRoute>} />
            <Route path="/engineering-infrastructure" element={<ProtectedRoute><DepartmentDashboard department="Engineering & Infrastructure" /></ProtectedRoute>} />
            <Route path="/electrical-mechanical" element={<ProtectedRoute><DepartmentDashboard department="Electrical & Mechanical" /></ProtectedRoute>} />
            <Route path="/finance-accounts" element={<ProtectedRoute><DepartmentDashboard department="Finance & Accounts" /></ProtectedRoute>} />
            <Route path="/hr" element={<ProtectedRoute><DepartmentDashboard department="Human Resources" /></ProtectedRoute>} />
            <Route path="/legal-compliance" element={<ProtectedRoute><DepartmentDashboard department="Legal & Compliance" /></ProtectedRoute>} />
            <Route path="/procurement-contracts" element={<ProtectedRoute><DepartmentDashboard department="Procurement & Contracts" /></ProtectedRoute>} />
            <Route path="/corporate-communications" element={<ProtectedRoute><DepartmentDashboard department="Corporate Communications" /></ProtectedRoute>} />
            <Route path="/business-development" element={<ProtectedRoute><DepartmentDashboard department="Business Development" /></ProtectedRoute>} />
            <Route path="/vigilance-security" element={<ProtectedRoute><DepartmentDashboard department="Vigilance & Security" /></ProtectedRoute>} />
            <Route path="/it-systems" element={<ProtectedRoute><DepartmentDashboard department="Information Technology & Systems" /></ProtectedRoute>} />
            <Route path="/planning-development" element={<ProtectedRoute><DepartmentDashboard department="Planning & Development" /></ProtectedRoute>} />
            <Route path="/environment-sustainability" element={<ProtectedRoute><DepartmentDashboard department="Environment & Sustainability" /></ProtectedRoute>} />
            <Route path="/customer-services" element={<ProtectedRoute><DepartmentDashboard department="Customer Relations & Services" /></ProtectedRoute>} />
            <Route path="/project-management" element={<ProtectedRoute><DepartmentDashboard department="Project Management" /></ProtectedRoute>} />
            
            <Route path="/engineering" element={<ProtectedRoute><DepartmentDashboard department="Engineering & Infrastructure" /></ProtectedRoute>} />
            <Route path="/human-resources" element={<ProtectedRoute><DepartmentDashboard department="Human Resources" /></ProtectedRoute>} />
            <Route path="/legal" element={<ProtectedRoute><DepartmentDashboard department="Legal & Compliance" /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><DepartmentDashboard department="Finance & Accounts" /></ProtectedRoute>} />
            <Route path="/safety" element={<ProtectedRoute><DepartmentDashboard department="Vigilance & Security" /></ProtectedRoute>} />
            <Route path="/operations" element={<ProtectedRoute><DepartmentDashboard department="Operations & Maintenance" /></ProtectedRoute>} />
            <Route path="/procurement" element={<ProtectedRoute><DepartmentDashboard department="Procurement & Contracts" /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><DepartmentDashboard department="Corporate Communications" /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute><DepartmentDashboard department="Operations & Maintenance" /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><DepartmentDashboard department="Vigilance & Security" /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
