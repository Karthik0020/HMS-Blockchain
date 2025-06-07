import { api } from "../libs/api";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';
import {
  Users,  
  Calendar, 
  FileText, 
  Shield, 
  Stethoscope,
  BriefcaseMedical,
  Hospital,
  DollarSign,
  FlaskConical,
  Boxes,
  Bed,
  AlarmClock,
  Scissors,
  Plus
} from 'lucide-react';

export const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.get('/stats');
        setStats(data);
        setError(null);
      } catch (error) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const statCards = [
    { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "blue" },
    { label: "Total Doctors", value: stats.totalDoctors, icon: Stethoscope, color: "green" },
    { label: "Appointments", value: stats.totalAppointments, icon: Calendar, color: "yellow" },
    { label: "Medical Records", value: stats.totalMedicalRecords, icon: FileText, color: "purple" },
    { label: "Blockchain Blocks", value: stats.blockchainBlocks, icon: Shield, color: "red" },
    { label: "Lab Tests", value: stats.totalLabTests, icon: FlaskConical, color: "indigo" },
    { label: "Surgeries", value: stats.totalSurgeries, icon: Scissors, color: "pink" },
    { label: "Admissions", value: stats.totalAdmissions, icon: Plus, color: "cyan" },
    { label: "Pending Bills", value: stats.pendingBills, icon: DollarSign, color: "rose" },
    { label: "Inventory Items", value: stats.totalInventoryItems, icon: Boxes, color: "amber" },
    { label: "Active Emergencies", value: stats.activeEmergencies, icon: AlarmClock, color: "fuchsia" },
    { label: "Available Rooms", value: stats.availableRooms, icon: Bed, color: "lime" },
    { label: "Occupied Rooms", value: stats.occupiedRooms, icon: Bed, color: "orange" }
  ];

  return (
    <div className="p-6 fade-in">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Management System</h1>
        <p className="text-gray-600">Blockchain-powered healthcare management platform</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }, idx) => (
          <div key={idx} className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white p-5 rounded-xl shadow-md`}>
            <div className="flex items-center">
              <Icon className="h-7 w-7 mr-3 opacity-80" />
              <div>
                <p className="text-sm opacity-80">{label}</p>
                <p className="text-xl font-bold">{value || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      
    </div>
  );
};
