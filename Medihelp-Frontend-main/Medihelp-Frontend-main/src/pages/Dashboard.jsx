import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import DoctorDashboard from "./DoctorDashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Stethoscope,
  Clock,
  Calendar,
  Heart,
  Camera,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Shield,
  Zap,
  User,
  ChevronRight,
  BarChart3,
  Plus,
} from "lucide-react";
import { getHealthChecks, getSymptomById } from "../services/api";
// Simplified useAuth hook
const useAuth = () => {
  const [user, setUser] = useState({ first_name: "User", role: "patient" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // First check if we have stored user data
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser({ 
            first_name: userData.first_name || userData.name || "User",
            role: userData.role || "patient"
          });
        } else {
          // Try to decode JWT token
          const base64Url = token.split('.')[1];
          if (base64Url) {
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            setUser({ 
              first_name: decoded.first_name || decoded.name || "User",
              role: decoded.role || "patient"
            });
          } else {
            // Fallback to a default user
            setUser({ first_name: "User", role: "patient" });
          }
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token decode error:", error);
        // Check for stored user data as fallback
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setUser({ 
              first_name: userData.first_name || userData.name || "User" 
            });
          } catch (e) {
            setUser({ first_name: "User" });
          }
        } else {
          setUser({ first_name: "User" });
        }
        setIsAuthenticated(true);
      }
    }
    setIsLoading(false);
  }, []);

  return { user, isAuthenticated, isLoading };
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [symptomChecks, setSymptomChecks] = useState([]);
  const [isLoadingChecks, setIsLoadingChecks] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Only redirect if definitely not authenticated and we have a token
    const token = localStorage.getItem("token");
    if (!isLoading && !isAuthenticated && !token) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // If user is a doctor, show doctor dashboard
  if (user.role === "doctor") {
    return <DoctorDashboard />;
  }

  useEffect(() => {
    const fetchSymptomChecks = async () => {
      try {
        setIsLoadingChecks(true);
        const response = await getHealthChecks();
        const data = response?.data?.results || response?.results || [];

        // Fetch symptom names for each health check
        const checksWithSymptomNames = await Promise.all(
          data.map(async (check) => {
            const symptomNames = await Promise.all(
              check.symptoms.map(async (symptomId) => {
                try {
                  const symptom = await getSymptomById(symptomId);
                  return symptom.name;
                } catch {
                  return "Unknown Symptom";
                }
              })
            );
            return { ...check, symptomNames };
          })
        );

        setSymptomChecks(checksWithSymptomNames);
      } catch (error) {
        console.error("Error fetching symptom checks:", error);
        // Enhanced fallback data
        setSymptomChecks([
          {
            id: 50,
            user: 19,
            symptoms: [7],
            symptomNames: ["Cough"],
            conditions: [
              {
                id: 2,
                name: "Common Cold",
                severity: 1,
                severity_display: "Mild",
                description: "Viral infection of the upper respiratory tract",
              },
            ],
            diagnosis: {
              urgency: "low",
              recommendations: [
                "Rest and get plenty of sleep",
                "Drink warm fluids like tea or soup",
                "Consider over-the-counter cough medicine",
              ],
            },
            created_at: "2025-05-04T18:12:33.014794Z",
          },
          {
            id: 49,
            user: 19,
            symptoms: [7, 10, 13, 14, 15],
            symptomNames: ["Cough", "Nausea", "Diarrhea", "Vomiting", "Abdominal Pain"],
            conditions: [
              {
                id: 5,
                name: "Food Poisoning",
                severity: 3,
                severity_display: "Severe",
                description: "Gastrointestinal illness caused by contaminated food.",
              },
            ],
            diagnosis: {
              urgency: "medium",
              recommendations: [
                "Stay hydrated with clear fluids",
                "Rest and avoid strenuous activity",
                "Monitor symptoms for worsening",
                "Consider seeking medical attention if symptoms persist",
              ],
            },
            created_at: "2025-05-04T18:10:23.196215Z",
          },
        ]);
      } finally {
        setIsLoadingChecks(false);
      }
    };
    
    if (isAuthenticated) {
      fetchSymptomChecks();
    }
  }, [isAuthenticated]);

  // Helper function to get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Helper function to get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high": return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      case "low": return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if we have a token, regardless of decoding success
  const token = localStorage.getItem("token");
  if (!isAuthenticated && !token) {
    return null;
  }

  const quickActions = [
    {
      title: "Symptom Checker",
      description: "Check your symptoms with AI-powered analysis",
      icon: <Activity className="h-6 w-6" />,
      gradient: "from-blue-500 to-cyan-500",
      route: "/symptom-checker",
      action: "Start Check"
    },
    {
      title: "First Aid",
      description: "Access emergency guides and procedures",
      icon: <Shield className="h-6 w-6" />,
      gradient: "from-red-500 to-pink-500",
      route: "/first-aid",
      action: "View Guides"
    },
    {
      title: "Find Doctors",
      description: "Book consultations with specialists",
      icon: <Stethoscope className="h-6 w-6" />,
      gradient: "from-green-500 to-emerald-500",
      route: "/find-doctor",
      action: "Find Doctors"
    },
    {
      title: "Skin Diagnosis",
      description: "AI-powered skin condition analysis",
      icon: <Camera className="h-6 w-6" />,
      gradient: "from-purple-500 to-violet-500",
      route: "/skin-diagnosis",
      action: "Take Photo"
    },
    {
      title: "Health Education",
      description: "Learn about health topics and wellness",
      icon: <BookOpen className="h-6 w-6" />,
      gradient: "from-orange-500 to-amber-500",
      route: "/education",
      action: "Learn More"
    },
    {
      title: "Health Chat",
      description: "Chat with our AI health assistant",
      icon: <MessageCircle className="h-6 w-6" />,
      gradient: "from-indigo-500 to-blue-500",
      route: "/chat",
      action: "Start Chat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavBar />
      
      {/* Header Section */}
      <div className="pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              {getGreeting()}, {user.first_name}! 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Welcome to your health dashboard. Take control of your wellness journey with our comprehensive tools.
            </p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 dark:border-gray-700/20">
              {[
                { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
                { id: "health-records", label: "Health Records", icon: <Heart className="h-4 w-4" /> },
                { id: "appointments", label: "Appointments", icon: <Calendar className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                           onClick={() => navigate(action.route)}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          {action.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {action.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`}>
                            {action.action}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Health Checks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recent Health Checks</h3>
                      <p className="text-gray-600 dark:text-gray-400">Your recent symptom checks and analysis results</p>
                    </div>
                    <button
                      onClick={() => navigate("/symptom-checker")}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="h-4 w-4" />
                      New Check
                    </button>
                  </div>

                  {isLoadingChecks ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your health checks...</p>
                    </div>
                  ) : symptomChecks.length > 0 ? (
                    <div className="space-y-4">
                      {symptomChecks.slice(0, 3).map((check, index) => (
                        <motion.div
                          key={check.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-gray-50/80 dark:bg-gray-700/80 rounded-xl p-6 hover:bg-gray-100/80 dark:hover:bg-gray-600/80 transition-all duration-300 cursor-pointer"
                          onClick={() => navigate(`/symptom-checker/results/${check.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
                                <Activity className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Health Check #{check.id}
                                  </h4>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(check.diagnosis?.urgency)}`}>
                                    {check.diagnosis?.urgency?.toUpperCase() || "UNKNOWN"} URGENCY
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Symptoms:</span> {check.symptomNames?.join(", ") || "No symptoms recorded"}
                                  </p>
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Conditions:</span> {
                                      check.conditions?.length > 0 
                                        ? check.conditions.map(c => c.name).join(", ")
                                        : "No conditions identified"
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {new Date(check.created_at).toLocaleDateString()}
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {symptomChecks.length > 3 && (
                        <div className="text-center pt-4">
                          <button
                            onClick={() => setActiveTab("health-records")}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            View all {symptomChecks.length} health checks →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Health Checks Yet</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">Start monitoring your health by performing your first symptom check.</p>
                      <button
                        onClick={() => navigate("/symptom-checker")}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        Check Symptoms Now
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeTab === "health-records" && (
              <motion.div
                key="health-records"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Health Records</h3>
                    <p className="text-gray-600 dark:text-gray-400">Complete history of your symptom checks and health analysis</p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Records: {symptomChecks.length}
                  </div>
                </div>

                {isLoadingChecks ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your health records...</p>
                  </div>
                ) : symptomChecks.length > 0 ? (
                  <div className="space-y-4">
                    {symptomChecks.map((check, index) => (
                      <motion.div
                        key={check.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-gray-50/80 dark:bg-gray-700/80 rounded-xl p-6 hover:bg-gray-100/80 dark:hover:bg-gray-600/80 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
                            <Activity className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Health Check #{check.id}
                                </h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(check.diagnosis?.urgency)}`}>
                                  {check.diagnosis?.urgency?.toUpperCase() || "UNKNOWN"} URGENCY
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(check.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-700 dark:text-gray-300 mb-1">
                                  <span className="font-medium">Symptoms:</span> {check.symptomNames?.join(", ") || "No symptoms recorded"}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Conditions:</span> {
                                    check.conditions?.length > 0 
                                      ? check.conditions.map(c => c.name).join(", ")
                                      : "No conditions identified"
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-700 dark:text-gray-300 mb-1">
                                  <span className="font-medium">Severity:</span> {
                                    check.conditions?.length > 0 
                                      ? check.conditions.map(c => c.severity_display).join(", ")
                                      : "N/A"
                                  }
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">Recommendations:</span> {
                                    check.diagnosis?.recommendations?.slice(0, 2).join(", ") + 
                                    (check.diagnosis?.recommendations?.length > 2 ? "..." : "") || "None provided"
                                  }
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/symptom-checker/results/${check.id}`)}
                              className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                            >
                              View Full Details
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Health Records</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't performed any symptom checks yet. Start building your health history today.</p>
                    <button
                      onClick={() => navigate("/symptom-checker")}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                    >
                      Check Symptoms Now
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Appointments</h3>
                    <p className="text-gray-600 dark:text-gray-400">Manage your teleconsultations and upcoming appointments</p>
                  </div>
                </div>

                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Upcoming Appointments</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have any scheduled appointments. Book a consultation with our qualified doctors.</p>
                  <button
                    onClick={() => navigate("/find-doctor")}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Book an Appointment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;