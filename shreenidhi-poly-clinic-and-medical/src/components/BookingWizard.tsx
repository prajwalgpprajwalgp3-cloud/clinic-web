import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  ShieldCheck,
  Stethoscope,
  RefreshCw,
  XCircle,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ServiceItem, DoctorItem, AppointmentRecord, ClinicSettings } from '../types';

interface BookingWizardProps {
  settings: ClinicSettings;
  services: ServiceItem[];
  doctors: DoctorItem[];
  preselectedServiceId?: string;
  preselectedDoctorId?: string;
  onBookingSuccess?: (appointment: AppointmentRecord) => void;
  onCancelBooking?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  settings,
  services,
  doctors,
  preselectedServiceId,
  preselectedDoctorId,
  onBookingSuccess,
  onCancelBooking,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (services[0]?.id || '')
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctorId || (doctors[0]?.id || '')
  );

  // Date defaults to tomorrow YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient Info
  const [patientName, setPatientName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('Male');
  const [reason, setReason] = useState<string>('');

  // Slot Availability state
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<AppointmentRecord | null>(null);

  // Fetch booked slots whenever selectedDate or selectedDoctorId changes
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      fetch(`/api/appointments/slots?date=${selectedDate}&doctorId=${selectedDoctorId}`)
        .then((res) => res.json())
        .then((data) => {
          setBookedSlots(data.bookedSlots || []);
        })
        .catch((err) => {
          console.error('Failed to load slots', err);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [selectedDate, selectedDoctorId]);

  // Generate standard daily slots between clinic opening and closing times
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const openHour = parseInt(settings.openingTime.split(':')[0], 10) || 9;
    const closeHour = parseInt(settings.closingTime.split(':')[0], 10) || 20;
    const interval = settings.slotDurationMinutes || 20;

    let currentMinutes = openHour * 60;
    const endMinutes = closeHour * 60;

    while (currentMinutes + interval <= endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      const displayMin = m < 10 ? `0${m}` : `${m}`;
      const slotStr = `${displayHour}:${displayMin} ${period}`;
      slots.push(slotStr);
      currentMinutes += interval;
    }

    return slots;
  };

  const availableSlots = generateTimeSlots();

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1 && !selectedServiceId) {
      setErrorMsg('Please select a healthcare service to proceed.');
      return;
    }
    if (step === 3 && !selectedDate) {
      setErrorMsg('Please choose an appointment date.');
      return;
    }
    if (step === 4 && !selectedTimeSlot) {
      setErrorMsg('Please select an available time slot.');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Please enter patient full name.');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          mobile,
          email,
          age: Number(age) || 30,
          gender,
          serviceId: selectedServiceId,
          doctorId: selectedDoctorId,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete appointment booking.');
      }

      setConfirmedAppointment(data.appointment);
      setStep(6); // Move to Step 6: Confirmation
      if (onBookingSuccess) {
        onBookingSuccess(data.appointment);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const selectedServiceObj = services.find((s) => s.id === selectedServiceId);
  const selectedDoctorObj = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <section id="appointments" className="py-12 md:py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                  Easy Online Scheduling
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Book an Appointment
                </h2>
                <p className="text-xs text-teal-100 mt-1">
                  {settings.name} · Bedarahalli, Bengaluru
                </p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Step Progress Indicator (Step 1 to 5) */}
            {step < 6 && (
              <div className="mt-6 pt-4 border-t border-teal-600/60 grid grid-cols-5 gap-2 text-center text-[11px] font-medium text-teal-200">
                <div className={`py-1 rounded-md ${step >= 1 ? 'bg-teal-600 text-white font-bold' : 'opacity-60'}`}>
                  1. Service
                </div>
                <div className={`py-1 rounded-md ${step >= 2 ? 'bg-teal-600 text-white font-bold' : 'opacity-60'}`}>
                  2. Doctor
                </div>
                <div className={`py-1 rounded-md ${step >= 3 ? 'bg-teal-600 text-white font-bold' : 'opacity-60'}`}>
                  3. Date
                </div>
                <div className={`py-1 rounded-md ${step >= 4 ? 'bg-teal-600 text-white font-bold' : 'opacity-60'}`}>
                  4. Time
                </div>
                <div className={`py-1 rounded-md ${step >= 5 ? 'bg-teal-600 text-white font-bold' : 'opacity-60'}`}>
                  5. Details
                </div>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Error Message banner */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Booking Notice:</strong> {errorMsg}
                </div>
              </div>
            )}

            {/* STEP 1: SELECT SERVICE */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 1: Select Healthcare Service</h3>
                  <p className="text-xs text-slate-500 mt-1">Choose the consultation type or health service you require.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((srv) => {
                    const isSelected = selectedServiceId === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                          isSelected
                            ? 'bg-teal-50/80 border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900">{srv.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                          <span className="text-[11px] font-semibold text-teal-700 block pt-1">
                            {srv.feeText}
                          </span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    Continue to Doctor <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT DOCTOR */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 2: Select Medical Professional</h3>
                  <p className="text-xs text-slate-500 mt-1">Choose a doctor or consult with our duty physician.</p>
                </div>

                <div className="space-y-3">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                          isSelected
                            ? 'bg-teal-50/80 border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={doc.profilePhoto}
                          alt={doc.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-xs text-teal-700 font-medium">
                            {doc.qualification} · {doc.specialty}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Available: {doc.availableTimeText}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    Select Date <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SELECT DATE */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 3: Select Appointment Date</h3>
                  <p className="text-xs text-slate-500 mt-1">Choose an upcoming date for your consultation.</p>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                  />

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      Selected: <strong>{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    View Available Slots <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DISPLAY TIME SLOTS */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 4: Select Available Time Slot</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Slots for {new Date(selectedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {loadingSlots ? (
                  <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                    <span>Checking live clinic schedule availability...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center ${
                            isBooked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-teal-500 hover:text-teal-700'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[10px] opacity-80 font-normal">
                            {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedTimeSlot}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    Enter Patient Info <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PATIENT DETAILS */}
            {step === 5 && (
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 5: Patient Details</h3>
                  <p className="text-xs text-slate-500 mt-1">Please provide accurate contact details for appointment confirmation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anish Kumar"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="e.g. 32"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reason for Visit / Symptoms <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly describe health concern (e.g., routine checkup, fever, prescription renewal)..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    ></textarea>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Notice:</strong> Your information is handled securely and used solely for managing your appointment with Shreenidhi Poly Clinic and Medical. We do not store or request sensitive electronic health records online.
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm &amp; Submit Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 6: CONFIRMATION SCREEN */}
            {step === 6 && confirmedAppointment && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Appointment Request Received
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your request has been submitted to <strong>{settings.name}</strong>.
                  </p>
                </div>

                {/* Reference Card */}
                <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-medium text-slate-500">Booking Reference ID</span>
                    <span className="text-lg font-mono font-bold text-teal-700 bg-teal-100/70 px-3 py-1 rounded-lg">
                      {confirmedAppointment.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Patient Name</span>
                      <strong className="text-slate-900">{confirmedAppointment.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Mobile Number</span>
                      <strong className="text-slate-900">{confirmedAppointment.mobile}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Service</span>
                      <strong className="text-slate-900">{confirmedAppointment.serviceName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Doctor</span>
                      <strong className="text-slate-900">{confirmedAppointment.doctorName || 'Duty Doctor'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Date</span>
                      <strong className="text-slate-900">{confirmedAppointment.date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Time Slot</span>
                      <strong className="text-slate-900">{confirmedAppointment.timeSlot}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    Clinic Address: {settings.address}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handlePrintReceipt}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print / Save Confirmation
                  </button>

                  <button
                    onClick={() => {
                      setStep(1);
                      setConfirmedAppointment(null);
                    }}
                    className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Book Another Appointment
                  </button>

                  <a
                    href="#home"
                    className="px-4 py-2.5 text-teal-700 hover:underline text-xs font-semibold"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
