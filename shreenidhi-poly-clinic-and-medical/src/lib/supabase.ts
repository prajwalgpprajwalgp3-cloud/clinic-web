import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ysluyenedticjkmhiace.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_4m3jDGduNI8sf9YjthNtpg_dLLtFEKu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseAppointmentRow {
  id: string;
  patient_name: string;
  mobile: string;
  email?: string | null;
  age: number;
  gender?: string | null;
  service_id: string;
  service_name: string;
  doctor_id?: string | null;
  doctor_name?: string | null;
  date: string;
  time_slot: string;
  reason?: string | null;
  status: string;
  created_at: string;
}

/**
 * Saves a new appointment directly to Supabase table `appointments`.
 */
export async function saveAppointmentToSupabase(appointment: {
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
  reason?: string;
  status: string;
  createdAt?: string;
}) {
  try {
    const rowPayload = {
      id: appointment.id,
      patient_name: appointment.patientName,
      patientName: appointment.patientName,
      mobile: appointment.mobile,
      email: appointment.email || null,
      age: appointment.age,
      gender: appointment.gender || null,
      service_id: appointment.serviceId,
      serviceId: appointment.serviceId,
      service_name: appointment.serviceName,
      serviceName: appointment.serviceName,
      doctor_id: appointment.doctorId || null,
      doctorId: appointment.doctorId || null,
      doctor_name: appointment.doctorName || null,
      doctorName: appointment.doctorName || null,
      date: appointment.date,
      time_slot: appointment.timeSlot,
      timeSlot: appointment.timeSlot,
      reason: appointment.reason || null,
      status: appointment.status,
      created_at: appointment.createdAt || new Date().toISOString(),
      createdAt: appointment.createdAt || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([rowPayload])
      .select();

    if (error) {
      console.warn('Supabase Insert Warning/Error:', error.message);
      // Fallback insert with minimal snake_case payload in case table has strict schema
      const minimalPayload = {
        id: appointment.id,
        patient_name: appointment.patientName,
        mobile: appointment.mobile,
        email: appointment.email || null,
        age: appointment.age,
        gender: appointment.gender || null,
        service_id: appointment.serviceId,
        service_name: appointment.serviceName,
        doctor_id: appointment.doctorId || null,
        doctor_name: appointment.doctorName || null,
        date: appointment.date,
        time_slot: appointment.timeSlot,
        reason: appointment.reason || null,
        status: appointment.status,
      };
      const retry = await supabase.from('appointments').insert([minimalPayload]);
      if (retry.error) {
        console.error('Supabase retry error:', retry.error.message);
      } else {
        console.log('Saved to Supabase successfully on minimal schema retry.');
      }
    } else {
      console.log('Successfully saved appointment to Supabase table "appointments":', data);
    }
  } catch (err) {
    console.error('Unexpected error saving to Supabase:', err);
  }
}
