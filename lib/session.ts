import { UsuarioSesion } from "@/types/liga";

const STORAGE_KEY = "usuario";

export function getUsuarioActual(): UsuarioSesion | null {
  if (typeof window === "undefined") {
    return null;
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as UsuarioSesion;
  } catch {
    return null;
  }
}

export function guardarUsuario(
  usuario: UsuarioSesion
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(usuario)
  );
}

export function cerrarSesion() {
  localStorage.removeItem(STORAGE_KEY);
}