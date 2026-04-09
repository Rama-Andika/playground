import z from "zod";
import { childrenSchema, childrenSchemaInitialValue } from "./children.schema";

export const parentSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  phone: z.string().min(1, { error: "Phone is required" }),
  code: z.string().default(""),
  userId: z.string().default(""),
  children: z
    .array(childrenSchema)
    .min(1, { error: "At least one child is required" }),
});

export type ParentSchemaType = z.infer<typeof parentSchema>;

export const parentSchemaInitialValues = (): ParentSchemaType => ({
  name: "",
  phone: "",
  code: "",
  userId: "",
  children: [childrenSchemaInitialValue()],
});
