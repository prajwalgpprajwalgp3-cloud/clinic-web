import React, { useState } from 'react';
import { Image as ImageIcon, Eye, X, ShieldAlert } from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onAdminClick: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onAdminClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);

  const categories = ['All', 'Exterior', 'Reception', 'Consultation', 'Facilities', 'Team'];

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Clinic Gallery
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Clinic Facilities &amp; Premises
          </h2>
          <p className="text-sm text-slate-600">
            A look inside Shreenidhi Poly Clinic and Medical at Srinidhi Arcade, Bedarahalli.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setPreviewPhoto(photo)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs hover:shadow-lg transition-all relative"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{photo.title}</h3>
                  <span className="text-[10px] text-teal-700 font-medium capitalize">
                    {photo.category}
                  </span>
                </div>
                {photo.isPlaceholder && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                    Placeholder
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Admin hint */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Clinic owner can manage photo gallery items in the{' '}
          <button onClick={onAdminClick} className="text-teal-700 font-bold underline">
            Admin Panel
          </button>
        </div>

      </div>

      {/* Lightbox Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewPhoto.url}
              alt={previewPhoto.title}
              className="w-full max-h-[70vh] object-contain bg-slate-900"
              referrerPolicy="no-referrer"
            />

            <div className="p-6 bg-white space-y-1">
              <span className="text-xs font-bold text-teal-700 uppercase">
                {previewPhoto.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{previewPhoto.title}</h3>
              <p className="text-xs text-slate-600">{previewPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
