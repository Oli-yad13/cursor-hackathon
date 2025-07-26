import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, DollarSign, Video, MapPin } from 'lucide-react';
import { createAppointment, getAvailableTimeSlots, checkAppointmentConflict } from '../services/appointmentService';

const AppointmentModal = ({ isOpen, onClose, doctor, onAppointmentBooked }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [reason, setReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user data
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate && doctor) {
      const slots = getAvailableTimeSlots(doctor.user.email, selectedDate);
      setAvailableSlots(slots);
      setSelectedTime(''); // Reset time when date changes
    }
  }, [selectedDate, doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!selectedDate || !selectedTime || !reason.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Check for conflicts
      if (checkAppointmentConflict(doctor.user.email, selectedDate, selectedTime)) {
        throw new Error('This time slot is no longer available');
      }

      // Create appointment
      const appointmentData = {
        doctorId: doctor.id,
        doctorName: `Dr. ${doctor.user.first_name} ${doctor.user.last_name}`,
        doctorEmail: doctor.user.email,
        doctorSpecialization: doctor.specialization,
        patientName: `${userData.first_name} ${userData.last_name}`,
        patientEmail: userData.email,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        reason: reason.trim(),
        consultationFee: doctor.consultation_fee,
        status: 'confirmed'
      };

      const newAppointment = createAppointment(appointmentData);
      
      // Call callback to notify parent component
      if (onAppointmentBooked) {
        onAppointmentBooked(newAppointment);
      }

      // Reset form and close modal
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentType('video');
      setReason('');
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Book Appointment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {doctor.user.first_name[0]}{doctor.user.last_name[0]}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Dr. {doctor.user.first_name} {doctor.user.last_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
              <div className="flex items-center mt-1">
                <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">${doctor.consultation_fee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="inline h-4 w-4 mr-2" />
              Select Time
            </label>
            {selectedDate ? (
              availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === slot
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No available slots for this date
                </p>
              )
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Please select a date first
              </p>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Appointment Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="video"
                  checked={appointmentType === 'video'}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="mr-2"
                />
                <Video className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Video Consultation</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="in-person"
                  checked={appointmentType === 'in-person'}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="mr-2"
                />
                <MapPin className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">In-Person Visit</span>
              </label>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your symptoms or reason for consultation..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime || !reason.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;