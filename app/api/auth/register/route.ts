import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    // -----------------------------------------
    // 1. Leer datos recibidos
    // -----------------------------------------

    const body = await request.json();

    const usuario =
      typeof body.usuario === "string"
        ? body.usuario.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const avatar =
      typeof body.avatar === "string" &&
      body.avatar.trim()
        ? body.avatar.trim()
        : "avatar1.png";

    // -----------------------------------------
    // 2. Validaciones básicas
    // -----------------------------------------

    if (
      !usuario ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Completa todos los campos.",
        },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        {
          error:
            "La contraseña debe tener al menos 4 caracteres.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 3. Comprobar email existente
    // -----------------------------------------

    const {
      data: usuarioExistente,
      error: errorEmail,
    } = await supabaseAdmin
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (errorEmail) {
      console.error(
        "Error comprobando email:",
        errorEmail
      );

      return NextResponse.json(
        {
          error:
            "Error comprobando el correo electrónico.",
        },
        { status: 500 }
      );
    }

    if (usuarioExistente) {
      return NextResponse.json(
        {
          error:
            "Ese correo ya está registrado.",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // 4. Crear usuario en Supabase Auth
    // -----------------------------------------

    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (
      authError ||
      !authData.user
    ) {
      console.error(
        "Error creando usuario en Supabase Auth:",
        authError
      );

      return NextResponse.json(
        {
          error:
            authError?.message ??
            "No se pudo crear la cuenta.",
        },
        { status: 400 }
      );
    }

    const authUserId =
      authData.user.id;

    // -----------------------------------------
    // 5. Crear usuario Rayongrid
    // -----------------------------------------

    const {
      data: nuevoUsuario,
      error: errorInsert,
    } = await supabaseAdmin
      .from("usuarios")
      .insert({
        usuario,
        email,
        auth_user_id: authUserId,
        avatar,
        activo: true,
        super_admin: false,
        liga_actual_id: null,
      })
      .select(
        "id, usuario, email, avatar, liga_actual_id, super_admin"
      )
      .single();

    // -----------------------------------------
    // 6. Si falla Rayongrid, eliminar Auth
    // -----------------------------------------

    if (
      errorInsert ||
      !nuevoUsuario
    ) {
      console.error(
        "Error creando usuario Rayongrid:",
        errorInsert
      );

      const {
        error: errorEliminarAuth,
      } =
        await supabaseAdmin.auth.admin.deleteUser(
          authUserId
        );

      if (errorEliminarAuth) {
        console.error(
          "Error eliminando usuario Auth después de fallo:",
          errorEliminarAuth
        );
      }

      return NextResponse.json(
        {
          error:
            errorInsert?.message ??
            "No se pudo crear la cuenta.",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 7. Respuesta correcta
    // -----------------------------------------

    return NextResponse.json(
      {
        ok: true,
        usuario: nuevoUsuario,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error en API de registro:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}