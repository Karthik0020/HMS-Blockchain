import { api } from "../libs/api";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';

import { 
  Plus, 
  Edit, 
  Save,
  X,
  Clock,
  Search,
  Settings,
  Phone,
  Mail,
  Stethoscope
} from 'lucide-react';
export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', specialization: '', email: '', phone: '', experience: '', qualification: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await api.get('/doctors');
      setDoctors(data);
      setError(null);
    } catch (error) {
      setError('Failed to load doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, formData);
      } else {
        await api.post('/doctors', formData);
      }
      setFormData({ name: '', specialization: '', email: '', phone: '', experience: '', qualification: '' });
      setShowForm(false);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (error) {
      setError('Failed to save doctor');
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      experience: doctor.experience || '',
      qualification: doctor.qualification || ''
    });
    setShowForm(true);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading doctors..." />;

  return (
    <div className="p-6 fade-in">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <p className="text-gray-600">Manage medical staff and specialists</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="       Search doctors by name, specialization, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Doctor Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingDoctor(null);
                  setFormData({ name: '', specialization: '', email: '', phone: '', experience: '', qualification: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter doctor's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cardiology, Neurology, Orthopedics"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    placeholder="Years of experience"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., MBBS, MD, MS"
                    value={formData.qualification}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingDoctor ? 'Update' : 'Add'} Doctor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoctor(null);
                    setFormData({ name: '', specialization: '', email: '', phone: '', experience: '', qualification: '' });
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

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">ID: {doctor.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(doctor)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Edit Doctor"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Settings className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium text-blue-600">{doctor.specialization}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{doctor.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{doctor.phone}</span>
                </div>
                
                {doctor.experience && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                )}
                
                {doctor.qualification && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Qualification:</span> {doctor.qualification}
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Registered: {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Stethoscope className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'No doctors match your search criteria.' : 'Get started by adding your first doctor.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add First Doctor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};