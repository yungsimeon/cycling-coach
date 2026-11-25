import { z } from "zod";

export const updateRideSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .max(100, "Name can only contain 100 characters at most")
    .transform((val) => {
      if (val === "") return null;
      return val;
    }),
  description: z
    .string()
    .trim()
    .max(2000, "Description can contain 2000 characters at most")
    .transform((val) => {
      if (val === "") return null;
      return val;
    }),
});
