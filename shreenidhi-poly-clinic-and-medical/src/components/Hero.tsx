import React from 'react';
import { Calendar, MapPin, Navigation, Clock, ShieldCheck, PhoneCall } from 'lucide-react';
import { ClinicSettings } from '../types';

interface HeroProps {
  settings: ClinicSettings;
  heroImage: string;
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, heroImage, onBookClick }) => {
  return (
    <section id="home" className="relative bg-gradient-to-b from-teal-50/60 via-slate-50 to-white pt-8 pb-16 md:pt-16 md:pb-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Metadata / Location Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>Bedarahalli, Bengaluru</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-normal capitalize">Srinidhi Arcade, Magadi Main Road</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Quality Healthcare, <br className="hidden sm:inline" />
              <span className="text-teal-700">Closer to You</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Shreenidhi Poly Clinic and Medical provides accessible healthcare services in Bedarahalli, Bengaluru.
            </p>

            {/* Location & Quick Info Snippets */}
            <div className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs space-y-2 max-w-xl">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Address:</strong> Srinidhi Arcade, Magadi Main Road, Bharath Nagar, BEL Layout 1st Stage, Bedarahalli, Bengaluru, Karnataka 560091
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{settings.hoursText}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onBookClick}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book an Appointment
              </button>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-teal-600" />
                Get Directions
              </a>

              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                  className="px-4 py-3.5 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4 text-teal-600" />
                  Call Clinic
                </a>
              )}
            </div>

            {/* Trust points without unsupported claims */}
            <div className="flex items-center gap-6 text-xs text-slate-500 pt-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Verified Local Clinic</span>
              </div>
              <span className="text-slate-300">·</span>
              <div>
                <span>Community Outpatient Services</span>
              </div>
            </div>

          </div>

          {/* Right Column: Imagery Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 group">
              <img
                src={heroImage}
                alt="Shreenidhi Poly Clinic and Medical Building"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold tracking-wider uppercase text-teal-300">
                  Srinidhi Arcade
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Shreenidhi Poly Clinic and Medical
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  Magadi Main Road, Bedarahalli, Bengaluru
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
