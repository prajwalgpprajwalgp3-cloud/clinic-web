import React from 'react';
import { Stethoscope, ShieldCheck, Activity, ClipboardCheck, HeartPulse, ArrowRight, Info } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceId: string) => void;
  onAdminClick: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
  onAdminClick,
}) => {
  // Helper to render icon by string name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Activity':
        return <Activity className="w-6 h-6" />;
      case 'ClipboardCheck':
        return <ClipboardCheck className="w-6 h-6" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6" />;
      case 'Stethoscope':
      default:
        return <Stethoscope className="w-6 h-6" />;
    }
  };

  const hasPlaceholders = services.some((s) => s.isPlaceholder);

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Medical Services
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Outpatient Care
          </h2>
          <p className="text-sm text-slate-600">
            Shreenidhi Poly Clinic provides essential primary healthcare and consultation services for individuals and families in Bedarahalli.
          </p>

          {hasPlaceholders && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] text-amber-800 font-medium">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Placeholder List — Services can be updated anytime in{' '}
                <button onClick={onAdminClick} className="underline font-bold hover:text-amber-900">
                  Admin Panel
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-xl w-fit group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  {renderIcon(service.iconName)}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Fee Structure</span>
                  <span className="text-xs font-bold text-slate-700">{service.feeText}</span>
                </div>

                <button
                  onClick={() => onSelectService(service.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white rounded-xl transition-colors flex items-center gap-1"
                >
                  Book Service <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
