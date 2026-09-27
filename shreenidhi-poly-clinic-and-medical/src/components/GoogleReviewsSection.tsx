import React from 'react';
import { Star, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { ClinicSettings } from '../types';

interface GoogleReviewsSectionProps {
  settings: ClinicSettings;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({ settings }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/70 text-teal-800 rounded-full text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
          <span>Patient Ratings &amp; Reviews</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Read Authentic Patient Feedback on Google
        </h2>

        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We believe in transparent, unedited patient reviews. View verified ratings, visitor experiences, and clinic reviews directly on our official Google Business Profile.
        </p>

        {/* Verified Google Badge Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-6 h-6 fill-amber-400" />
            ))}
          </div>

          <div className="text-slate-900 font-extrabold text-lg">
            Shreenidhi Poly Clinic and Medical
          </div>

          <p className="text-xs text-slate-500">
            Srinidhi Arcade, Magadi Main Road, Bedarahalli, Bengaluru
          </p>

          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2"
          >
            See Our Google Reviews
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
