export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressResponse {
  status: string;
  message?: string;
  data: Address[];
}

export interface SingleAddressResponse {
  status: string;
  message: string;
  data: Address;
}
