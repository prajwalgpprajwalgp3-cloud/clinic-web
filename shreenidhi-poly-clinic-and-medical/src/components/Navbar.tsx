import React, { useState } from 'react';
import { Cross, Menu, X, Calendar, Search, ShieldAlert, Phone, MapPin } from 'lucide-react';
import { ClinicSettings } from '../types';

interface NavbarProps {
  settings: ClinicSettings;
  onBookClick: () => void;
  onLookupClick: () => void;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onBookClick,
  onLookupClick,
  onAdminClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Appointments', href: '#appointments' },
    { name: 'Contact', href: '#contact' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Banner Notice for Unverified Info if applicable */}
      {(settings.isPhonePlaceholder || settings.isHoursPlaceholder) && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-800 text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            Clinic Owner Notice: Some clinic details are placeholders. You can update phone numbers, timings, and services in the{' '}
            <button
              onClick={onAdminClick}
              className="font-semibold underline hover:text-amber-900 transition-colors"
            >
              Admin Settings Panel
            </button>
            .
          </span>
        </div>
      )}

      {/* Sticky Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Zone 1: Brand Title */}
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-700 transition-colors shrink-0">
                <Cross className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                  Shreenidhi Poly Clinic
                </span>
                <span className="text-xs font-medium text-teal-700 leading-none">
                  &amp; Medical · Bedarahalli
                </span>
              </div>
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={onLookupClick}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Check status or manage existing appointment"
              >
                <Search className="w-3.5 h-3.5" />
                Find Appointment
              </button>

              <button
                onClick={onAdminClick}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Admin Login
              </button>

              <button
                onClick={onBookClick}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onBookClick}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLookupClick();
                }}
                className="w-full py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Find / Reschedule My Booking
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="w-full py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Admin Panel Login
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
