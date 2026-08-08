export function esSuperAdmin(): boolean {
  const sesion = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  return sesion.super_admin === true;
}