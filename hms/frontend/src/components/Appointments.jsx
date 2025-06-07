import { api } from "../libs/api";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';


import { 
  Calendar,
  Plus, 
  Edit, 
  Save,
  X,
} from 'lucide-react';
export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'scheduled'
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments...');
      setLoading(true);
      const data = await api.get('/appointments');
      console.log('Appointments data:', data);
      setAppointments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      console.log('Fetching patients...');
      const data = await api.get('/patients');
      console.log('Patients data:', data);
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors...');
      const data = await api.get('/doctors');
      console.log('Doctors data:', data);
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await api.put(`/appointments/${editingAppointment.id}`, formData);
      } else {
        await api.post('/appointments', formData);
      }
      setFormData({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'scheduled' });
      setShowForm(false);
      setEditingAppointment(null);
      fetchAppointments();
      setLoading(false);
    } catch (error) {
      setError('Failed to save appointment');
      console.error('Error saving appointment:', error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date?.split('T')[0] || '',
      time: appointment.time || '',
      reason: appointment.reason || '',
      status: appointment.status
    });
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner message="Loading appointments..." />;

  return (
    <div className="p-6 fade-in">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Schedule Appointment
        </button>
      </div>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAppointment(null);
                  setFormData({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'scheduled' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient *
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.phone}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor *
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  placeholder="Enter reason for appointment"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              
              {editingAppointment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingAppointment ? 'Update' : 'Schedule'} Appointment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAppointment(null);
                    setFormData({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'scheduled' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.doctorName}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        {appointment.time && (
                          <div className="text-gray-500">{appointment.time}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {appointment.reason || 'Not specified'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        appointment.status === 'completed' ? 'badge-success' :
                        appointment.status === 'scheduled' ? 'badge-info' :
                        appointment.status === 'cancelled' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit Appointment"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500 mb-6">Schedule your first appointment to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Schedule First Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};