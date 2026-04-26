import { z } from "zod";

export const submitSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  vorname: z
    .string()
    .trim()
    .min(1, "Vorname ist erforderlich")
    .max(20, "Vorname darf maximal 20 Zeichen lang sein"),
  nachname: z
    .string()
    .trim()
    .min(1, "Nachname ist erforderlich")
    .max(20, "Nachname darf maximal 20 Zeichen lang sein"),
  schaetzwert: z.number().int().nonnegative("Schätzwert muss positiv sein"),
  captchaToken: z.string().min(1, "reCAPTCHA Token fehlt"),
  HatWerbungAboniert: z.boolean().default(false),
});

export const verifySchema = z.object({
  token: z.string().uuid("Ungültiges Token-Format"),
});

export const unsubscribeSchema = z.object({
  id: z.union([z.string().min(1), z.number().int()]),
  token: z.string().regex(/^[0-9a-f]{64}$/i, "Ungültiges Token-Format"),
});

export type SubmitInput = z.infer<typeof submitSchema>;
export type VerifyInput = z.infer<typeof verifySchema>;
export type UnsubscribeInput = z.infer<typeof unsubscribeSchema>;
