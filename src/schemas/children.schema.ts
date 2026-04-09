import { generateNumericId } from "@/utils/generate-numeric-id";
import z from "zod";

export const childrenSchema = z.object({
  id: z.string().default(""),
  name: z.string().min(1, { error: "Name is required" }),
  age: z.number().default(0),
  itemId: z.string().min(1, { error: "Item is required" }),
  price: z.number().default(0),
  code: z.string().default(""),
});

export type ChildrenSchemaType = z.infer<typeof childrenSchema>;

export const childrenSchemaInitialValue = (): ChildrenSchemaType => ({
  id: generateNumericId(),
  name: "",
  age: 0,
  itemId: "",
  price: 0,
  code: "",
});
