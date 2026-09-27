import React from 'react';
import { User, Calendar, Clock, Award, ShieldAlert } from 'lucide-react';
import { DoctorItem } from '../types';

interface DoctorsSectionProps {
  doctors: DoctorItem[];
  onBookWithDoctor: (doctorId: string) => void;
  onAdminClick: () => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  doctors,
  onBookWithDoctor,
  onAdminClick,
}) => {
  const hasPlaceholders = doctors.some((d) => d.isPlaceholder);

  return (
    <section id="doctors" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Medical Team
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Our Medical Team
          </h2>
          <p className="text-sm text-slate-600">
            Meet our qualified healthcare professionals dedicated to patient wellbeing.
          </p>

          {hasPlaceholders && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] text-amber-800 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                Doctor profile placeholder. Clinic owner can enter actual doctor details in{' '}
                <button onClick={onAdminClick} className="underline font-bold hover:text-amber-900">
                  Admin Panel
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-slate-50/80 rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Profile Photo */}
              <div className="relative h-56 bg-slate-200">
                <img
                  src={doctor.profilePhoto}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                {doctor.isPlaceholder && (
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-md">
                    Editable Placeholder
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-4 text-white">
                  <h3 className="text-base font-bold leading-tight">{doctor.name}</h3>
                  <p className="text-xs text-teal-300 font-medium mt-0.5">
                    {doctor.qualification} · {doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4 text-xs text-slate-600">
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px]">Specialty</span>
                    <span className="font-semibold text-slate-800">{doctor.specialty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px]">Experience</span>
                    <span className="font-semibold text-slate-800">{doctor.experience}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      <strong>Days:</strong> {doctor.availableDays.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Hours:</strong> {doctor.availableTimeText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      <strong>Consultation Fee:</strong> {doctor.feeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onBookWithDoctor(doctor.id)}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Book Consultation with Doctor
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
