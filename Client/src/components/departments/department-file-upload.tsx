import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
  Trash2,
  Eye,
  Download,
  Calendar,
  User,
  FolderOpen,
  Image,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileType,
  Film,
  Music,
  Archive,
  Code,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/Utils/Auth/axiosInstance";
import { documentAPI, DocumentFromAPI } from "@/lib/api";
import { getUser } from "@/Utils/Auth/token";

interface DepartmentFileUploadProps {
  department: string;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  description?: string;
  preview?: string; // For image files
}

// Department theme configuration
const departmentThemes = {
  // KMRL Departments with new themes
  "Operations & Maintenance": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    secondary: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700",
  },
  "Engineering & Infrastructure": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    secondary: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700",
  },
  "Electrical & Mechanical": {
    primary: "from-orange-600 via-amber-700 to-yellow-800",
    secondary: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-amber-100",
    darkBg: "from-orange-900/20 to-amber-800/20",
    border: "border-orange-200 dark:border-orange-700",
  },
  "Finance & Accounts": {
    primary: "from-yellow-600 via-amber-700 to-orange-800",
    secondary: "from-yellow-50 to-amber-50",
    accent: "bg-yellow-500",
    text: "text-yellow-600",
    lightBg: "from-yellow-50 to-amber-100",
    darkBg: "from-yellow-900/20 to-amber-800/20",
    border: "border-yellow-200 dark:border-yellow-700",
  },
  "Human Resources": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    secondary: "from-emerald-50 to-green-50",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700",
  },
  "Legal & Compliance": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    secondary: "from-purple-50 to-violet-50",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700",
  },
  "Procurement & Contracts": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    secondary: "from-teal-50 to-emerald-50",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700",
  },
  "Corporate Communications": {
    primary: "from-pink-600 via-rose-700 to-red-800",
    secondary: "from-pink-50 to-rose-50",
    accent: "bg-pink-500",
    text: "text-pink-600",
    lightBg: "from-pink-50 to-rose-100",
    darkBg: "from-pink-900/20 to-rose-800/20",
    border: "border-pink-200 dark:border-pink-700",
  },
  "Business Development": {
    primary: "from-indigo-600 via-blue-700 to-cyan-800",
    secondary: "from-indigo-50 to-blue-50",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-blue-100",
    darkBg: "from-indigo-900/20 to-blue-800/20",
    border: "border-indigo-200 dark:border-indigo-700",
  },
  "Vigilance & Security": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    secondary: "from-red-50 to-rose-50",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700",
  },
  "Information Technology & Systems": {
    primary: "from-violet-600 via-purple-700 to-indigo-800",
    secondary: "from-violet-50 to-purple-50",
    accent: "bg-violet-500",
    text: "text-violet-600",
    lightBg: "from-violet-50 to-purple-100",
    darkBg: "from-violet-900/20 to-purple-800/20",
    border: "border-violet-200 dark:border-violet-700",
  },
  "Planning & Development": {
    primary: "from-lime-600 via-green-700 to-emerald-800",
    secondary: "from-lime-50 to-green-50",
    accent: "bg-lime-500",
    text: "text-lime-600",
    lightBg: "from-lime-50 to-green-100",
    darkBg: "from-lime-900/20 to-green-800/20",
    border: "border-lime-200 dark:border-lime-700",
  },
  "Environment & Sustainability": {
    primary: "from-green-600 via-emerald-700 to-teal-800",
    secondary: "from-green-50 to-emerald-50",
    accent: "bg-green-500",
    text: "text-green-600",
    lightBg: "from-green-50 to-emerald-100",
    darkBg: "from-green-900/20 to-emerald-800/20",
    border: "border-green-200 dark:border-green-700",
  },
  "Customer Relations & Services": {
    primary: "from-sky-600 via-blue-700 to-indigo-800",
    secondary: "from-sky-50 to-blue-50",
    accent: "bg-sky-500",
    text: "text-sky-600",
    lightBg: "from-sky-50 to-blue-100",
    darkBg: "from-sky-900/20 to-blue-800/20",
    border: "border-sky-200 dark:border-sky-700",
  },
  "Project Management": {
    primary: "from-orange-600 via-amber-700 to-yellow-800",
    secondary: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-amber-100",
    darkBg: "from-orange-900/20 to-amber-800/20",
    border: "border-orange-200 dark:border-orange-700",
  },
  // Legacy department mappings (for backward compatibility)
  Engineering: {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    secondary: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700",
  },
  HR: {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    secondary: "from-emerald-50 to-green-50",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700",
  },
  Legal: {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    secondary: "from-purple-50 to-violet-50",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700",
  },
  Finance: {
    primary: "from-amber-600 via-yellow-700 to-orange-800",
    secondary: "from-amber-50 to-yellow-50",
    accent: "bg-amber-500",
    text: "text-amber-600",
    lightBg: "from-amber-50 to-yellow-100",
    darkBg: "from-amber-900/20 to-yellow-800/20",
    border: "border-amber-200 dark:border-amber-700",
  },
  Safety: {
    primary: "from-red-600 via-rose-700 to-pink-800",
    secondary: "from-red-50 to-rose-50",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700",
  },
  Operations: {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    secondary: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700",
  },
  Procurement: {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    secondary: "from-teal-50 to-emerald-50",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700",
  },
  Admin: {
    primary: "from-slate-600 via-gray-700 to-zinc-800",
    secondary: "from-slate-50 to-gray-50",
    accent: "bg-slate-500",
    text: "text-slate-600",
    lightBg: "from-slate-50 to-gray-100",
    darkBg: "from-slate-900/20 to-gray-800/20",
    border: "border-slate-200 dark:border-slate-700",
  },
  Maintenance: {
    primary: "from-orange-600 via-red-700 to-rose-800",
    secondary: "from-orange-50 to-red-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-red-100",
    darkBg: "from-orange-900/20 to-red-800/20",
    border: "border-orange-200 dark:border-orange-700",
  },
  Security: {
    primary: "from-indigo-600 via-purple-700 to-violet-800",
    secondary: "from-indigo-50 to-purple-50",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-purple-100",
    darkBg: "from-indigo-900/20 to-purple-800/20",
    border: "border-indigo-200 dark:border-indigo-700",
  },
};



export const DepartmentFileUpload = ({
  department,
}: DepartmentFileUploadProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadDescription, setUploadDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDocuments, setUserDocuments] = useState<DocumentFromAPI[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Get department theme
  const theme =
    departmentThemes[department as keyof typeof departmentThemes] ||
    departmentThemes["Engineering"];

  // Get appropriate icon for file type
  const getFileIcon = (fileName: string, mimeType?: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    // Image files
    if (
      mimeType?.startsWith("image/") ||
      [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "svg",
        "tiff",
        "ico",
      ].includes(extension || "")
    ) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    }

    // Video files
    if (
      mimeType?.startsWith("video/") ||
      ["mp4", "avi", "mov", "webm", "ogv", "mkv", "flv"].includes(
        extension || ""
      )
    ) {
      return <Film className="h-5 w-5 text-purple-500" />;
    }

    // Audio files
    if (
      mimeType?.startsWith("audio/") ||
      ["mp3", "wav", "ogg", "aac", "m4a", "flac"].includes(extension || "")
    ) {
      return <Music className="h-5 w-5 text-green-500" />;
    }

    // Archive files
    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension || "")) {
      return <Archive className="h-5 w-5 text-orange-500" />;
    }

    // Spreadsheet files
    if (["xls", "xlsx", "csv"].includes(extension || "")) {
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    }

    // Code files
    if (
      [
        "js",
        "ts",
        "html",
        "css",
        "json",
        "xml",
        "py",
        "java",
        "cpp",
        "c",
      ].includes(extension || "")
    ) {
      return <Code className="h-5 w-5 text-indigo-500" />;
    }

    // Document files
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }

    // Default file icon
    return <FileType className="h-5 w-5 text-gray-500" />;
  };

  // Fetch current user and their documents
  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        const user = getUser();
        if (!user || !user.id) {
          console.error("No user found");
          setIsLoadingDocuments(false);
          return;
        }

        setCurrentUser(user);
        const documents = await documentAPI.getDocumentsByUser(user.id);
        setUserDocuments(documents);
      } catch (error) {
        console.error("Failed to fetch user documents:", error);
        toast({
          title: "Error",
          description: "Failed to load your documents",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchUserDocuments();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    // Validate file types and size
    const validFiles = newFiles.filter((file) => {
      const maxSize = 50 * 1024 * 1024; // 50MB as per backend
      const allowedTypes = [
        // Document types
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.ms-powerpoint", // .ppt
        "text/plain", // .txt
        "text/csv", // .csv
        "application/rtf", // .rtf

        // Image types
        "image/jpeg", // .jpg, .jpeg
        "image/png", // .png
        "image/gif", // .gif
        "image/bmp", // .bmp
        "image/webp", // .webp
        "image/svg+xml", // .svg
        "image/tiff", // .tiff
        "image/x-icon", // .ico

        // Archive types
        "application/zip", // .zip
        "application/x-rar-compressed", // .rar
        "application/x-7z-compressed", // .7z
        "application/x-tar", // .tar
        "application/gzip", // .gz

        // Audio types
        "audio/mpeg", // .mp3
        "audio/wav", // .wav
        "audio/ogg", // .ogg
        "audio/aac", // .aac
        "audio/mp4", // .m4a

        // Video types
        "video/mp4", // .mp4
        "video/avi", // .avi
        "video/quicktime", // .mov
        "video/x-msvideo", // .avi
        "video/webm", // .webm
        "video/ogg", // .ogv

        // Other formats
        "application/json", // .json
        "application/xml", // .xml
        "text/xml", // .xml
        "application/javascript", // .js
        "text/css", // .css
        "text/html", // .html
        "application/octet-stream", // Generic binary files
      ];

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 50MB limit.`,
          variant: "destructive",
        });
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        const fileExtension =
          file.name.split(".").pop()?.toLowerCase() || "unknown";
        toast({
          title: "Unsupported File Type",
          description: `${fileExtension.toUpperCase()} files are not supported. Please upload documents, images, audio, video, or archive files.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    const uploadFiles: UploadFile[] = await Promise.all(
      validFiles.map(async (file) => {
        let preview: string | undefined;

        // Generate preview for image files
        if (file.type.startsWith("image/")) {
          try {
            preview = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
          } catch (error) {
            console.warn("Failed to generate image preview:", error);
          }
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: "pending" as const,
          description: uploadDescription || file.name,
          preview,
        };
      })
    );

    setFiles((prev) => [...prev, ...uploadFiles]);

    // Show success message
    toast({
      title: "Files Selected",
      description: `${uploadFiles.length} file${
        uploadFiles.length > 1 ? "s" : ""
      } ready for upload`,
      variant: "default",
    });
  };

  const uploadFileToBackend = async (uploadFile: UploadFile) => {
    const { file, description } = uploadFile;

    try {
      // Set status to uploading when upload actually starts
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "uploading", progress: 0 }
            : f
        )
      );

      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", description || file.name);

      // Department will be automatically fetched from user's profile in backend

      const response = await axiosInstance.post(
        `/api/documents/upload?userId=${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === uploadFile.id
                    ? { ...f, progress, status: "uploading" }
                    : f
                )
              );
            }
          },
        }
      );

      // Update file status to completed
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, progress: 100, status: "completed" }
            : f
        )
      );

      return response.data;
    } catch (error: any) {
      console.error("Upload error:", error);

      // Update file status to error
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "error" } : f
        )
      );

      throw error;
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSubmitAll = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files before submitting.",
        variant: "destructive",
      });
      return;
    }



    if (pendingFiles === 0) {
      toast({
        title: "No Files to Upload",
        description: "All files have already been processed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Only upload pending files
      const pendingFilesToUpload = files.filter((f) => f.status === "pending");
      const uploadPromises = pendingFilesToUpload.map((file) =>
        uploadFileToBackend(file)
      );

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      // Check results
      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const errorCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successCount > 0) {
        toast({
          title: "Upload Successful!",
          description: `${successCount} file${
            successCount > 1 ? "s" : ""
          } uploaded successfully${
            errorCount > 0
              ? `. ${errorCount} file${errorCount > 1 ? "s" : ""} failed.`
              : "."
          }`,
          variant:
            successCount === pendingFilesToUpload.length
              ? "default"
              : "destructive",
        });
      }

      if (errorCount === pendingFilesToUpload.length) {
        toast({
          title: "Upload Failed",
          description:
            "All files failed to upload. Please check your connection and try again.",
          variant: "destructive",
        });
      }

      // Clear completed and pending files after successful submission
      if (successCount > 0) {
        // Refresh the user documents list
        refreshDocuments();

        setTimeout(() => {
          setFiles((prev) => prev.filter((f) => f.status === "error")); // Keep only error files
          setUploadDescription("");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Upload Error",
        description:
          error.response?.data?.error ||
          "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (document: DocumentFromAPI): string => {
    // Try uploadedAt first, then createdAt as fallback
    const dateString = document.uploadedAt || document.createdAt;
    
    if (!dateString) return 'No date available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const toggleSummary = (documentId: string) => {
    setExpandedSummaries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  };

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    if (!currentUser) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await documentAPI.deleteDocument(documentId, currentUser.id);
      setUserDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
      toast({
        title: "Success",
        description: `"${fileName}" has been deleted successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshDocuments = async () => {
    if (!currentUser) return;

    setIsLoadingDocuments(true);
    try {
      const documents = await documentAPI.getDocumentsByUser(currentUser.id);
      setUserDocuments(documents);
    } catch (error) {
      console.error("Failed to refresh documents:", error);
      toast({
        title: "Error",
        description: "Failed to refresh your documents",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const completedFiles = files.filter((f) => f.status === "completed").length;
  const pendingFiles = files.filter((f) => f.status === "pending").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;
  const errorFiles = files.filter((f) => f.status === "error").length;
  const totalSize = files.reduce((acc, file) => acc + file.file.size, 0);

  return (
    <div className="space-y-8">
      {/* Header Section - Now uses department theme colors */}
      <div
        className={`bg-gradient-to-br ${theme.primary} rounded-xl p-6 text-white shadow-2xl`}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Upload className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Upload Documents</h2>
        </div>
        <p className="text-white/90 font-medium">
          Submit your documents for {department} department review and approval
        </p>
      </div>

      {/* Upload Configuration */}
      <Card className={`border-2 border-dashed ${theme.border} shadow-lg`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${theme.text}`}>
            <FileText className="h-5 w-5" />
            <span>Document Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Input
                id="description"
                placeholder="Brief description of the documents"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging
                ? `${theme.border
                    .replace("border-", "border-")
                    .replace("-200", "-400")} bg-gradient-to-br ${
                    theme.lightBg
                  } ${theme.darkBg} scale-105`
                : `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50`
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <div className="space-y-4">
              <div
                className={`mx-auto w-16 h-16 ${
                  isDragging ? theme.accent : "bg-gray-100 dark:bg-gray-700"
                } rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDragging ? "animate-bounce" : ""
                }`}
              >
                <Upload
                  className={`h-8 w-8 transition-all duration-300 ${
                    isDragging ? "text-white animate-pulse" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {isDragging
                    ? "Drop your files here"
                    : "Drag & drop files here"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click the button below to browse files
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full text-xs">
                    <FileText className="h-3 w-3 text-red-500" />
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full text-xs">
                    <FileImage className="h-3 w-3 text-blue-500" />
                    <span>Images</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full text-xs">
                    <Film className="h-3 w-3 text-purple-500" />
                    <span>Videos</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full text-xs">
                    <Music className="h-3 w-3 text-green-500" />
                    <span>Audio</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full text-xs">
                    <Archive className="h-3 w-3 text-orange-500" />
                    <span>Archives</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full text-xs">
                    <Code className="h-3 w-3 text-indigo-500" />
                    <span>Code</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Maximum file size: 50MB per file
                </p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tiff,.ico,.zip,.rar,.7z,.tar,.gz,.mp3,.wav,.ogg,.aac,.m4a,.mp4,.avi,.mov,.webm,.ogv,.json,.xml,.js,.css,.html"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button
                asChild
                size="lg"
                className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </label>
              </Button>
            </div>
          </div>

          {/* Upload Guidelines */}
          <Alert
            className={`${theme.border} bg-gradient-to-r ${theme.lightBg} dark:${theme.darkBg}`}
          >
            <AlertCircle className={`h-4 w-4 ${theme.text}`} />
            <AlertDescription className={`${theme.text} dark:text-white`}>
              <strong>Important:</strong> Ensure all documents are properly
              named and contain relevant information for the {department}{" "}
              department. Files will be reviewed by administrators before
              approval.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* File List & Submit Section */}
      {files.length > 0 && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card
            className={`bg-gradient-to-br ${theme.lightBg} ${theme.darkBg} ${theme.border} shadow-lg`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 ${theme.accent} rounded-full flex items-center justify-center`}
                  >
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pendingFiles} Files Ready for Submission
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total size: {formatFileSize(totalSize)}
                      {completedFiles > 0 && (
                        <span className="ml-2 text-green-600">
                          • {completedFiles} uploaded
                        </span>
                      )}
                      {errorFiles > 0 && (
                        <span className="ml-2 text-red-600">
                          • {errorFiles} failed
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitAll}
                  disabled={isSubmitting}
                  size="lg"
                  className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit All Files
                    </>
                  )}
                </Button>
              </div>

              {completedFiles > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Upload Progress</span>
                    <span>
                      {completedFiles} of {files.length} completed
                    </span>
                  </div>
                  <Progress
                    value={(completedFiles / files.length) * 100}
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* File List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Selected Files ({files.length})</span>
                </div>
                {files.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>Types:</span>
                      {[
                        ...new Set(files.map((f) => f.file.type.split("/")[0])),
                      ].map((type, index, array) => (
                        <span key={type} className="capitalize">
                          {type === "application" ? "docs" : type}
                          {index < array.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex-shrink-0">
                      {file.preview && file.file.type.startsWith("image/") ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center border shadow-sm">
                          {getFileIcon(file.file.name, file.file.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.file.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>{formatFileSize(file.file.size)}</span>
                        {file.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-xs">
                              {file.description}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <Progress
                          value={file.progress}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs font-medium text-gray-900 dark:text-white min-w-[3rem] text-right">
                          {file.status === "pending"
                            ? "Ready"
                            : `${Math.round(file.progress)}%`}
                        </span>
                        <div className="min-w-[1.5rem] flex justify-center">
                          {file.status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {file.status === "uploading" && (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          {file.status === "pending" && (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Documents Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5" />
                <span>Recent Documets</span>
                <Badge variant="secondary" className="ml-2">
                  {userDocuments.length > 3
                    ? "3 of " + userDocuments.length
                    : userDocuments.length}{" "}
                  documents
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDocuments}
                disabled={isLoadingDocuments}
                className="flex items-center space-x-2"
              >
                {isLoadingDocuments ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>Refresh</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDocuments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">
                  Loading your documents...
                </span>
              </div>
            ) : userDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload your first document using the form above
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userDocuments.slice(-3).map((document) => (
                  <div
                    key={document._id}
                    className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'
                    }}
                  >
                    {/* Decorative gradient bar at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="p-6 relative z-10">
                      <div className="flex items-start justify-between">
                        {/* Left section with document info */}
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          {/* Enhanced file icon */}
                          <div className="relative flex-shrink-0">
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                              {getFileIcon(document.fileName)}
                            </div>
                          </div>

                          {/* Document details */}
                          <div className="flex-1 min-w-0">
                            {/* Document title */}
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
                                {document.title || document.fileName}
                              </h4>
                            </div>

                            {/* Metadata badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <FileText className="h-3 w-3 mr-1" />
                                {document.fileName}
                              </Badge>
                              <Badge className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <Archive className="h-3 w-3 mr-1" />
                                {formatFileSize(document.fileSize)}
                              </Badge>
                              <Badge className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                {document.category}
                              </Badge>
                              {document.detected_language &&
                                document.detected_language !== "unknown" && (
                                  <Badge className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    {document.detected_language.toUpperCase()}
                                  </Badge>
                                )}
                            </div>

                            {/* User and date info */}
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                                <span className="font-medium">{document.uploadedBy?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>Uploaded {formatDate(document)}</span>
                              </div>
                            </div>

                            {/* AI-Generated Summary - Collapsible */}
                            {document.summary && (
                              <div className="mb-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSummary(document._id)}
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto rounded-xl transition-all duration-200"
                                >
                                  <Sparkles className="h-4 w-4" />
                                  <span className="text-sm font-medium">AI Summary</span>
                                  {expandedSummaries.has(document._id) ? (
                                    <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                                  )}
                                </Button>
                                
                                {expandedSummaries.has(document._id) && (
                                  <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm transition-all duration-300 ease-in-out transform">
                                    <div className="flex items-start space-x-2">
                                      <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                      <p className="text-sm text-blue-700 leading-relaxed">
                                        {document.summary}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right section with actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Implement document view/download
                              toast({
                                title: "Feature Coming Soon",
                                description:
                                  "Document viewing will be available soon",
                                variant: "default",
                              });
                            }}
                            className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0 h-10 w-10 p-0 rounded-xl"
                            title="View Document"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteDocument(document._id, document.fileName)
                            }
                            className="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0 h-10 w-10 p-0 rounded-xl"
                            title="Delete Document"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line with animation */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
