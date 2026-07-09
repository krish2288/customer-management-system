import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Customer, CustomerRequest, CustomerResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = 'http://localhost:8080/api/customers';

  constructor(private readonly http: HttpClient) {}

  createCustomer(customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.apiUrl, customer);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomerById(customerId: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/${customerId}`);
  }

  updateCustomer(customerId: string, customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.apiUrl}/${customerId}`, customer);
  }

  deleteCustomer(customerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerId}`);
  }
}
