import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Calendar,
  Settings,
  UserCheck,
  Stethoscope,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';
import { AppointmentRecord, ClinicSettings, ServiceItem, DoctorItem, FAQItem } from '../types';

interface AdminDashboardModalProps {
  settings: ClinicSettings;
  services: ServiceItem[];
  doctors: DoctorItem[];
  faqs: FAQItem[];
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  settings,
  services,
  doctors,
  faqs,
  isOpen,
  onClose,
  onRefreshData,
}) => {
  // Auth state
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'appointments' | 'settings' | 'services' | 'doctors' | 'faqs'
  const [activeTab, setActiveTab] = useState<string>('appointments');

  // Appointments data state
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApptDetail, setSelectedApptDetail] = useState<AppointmentRecord | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ClinicSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');

  // Services form state
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Doctors form state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorItem | null>(null);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  if (!isOpen) return null;

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      setIsAuthenticated(true);
      setAuthToken(data.token);
      fetchAppointments(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid PIN code.');
    }
  };

  const fetchAppointments = async (token: string) => {
    setLoadingAppts(true);
    try {
      const res = await fetch('/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoadingAppts(false);
    }
  };

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAppointments(authToken);
        if (selectedApptDetail && selectedApptDetail.id === id) {
          setSelectedApptDetail({ ...selectedApptDetail, status: newStatus as any });
        }
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(settingsForm),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      setSettingsMsg('Clinic settings successfully updated!');
      onRefreshData();
    } catch (err: any) {
      setSettingsMsg(err.message || 'Error updating settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered appointments
  const filteredAppts = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto min-h-[500px] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-500 text-slate-950 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Shreenidhi Poly Clinic — Admin Portal</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Supabase Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Manage Appointments &amp; Clinic Settings · Project: ysluyenedticjkmhiace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6 my-auto">
            <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto border border-teal-100">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Admin Authentication</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your Admin PIN to access the clinic dashboard. (Default PIN: <strong className="font-mono text-teal-700">1234</strong>)
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                maxLength={10}
                placeholder="Enter Admin PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono border border-slate-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />

              {loginError && (
                <p className="text-xs text-rose-600 font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl transition-colors shadow-xs"
              >
                Access Admin Portal
              </button>
            </form>

            <p className="text-[11px] text-slate-400">
              Clinic owner PIN can be customized inside settings after login.
            </p>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN INTERFACE */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Admin Navigation Sidebar */}
            <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2 shrink-0">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === 'appointments'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Calendar className="w-4 h-4" /> Appointments Dashboard
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === 'settings'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Settings className="w-4 h-4" /> Clinic Settings &amp; Info
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === 'services'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Stethoscope className="w-4 h-4" /> Manage Services
              </button>

              <button
                onClick={() => setActiveTab('doctors')}
                className={`w-full p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === 'doctors'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Manage Medical Team
              </button>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full p-2.5 text-xs text-rose-700 hover:bg-rose-50 rounded-xl font-medium transition-colors text-left"
                >
                  Sign Out of Admin
                </button>
              </div>
            </div>

            {/* Right Tab Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: APPOINTMENTS DASHBOARD */}
              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  
                  {/* Stats Counter Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Today</span>
                      <span className="text-xl font-extrabold text-slate-900 font-mono">{todayCount}</span>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <span className="text-[10px] font-semibold text-amber-700 uppercase block">Pending</span>
                      <span className="text-xl font-extrabold text-amber-900 font-mono">{pendingCount}</span>
                    </div>

                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
                      <span className="text-[10px] font-semibold text-teal-700 uppercase block">Confirmed</span>
                      <span className="text-xl font-extrabold text-teal-900 font-mono">{confirmedCount}</span>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase block">Completed</span>
                      <span className="text-xl font-extrabold text-emerald-900 font-mono">{completedCount}</span>
                    </div>

                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                      <span className="text-[10px] font-semibold text-rose-700 uppercase block">Cancelled</span>
                      <span className="text-xl font-extrabold text-rose-900 font-mono">{cancelledCount}</span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search name, mobile or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-slate-500 font-medium">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => fetchAppointments(authToken)}
                        className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-600"
                        title="Refresh list"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Appointments Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white">
                    <table className="w-full text-left text-xs text-slate-700 border-collapse">
                      <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Patient</th>
                          <th className="p-3">Service &amp; Doctor</th>
                          <th className="p-3">Date &amp; Slot</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loadingAppts ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                              Loading appointment records...
                            </td>
                          </tr>
                        ) : filteredAppts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                              No appointment records match current filter.
                            </td>
                          </tr>
                        ) : (
                          filteredAppts.map((appt) => (
                            <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 font-mono font-bold text-teal-700">{appt.id}</td>
                              <td className="p-3">
                                <strong className="text-slate-900 block">{appt.patientName}</strong>
                                <span className="text-[11px] text-slate-500">{appt.mobile}</span>
                              </td>
                              <td className="p-3">
                                <span>{appt.serviceName}</span>
                                <span className="text-[11px] text-slate-400 block">{appt.doctorName || 'Duty Doctor'}</span>
                              </td>
                              <td className="p-3 font-medium">
                                <div>{appt.date}</div>
                                <div className="text-[11px] text-teal-700 font-bold">{appt.timeSlot}</div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  appt.status === 'Confirmed'
                                    ? 'bg-teal-100 text-teal-800'
                                    : appt.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : appt.status === 'Cancelled'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-1">
                                {appt.status === 'Pending' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'Confirmed')}
                                    className="px-2 py-1 bg-teal-600 text-white rounded-lg text-[10px] font-semibold hover:bg-teal-700"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {appt.status === 'Confirmed' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'Completed')}
                                    className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-semibold hover:bg-emerald-700"
                                  >
                                    Complete
                                  </button>
                                )}
                                {appt.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'Cancelled')}
                                    className="px-2 py-1 bg-rose-100 text-rose-800 rounded-lg text-[10px] font-semibold hover:bg-rose-200"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedApptDetail(appt)}
                                  className="p-1 text-slate-500 hover:text-slate-800"
                                  title="View details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: CLINIC SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Clinic Information Settings</h3>
                    <p className="text-xs text-slate-500">Update verified clinic address, contact info, and operational hours.</p>
                  </div>

                  {settingsMsg && (
                    <div className="p-3 bg-teal-50 text-teal-800 rounded-xl text-xs font-semibold border border-teal-200">
                      {settingsMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Clinic Phone</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value, isPhonePlaceholder: false })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Clinic Email</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value, isEmailPlaceholder: false })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Opening Hours Display Text</label>
                      <input
                        type="text"
                        value={settingsForm.hoursText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hoursText: e.target.value, isHoursPlaceholder: false })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Full Clinic Address</label>
                      <textarea
                        rows={2}
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Landmark</label>
                      <input
                        type="text"
                        value={settingsForm.landmark}
                        onChange={(e) => setSettingsForm({ ...settingsForm, landmark: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Google Maps Link</label>
                      <input
                        type="url"
                        value={settingsForm.googleMapsUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Daily Opening Time (24h)</label>
                      <input
                        type="time"
                        value={settingsForm.openingTime}
                        onChange={(e) => setSettingsForm({ ...settingsForm, openingTime: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Daily Closing Time (24h)</label>
                      <input
                        type="time"
                        value={settingsForm.closingTime}
                        onChange={(e) => setSettingsForm({ ...settingsForm, closingTime: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Slot Duration (Minutes)</label>
                      <input
                        type="number"
                        min="10"
                        max="60"
                        value={settingsForm.slotDurationMinutes}
                        onChange={(e) => setSettingsForm({ ...settingsForm, slotDurationMinutes: Number(e.target.value) })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Admin Access PIN</label>
                      <input
                        type="text"
                        value={settingsForm.adminPin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Save Settings
                  </button>
                </form>
              )}

              {/* TAB 3: SERVICES MANAGER */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Manage Medical Services</h3>
                      <p className="text-xs text-slate-500">Add, update, or remove clinic outpatient services.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div key={srv.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-slate-900 text-xs">{srv.name}</h4>
                          {srv.isPlaceholder && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-medium">
                              Placeholder
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">{srv.description}</p>
                        <div className="text-[11px] font-bold text-teal-700 pt-1">
                          Fee: {srv.feeText}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DOCTORS MANAGER */}
              {activeTab === 'doctors' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Manage Medical Team</h3>
                    <p className="text-xs text-slate-500">Edit healthcare provider details, qualifications, and consultation schedules.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doc) => (
                      <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                        <img
                          src={doc.profilePhoto}
                          alt={doc.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="space-y-1 text-xs">
                          <h4 className="font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-teal-700 font-medium">{doc.qualification} · {doc.specialty}</p>
                          <p className="text-slate-500 text-[11px]">{doc.availableTimeText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
