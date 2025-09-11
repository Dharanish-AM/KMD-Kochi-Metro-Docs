import { createContext, useContext, useState, ReactNode } from "react"

export type Language = "en" | "ml"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "train.operational.intelligence": "Train Operational Intelligence",
    "critical.operational.data": "Critical operational data for train route clearance and safety verification",
    "route.clearance.report": "Route Clearance Report",
    "share.control.center": "Share with Control Center",
    
    // Stats
    "total.issues": "Total Issues",
    "critical.alerts": "Critical Alerts", 
    "safety.concerns": "Safety Concerns",
    "active.alerts": "Active Alerts",
    
    // Filters
    "search": "Search",
    "search.placeholder": "Search important points...",
    "department": "Department",
    "category": "Category",
    "priority": "Priority",
    "all.departments": "All Departments",
    "all.categories": "All Categories",
    "all.priorities": "All Priorities",
    "high.priority": "High Priority",
    "medium.priority": "Medium Priority", 
    "low.priority": "Low Priority",
    
    // Categories
    "safety": "Safety",
    "procedures": "Procedures",
    "policies": "Policies",
    "regulations": "Regulations",
    "guidelines": "Guidelines",
    "requirements": "Requirements",
    "warnings": "Warnings",
    "security": "Security",
    
    // Departments
    "signal.telecommunications": "Signal & Telecommunications",
    "rolling.stock.maintenance": "Rolling Stock Maintenance",
    "track.maintenance": "Track Maintenance",
    "electrical.systems": "Electrical Systems",
    "station.operations": "Station Operations",
    "control.center.operations": "Control Center Operations",
    "track.safety.systems": "Track Safety Systems",
    "environmental.control": "Environmental Control",
    "tunnel.safety": "Tunnel Safety",
    "overhead.line.equipment": "Overhead Line Equipment",
    
    // Priority levels
    "high": "High",
    "medium": "Medium",
    "low": "Low",
    
    // Common
    "confidence": "Confidence",
    "page": "Page",
    "load.more.points": "Load More Points",
    "no.points.found": "No important points found",
    "adjust.filters": "Try adjusting your filters or search terms"
  },
  ml: {
    // Header
    "train.operational.intelligence": "ട്രയിൻ ഓപ്പറേഷണൽ ഇന്റലിജൻസ്",
    "critical.operational.data": "ട്രയിൻ റൂട്ട് ക്ലിയറൻസിനും സുരക്ഷാ പരിശോധനയ്ക്കുമുള്ള നിർണായക പ്രവർത്തന ഡാറ്റ",
    "route.clearance.report": "റൂട്ട് ക്ലിയറൻസ് റിപ്പോർട്ട്",
    "share.control.center": "കൺട്രോൾ സെന്ററുമായി പങ്കിടുക",
    
    // Stats
    "total.issues": "മൊത്തം പ്രശ്നങ്ങൾ",
    "critical.alerts": "നിർണായക മുന്നറിയിപ്പുകൾ",
    "safety.concerns": "സുരക്ഷാ ആശങ്കകൾ", 
    "active.alerts": "സജീവ മുന്നറിയിപ്പുകൾ",
    
    // Filters
    "search": "തിരയുക",
    "search.placeholder": "പ്രധാന പോയിന്റുകൾ തിരയുക...",
    "department": "വകുപ്പ്",
    "category": "വിഭാഗം",
    "priority": "മുൻഗണന",
    "all.departments": "എല്ലാ വകുപ്പുകളും",
    "all.categories": "എല്ലാ വിഭാഗങ്ങളും", 
    "all.priorities": "എല്ലാ മുൻഗണനകളും",
    "high.priority": "ഉയർന്ന മുൻഗണന",
    "medium.priority": "ഇടത്തരം മുൻഗണന",
    "low.priority": "കുറഞ്ഞ മുൻഗണന",
    
    // Categories
    "safety": "സുരക്ഷ",
    "procedures": "നടപടിക്രമങ്ങൾ",
    "policies": "നയങ്ങൾ", 
    "regulations": "നിയന്ത്രണങ്ങൾ",
    "guidelines": "മാർഗ്ഗനിർദ്ദേശങ്ങൾ",
    "requirements": "ആവശ്യകതകൾ",
    "warnings": "മുന്നറിയിപ്പുകൾ",
    "security": "സെക്യൂരിറ്റി",
    
    // Departments
    "signal.telecommunications": "സിഗ്നൽ & ടെലികമ്മ്യൂണിക്കേഷൻസ്",
    "rolling.stock.maintenance": "റോളിംഗ് സ്റ്റോക്ക് മെയിൻറനൻസ്",
    "track.maintenance": "ട്രാക്ക് മെയിൻറനൻസ്", 
    "electrical.systems": "ഇലക്ട്രിക്കൽ സിസ്റ്റംസ്",
    "station.operations": "സ്റ്റേഷൻ ഓപ്പറേഷൻസ്",
    "control.center.operations": "കൺട്രോൾ സെന്റർ ഓപ്പറേഷൻസ്",
    "track.safety.systems": "ട്രാക്ക് സേഫ്റ്റി സിസ്റ്റംസ്",
    "environmental.control": "എൻവയോൺമെന്റൽ കൺട്രോൾ",
    "tunnel.safety": "ടണൽ സേഫ്റ്റി",
    "overhead.line.equipment": "ഓവർഹെഡ് ലൈൻ ഇക്വിപ്മെന്റ്",
    
    // Priority levels
    "high": "ഉയർന്ന",
    "medium": "ഇടത്തരം",
    "low": "കുറഞ്ഞ",
    
    // Common
    "confidence": "വിശ്വാസ്യത",
    "page": "പേജ്",
    "load.more.points": "കൂടുതൽ പോയിന്റുകൾ ലോഡ് ചെയ്യുക",
    "no.points.found": "പ്രധാന പോയിന്റുകൾ കണ്ടെത്തിയില്ല",
    "adjust.filters": "നിങ്ങളുടെ ഫിൽട്ടറുകളോ തിരയൽ പദങ്ങളോ ക്രമീകരിക്കാൻ ശ്രമിക്കുക"
  }
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
