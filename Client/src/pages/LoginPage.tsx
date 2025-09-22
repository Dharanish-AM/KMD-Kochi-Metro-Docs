import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import LoginLottie from "@/Utils/Lotties/Loginlottie.json";
import axiosInstance from "@/Utils/Auth/axiosInstance";
import { setToken, setUser, setUserType } from "@/Utils/Auth/token";
import { showToast } from "@/Utils/toaster";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Prevent automatic scrolling
  useEffect(() => {
    // Disable smooth scrolling behavior globally for this component
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    return () => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on change to prevent scroll on submit
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // Call the backend login API
      const response = await axiosInstance.post("/api/employee/login", {
        email: data.email,
        password: data.password,
      });

      // Store token and user data in localStorage
      const { token, user, userType } = response.data;
      
      // Store the token
      setToken(token);
      
      // Store user data using utility functions
      setUser(user);
      setUserType(userType);
      
      console.log("Login successful:", response.data);
      
      // Show success toast
      showToast.success(
        "Login Successful!", 
        `Welcome back, ${user.name}!`
      );
      
      // Redirect to dashboard
      navigate("/");
      
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle error response with toast
      if (err.response?.data?.message) {
        showToast.error("Login Failed", err.response.data.message);
      } else {
        showToast.error(
          "Login Failed", 
          "An error occurred during login. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4"
      style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Lottie Animation - Hidden on mobile */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500/80 via-indigo-500/80 to-purple-600/80 items-center justify-center p-8 lg:p-12 relative">
            {/* Subtle overlay to dim background */}
            <div className="absolute inset-0 bg-black/10"></div>
            {/* Subtle overlay to dim background */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="w-full max-w-md text-center relative z-10">
              <div className="mb-8">
                <Lottie
                  animationData={LoginLottie}
                  loop={true}
                  className="w-full h-80 lg:h-96 drop-shadow-lg"
                />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-md">
                Welcome Back!
              </h1>
              <p className="text-blue-50 text-lg leading-relaxed drop-shadow-sm">
                Sign in to access your dashboard and manage your documents efficiently.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form - Full width on mobile */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">
              <Card className="border-0 shadow-none">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Form {...form}>
                    <form 
                      onSubmit={form.handleSubmit(onSubmit)} 
                      className="space-y-6"
                      style={{ scrollMarginTop: 0 }}
                      onInvalid={(e) => e.preventDefault()}
                    >
                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email"
                                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      {/* Password Field */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      {/* Forgot Password Link */}
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                          Forgot your password?
                        </button>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Signing In...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Sign In
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Additional Info */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                      By signing in, you agree to our{" "}
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
