export type CustomerStatus = 'ACTIVE' | 'INACTIVE';

export type StatusFilter = 'ALL' | CustomerStatus;

export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: CustomerStatus;
}

export interface CustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status?: CustomerStatus;
}

export type CustomerResponse = Customer;
