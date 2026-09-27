import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQSectionProps {
  faqs: FAQItem[];
  onAdminClick: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, onAdminClick }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Help &amp; Information
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Answers to common questions about clinic visits, appointments, and location details.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left bg-slate-50/60 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-teal-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
