export interface PlaygroundRegistrationView {
  id: string;
  regNumber: string;
  parentName: string;
  createdDate: string;
  status: string
}

export interface PlaygroundRegistrationSearch {
  number?: string;
  page: number;
  size: number;
}
