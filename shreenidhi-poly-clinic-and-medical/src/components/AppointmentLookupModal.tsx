import React, { useState } from 'react';
import { Search, X, Calendar, Clock, AlertCircle, RefreshCw, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AppointmentRecord, ClinicSettings } from '../types';

interface AppointmentLookupModalProps {
  settings: ClinicSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentLookupModal: React.FC<AppointmentLookupModalProps> = ({
  settings,
  isOpen,
  onClose,
}) => {
  const [bookingId, setBookingId] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [appointment, setAppointment] = useState<AppointmentRecord | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [rescheduleMsg, setRescheduleMsg] = useState('');

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setAppointment(null);
    setIsRescheduling(false);

    if (!bookingId.trim() || !mobile.trim()) {
      setErrorMsg('Please enter both Booking ID and Mobile Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/lookup?id=${encodeURIComponent(bookingId.trim())}&mobile=${encodeURIComponent(mobile.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Appointment not found.');
      }
      setAppointment(data.appointment);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error looking up appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointment) return;
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/appointments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointment.id, mobile: appointment.mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel appointment.');
      setAppointment(data.appointment);
      setRescheduleMsg('Appointment has been successfully cancelled.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error cancelling appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment || !newDate || !newTimeSlot) return;

    setLoading(true);
    try {
      const res = await fetch('/api/appointments/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: appointment.id,
          mobile: appointment.mobile,
          newDate,
          newTimeSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reschedule.');
      setAppointment(data.appointment);
      setIsRescheduling(false);
      setRescheduleMsg('Appointment successfully rescheduled!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error rescheduling.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-200" />
            <h3 className="font-bold text-base">Find / Manage Booking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-teal-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-teal-100" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Form */}
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Booking Reference ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. SPC-8102"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search Appointment Record
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Reschedule / Cancellation Success Message */}
          {rescheduleMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{rescheduleMsg}</span>
            </div>
          )}

          {/* Appointment Result Card */}
          {appointment && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Reference ID</span>
                  <strong className="text-slate-900 text-sm font-mono">{appointment.id}</strong>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  appointment.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : appointment.status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {appointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient</span>
                  <strong>{appointment.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Service</span>
                  <strong>{appointment.serviceName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date</span>
                  <strong>{appointment.date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Time Slot</span>
                  <strong>{appointment.timeSlot}</strong>
                </div>
              </div>

              {/* Actions if active */}
              {appointment.status !== 'Cancelled' && (
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setIsRescheduling(!isRescheduling)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={handleCancelAppointment}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-semibold"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}

              {/* Reschedule Form inline */}
              {isRescheduling && (
                <form onSubmit={handleConfirmReschedule} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 mt-3">
                  <h4 className="font-bold text-slate-900 text-xs">Reschedule Appointment</h4>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Time Slot</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 11:20 AM"
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs"
                  >
                    Confirm Reschedule
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
