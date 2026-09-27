import React from 'react';
import { MapPin, Clock, Stethoscope, CalendarCheck, ChevronRight, Navigation } from 'lucide-react';
import { ClinicSettings } from '../types';

interface QuickInfoCardsProps {
  settings: ClinicSettings;
  onBookClick: () => void;
}

export const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({ settings, onBookClick }) => {
  return (
    <section className="-mt-8 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Location */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-0.5"
            >
              Directions <Navigation className="w-3 h-3" />
            </a>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Clinic Location</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
              {settings.address}
            </p>
          </div>
          <p className="text-[11px] text-teal-800 font-medium">Landmark: {settings.landmark}</p>
        </div>

        {/* Card 2: Clinic Hours */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            {settings.isHoursPlaceholder && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md">
                Unverified
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Clinic Hours</h3>
            <p className="text-xs font-medium text-slate-700 mt-1">
              {settings.hoursText}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Mon – Sat consultation schedules available online.
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Preferred timings selected during booking.
          </div>
        </div>

        {/* Card 3: Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Medical Services</h3>
            <ul className="text-xs text-slate-600 mt-1 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                General Consultation
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                Preventive Health Screenings
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                Routine Health Checkups
              </li>
            </ul>
          </div>
          <a href="#services" className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1">
            View All Services <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 4: Appointment Booking */}
        <div className="bg-gradient-to-br from-teal-700 to-teal-800 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between space-y-3">
          <div className="p-2.5 bg-white/10 rounded-xl w-fit">
            <CalendarCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Appointment Booking</h3>
            <p className="text-xs text-teal-100 mt-1 leading-relaxed">
              Select date, doctor &amp; preferred time slot online. Instant reference code issued.
            </p>
          </div>
          <button
            onClick={onBookClick}
            className="w-full py-2.5 px-3 bg-white hover:bg-teal-50 text-teal-800 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            Book Appointment Now
          </button>
        </div>

      </div>
    </section>
  );
};
