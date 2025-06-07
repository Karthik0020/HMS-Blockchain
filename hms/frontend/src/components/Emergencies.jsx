import { api } from "../libs/api";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';

import { 
  Plus, 
  Edit, 
  Save,
  X,
  AlertTriangle,
  Phone,
  Clock,
  User,
  Stethoscope,
  MapPin
} from 'lucide-react';

export const Emergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmergency, setEditingEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '', 
    doctorId: '', 
    type: '', 
    priority: 'medium', 
    description: '', 
    location: '', 
    status: 'active'
  });

  useEffect(() => {
    fetchEmergencies();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchEmergencies = async () => {
    try {
      console.log('Fetching emergencies...');
      setLoading(true);
      const data = await api.get('/emergencies');
      console.log('Emergencies data:', data);
      setEmergencies(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      setError('Failed to load emergencies');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await api.get('/patients');
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await api.get('/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingEmergency) {
        await api.put(`/emergencies/${editingEmergency.id}`, formData);
      } else {
        await api.post('/emergencies', formData);
      }
      setFormData({ 
        patientId: '', 
        doctorId: '', 
        type: '', 
        priority: 'medium', 
        description: '', 
        location: '', 
        status: 'active' 
      });
      setShowForm(false);
      setEditingEmergency(null);
      fetchEmergencies();
    } catch (error) {
      setError('Failed to save emergency');
      console.error('Error saving emergency:', error);
    }
  };

  const handleEdit = (emergency) => {
    setEditingEmergency(emergency);
    setFormData({
      patientId: emergency.patientId || '',
      doctorId: emergency.doctorId || '',
      type: emergency.type || '',
      priority: emergency.priority || 'medium',
      description: emergency.description || '',
      location: emergency.location || '',
      status: emergency.status || 'active'
    });
    setShowForm(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'badge-danger';
      case 'in-progress':
        return 'badge-warning';
      case 'resolved':
        return 'badge-success';
      case 'cancelled':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <LoadingSpinner message="Loading emergencies..." />;

  return (
    <div className="p-6 fade-in">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Emergency Management</h1>
          <p className="text-gray-600">Track and manage emergency cases</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Report Emergency
        </button>
      </div>

      {/* Emergency Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingEmergency ? 'Update Emergency' : 'Report New Emergency'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingEmergency(null);
                  setFormData({ 
                    patientId: '', 
                    doctorId: '', 
                    type: '', 
                    priority: 'medium', 
                    description: '', 
                    location: '', 
                    status: 'active' 
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    Assigned Doctor
                  </label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Cardiac Arrest">Cardiac Arrest</option>
                    <option value="Respiratory Distress">Respiratory Distress</option>
                    <option value="Trauma">Trauma</option>
                    <option value="Stroke">Stroke</option>
                    <option value="Seizure">Seizure</option>
                    <option value="Allergic Reaction">Allergic Reaction</option>
                    <option value="Overdose">Overdose</option>
                    <option value="Burns">Burns</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="critical">Critical (Life threatening)</option>
                    <option value="high">High (Urgent care needed)</option>
                    <option value="medium">Medium (Stable but needs attention)</option>
                    <option value="low">Low (Non-urgent)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="Room number, department, or specific location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  placeholder="Detailed description of the emergency situation"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="form-input"
                  rows="3"
                  required
                />
              </div>
              
              {editingEmergency && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="active">Active</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingEmergency ? 'Update' : 'Report'} Emergency
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEmergency(null);
                    setFormData({ 
                      patientId: '', 
                      doctorId: '', 
                      type: '', 
                      priority: 'medium', 
                      description: '', 
                      location: '', 
                      status: 'active' 
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergencies Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {emergencies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Emergency Details</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Priority</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emergencies.map((emergency) => (
                  <tr key={emergency.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          {emergency.type}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {emergency.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">
                          {emergency.patientName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {emergency.doctorName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(emergency.priority)}`}>
                        {emergency.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {emergency.location}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(emergency.status)}`}>
                        {emergency.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <div>
                          <div>{formatDateTime(emergency.createdAt)}</div>
                          {emergency.updatedAt && emergency.updatedAt !== emergency.createdAt && (
                            <div className="text-xs text-gray-500">
                              Updated: {formatDateTime(emergency.updatedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(emergency)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit Emergency"
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
            <AlertTriangle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No emergencies reported</h3>
            <p className="text-gray-500 mb-6">All systems normal. Emergency reports will appear here.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Report Emergency
            </button>
          </div>
        )}
      </div>
    </div>
  );
};