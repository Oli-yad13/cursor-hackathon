import React, { useState, useEffect } from "react";
import { CalendarIcon, Stethoscope, Video, MapPin, Clock, User } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getPatientAppointments, getUpcomingPatientAppointments, cancelAppointment } from "../services/appointmentService";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    // Load appointments when userData is available
    if (userData?.email) {
      loadAppointments();
    }
  }, [userData]);

  const loadAppointments = () => {
    if (!userData?.email) return;
    const userAppointments = getPatientAppointments(userData.email);
    setAppointments(userAppointments);
  };

  const handleCancelAppointment = (appointmentId) => {
    cancelAppointment(appointmentId);
    loadAppointments(); // Refresh the list
  };

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const appointmentDateTime = new Date(`${apt.date} ${apt.time}`);
      return appointmentDateTime > now && apt.status !== 'cancelled';
    }).sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const appointmentDateTime = new Date(`${apt.date} ${apt.time}`);
      return appointmentDateTime <= now;
    }).sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
  };

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  return (
    <div className="flex flex-col min-h-screen">
     
      <div className="container mx-auto py-19 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Appointments</h1>
        </div>

        <div className="mb-6">
          <button
            className={`mr-2 px-4 py-2 rounded ${activeTab === "upcoming" ? "bg-blue-500 text-white" : "bg-gray-100 text-blue-500 border border-blue-500"}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`mr-2 px-4 py-2 rounded ${activeTab === "book" ? "bg-blue-500 text-white" : "bg-gray-100 text-blue-500 border border-blue-500"}`}
            onClick={() => setActiveTab("book")}
          >
            Book Appointment
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "history" ? "bg-blue-500 text-white" : "bg-gray-100 text-blue-500 border border-blue-500"}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === "upcoming" && (
            <div>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 border rounded-lg shadow-sm bg-white mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-500">{appointment.doctorSpecialization}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs flex items-center ${
                        appointment.type === 'video' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {appointment.type === 'video' ? (
                          <Video className="h-3 w-3 mr-1" />
                        ) : (
                          <MapPin className="h-3 w-3 mr-1" />
                        )}
                        {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center mb-3">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{formatTimeDisplay(appointment.time)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">Reason: {appointment.reason}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button 
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      {appointment.type === 'video' && (
                        <button className="bg-cyan-400 text-white rounded px-4 py-2 hover:bg-cyan-500">
                          Join Call
                        </button>
                      )}
                      <div className="text-sm text-gray-600">
                        Fee: ${appointment.consultationFee}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 border rounded-lg shadow-sm bg-white text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-500">You don't have any upcoming appointments.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "book" && (
            <div className="p-12 border rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-800">Book a New Appointment</h3>
              <p className="text-sm text-gray-500">Schedule a consultation with one of our healthcare professionals.</p>
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Doctor</label>
                <select className="w-full border border-gray-300 rounded p-2 text-gray-500">
                  <option>Select a doctor</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-cyan-400 text-white rounded px-4 py-2 w-full hover:bg-cyan-500">
                  Book Appointment
                </button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 border rounded-lg shadow-sm bg-white mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-500">{appointment.doctorSpecialization}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {appointment.status}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center mb-3">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{formatTimeDisplay(appointment.time)}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">Reason: {appointment.reason}</span>
                      </div>
                      <div className="flex items-center">
                        {appointment.type === 'video' ? (
                          <Video className="h-4 w-4 mr-2 text-gray-500" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        )}
                        <span className="text-gray-700">
                          {appointment.type === 'video' ? 'Video Call' : 'In-Person'} • ${appointment.consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 border rounded-lg shadow-sm bg-white text-center">
                  <Stethoscope className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Past Appointments</h3>
                  <p className="text-gray-500">You don't have any past appointments.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer className="w-full mt-auto" />
    </div>
  );
};

export default Appointments;