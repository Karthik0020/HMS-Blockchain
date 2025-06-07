import { api } from "../libs/api";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';

import { 
  Plus, 
  Edit, 
  Save,
  X,
  UserCheck,
  Phone,
  Mail
} from 'lucide-react';

export const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', specialization: '', department: '', shift: '', status: 'active'
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      console.log('Fetching technicians...');
      setLoading(true);
      const data = await api.get('/technicians');
      console.log('Technicians data:', data);
      setTechnicians(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setError('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTechnician) {
        await api.put(`/technicians/${editingTechnician.id}`, formData);
      } else {
        await api.post('/technicians', formData);
      }
      setFormData({ name: '', email: '', phone: '', specialization: '', department: '', shift: '', status: 'active' });
      setShowForm(false);
      setEditingTechnician(null);
      fetchTechnicians();
    } catch (error) {
      setError('Failed to save technician');
      console.error('Error saving technician:', error);
    }
  };

  const handleEdit = (technician) => {
    setEditingTechnician(technician);
    setFormData({
      name: technician.name || '',
      email: technician.email || '',
      phone: technician.phone || '',
      specialization: technician.specialization || '',
      department: technician.department || '',
      shift: technician.shift || '',
      status: technician.status || 'active'
    });
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner message="Loading technicians..." />;

  return (
    <div className="p-6 fade-in">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Technicians</h1>
          <p className="text-gray-600">Manage medical technicians and support staff</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Technician
        </button>
      </div>

      {/* Technician Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingTechnician ? 'Edit Technician' : 'Add New Technician'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTechnician(null);
                  setFormData({ name: '', email: '', phone: '', specialization: '', department: '', shift: '', status: 'active' });
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
                  placeholder="Enter technician's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="technician@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Specialization</option>
                    <option value="Lab Technician">Lab Technician</option>
                    <option value="Radiology Technician">Radiology Technician</option>
                    <option value="Pharmacy Technician">Pharmacy Technician</option>
                    <option value="Medical Equipment Technician">Medical Equipment Technician</option>
                    <option value="Operating Room Technician">Operating Room Technician</option>
                    <option value="Emergency Medical Technician">Emergency Medical Technician</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Department</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency">Emergency</option>
                    <option value="ICU">ICU</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({...formData, shift: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select Shift</option>
                    <option value="Morning">Morning (6 AM - 2 PM)</option>
                    <option value="Evening">Evening (2 PM - 10 PM)</option>
                    <option value="Night">Night (10 PM - 6 AM)</option>
                    <option value="Rotating">Rotating</option>
                  </select>
                </div>
                
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
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingTechnician ? 'Update' : 'Add'} Technician
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTechnician(null);
                    setFormData({ name: '', email: '', phone: '', specialization: '', department: '', shift: '', status: 'active' });
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

      {/* Technicians Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {technicians.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {technicians.map((technician) => (
                  <tr key={technician.id}>
                    <td>
                      <div className="font-medium text-gray-900">
                        {technician.name}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{technician.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{technician.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {technician.specialization || 'Not specified'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {technician.department || 'Not assigned'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {technician.shift || 'Not assigned'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        technician.status === 'active' ? 'badge-success' :
                        technician.status === 'inactive' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {technician.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(technician)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit Technician"
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
            <UserCheck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians registered</h3>
            <p className="text-gray-500 mb-6">Add your first technician to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add First Technician
            </button>
          </div>
        )}
      </div>
    </div>
  );
};