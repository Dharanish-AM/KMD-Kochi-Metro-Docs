import axiosInstance from "@/Utils/Auth/axiosInstance";

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Department types based on backend schema
export interface Employee {
  _id: string;
  name: string;
}

export interface Document {
  _id: string;
  title: string;
}

export interface DepartmentFromAPI {
  _id: string;
  name: string;
  description?: string;
  employees: Employee[];
  documents: Document[];
  createdAt: string;
}

// Department API functions
export const departmentAPI = {
  // Get all departments for UI
  getDepartments: async (): Promise<DepartmentFromAPI[]> => {
    try {
      const response = await axiosInstance.get('/api/departments/get-department-ui');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },

  // Get specific department by ID
  getDepartment: async (id: string): Promise<DepartmentFromAPI> => {
    try {
      const response = await axiosInstance.get(`/api/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch department:', error);
      throw error;
    }
  },

  // Create new department
//   createDepartment: async (data: { name: string; description?: string }): Promise<{ message: string; department: DepartmentFromAPI }> => {
//     try {
//       const response = await axiosInstance.post('/api/departments/create-department', data);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create department:', error);
//       throw error;
//     }
//   },
};

// Utility function to transform API data to UI format
export function transformDepartmentData(apiDepartment: DepartmentFromAPI): {
  id: string;
  name: string;
  description?: string;
  category?: string;
  totalDocs: number;
  pendingDocs: number;
  activeUsers: number;
  completionRate: number;
  lastUpdated: string;
  status: "active" | "maintenance" | "inactive";
  slug: string; // Added slug for URL routing
} {
  // Calculate stats based on real data
  const totalDocs = apiDepartment.documents.length;
  const activeUsers = apiDepartment.employees.length;
  
  // For now, we'll estimate these values. In a real app, you'd get these from the backend
  const pendingDocs = Math.floor(totalDocs * 0.1); // Assume 10% are pending
  const completionRate = totalDocs > 0 ? Math.floor(90 + Math.random() * 10) : 0; // Random between 90-100%
  
  // Calculate time since last update
  const lastUpdate = new Date(apiDepartment.createdAt);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60));
  const lastUpdated = diffInHours < 24 ? `${diffInHours} hours ago` : `${Math.floor(diffInHours / 24)} days ago`;
  
  // Determine category based on department name
  const getCategoryFromName = (name: string): string => {
    const technicalDepts = [
      'operations & maintenance', 
      'engineering & infrastructure', 
      'electrical & mechanical',
      'information technology & systems',
      'environment & sustainability'
    ];
    const adminDepts = [
      'human resources', 
      'finance & accounts', 
      'legal & compliance',
      'corporate communications'
    ];
    const operationalDepts = [
      'procurement & contracts',
      'business development',
      'vigilance & security',
      'customer relations & services',
      'project management',
      'planning & development'
    ];
    
    const lowerName = name.toLowerCase();
    if (technicalDepts.some(dept => lowerName.includes(dept.toLowerCase()))) return 'technical';
    if (adminDepts.some(dept => lowerName.includes(dept.toLowerCase()))) return 'administrative';
    if (operationalDepts.some(dept => lowerName.includes(dept.toLowerCase()))) return 'operational';
    return 'other';
  };

  // Create URL-friendly slug
  const createSlug = (name: string): string => {
    const slugMap: { [key: string]: string } = {
      'operations & maintenance': 'operations-maintenance',
      'engineering & infrastructure': 'engineering-infrastructure',
      'electrical & mechanical': 'electrical-mechanical',
      'finance & accounts': 'finance-accounts',
      'human resources': 'hr',
      'legal & compliance': 'legal-compliance',
      'procurement & contracts': 'procurement-contracts',
      'corporate communications': 'corporate-communications',
      'business development': 'business-development',
      'vigilance & security': 'vigilance-security',
      'information technology & systems': 'it-systems',
      'planning & development': 'planning-development',
      'environment & sustainability': 'environment-sustainability',
      'customer relations & services': 'customer-services',
      'project management': 'project-management',
      
      // Alternative mappings for shorter forms
      'operations': 'operations-maintenance',
      'engineering': 'engineering-infrastructure',
      'electrical': 'electrical-mechanical',
      'finance': 'finance-accounts',
      'hr': 'hr',
      'legal': 'legal-compliance',
      'procurement': 'procurement-contracts',
      'communications': 'corporate-communications',
      'business': 'business-development',
      'security': 'vigilance-security',
      'it': 'it-systems',
      'planning': 'planning-development',
      'environment': 'environment-sustainability',
      'customer': 'customer-services',
      'project': 'project-management'
    };
    
    const lowerName = name.toLowerCase();
    return slugMap[lowerName] || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return {
    id: apiDepartment._id,
    name: apiDepartment.name,
    description: apiDepartment.description,
    category: getCategoryFromName(apiDepartment.name),
    totalDocs,
    pendingDocs,
    activeUsers,
    completionRate,
    lastUpdated,
    status: "active", // For now, assume all are active. This could be enhanced based on real data
    slug: createSlug(apiDepartment.name)
  };
}