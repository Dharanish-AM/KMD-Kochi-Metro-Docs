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
          
          {/* Department-specific dashboard routes */}
          <Route path="/engineering" element={<DepartmentDashboard department="Engineering" />} />
          <Route path="/hr" element={<DepartmentDashboard department="HR" />} />
          <Route path="/legal" element={<DepartmentDashboard department="Legal" />} />
          <Route path="/finance" element={<DepartmentDashboard department="Finance" />} />
          <Route path="/safety" element={<DepartmentDashboard department="Safety" />} />
          <Route path="/operations" element={<DepartmentDashboard department="Operations" />} />
          <Route path="/procurement" element={<DepartmentDashboard department="Procurement" />} />
          <Route path="/admin" element={<DepartmentDashboard department="Admin" />} />
          <Route path="/maintenance" element={<DepartmentDashboard department="Maintenance" />} />
          <Route path="/security" element={<DepartmentDashboard department="Security" />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
