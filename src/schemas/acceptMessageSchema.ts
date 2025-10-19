import { z } from "zod";

export const acceptMessageSchemaValidation = z.object({
  acceptMessages:z.boolean()
});
