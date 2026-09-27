import React, { useState } from 'react';
import { Cross, MapPin, Phone, Mail, Calendar, ExternalLink, ShieldAlert, X } from 'lucide-react';
import { ClinicSettings } from '../types';

interface FooterProps {
  settings: ClinicSettings;
  onBookClick: () => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onBookClick, onAdminClick }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Clinic Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Cross className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base leading-tight">
                Shreenidhi Poly Clinic <br />
                <span className="text-teal-400 font-normal text-xs">&amp; Medical · Bedarahalli</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Providing accessible outpatient medical consultation and healthcare services to the Bedarahalli and Magadi Main Road community in Bengaluru.
            </p>

            <button
              onClick={onBookClick}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-teal-400">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Clinic</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Medical Services</a></li>
              <li><a href="#doctors" className="hover:text-white transition-colors">Medical Team</a></li>
              <li><a href="#appointments" className="hover:text-white transition-colors">Appointment Booking</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact &amp; Location</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Clinic Gallery</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Address & Location */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-teal-400">
              Address &amp; Directions
            </h4>
            <p className="text-slate-400 leading-relaxed">
              {settings.address}
            </p>
            <p className="text-teal-400 text-[11px]">
              Landmark: {settings.landmark}
            </p>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline flex items-center gap-1 font-semibold pt-1"
            >
              Open Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-teal-400">
              Clinic Contact
            </h4>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{settings.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{settings.email}</span>
            </p>
            <div className="pt-2 border-t border-slate-800 text-slate-400">
              <strong className="text-white block mb-0.5">Clinic Hours:</strong>
              {settings.hoursText}
            </div>

            <button
              onClick={onAdminClick}
              className="text-[11px] text-slate-500 hover:text-slate-300 underline pt-2 block"
            >
              Admin Portal Access
            </button>
          </div>

        </div>

        {/* Medical Disclaimer Box */}
        <div className="p-4 bg-slate-850 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-teal-400 uppercase text-[10px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Medical Disclaimer
          </div>
          <p>
            Information on this website is for general informational purposes and does not replace professional medical advice, diagnosis, or treatment.
          </p>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Shreenidhi Poly Clinic and Medical. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => setTermsOpen(true)} className="hover:text-slate-300">
              Terms of Service
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base">Privacy Policy</h3>
              <button onClick={() => setPrivacyOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2 max-h-96 overflow-y-auto">
              <p>
                At Shreenidhi Poly Clinic and Medical, we respect your privacy. Personal contact details collected during online appointment scheduling (such as full name, mobile number, age, and preferred time) are exclusively used for verifying and coordinating your visit.
              </p>
              <p>
                We do not sell, rent, or distribute personal information to third parties. We do not store sensitive electronic health records on public servers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base">Terms of Service</h3>
              <button onClick={() => setTermsOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2 max-h-96 overflow-y-auto">
              <p>
                Online appointment requests are subject to confirmation by clinic staff based on doctor availability. For acute emergencies, please visit an emergency medical center immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
