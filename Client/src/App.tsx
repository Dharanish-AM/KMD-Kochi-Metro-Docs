import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Index />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/users" element={<AllUsersPage />} />
          <Route path="/important-points" element={<ImportantPointsPage />} />
          <Route path="/department/:departmentName" element={<DepartmentPanel />} />
          <Route path="/users/:departmentId" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Department-specific dashboard routes - matching slug mappings */}
          {/* Operations & Maintenance */}
          <Route path="/operations-maintenance" element={<DepartmentDashboard department="Operations & Maintenance" />} />
          {/* Engineering & Infrastructure */}
          <Route path="/engineering-infrastructure" element={<DepartmentDashboard department="Engineering & Infrastructure" />} />
          {/* Electrical & Mechanical */}
          <Route path="/electrical-mechanical" element={<DepartmentDashboard department="Electrical & Mechanical" />} />
          {/* Finance & Accounts */}
          <Route path="/finance-accounts" element={<DepartmentDashboard department="Finance & Accounts" />} />
          {/* Human Resources */}
          <Route path="/hr" element={<DepartmentDashboard department="Human Resources" />} />
          {/* Legal & Compliance */}
          <Route path="/legal-compliance" element={<DepartmentDashboard department="Legal & Compliance" />} />
          {/* Procurement & Contracts */}
          <Route path="/procurement-contracts" element={<DepartmentDashboard department="Procurement & Contracts" />} />
          {/* Corporate Communications */}
          <Route path="/corporate-communications" element={<DepartmentDashboard department="Corporate Communications" />} />
          {/* Business Development */}
          <Route path="/business-development" element={<DepartmentDashboard department="Business Development" />} />
          {/* Vigilance & Security */}
          <Route path="/vigilance-security" element={<DepartmentDashboard department="Vigilance & Security" />} />
          {/* Information Technology & Systems */}
          <Route path="/it-systems" element={<DepartmentDashboard department="Information Technology & Systems" />} />
          {/* Planning & Development */}
          <Route path="/planning-development" element={<DepartmentDashboard department="Planning & Development" />} />
          {/* Environment & Sustainability */}
          <Route path="/environment-sustainability" element={<DepartmentDashboard department="Environment & Sustainability" />} />
          {/* Customer Relations & Services */}
          <Route path="/customer-services" element={<DepartmentDashboard department="Customer Relations & Services" />} />
          {/* Project Management */}
          <Route path="/project-management" element={<DepartmentDashboard department="Project Management" />} />
          
          {/* Legacy department routes (keeping for backward compatibility) */}
          <Route path="/engineering" element={<DepartmentDashboard department="Engineering & Infrastructure" />} />
          <Route path="/human-resources" element={<DepartmentDashboard department="Human Resources" />} />
          <Route path="/legal" element={<DepartmentDashboard department="Legal & Compliance" />} />
          <Route path="/finance" element={<DepartmentDashboard department="Finance & Accounts" />} />
          <Route path="/safety" element={<DepartmentDashboard department="Vigilance & Security" />} />
          <Route path="/operations" element={<DepartmentDashboard department="Operations & Maintenance" />} />
          <Route path="/procurement" element={<DepartmentDashboard department="Procurement & Contracts" />} />
          <Route path="/admin" element={<DepartmentDashboard department="Corporate Communications" />} />
          <Route path="/maintenance" element={<DepartmentDashboard department="Operations & Maintenance" />} />
          <Route path="/security" element={<DepartmentDashboard department="Vigilance & Security" />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
