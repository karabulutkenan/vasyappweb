import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let anonClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

function readPublicEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase yapılandırması eksik. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlayın.",
    );
  }

  return { url, anonKey };
}

/** Tarayıcı / anon erişim (RLS uygulanır). */
export function getSupabaseClient(): SupabaseClient {
  if (anonClient) {
    return anonClient;
  }

  const { url, anonKey } = readPublicEnv();
  anonClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return anonClient;
}

/** Sunucu tarafı doğrulama (service role; RLS bypass). ASLA client'a export etme. */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const { url } = readPublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY eksik. Sunucu tarafı doğrulama için .env.local dosyasına ekleyin.",
    );
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const instance = getSupabaseClient();
    const value = Reflect.get(instance, property, instance) as unknown;

    if (typeof value === "function") {
      return value.bind(instance);
    }

    return value;
  },
});
