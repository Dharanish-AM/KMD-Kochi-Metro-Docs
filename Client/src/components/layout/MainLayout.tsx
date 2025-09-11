import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface MainLayoutProps {
  children?: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Kochi Metro Documentation" 
          description="Centralized document management system"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}
