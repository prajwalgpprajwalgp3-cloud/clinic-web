import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickInfoCards } from './components/QuickInfoCards';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { DoctorsSection } from './components/DoctorsSection';
import { BookingWizard } from './components/BookingWizard';
import { ContactAndDirections } from './components/ContactAndDirections';
import { PhotoGallery } from './components/PhotoGallery';
import { GoogleReviewsSection } from './components/GoogleReviewsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AppointmentLookupModal } from './components/AppointmentLookupModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AppData, AppointmentRecord } from './types';
import { Calendar, PhoneCall, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Modals state
  const [lookupModalOpen, setLookupModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // Preselected booking choices
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>();
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed to load clinic information');
      const json = await res.json();
      setAppData(json);
    } catch (err: any) {
      setError(err.message || 'Error loading clinic data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById('appointments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceAndBook = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    scrollToBooking();
  };

  const handleSelectDoctorAndBook = (doctorId: string) => {
    setPreselectedDoctorId(doctorId);
    scrollToBooking();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Shreenidhi Poly Clinic and Medical</h2>
          <p className="text-xs text-slate-500 mt-1">Loading clinic information &amp; appointment schedules...</p>
        </div>
      </div>
    );
  }

  if (error || !appData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-rose-100 text-rose-800 rounded-full">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Unable to load clinic details</h2>
        <p className="text-xs text-slate-600 max-w-md">{error || 'Network error encountered.'}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Retry Loading
        </button>
      </div>
    );
  }

  const heroImage =
    appData.photos.find((p) => p.category === 'Exterior')?.url ||
    '/src/assets/images/clinic_hero_building_1790484178521.jpg';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Navbar */}
      <Navbar
        settings={appData.settings}
        onBookClick={scrollToBooking}
        onLookupClick={() => setLookupModalOpen(true)}
        onAdminClick={() => setAdminModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        settings={appData.settings}
        heroImage={heroImage}
        onBookClick={scrollToBooking}
      />

      {/* Quick Info Cards */}
      <QuickInfoCards
        settings={appData.settings}
        onBookClick={scrollToBooking}
      />

      {/* About The Clinic */}
      <AboutSection
        settings={appData.settings}
      />

      {/* Services Section */}
      <ServicesSection
        services={appData.services}
        onSelectService={handleSelectServiceAndBook}
        onAdminClick={() => setAdminModalOpen(true)}
      />

      {/* Medical Team */}
      <DoctorsSection
        doctors={appData.doctors}
        onBookWithDoctor={handleSelectDoctorAndBook}
        onAdminClick={() => setAdminModalOpen(true)}
      />

      {/* Interactive Appointment Booking Wizard */}
      <BookingWizard
        settings={appData.settings}
        services={appData.services}
        doctors={appData.doctors}
        preselectedServiceId={preselectedServiceId}
        preselectedDoctorId={preselectedDoctorId}
      />

      {/* Contact & Directions */}
      <ContactAndDirections
        settings={appData.settings}
      />

      {/* Photo Gallery */}
      <PhotoGallery
        photos={appData.photos}
        onAdminClick={() => setAdminModalOpen(true)}
      />

      {/* Verified Google Reviews */}
      <GoogleReviewsSection
        settings={appData.settings}
      />

      {/* FAQ Section */}
      <FAQSection
        faqs={appData.faqs}
        onAdminClick={() => setAdminModalOpen(true)}
      />

      {/* Footer */}
      <Footer
        settings={appData.settings}
        onBookClick={scrollToBooking}
        onAdminClick={() => setAdminModalOpen(true)}
      />

      {/* Floating Mobile Sticky CTA */}
      <div className="fixed bottom-4 right-4 z-30 md:hidden flex items-center gap-2">
        <button
          onClick={scrollToBooking}
          className="px-5 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Find/Manage Appointment Modal */}
      <AppointmentLookupModal
        settings={appData.settings}
        isOpen={lookupModalOpen}
        onClose={() => setLookupModalOpen(false)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        settings={appData.settings}
        services={appData.services}
        doctors={appData.doctors}
        faqs={appData.faqs}
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onRefreshData={loadData}
      />

    </div>
  );
}
