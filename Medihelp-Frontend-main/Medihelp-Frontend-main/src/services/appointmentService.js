// Frontend-only appointment management system using localStorage

// Generate unique ID for appointments
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get all appointments from localStorage
export const getAppointments = () => {
  try {
    const appointments = localStorage.getItem('appointments');
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};

// Save appointments to localStorage
const saveAppointments = (appointments) => {
  try {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  } catch (error) {
    console.error('Error saving appointments:', error);
  }
};

// Create a new appointment
export const createAppointment = (appointmentData) => {
  const appointments = getAppointments();
  const newAppointment = {
    id: generateId(),
    ...appointmentData,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  saveAppointments(appointments);
  return newAppointment;
};

// Get appointments for a specific patient
export const getPatientAppointments = (patientEmail) => {
  const appointments = getAppointments();
  return appointments.filter(apt => apt.patientEmail === patientEmail);
};

// Get appointments for a specific doctor
export const getDoctorAppointments = (doctorEmail) => {
  const appointments = getAppointments();
  return appointments.filter(apt => apt.doctorEmail === doctorEmail);
};

// Get today's appointments for a doctor
export const getTodaysDoctorAppointments = (doctorEmail) => {
  const appointments = getDoctorAppointments(doctorEmail);
  const today = new Date().toDateString();
  
  return appointments.filter(apt => {
    const appointmentDate = new Date(apt.date).toDateString();
    return appointmentDate === today;
  }).sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
};

// Get upcoming appointments for a patient
export const getUpcomingPatientAppointments = (patientEmail) => {
  const appointments = getPatientAppointments(patientEmail);
  const now = new Date();
  
  return appointments.filter(apt => {
    const appointmentDateTime = new Date(`${apt.date} ${apt.time}`);
    return appointmentDateTime > now;
  }).sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
};

// Cancel an appointment
export const cancelAppointment = (appointmentId) => {
  const appointments = getAppointments();
  const updatedAppointments = appointments.map(apt => 
    apt.id === appointmentId 
      ? { ...apt, status: 'cancelled', updatedAt: new Date().toISOString() }
      : apt
  );
  saveAppointments(updatedAppointments);
  return updatedAppointments.find(apt => apt.id === appointmentId);
};

// Update appointment status
export const updateAppointmentStatus = (appointmentId, status) => {
  const appointments = getAppointments();
  const updatedAppointments = appointments.map(apt => 
    apt.id === appointmentId 
      ? { ...apt, status, updatedAt: new Date().toISOString() }
      : apt
  );
  saveAppointments(updatedAppointments);
  return updatedAppointments.find(apt => apt.id === appointmentId);
};

// Get appointment statistics for doctor dashboard
export const getDoctorStats = (doctorEmail) => {
  const appointments = getDoctorAppointments(doctorEmail);
  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const todayAppointments = appointments.filter(apt => 
    new Date(apt.date).toDateString() === today
  );
  
  const thisMonthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear;
  });
  
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed').length;
  const totalToday = todayAppointments.length;
  const remainingToday = todayAppointments.filter(apt => 
    apt.status === 'confirmed' || apt.status === 'pending'
  ).length;
  
  // Calculate monthly revenue (assuming consultation fee is stored with appointment)
  const monthlyRevenue = thisMonthAppointments
    .filter(apt => apt.status === 'completed')
    .reduce((total, apt) => total + (apt.consultationFee || 0), 0);
  
  return {
    todayTotal: totalToday,
    todayCompleted: completedToday,
    todayRemaining: remainingToday,
    monthlyAppointments: thisMonthAppointments.length,
    monthlyRevenue: monthlyRevenue,
    activePatients: [...new Set(appointments.map(apt => apt.patientEmail))].length
  };
};

// Check for appointment conflicts
export const checkAppointmentConflict = (doctorEmail, date, time) => {
  const appointments = getDoctorAppointments(doctorEmail);
  return appointments.some(apt => 
    apt.date === date && 
    apt.time === time && 
    (apt.status === 'confirmed' || apt.status === 'pending')
  );
};

// Get available time slots for a doctor on a specific date
export const getAvailableTimeSlots = (doctorEmail, date) => {
  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];
  
  const bookedSlots = getDoctorAppointments(doctorEmail)
    .filter(apt => apt.date === date && (apt.status === 'confirmed' || apt.status === 'pending'))
    .map(apt => apt.time);
  
  return allSlots.filter(slot => !bookedSlots.includes(slot));
};