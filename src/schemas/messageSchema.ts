import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Message content cannot be empty" })
    .max(300, {
      message: "Message content must be at most 300 characters long",
    }),
});
