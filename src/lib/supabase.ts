const url = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

const hasRemote = Boolean(url && anon);

const request = async <T>(path: string, body: Record<string, unknown>): Promise<{ data: T | null; error: Error | null }> => {
  if (!hasRemote) {
    return { data: null, error: null };
  }

  try {
    const res = await fetch(`${url}/rest/v1${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed with ${res.status}`);
    }

    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const logEvent = async (eventType: string, payload: Record<string, unknown>) => {
  if (!hasRemote) {
    console.info('[clarifile] telemetry event', eventType, payload);
    return { error: null };
  }

  const { error } = await request('/events', {
    event_type: eventType,
    payload
  });

  return { error };
};

export interface LicenseValidationResult {
  valid: boolean;
  reason?: string;
}

export const validateLicense = async (licenseKey: string, machineHash: string): Promise<LicenseValidationResult> => {
  if (!hasRemote) {
    return { valid: licenseKey === 'CLARIFILE-DEMO', reason: 'mock' };
  }

  const { data, error } = await request<boolean>('/rpc/validate_license', {
    license_key: licenseKey,
    machine_hash: machineHash
  });

  if (error) {
    console.error(error);
    return { valid: false, reason: error.message };
  }

  return { valid: Boolean(data) };
};
