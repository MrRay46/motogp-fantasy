ALTER TABLE public.grandes_premios
ADD COLUMN IF NOT EXISTS carrera_suspendida boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.grandes_premios.carrera_suspendida IS
  'Indica que la carrera principal fue suspendida o cancelada; el resultado del Sprint puede conservarse.';
