export interface ClinicSettings {
  name: string;
  category: string;
  tagline: string;
  description: string;
  address: string;
  landmark: string;
  googleMapsUrl: string;
  phone: string;
  email: string;
  hoursText: string;
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  availableDays: string[];
  adminPin?: string;
  isPhonePlaceholder?: boolean;
  isEmailPlaceholder?: boolean;
  isHoursPlaceholder?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  iconName: string;
  feeText: string;
  isPlaceholder?: boolean;
}

export interface DoctorItem {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  experience: string;
  feeText: string;
  availableDays: string[];
  availableTimeText: string;
  profilePhoto: string;
  isPlaceholder?: boolean;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'Exterior' | 'Reception' | 'Consultation' | 'Team' | 'Facilities';
  url: string;
  description: string;
  isPlaceholder?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isPlaceholder?: boolean;
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  mobile: string;
  email?: string;
  age: number;
  gender?: string;
  serviceId: string;
  serviceName: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';
  createdAt: string;
}

export interface AppData {
  settings: ClinicSettings;
  services: ServiceItem[];
  doctors: DoctorItem[];
  photos: PhotoItem[];
  faqs: FAQItem[];
}
