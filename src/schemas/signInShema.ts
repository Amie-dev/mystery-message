import { z } from "zod";

export const sigInSchemaValidation = z.object({
  identifier:z.string(),
  password:z.string()
});
