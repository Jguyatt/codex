import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const supabase = url && anon ? createClient(url, anon) : null;

export const logEvent = async (eventType: string, payload: Record<string, unknown>) => {
  if (!supabase) {
    console.info('[clarifile] telemetry event', eventType, payload);
    return { error: null };
  }
  return supabase.from('events').insert({ event_type: eventType, payload });
};

export interface LicenseValidationResult {
  valid: boolean;
  reason?: string;
}

export const validateLicense = async (licenseKey: string, machineHash: string): Promise<LicenseValidationResult> => {
  if (!supabase) {
    return { valid: licenseKey === 'CLARIFILE-DEMO', reason: 'mock' };
  }

  const { data, error } = await supabase.rpc('validate_license', {
    license_key: licenseKey,
    machine_hash: machineHash
  });

  if (error) {
    console.error(error);
    return { valid: false, reason: error.message };
  }

  return { valid: Boolean(data) };
};
