import type { PlaygroundRegistrationView } from "@/interfaces/playground-registration.interface";

export interface RegistrationRecordsProps {
  data: PlaygroundRegistrationView[];
  isLoading: boolean;
  page: number;
  size: number;
  totalPages: number;
  start: number;
  onPageChange: (nextPage: number) => void;
  onSizeChange: (nextSize: number) => void;
  title: string;
  subtitle: string;
}
