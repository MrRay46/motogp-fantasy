# 🏁 RayGrid

Historial oficial de versiones del proyecto.

---

# v0.9 Alpha — Rebranding

📅 Julio 2026

## ✨ Nuevo

- Nuevo nombre oficial: **RayonGrid**
- Branding completo.
- Logo oficial.
- Eslogan principal.
- Eslogan de marketing.
- Landing Page.
- Login renovado.
- Dashboard independiente.
- Nueva identidad visual..

## 🔧 Mejoras

- Arquitectura preparada para sistema multiliga.
- Separación entre Landing y Dashboard.
- Primer flujo profesional de acceso.

---

# 🚧 Próxima versión

## v0.95 Beta — Sistema Multiliga

### Objetivos

- Crear liga.
- Unirse a liga.
- Administradores de liga.
- Código de invitación.
- Filtrado por `liga_id`.
- Flujo de onboarding.

---

# 🎯 Objetivo final

## v1.0

Publicación oficial de RayonGrid.

- Android.
- iPhone.
- Landing definitiva.
- Dominio.
- Publicación.
- Sistema multiliga completo.
# Rayongrid — Changelog

Historial de cambios del proyecto.

## v1.0.0 — Versión estable

### Funcionalidades

- Sistema de ligas: creación, acceso mediante invitación y selección de liga activa.
- Equipos fantasy independientes por usuario y liga.
- Mercado de pilotos y constructores, con ventanas y límites de cambios.
- Predicciones de campeón de piloto y constructor.
- Clasificaciones de pilotos, constructores y ligas.
- Procesamiento de resultados y puntos de cada Gran Premio.
- Administración de liga y herramientas de SuperAdmin.
- Noticias, perfil y selección de avatar.

### Seguridad y acceso a datos

- RLS activada en las tablas privadas revisadas.
- Operaciones sensibles canalizadas mediante APIs de servidor.
- Comprobación de sesión, membresía de liga y permisos de administración en las APIs.
- Lectura pública limitada a los datos destinados a mostrarse públicamente.

### Correcciones y mejoras

- Se permite completar por primera vez un equipo aunque el mercado esté cerrado.
- Los cambios de equipos ya creados siguen sujetos a las reglas de las ventanas de mercado.
- Se corrigió el guardado de equipos incompletos durante el proceso de selección.
- Los puntos mostrados en las fichas del mercado se sincronizan con la clasificación de pilotos.
- La página de equipo muestra los puntos del Gran Premio actual.
- El proceso de bonificaciones comprueba los permisos del administrador de la liga y evita aplicar una bonificación dos veces al mismo equipo.

### Bonificaciones de temporada

- Se añadió la tabla `campeones_temporada`, con RLS activada.
- El piloto y el constructor campeones se registran manualmente.
- El botón de bonificaciones permanece bloqueado hasta que haya campeones registrados y todos los GP de la temporada estén finalizados y procesados.
- La API vuelve a comprobar esas condiciones al recibir la solicitud, aunque se intente llamar sin usar el botón.
- Se conservan las bonificaciones definidas por las reglas para las predicciones originales y modificadas.

### Verificación

- `npm run build` completado correctamente tras los últimos cambios.
- El usuario confirmó las pruebas de creación y guardado de equipos y la comprobación visual del bloqueo de bonificaciones.

## Mantenimiento — octubre de 2026

- Revisión de seguridad de tablas y accesos mediante RLS y APIs.
- Actualización de las fichas del mercado para mostrar los puntos actuales de los pilotos.
- Ajuste de los puntos del Gran Premio mostrados en la página de equipo.
- Protección del proceso de bonificaciones de temporada.