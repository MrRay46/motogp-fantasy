import { supabase } from "@/lib/supabase";

export async function esSuperAdmin(): Promise<boolean> {
  const sesion = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  if (!sesion.id) {
    return false;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("super_admin")
    .eq("id", sesion.id)
    .single();

  if (error || !data) {
    return false;
  }

  return data.super_admin === true;
}