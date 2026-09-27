import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Compass, ExternalLink } from 'lucide-react';
import { ClinicSettings } from '../types';

interface ContactAndDirectionsProps {
  settings: ClinicSettings;
}

export const ContactAndDirections: React.FC<ContactAndDirectionsProps> = ({ settings }) => {
  // Reliable search query embed for exact clinic location in Bedarahalli
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    'Shreenidhi Poly Clinic and Medical, Srinidhi Arcade, Magadi Main Road, Bedarahalli, Bengaluru, 560091'
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Contact &amp; Location
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find Us in Bedarahalli
          </h2>
          <p className="text-sm text-slate-600">
            Shreenidhi Poly Clinic and Medical is located on Magadi Main Road at Srinidhi Arcade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Clinic Information
              </h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold text-sm">Address</strong>
                    <p className="mt-0.5 leading-relaxed text-slate-600">{settings.address}</p>
                    <p className="text-teal-700 font-medium mt-1">Landmark: {settings.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold text-sm">Phone Number</strong>
                    <p className="mt-0.5 text-slate-600">{settings.phone}</p>
                    {settings.isPhonePlaceholder && (
                      <span className="text-[10px] text-amber-600 font-medium">Editable placeholder</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold text-sm">Email Address</strong>
                    <p className="mt-0.5 text-slate-600">{settings.email}</p>
                    {settings.isEmailPlaceholder && (
                      <span className="text-[10px] text-amber-600 font-medium">Editable placeholder</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold text-sm">Clinic Timings</strong>
                    <p className="mt-0.5 text-slate-600">{settings.hoursText}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Navigation className="w-4 h-4" />
                  Open Direct Google Maps Link
                </a>
              </div>
            </div>

            {/* Travel / Landmark Advice Card */}
            <div className="p-5 bg-teal-800 text-white rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-200 uppercase">
                <Compass className="w-4 h-4" />
                How to Find Us
              </div>
              <p className="text-xs text-teal-100 leading-relaxed">
                Located right on Magadi Main Road in Srinidhi Arcade (BEL Layout 1st Stage, Bedarahalli). Accessible via local bus routes and autorickshaws from Sumanahalli and Kamakshipalya.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Google Map */}
          <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="rounded-xl overflow-hidden border border-slate-200 h-96 lg:h-[460px] relative">
              <iframe
                title="Shreenidhi Poly Clinic Location Map"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Srinidhi Arcade, Magadi Main Road, Bedarahalli</span>
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                View Larger Map <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
