import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://edlpwbhgxixiyivvljtk.supabase.co";

const supabaseAnonKey =
  "sb_publishable_KYJMLwt2kgyumrzMUIh2jg_4Rh0NwX2";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );