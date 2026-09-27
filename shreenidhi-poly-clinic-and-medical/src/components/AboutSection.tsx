import React from 'react';
import { HeartHandshake, ShieldCheck, UserCheck, Building } from 'lucide-react';
import { ClinicSettings } from '../types';

interface AboutSectionProps {
  settings: ClinicSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image with Subtle Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
              <img
                src="/src/assets/images/clinic_reception_area_1790484193312.jpg"
                alt="Shreenidhi Poly Clinic Reception Area"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-slate-900/80 backdrop-blur-xs text-white absolute bottom-0 inset-x-0">
                <p className="text-xs font-medium text-slate-200">
                  Located at Srinidhi Arcade, Bedarahalli, Bengaluru
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Factual Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              About The Clinic
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              Serving the Healthcare Needs of Bedarahalli &amp; Magadi Road
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Shreenidhi Poly Clinic and Medical is a medical clinic serving the local community in Bedarahalli, Bengaluru.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Conveniently located at Srinidhi Arcade on Magadi Main Road (BEL Layout 1st Stage), the polyclinic provides essential outpatient consultations, routine medical guidance, and health checkups in a comfortable, clean neighborhood setting.
            </p>

            {/* Factual Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="p-2 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Accessible Location</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Situated on Magadi Main Road for easy access from Bharath Nagar &amp; BEL Layout.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="p-2 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Patient-Centered Care</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attentive consultation and individual healthcare evaluation.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="p-2 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Hygienic Environment</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clean consultation rooms and organized waiting lounge.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="p-2 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Easy Online Booking</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Streamlined appointment request and rescheduling system.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
