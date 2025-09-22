// utils/toaster.js
import { toast } from "@/hooks/use-toast";

export const showToast = {
  success: (title, description) => {
    toast({
      title: title || "Success!",
      description: description || "",
      variant: "default",
      className: "border-green-200 bg-green-50 text-green-800",
    });
  },

  error: (title, description) => {
    toast({
      title: title || "Error!",
      description: description || "",
      variant: "destructive",
    });
  },

  warning: (title, description) => {
    toast({
      title: title || "Warning!",
      description: description || "",
      variant: "default",
      className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    });
  },

  info: (title, description) => {
    toast({
      title: title || "Info",
      description: description || "",
      variant: "default",
      className: "border-blue-200 bg-blue-50 text-blue-800",
    });
  },

  // Simple methods for quick usage
  successSimple: (message) => {
    toast({
      description: message,
      variant: "default",
      className: "border-green-200 bg-green-50 text-green-800",
    });
  },

  errorSimple: (message) => {
    toast({
      description: message,
      variant: "destructive",
    });
  },
};

export default showToast;