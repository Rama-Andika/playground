import type { ParentSchemaType } from "@/schemas/parent.schema";
import type { ChildrenSchemaType } from "@/schemas/children.schema";

export interface RegistrationNewProps {
  data: ParentSchemaType;
  itemMasterOptions: { value: string; label: string; }[] | undefined;
  handleParentChange: <K extends keyof ParentSchemaType>(
    key: K,
    value: ParentSchemaType[K],
  ) => void;
  handleChildrenChange: <K extends keyof ChildrenSchemaType>(
    key: K,
    id: string,
    value: ChildrenSchemaType[K],
  ) => Promise<void>;
  handleContinue: () => Promise<void>;
  handleAddChild: () => void;
  handleDeleteChild: (id: string) => void;
  errors: Record<string, string | undefined>;
  isPending: boolean;
  title: string;
  subtitle: string;
}
