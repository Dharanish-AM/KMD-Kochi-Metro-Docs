import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '../styles/landing.css';
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Shield,
  Zap,
  Users,
  Globe,
  Brain,
  Search,
  Upload,
  Download,
  BarChart3,
  Lock,
  Sparkles,
  CheckCircle,
  Star,
  Play,
  Menu,
  X,
  Train,
  Building2,
  Clock,
  TrendingUp,
  Award,
  Lightbulb,
  Workflow,
  Database,
  Cloud,
  MessageSquare,
  Eye,
  Target,
  Rocket,
  Heart,
  Coffee,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Monitor,
  Layers,
  Cpu,
  Network,
  Activity,
  BookOpen,
  Settings,
  Filter,
  MousePointer2,
  Palette,
  Infinity,
  Briefcase,
  Trophy,
  Diamond,
  Flame,
  Waves,
  Zap as Lightning,
  Atom,
  Binary,
} from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced neural networks automatically categorize, summarize, and extract actionable insights from your documents with unprecedented accuracy.',
      color: 'from-blue-600 via-cyan-500 to-teal-400',
      bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
      stats: '99.8% Accuracy',
      highlight: 'Most Advanced',
      benefits: ['Auto-categorization', 'Smart summaries', 'Insight extraction', 'Pattern recognition']
    },
    {
      icon: Search,
      title: 'Quantum Search Engine',
      description: 'Revolutionary semantic search technology that understands context, meaning, and relationships between documents.',
      color: 'from-purple-600 via-pink-500 to-rose-400',
      bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
      stats: '<0.3s Response',
      highlight: 'Lightning Fast',
      benefits: ['Semantic understanding', 'Multi-language support', 'Cross-references', 'Instant results']
    },
    {
      icon: Shield,
      title: 'Fort Knox Security',
      description: 'Military-grade encryption with quantum-resistant algorithms ensuring your data remains absolutely secure.',
      color: 'from-emerald-600 via-green-500 to-lime-400',
      bgGradient: 'from-emerald-50 via-green-50 to-lime-50',
      stats: 'Zero Breaches',
      highlight: 'Unbreakable',
      benefits: ['End-to-end encryption', 'Biometric access', 'Audit trails', 'Compliance ready']
    },
    {
      icon: Workflow,
      title: 'Seamless Ecosystem',
      description: 'Integrates flawlessly with over 100+ enterprise tools and creates a unified digital workspace.',
      color: 'from-orange-600 via-amber-500 to-yellow-400',
      bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
      stats: '100+ Integrations',
      highlight: 'Universal',
      benefits: ['API-first design', 'Webhook support', 'Single sign-on', 'Custom workflows']
    },
  ];

  const departments = [
    { 
      name: 'Operations & Maintenance', 
      icon: Train, 
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      description: 'Daily operations and system maintenance',
      users: '2.5k+ users',
      documents: '15k+ docs'
    },
    { 
      name: 'Engineering & Infrastructure', 
      icon: Building2, 
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      description: 'Infrastructure planning and development',
      users: '1.8k+ users',
      documents: '12k+ docs'
    },
    { 
      name: 'Finance & Accounts', 
      icon: BarChart3, 
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      description: 'Financial management and reporting',
      users: '950+ users',
      documents: '8k+ docs'
    },
    { 
      name: 'Human Resources', 
      icon: Users, 
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      description: 'Employee management and development',
      users: '750+ users',
      documents: '6k+ docs'
    },
    { 
      name: 'Legal & Compliance', 
      icon: Shield, 
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      description: 'Legal affairs and regulatory compliance',
      users: '420+ users',
      documents: '4k+ docs'
    },
    { 
      name: 'Information Technology', 
      icon: Cpu, 
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      description: 'IT infrastructure and digital solutions',
      users: '680+ users',
      documents: '7k+ docs'
    },
  ];

  const testimonials = [
    {
      name: 'Dr. A.P.M. Mohammed Hanish',
      role: 'Managing Director, KMRL',
      content: 'IntelliDocs has revolutionized how we manage documents across all departments. The AI capabilities are truly remarkable.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      content: 'The efficiency gains are incredible. We save 4-5 hours daily on document processing tasks.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Rajesh Kumar',
      role: 'IT Director',
      content: 'The security features and integration capabilities exceed our expectations. Highly recommended.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    },
  ];

  const stats = [
    { value: '50K+', label: 'Documents Processed', icon: FileText },
    { value: '99.9%', label: 'Uptime Guarantee', icon: Shield },
    { value: '15', label: 'Departments Served', icon: Building2 },
    { value: '24/7', label: 'AI Support', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  KMD
                </span>
                <div className="text-xs text-gray-500">AI-Powered Document Management</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#departments" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Departments
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Reviews
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </a>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100 animate-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Features
                </a>
                <a href="#departments" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Departments
                </a>
                <a href="#testimonials" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Reviews
                </a>
                <a href="#contact" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Contact
                </a>
                <Link to="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {/* Animated Gradient Orbs */}
          <div className="absolute inset-0">
            <div 
              className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                top: '10%', 
                left: '10%',
                transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
              }}
            ></div>
            <div 
              className="absolute w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                top: '20%', 
                right: '15%',
                animationDelay: '1s',
                transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.01}px)`
              }}
            ></div>
            <div 
              className="absolute w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                bottom: '20%', 
                left: '20%',
                animationDelay: '2s',
                transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.01}px)`
              }}
            ></div>
            <div 
              className="absolute w-64 h-64 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                bottom: '30%', 
                right: '10%',
                animationDelay: '0.5s',
                transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.015}px)`
              }}
            ></div>
          </div>

          {/* Floating Geometric Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl rotate-45 animate-bounce backdrop-blur-sm border border-blue-200/20"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full animate-pulse backdrop-blur-sm border border-purple-200/20" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl rotate-12 animate-pulse backdrop-blur-sm border border-indigo-200/20" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-2xl -rotate-12 animate-bounce backdrop-blur-sm border border-teal-200/20" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="w-full h-full animate-pulse" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59,130,246,0.8) 1px, transparent 0)',
              backgroundSize: '60px 60px',
              animationDuration: '4s'
            }}></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
                style={{ 
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            {/* <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-8 shadow-lg animate-in fade-in-0 duration-1000">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Powered by Advanced AI Technology</span>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">New</Badge>
            </div> */}

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              Transform Your
              <span className="block gradient-text-animated font-extrabold">
                Document Management
              </span>
              with AI Intelligence
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-1000 delay-400">
              Streamline operations across all KMRL departments with our cutting-edge AI-powered 
              document management system. Upload, analyze, and retrieve documents with unprecedented ease.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in slide-in-from-bottom-4 duration-1000 delay-600">
              <Link to="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-lg font-semibold">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-300 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-1000 delay-800">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-float hover-lift" style={{ animationDelay: `${index * 0.5}s` }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-xl neon-glow">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Organizations
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our AI-powered platform revolutionizes document management 
              with cutting-edge technology and intuitive design.
            </p>
          </div>

          {/* Interactive Features Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Feature Cards */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`group cursor-pointer transition-all duration-700 border-0 hover:shadow-2xl transform hover:scale-105 relative overflow-hidden ${
                    activeFeature === index 
                      ? 'shadow-2xl scale-105' 
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                  
                  {/* Active Feature Indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${feature.color} transition-all duration-500 ${
                    activeFeature === index ? 'opacity-100' : 'opacity-0'
                  }`}></div>

                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start space-x-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                        <feature.icon className="h-8 w-8 text-white relative z-10" />
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                                {feature.title}
                              </h3>
                              <Badge className={`bg-gradient-to-r ${feature.color} text-white border-0 shadow-md text-xs px-3 py-1`}>
                                {feature.highlight}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-bold">
                              {feature.stats}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {feature.description}
                        </p>
                        
                        {/* Feature Benefits */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Card>
              ))}
            </div>

            {/* Feature Visualization */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  {/* Mock Document Interface */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">KMRL IntelliDocs</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-full w-3/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
                        <Search className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="text-xs text-green-600 font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      AI Processing Complete
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Serving All
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                KMRL Departments
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored solutions for every department's unique document management needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-700 transform hover:scale-105 border-0 shadow-xl overflow-hidden relative">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dept.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-4 bg-gradient-to-br ${dept.gradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <dept.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 text-lg">
                        {dept.name}
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">{dept.description}</div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{dept.users}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{dept.documents}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span>Live Activity</span>
                    </div>
                    <Badge className={`bg-gradient-to-r ${dept.gradient} text-white border-0 shadow-lg`}>
                      Active
                    </Badge>
                  </div>
                </CardContent>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(30deg, #3b82f6 12%, transparent 12.5%, transparent 87%, #3b82f6 87.5%, #3b82f6), linear-gradient(150deg, #3b82f6 12%, transparent 12.5%, transparent 87%, #3b82f6 87.5%, #3b82f6)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">Customer Success Stories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Trusted by
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how organizations worldwide are transforming their document management with IntelliDocs
            </p>
          </div>

          {/* Enhanced Carousel */}
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="group border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-700 overflow-hidden">
                      <CardContent className="p-12 text-center relative">
                        {/* Quote Icon */}
                        <div className="absolute top-8 left-8 text-6xl text-blue-200 opacity-50 font-serif">"</div>
                        
                        {/* Stars */}
                        <div className="flex justify-center items-center mb-8 space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                          ))}
                        </div>
                        
                        {/* Testimonial Content */}
                        <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 mb-8 leading-relaxed italic max-w-4xl mx-auto">
                          "{testimonial.content}"
                        </blockquote>
                        
                        {/* Author */}
                        <div className="flex items-center justify-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <User className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-xl text-gray-900">{testimonial.name}</div>
                            <div className="text-blue-600 font-medium">{testimonial.role}</div>
                          </div>
                        </div>

                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center mt-12 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    currentTestimonial === index 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Departments</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Documents Processed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          {/* Animated Gradient Meshes */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-32 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-40 right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Geometric Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(30deg, #3b82f6 12%, transparent 12.5%, transparent 87%, #3b82f6 87.5%, #3b82f6), linear-gradient(150deg, #3b82f6 12%, transparent 12.5%, transparent 87%, #3b82f6 87.5%, #3b82f6), linear-gradient(30deg, #8b5cf6 12%, transparent 12.5%, transparent 87%, #8b5cf6 87.5%, #8b5cf6), linear-gradient(150deg, #8b5cf6 12%, transparent 12.5%, transparent 87%, #8b5cf6 87.5%, #8b5cf6)',
              backgroundSize: '80px 80px'
            }}></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-16 left-16 w-8 h-8 bg-white/10 rounded-lg rotate-45 animate-bounce backdrop-blur-sm"></div>
            <div className="absolute top-32 right-24 w-6 h-6 bg-blue-400/20 rounded-full animate-pulse backdrop-blur-sm"></div>
            <div className="absolute bottom-24 left-24 w-4 h-4 bg-purple-400/20 rounded-sm rotate-12 animate-bounce backdrop-blur-sm" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-16 right-16 w-10 h-10 bg-indigo-400/20 rounded-xl -rotate-12 animate-pulse backdrop-blur-sm" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 shadow-xl">
            <Rocket className="h-5 w-5 text-blue-300" />
            <span className="text-sm font-semibold text-white">Join the Digital Revolution</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Document Universe?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of KMRL professionals already using IntelliDocs to revolutionize their 
            operations and unlock unprecedented productivity with cutting-edge AI technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/login">
              <Button size="lg" className="group bg-white text-slate-900 hover:bg-blue-50 px-10 py-5 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500 transform hover:scale-110 text-lg font-bold border-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <Rocket className="ml-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="group border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-10 py-5 rounded-2xl text-lg font-bold backdrop-blur-sm transition-all duration-500 hover:scale-105">
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-blue-200 text-sm">Secure & Compliant</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-blue-200 text-sm">Active Users</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <Clock className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-blue-200 text-sm">AI Support</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">300%</div>
              <div className="text-blue-200 text-sm">Productivity Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    KMRL IntelliDocs
                  </span>
                  <div className="text-gray-400 font-medium">AI-Powered Document Intelligence</div>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Revolutionizing document management for Kochi Metro Rail Limited with 
                state-of-the-art artificial intelligence and quantum-speed processing.
              </p>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">50K+</div>
                  <div className="text-xs text-gray-400">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">15</div>
                  <div className="text-xs text-gray-400">Departments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-xs text-gray-400">AI Support</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white mb-6 relative">
                Quick Links
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </h4>
              <div className="space-y-4">
                {[
                  { href: "#features", label: "Features", icon: Zap },
                  { href: "#departments", label: "Departments", icon: Building2 },
                  { href: "#testimonials", label: "Reviews", icon: Star },
                  { href: "/login", label: "Sign In", icon: ArrowRight, isLink: true }
                ].map((item, index) => (
                  <div key={index}>
                    {item.isLink ? (
                      <Link 
                        to={item.href} 
                        className="flex items-center space-x-3 text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                      >
                        <item.icon className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ) : (
                      <a 
                        href={item.href} 
                        className="flex items-center space-x-3 text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                      >
                        <item.icon className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                        <span className="font-medium">{item.label}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white mb-6 relative">
                Contact Us
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300 group hover:text-white transition-colors duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">+91 484 123 4567</div>
                    <div className="text-xs text-gray-500">24/7 Support Hotline</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300 group hover:text-white transition-colors duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">support@kmrlintelli.com</div>
                    <div className="text-xs text-gray-500">Email Support</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300 group hover:text-white transition-colors duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Kochi Metro Rail Ltd</div>
                    <div className="text-xs text-gray-500">Kerala, India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-8">
                <div className="text-gray-400">
                  © 2025 KMRL IntelliDocs. All rights reserved.
                </div>
                <div className="hidden md:flex space-x-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-red-500 animate-pulse" />
                <span className="text-gray-400">Crafted with passion for KMRL</span>
                <div className="flex items-center space-x-1">
                  <Coffee className="h-4 w-4 text-amber-400" />
                  <span className="text-gray-500 text-sm">& lots of coffee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;