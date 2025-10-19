import { z } from "zod";

export const messageSchemaValidation = z.object({
  content: z
    .string()
    .min(3, { message: "content must be 3 characters" })
    .max(300, { message: "content not more then  300 characters" }),
});
