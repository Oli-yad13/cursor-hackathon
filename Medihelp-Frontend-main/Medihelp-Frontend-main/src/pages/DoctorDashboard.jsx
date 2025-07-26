import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Bell,
  UserCheck,
  Activity,
  DollarSign,
  Video,
  Star,
  ChevronRight,
  Phone,
  MapPin
} from "lucide-react";
import { 
  getTodaysDoctorAppointments, 
  getDoctorStats, 
  updateAppointmentStatus,
  getDoctorAppointments 
} from "../services/appointmentService";

const DoctorDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayTotal: 0,
    todayCompleted: 0,
    todayRemaining: 0,
    monthlyAppointments: 0,
    monthlyRevenue: 0,
    activePatients: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load appointment data when userData is available
    if (userData?.email) {
      loadAppointmentData();
    }
  }, [userData]);

  const loadAppointmentData = () => {
    if (!userData?.email) return;

    // Get today's appointments
    const appointments = getTodaysDoctorAppointments(userData.email);
    setTodaysAppointments(appointments);

    // Get statistics
    const doctorStats = getDoctorStats(userData.email);
    setStats(doctorStats);
  };

  const handleAppointmentAction = (appointmentId, action) => {
    updateAppointmentStatus(appointmentId, action);
    loadAppointmentData(); // Refresh data
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Real stats data
  const statsDisplay = [
    {
      title: "Today's Appointments",
      value: stats.todayTotal.toString(),
      icon: Calendar,
      color: "bg-blue-500",
      change: `${stats.todayRemaining} remaining`
    },
    {
      title: "Active Patients",
      value: stats.activePatients.toString(),
      icon: Users,
      color: "bg-green-500",
      change: "Total patients served"
    },
    {
      title: "Consultations Done",
      value: stats.todayCompleted.toString(),
      icon: UserCheck,
      color: "bg-purple-500",
      change: `${stats.todayRemaining} remaining today`
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: `${stats.monthlyAppointments} appointments this month`
    }
  ];

  // Format time for display
  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const quickActions = [
    {
      title: "Schedule Appointment",
      description: "Book new patient appointments",
      icon: Calendar,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Patient Records",
      description: "Access patient medical history",
      icon: FileText,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Video Consultation",
      description: "Start teleconsultation session",
      icon: Video,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Analytics",
      description: "View practice performance",
      icon: TrendingUp,
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {getGreeting()}, Dr. {userData?.first_name || "Doctor"}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">Available</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsDisplay.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {stat.title}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {stat.change}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`w-full ${action.color} text-white rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-left">
                        <action.icon className="h-6 w-6 mr-3" />
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Today's Schedule
              </h2>
              <div className="space-y-4">
                {todaysAppointments.length > 0 ? (
                  todaysAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {appointment.patientName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {appointment.reason} • {formatTimeDisplay(appointment.time)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            ${appointment.consultationFee}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : appointment.status === "completed"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {appointment.status}
                        </span>
                        {appointment.type === "video" && (
                          <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        )}
                        {appointment.type === "in-person" && (
                          <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                        
                        {appointment.status === "confirmed" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAppointmentAction(appointment.id, 'completed')}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleAppointmentAction(appointment.id, 'cancelled')}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No appointments scheduled for today</p>
                  </div>
                )}
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                View Full Schedule
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Completed consultation with <span className="font-semibold">Jane Doe</span>
                </p>
                <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  New patient registration: <span className="font-semibold">Mark Wilson</span>
                </p>
                <span className="text-sm text-gray-500 ml-auto">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Updated medical records for <span className="font-semibold">Lisa Johnson</span>
                </p>
                <span className="text-sm text-gray-500 ml-auto">6 hours ago</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;