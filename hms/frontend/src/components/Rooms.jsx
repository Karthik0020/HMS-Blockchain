import { api } from "../libs/api";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Save, X, BedDouble } from 'lucide-react';

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await api.get('/rooms');
      setRooms(data);
      setError(null);
    } catch (error) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, formData);
      } else {
        await api.post('/rooms', formData);
      }
      setFormData({ name: '', type: '', capacity: '' });
      setShowForm(false);
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      setError('Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      type: room.type || '',
      capacity: room.capacity || ''
    });
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner message="Loading rooms..." />;

  return (
    <div className="p-6 fade-in">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
          <p className="text-gray-600">Manage hospital rooms and capacities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRoom(null);
                  setFormData({ name: '', type: '', capacity: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingRoom ? 'Update' : 'Add'} Room
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRoom(null);
                    setFormData({ name: '', type: '', capacity: '' });
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

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {rooms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>{room.capacity}</td>
                    <td>{room.status}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit Room"
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
            <BedDouble className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms added</h3>
            <p className="text-gray-500 mb-6">Start by adding a new room.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
