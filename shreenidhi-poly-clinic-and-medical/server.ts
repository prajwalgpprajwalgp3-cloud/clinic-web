import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, saveAppointmentToSupabase } from './src/lib/supabase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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
  openingTime: string; // HH:MM 24h format e.g. "09:00"
  closingTime: string; // HH:MM 24h format e.g. "20:00"
  slotDurationMinutes: number;
  availableDays: string[];
  adminPin: string;
  isPhonePlaceholder: boolean;
  isEmailPlaceholder: boolean;
  isHoursPlaceholder: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  iconName: string;
  feeText: string;
  isPlaceholder: boolean;
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
  isPlaceholder: boolean;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'Exterior' | 'Reception' | 'Consultation' | 'Team' | 'Facilities';
  url: string;
  description: string;
  isPlaceholder: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isPlaceholder: boolean;
}

export interface AppointmentRecord {
  id: string; // e.g. SPC-1048
  patientName: string;
  mobile: string;
  email?: string;
  age: number;
  gender?: string;
  serviceId: string;
  serviceName: string;
  doctorId?: string;
  doctorName?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:20 AM"
  reason: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';
  createdAt: string;
}

const DEFAULT_SETTINGS: ClinicSettings = {
  name: 'Shreenidhi Poly Clinic and Medical',
  category: 'Medical Clinic / Polyclinic',
  tagline: 'Quality Healthcare, Closer to You',
  description: 'Shreenidhi Poly Clinic and Medical provides accessible healthcare services in Bedarahalli, Bengaluru.',
  address: 'Srinidhi Arcade, Magadi Main Road, Bharath Nagar, BEL Layout 1st Stage, Bedarahalli, Bengaluru, Karnataka 560091',
  landmark: 'Near Bedarahalli Bus Stop, Magadi Main Road',
  googleMapsUrl: 'https://maps.app.goo.gl/kXQo42Csv5cbajsr6',
  phone: '+91 98765 43210 (Contact Clinic)',
  email: 'contact@shreenidhipolyclinic.com',
  hoursText: 'Hours: Please contact the clinic',
  openingTime: '09:00',
  closingTime: '20:00',
  slotDurationMinutes: 20,
  availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  adminPin: '1234',
  isPhonePlaceholder: true,
  isEmailPlaceholder: true,
  isHoursPlaceholder: true,
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'General Consultation',
    description: 'Routine medical examination, health evaluations, diagnosis, and treatment planning for general health concerns.',
    durationMinutes: 20,
    iconName: 'Stethoscope',
    feeText: 'Please contact clinic',
    isPlaceholder: true,
  },
  {
    id: 'srv-2',
    name: 'Preventive Healthcare',
    description: 'Health screening, disease risk assessment, immunizations, and preventive medical guidance for long-term wellness.',
    durationMinutes: 20,
    iconName: 'ShieldCheck',
    feeText: 'Please contact clinic',
    isPlaceholder: true,
  },
  {
    id: 'srv-3',
    name: 'Routine Health Checkups',
    description: 'Comprehensive physical health examinations, vital parameter checks, and routine diagnostic follow-ups.',
    durationMinutes: 30,
    iconName: 'Activity',
    feeText: 'Please contact clinic',
    isPlaceholder: true,
  },
  {
    id: 'srv-4',
    name: 'Follow-up Consultation',
    description: 'Re-evaluation for ongoing medical treatments, prescription management, and clinical progress reviews.',
    durationMinutes: 15,
    iconName: 'ClipboardCheck',
    feeText: 'Please contact clinic',
    isPlaceholder: true,
  },
  {
    id: 'srv-5',
    name: 'Other Clinic Services',
    description: 'General outpatient assistance, basic medical procedures, diagnostic sampling, and community healthcare support.',
    durationMinutes: 20,
    iconName: 'HeartPulse',
    feeText: 'Please contact clinic',
    isPlaceholder: true,
  },
];

const DEFAULT_DOCTORS: DoctorItem[] = [
  {
    id: 'doc-1',
    name: 'Duty Medical Officer / General Physician',
    qualification: 'MBBS',
    specialty: 'General Medicine',
    experience: '5+ Years',
    feeText: 'Please contact clinic',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableTimeText: '09:00 AM - 01:00 PM & 05:00 PM - 08:00 PM',
    profilePhoto: '/src/assets/images/medical_team_professionals_1790484235642.jpg',
    isPlaceholder: true,
  },
];

const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'img-1',
    title: 'Srinidhi Arcade Exterior',
    category: 'Exterior',
    url: '/src/assets/images/clinic_hero_building_1790484178521.jpg',
    description: 'Clinic exterior view at Srinidhi Arcade, Magadi Main Road.',
    isPlaceholder: false,
  },
  {
    id: 'img-2',
    title: 'Clinic Reception & Waiting Desk',
    category: 'Reception',
    url: '/src/assets/images/clinic_reception_area_1790484193312.jpg',
    description: 'Clean, comfortable patient waiting lounge and reception desk.',
    isPlaceholder: false,
  },
  {
    id: 'img-3',
    title: 'Doctor Consultation Room',
    category: 'Consultation',
    url: '/src/assets/images/consultation_room_medical_1790484207023.jpg',
    description: 'Private, well-equipped consultation room for patient evaluations.',
    isPlaceholder: false,
  },
  {
    id: 'img-4',
    title: 'Medical Facilities & Testing Area',
    category: 'Facilities',
    url: '/src/assets/images/clinic_medical_facilities_1790484222511.jpg',
    description: 'Clean medical examination and diagnostic sample facility area.',
    isPlaceholder: false,
  },
  {
    id: 'img-5',
    title: 'Medical Team & Staff',
    category: 'Team',
    url: '/src/assets/images/medical_team_professionals_1790484235642.jpg',
    description: 'Our team of dedicated healthcare professionals.',
    isPlaceholder: true,
  },
];

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How can I book an appointment?',
    answer: 'Select your preferred service, date, and time slot on our website, fill in your details, and submit. You will instantly receive an appointment reference ID.',
    isPlaceholder: false,
  },
  {
    id: 'faq-2',
    question: 'How can I contact the clinic?',
    answer: 'You can reach us by visiting Srinidhi Arcade, Magadi Main Road, Bedarahalli, Bengaluru, or by calling our clinic desk.',
    isPlaceholder: false,
  },
  {
    id: 'faq-3',
    question: 'Where is the clinic located?',
    answer: 'Shreenidhi Poly Clinic and Medical is located at Srinidhi Arcade, Magadi Main Road, Bharath Nagar, BEL Layout 1st Stage, Bedarahalli, Bengaluru, Karnataka 560091.',
    isPlaceholder: false,
  },
  {
    id: 'faq-4',
    question: 'What are the clinic timings?',
    answer: 'Hours: Please contact the clinic for updated daily consultation hours.',
    isPlaceholder: true,
  },
  {
    id: 'faq-5',
    question: 'Can I reschedule or cancel my appointment?',
    answer: 'Yes! You can reschedule or cancel your appointment online at any time using your Booking Reference ID.',
    isPlaceholder: false,
  },
  {
    id: 'faq-6',
    question: 'How do I get directions to the clinic?',
    answer: 'Click the "Get Directions" button anywhere on our website to open our location directly on Google Maps.',
    isPlaceholder: false,
  },
];

interface InitialData {
  settings: ClinicSettings;
  services: ServiceItem[];
  doctors: DoctorItem[];
  photos: PhotoItem[];
  faqs: FAQItem[];
  appointments: AppointmentRecord[];
}

function loadDb(): InitialData {
  if (!fs.existsSync(DB_FILE)) {
    const initial: InitialData = {
      settings: DEFAULT_SETTINGS,
      services: DEFAULT_SERVICES,
      doctors: DEFAULT_DOCTORS,
      photos: DEFAULT_PHOTOS,
      faqs: DEFAULT_FAQS,
      appointments: [
        {
          id: 'SPC-8102',
          patientName: 'Ramesh Kumar',
          mobile: '9845012345',
          email: 'ramesh@example.com',
          age: 42,
          gender: 'Male',
          serviceId: 'srv-1',
          serviceName: 'General Consultation',
          doctorName: 'Duty Medical Officer / General Physician',
          date: new Date().toISOString().split('T')[0],
          timeSlot: '10:00 AM',
          reason: 'Routine health check and fever consultation',
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse db.json, writing defaults', err);
    const initial: InitialData = {
      settings: DEFAULT_SETTINGS,
      services: DEFAULT_SERVICES,
      doctors: DEFAULT_DOCTORS,
      photos: DEFAULT_PHOTOS,
      faqs: DEFAULT_FAQS,
      appointments: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveDb(data: InitialData) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Public API endpoints
  app.get('/api/data', (_req, res) => {
    const db = loadDb();
    // Return public data (hide admin pin)
    const { adminPin, ...safeSettings } = db.settings;
    res.json({
      settings: safeSettings,
      services: db.services,
      doctors: db.doctors,
      photos: db.photos,
      faqs: db.faqs,
    });
  });

  // Book appointment
  app.post('/api/appointments', (req, res) => {
    const { patientName, mobile, email, age, gender, serviceId, doctorId, date, timeSlot, reason } = req.body;

    if (!patientName || !mobile || !serviceId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing required appointment fields.' });
    }

    const db = loadDb();
    const service = db.services.find((s) => s.id === serviceId);
    const doctor = db.doctors.find((d) => d.id === doctorId);

    // Check for double booking
    const existing = db.appointments.find(
      (a) => a.date === date && a.timeSlot === timeSlot && (doctorId ? a.doctorId === doctorId : true) && a.status !== 'Cancelled'
    );

    if (existing) {
      return res.status(409).json({ error: 'This time slot is already booked. Please choose another slot.' });
    }

    const bookingId = `SPC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: AppointmentRecord = {
      id: bookingId,
      patientName: patientName.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : undefined,
      age: Number(age) || 30,
      gender: gender || 'Not Specified',
      serviceId,
      serviceName: service ? service.name : 'General Medical Service',
      doctorId,
      doctorName: doctor ? doctor.name : 'Duty Doctor',
      date,
      timeSlot,
      reason: reason ? reason.trim() : 'General consultation',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    db.appointments.push(newAppointment);
    saveDb(db);

    // Save automatically to user's Supabase backend
    saveAppointmentToSupabase(newAppointment).catch((err) =>
      console.error('Background Supabase save error:', err)
    );

    res.status(201).json({ success: true, appointment: newAppointment });
  });

  // Get booked time slots for a specific date and doctor/service
  app.get('/api/appointments/slots', async (req, res) => {
    const { date, doctorId } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date parameter required' });
    }
    const db = loadDb();
    const localSlots = db.appointments
      .filter((a) => a.date === date && (doctorId ? a.doctorId === doctorId : true) && a.status !== 'Cancelled')
      .map((a) => a.timeSlot);

    let supabaseSlots: string[] = [];
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', String(date))
        .neq('status', 'Cancelled');

      if (!error && data) {
        supabaseSlots = data
          .filter((row: any) => (doctorId ? (row.doctor_id || row.doctorId) === doctorId : true))
          .map((row: any) => row.time_slot || row.timeSlot)
          .filter(Boolean);
      }
    } catch (e) {
      console.warn('Error fetching slots from Supabase:', e);
    }

    const allSlots = Array.from(new Set([...localSlots, ...supabaseSlots]));
    res.json({ bookedSlots: allSlots });
  });

  // Lookup appointment by ID and Mobile
  app.get('/api/appointments/lookup', async (req, res) => {
    const { id, mobile } = req.query;
    if (!id || !mobile) {
      return res.status(400).json({ error: 'Reference ID and Mobile Number are required.' });
    }
    const db = loadDb();
    let found = db.appointments.find(
      (a) =>
        a.id.toLowerCase() === String(id).trim().toLowerCase() &&
        a.mobile.replace(/\D/g, '').endsWith(String(mobile).replace(/\D/g, '').slice(-10))
    );

    if (!found) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .ilike('id', String(id).trim())
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          const rowMobile = String(row.mobile || '').replace(/\D/g, '');
          const queryMobile = String(mobile).replace(/\D/g, '').slice(-10);
          if (rowMobile.endsWith(queryMobile)) {
            found = {
              id: row.id,
              patientName: row.patient_name || row.patientName || 'Patient',
              mobile: row.mobile || '',
              email: row.email || undefined,
              age: Number(row.age) || 30,
              gender: row.gender || 'Not Specified',
              serviceId: row.service_id || row.serviceId || 'srv-1',
              serviceName: row.service_name || row.serviceName || 'General Service',
              doctorId: row.doctor_id || row.doctorId || undefined,
              doctorName: row.doctor_name || row.doctorName || undefined,
              date: row.date,
              timeSlot: row.time_slot || row.timeSlot || '10:00 AM',
              reason: row.reason || '',
              status: row.status || 'Pending',
              createdAt: row.created_at || row.createdAt || new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        console.warn('Supabase lookup error:', err);
      }
    }

    if (!found) {
      return res.status(404).json({ error: 'No matching appointment found. Please check details and try again.' });
    }

    res.json({ appointment: found });
  });

  // Cancel appointment by patient
  app.post('/api/appointments/cancel', (req, res) => {
    const { id, mobile } = req.body;
    const db = loadDb();
    const index = db.appointments.findIndex(
      (a) =>
        a.id.toLowerCase() === String(id).trim().toLowerCase() &&
        a.mobile.replace(/\D/g, '').endsWith(String(mobile).replace(/\D/g, '').slice(-10))
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found or details mismatch.' });
    }

    db.appointments[index].status = 'Cancelled';
    saveDb(db);

    supabase
      .from('appointments')
      .update({ status: 'Cancelled' })
      .eq('id', db.appointments[index].id)
      .then(({ error }) => {
        if (error) console.warn('Supabase update status error:', error.message);
      });

    res.json({ success: true, appointment: db.appointments[index] });
  });

  // Reschedule appointment by patient
  app.post('/api/appointments/reschedule', (req, res) => {
    const { id, mobile, newDate, newTimeSlot } = req.body;
    if (!newDate || !newTimeSlot) {
      return res.status(400).json({ error: 'New date and time slot required.' });
    }
    const db = loadDb();
    const appointment = db.appointments.find(
      (a) =>
        a.id.toLowerCase() === String(id).trim().toLowerCase() &&
        a.mobile.replace(/\D/g, '').endsWith(String(mobile).replace(/\D/g, '').slice(-10))
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or details mismatch.' });
    }

    // Check availability
    const conflict = db.appointments.find(
      (a) =>
        a.id !== appointment.id &&
        a.date === newDate &&
        a.timeSlot === newTimeSlot &&
        (appointment.doctorId ? a.doctorId === appointment.doctorId : true) &&
        a.status !== 'Cancelled'
    );

    if (conflict) {
      return res.status(409).json({ error: 'Selected time slot is already taken. Please choose another time.' });
    }

    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = 'Pending';
    saveDb(db);

    supabase
      .from('appointments')
      .update({
        date: newDate,
        time_slot: newTimeSlot,
        timeSlot: newTimeSlot,
        status: 'Pending',
      })
      .eq('id', appointment.id)
      .then(({ error }) => {
        if (error) console.warn('Supabase reschedule update error:', error.message);
      });

    res.json({ success: true, appointment });
  });

  // ADMIN ENDPOINTS
  app.post('/api/admin/login', (req, res) => {
    const { pin } = req.body;
    const db = loadDb();
    if (pin === db.settings.adminPin) {
      res.json({ success: true, token: 'admin-auth-token-spc' });
    } else {
      res.status(401).json({ error: 'Invalid Admin PIN' });
    }
  });

  // Helper auth check
  const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer admin-auth-token-spc') {
      return next();
    }
    return res.status(403).json({ error: 'Unauthorized admin access.' });
  };

  app.get('/api/admin/appointments', checkAdminAuth, async (_req, res) => {
    const db = loadDb();
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');

      if (!error && data && data.length > 0) {
        // Map Supabase rows to AppointmentRecord format
        const supabaseAppts: AppointmentRecord[] = data.map((row: any) => ({
          id: row.id,
          patientName: row.patient_name || row.patientName || 'Patient',
          mobile: row.mobile || '',
          email: row.email || undefined,
          age: Number(row.age) || 30,
          gender: row.gender || 'Not Specified',
          serviceId: row.service_id || row.serviceId || 'srv-1',
          serviceName: row.service_name || row.serviceName || 'General Service',
          doctorId: row.doctor_id || row.doctorId || undefined,
          doctorName: row.doctor_name || row.doctorName || undefined,
          date: row.date,
          timeSlot: row.time_slot || row.timeSlot || '10:00 AM',
          reason: row.reason || '',
          status: row.status || 'Pending',
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
        }));

        // Merge with local db appointments (deduplicating by id)
        const map = new Map<string, AppointmentRecord>();
        db.appointments.forEach((a) => map.set(a.id, a));
        supabaseAppts.forEach((a) => map.set(a.id, a));

        const combined = Array.from(map.values());
        return res.json({ appointments: combined });
      }
    } catch (err) {
      console.warn('Could not fetch appointments from Supabase, returning local db:', err);
    }

    res.json({ appointments: db.appointments });
  });

  app.put('/api/admin/appointments/:id', checkAdminAuth, (req, res) => {
    const { id } = req.params;
    const { status, date, timeSlot, doctorName, serviceName } = req.body;
    const db = loadDb();
    const appt = db.appointments.find((a) => a.id === id);
    if (!appt) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    if (status) appt.status = status;
    if (date) appt.date = date;
    if (timeSlot) appt.timeSlot = timeSlot;
    if (doctorName) appt.doctorName = doctorName;
    if (serviceName) appt.serviceName = serviceName;

    saveDb(db);

    supabase
      .from('appointments')
      .update({
        status: appt.status,
        date: appt.date,
        time_slot: appt.timeSlot,
        timeSlot: appt.timeSlot,
        doctor_name: appt.doctorName,
        doctorName: appt.doctorName,
        service_name: appt.serviceName,
        serviceName: appt.serviceName,
      })
      .eq('id', appt.id)
      .then(({ error }) => {
        if (error) console.warn('Supabase admin update error:', error.message);
      });

    res.json({ success: true, appointment: appt });
  });

  app.put('/api/admin/settings', checkAdminAuth, (req, res) => {
    const db = loadDb();
    const updated = { ...db.settings, ...req.body };
    db.settings = updated;
    saveDb(db);
    res.json({ success: true, settings: safeSettings(updated) });
  });

  app.post('/api/admin/services', checkAdminAuth, (req, res) => {
    const db = loadDb();
    const service: ServiceItem = {
      id: req.body.id || `srv-${Date.now()}`,
      name: req.body.name,
      description: req.body.description,
      durationMinutes: Number(req.body.durationMinutes) || 20,
      iconName: req.body.iconName || 'Stethoscope',
      feeText: req.body.feeText || 'Contact clinic',
      isPlaceholder: false,
    };
    const index = db.services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      db.services[index] = service;
    } else {
      db.services.push(service);
    }
    saveDb(db);
    res.json({ success: true, services: db.services });
  });

  app.delete('/api/admin/services/:id', checkAdminAuth, (req, res) => {
    const db = loadDb();
    db.services = db.services.filter((s) => s.id !== req.params.id);
    saveDb(db);
    res.json({ success: true, services: db.services });
  });

  app.post('/api/admin/doctors', checkAdminAuth, (req, res) => {
    const db = loadDb();
    const doc: DoctorItem = {
      id: req.body.id || `doc-${Date.now()}`,
      name: req.body.name,
      qualification: req.body.qualification,
      specialty: req.body.specialty,
      experience: req.body.experience,
      feeText: req.body.feeText,
      availableDays: req.body.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      availableTimeText: req.body.availableTimeText,
      profilePhoto: req.body.profilePhoto || '/src/assets/images/medical_team_professionals_1790484235642.jpg',
      isPlaceholder: false,
    };
    const index = db.doctors.findIndex((d) => d.id === doc.id);
    if (index >= 0) {
      db.doctors[index] = doc;
    } else {
      db.doctors.push(doc);
    }
    saveDb(db);
    res.json({ success: true, doctors: db.doctors });
  });

  app.delete('/api/admin/doctors/:id', checkAdminAuth, (req, res) => {
    const db = loadDb();
    db.doctors = db.doctors.filter((d) => d.id !== req.params.id);
    saveDb(db);
    res.json({ success: true, doctors: db.doctors });
  });

  function safeSettings(settings: ClinicSettings) {
    const { adminPin, ...safe } = settings;
    return safe;
  }

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shreenidhi Poly Clinic server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
