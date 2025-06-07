import { api } from "../libs/api";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import { 
  Users, 
  Plus, 
  Edit, 
  Save,
  X,
  Search,
  Phone,
  Mail,
  MapPin,
  User,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', email: '', phone: '', address: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await api.get('/patients');
      setPatients(data);
      setError(null);
    } catch (error) {
      setError('Failed to load patients');
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient.id}`, formData);
      } else {
        await api.post('/patients', formData);
      }
      setFormData({ name: '', age: '', gender: '', email: '', phone: '', address: '' });
      setShowForm(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      setError('Failed to save patient');
      console.error('Error saving patient:', error);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      address: patient.address
    });
    setShowForm(true);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  if (loading) return <LoadingSpinner message="Loading patients..." />;

  return (
    <div className="p-6 fade-in">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="     Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 mr-4"
            />
          </div>
        </div>
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPatient(null);
                  setFormData({ name: '', age: '', gender: '', email: '', phone: '', address: '' });
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
                  placeholder="Enter patient's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    placeholder="Age"
                    min="0"
                    max="150"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingPatient ? 'Update' : 'Add'} Patient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPatient(null);
                    setFormData({ name: '', age: '', gender: '', email: '', phone: '', address: '' });
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

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">ID: {patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{patient.age} years</td>
                    <td>{patient.gender}</td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {patient.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate max-w-32">{patient.address}</span>
                      </div>
                    </td>
                    <td className="text-sm text-gray-500">
                      {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(patient)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Edit Patient"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'No patients match your search criteria.' : 'Get started by adding your first patient.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add First Patient
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
