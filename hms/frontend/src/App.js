import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Appointments } from './components/Appointments';
import { Blockchain } from './components/Blockchain';
import { Doctors } from './components/Doctors';
import { MedicalRecords } from './components/MedicalRecords';
import { Patients } from './components/Patients';
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Shield,
  X,
  Stethoscope,
  Scissors,
  Save,
  Receipt,
  Pill,
  Wrench,
  AlertTriangle,
  Boxes, // Corrected from Edit for Inventory
  BedDouble,
  Menu,
  UserCircle
} from 'lucide-react';
import { Technicians } from './components/Technicians';
import { LabTests } from './components/LabTests';
import { Surgeries } from './components/Surgeries';
import { Admissions } from './components/Admissions';
import { Bills } from './components/Bills';
import { Medicines } from './components/Medicines';
import { Equipment } from './components/Equipment';
import { Emergencies } from './components/Emergencies';
import { Inventory } from './components/Inventory';
import { Rooms } from './components/Rooms';

const HMSApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'technicians', label: 'Technicians', icon: Wrench },
    { id: 'admission', label: 'Admissions', icon: Save },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'emergencies', label: 'Emergencies', icon: AlertTriangle },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'labtest', label: 'Lab Test', icon: Pill },
    { id: 'surgery', label: 'Surgeries', icon: Scissors },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'equipment', label: 'Equipment', icon: Wrench },
    { id: 'Inventory', label: 'Inventory', icon: Boxes },
    { id: 'bill', label: 'Bills', icon: Receipt },
    { id: 'blockchain', label: 'Blockchain', icon: Shield },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'patients':
        return <Patients />;
      case 'doctors':
        return <Doctors />;
      case 'technicians':
        return <Technicians />;
      case 'appointments':
        return <Appointments />;
      case 'records':
        return <MedicalRecords />;
      case 'rooms':
        return <Rooms />;
      case 'labtest':
        return <LabTests />;
      case 'surgery':
        return <Surgeries />;
      case 'admission':
        return <Admissions />;
      case 'emergencies':
        return <Emergencies />;
      case 'medicines':
        return <Medicines />;
      case 'blockchain':
        return <Blockchain />;
      case 'bill':
        return <Bills />;
      case 'equipment':
        return <Equipment />;
      case 'Inventory':
        return <Inventory />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100 font-sans"> {/* Apply font-sans here */}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-xl
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">Hospital System</h1>
          <button className="lg:hidden text-gray-400 hover:text-white transition-colors focus:outline-none" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-all duration-200
                  ${currentView === item.id
                    ? 'bg-blue-600 text-white rounded-r-full shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-r-full'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}> {/* Added focus styles */}
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top nav */}
        <header className="bg-gray-800 shadow-md border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button className="lg:hidden text-gray-400 hover:text-white transition-colors focus:outline-none" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-semibold text-white hidden sm:block">
              {navigation.find(item => item.id === currentView)?.label || 'Dashboard'}
            </h2>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="relative group cursor-pointer">
                 <UserCircle className="h-8 w-8 text-blue-400 hover:text-blue-300 transition-colors" />
                 {/* Optional: Dropdown for user actions */}
                 {/* <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10 hidden group-hover:block transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Logout</a>
                 </div> */}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-900">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default HMSApp;