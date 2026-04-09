export interface CustomerView {
  id: string;
  name: string;
  phone: string;
}

export interface CustomerSearch {
  name: string;
  page: number;
  size: number;
}

export const customerSearchInitialValue: CustomerSearch = {
  name: "",
  page: 0,
  size: 25,
}
