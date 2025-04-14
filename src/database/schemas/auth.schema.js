import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string({ required_error: "El nombre de usuario es obligatorio." })
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres.",
      })
      .max(15, {
        message: "El nombre de usuario no puede exceder los 15 caracteres.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "El nombre de usuario solo puede contener letras, números y guiones bajos.",
      }),

    first_name: z
      .string({ required_error: "El nombre es obligatorio." })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
      .regex(/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/, {
        message:
          "El nombre debe comenzar con una letra mayúscula, y cada palabra debe comenzar con una letra mayúscula seguida de letras minúsculas.",
      }),

    last_name: z
      .string({ required_error: "El apellido es obligatorio." })
      .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
      .regex(/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/, {
        message:
          "El apellido debe comenzar con una letra mayúscula, y cada palabra debe comenzar con una letra mayúscula seguida de letras minúsculas.",
      }),

    email: z
      .string({ required_error: "El correo electrónico es obligatorio." })
      .email({
        message: "El correo electrónico debe ser una dirección válida.",
      }),

    password: z
      .string({ required_error: "La contraseña es obligatoria." })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
      .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una letra minúscula.",
      })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una letra mayúscula.",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número.",
      })
      .regex(/[\W_]/, {
        message: "La contraseña debe contener al menos un carácter especial.",
      }),

    confirm_password: z
      .string({
        required_error: "La confirmación de la contraseña es obligatoria.",
      })
      .min(8, {
        message:
          "La confirmación de la contraseña debe tener al menos 8 caracteres.",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Las contraseñas no coinciden.",
  });

export const confirmAccountSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico debe ser una dirección válida.",
  }),
});

export const signInSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico debe ser una dirección válida.",
  }),

  password: z
    .string({ required_error: "La contraseña es obligatoria." })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico debe ser una dirección válida.",
  }),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email({
      message: "El correo electrónico debe ser una dirección válida.",
    }),
    password: z
      .string({ required_error: "La contraseña es obligatoria." })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
      .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una letra minúscula.",
      })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una letra mayúscula.",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número.",
      })
      .regex(/[\W_]/, {
        message: "La contraseña debe contener al menos un carácter especial.",
      }),

    confirm_password: z
      .string({
        required_error: "La confirmación de la contraseña es obligatoria.",
      })
      .min(8, {
        message:
          "La confirmación de la contraseña debe tener al menos 8 caracteres.",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Las contraseñas no coinciden.",
  });
