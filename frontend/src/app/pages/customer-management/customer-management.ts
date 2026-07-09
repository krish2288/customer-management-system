import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { finalize, switchMap } from 'rxjs';

import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal';
import { CustomerFormComponent } from '../../components/customer-form/customer-form';
import { CustomerListComponent } from '../../components/customer-list/customer-list';
import { FooterComponent } from '../../components/footer/footer';
import { HeaderComponent } from '../../components/header/header';
import { ToastComponent } from '../../components/toast/toast';
import { Customer, CustomerRequest } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-customer-management',
  imports: [
    HeaderComponent,
    CustomerFormComponent,
    CustomerListComponent,
    ConfirmationModalComponent,
    ToastComponent,
    FooterComponent,
  ],
  templateUrl: './customer-management.html',
})
export class CustomerManagementComponent implements OnInit {
  @ViewChild('formSection') private formSection?: ElementRef<HTMLElement>;
  @ViewChild(CustomerFormComponent) private customerFormComponent?: CustomerFormComponent;

  private readonly customersState = signal<Customer[]>([]);
  private readonly editingCustomerState = signal<Customer | null>(null);
  private readonly customerPendingDeleteState = signal<Customer | null>(null);
  private readonly isLoadingCustomersState = signal(false);
  private readonly isSavingCustomerState = signal(false);
  private readonly isRefreshingState = signal(false);
  private readonly isDeletingCustomerState = signal(false);
  private readonly formResetCounterState = signal(0);

  constructor(
    private readonly customerService: CustomerService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  get customers(): Customer[] {
    return this.customersState();
  }

  get editingCustomer(): Customer | null {
    return this.editingCustomerState();
  }

  get customerPendingDelete(): Customer | null {
    return this.customerPendingDeleteState();
  }

  get isLoadingCustomers(): boolean {
    return this.isLoadingCustomersState();
  }

  get isSavingCustomer(): boolean {
    return this.isSavingCustomerState();
  }

  get isRefreshing(): boolean {
    return this.isRefreshingState();
  }

  get isDeletingCustomer(): boolean {
    return this.isDeletingCustomerState();
  }

  get formResetCounter(): number {
    return this.formResetCounterState();
  }

  get deleteConfirmationMessage(): string {
    const customer = this.customerPendingDeleteState();

    if (!customer) {
      return 'Do you want to delete this customer?';
    }

    return `Do you want to delete ${customer.firstName} ${customer.lastName}?`;
  }

  loadCustomers(): void {
    this.isLoadingCustomersState.set(true);

    this.customerService
      .getCustomers()
      .pipe(finalize(() => this.isLoadingCustomersState.set(false)))
      .subscribe({
        next: (customers) => {
          this.setCustomers(customers);
        },
        error: (error: unknown) => {
          this.customersState.set([]);
          this.toastService.error(
            this.getApiErrorMessage(error, 'Unable to load customers. Please try again later.'),
          );
        },
      });
  }

  refreshCustomers(): void {
    this.isRefreshingState.set(true);

    this.customerService
      .getCustomers()
      .pipe(finalize(() => this.isRefreshingState.set(false)))
      .subscribe({
        next: (customers) => {
          this.setCustomers(customers);
        },
        error: (error: unknown) => {
          this.toastService.error(
            this.getApiErrorMessage(error, 'Unable to load customers. Please try again later.'),
          );
        },
      });
  }

  addNewCustomer(): void {
    this.clearFormState();
    this.scrollToForm();
  }

  editCustomer(customer: Customer): void {
    this.editingCustomerState.set(customer);
    this.scrollToForm();
  }

  saveCustomer(customerRequest: CustomerRequest): void {
    this.isSavingCustomerState.set(true);
    const customerBeingEdited = this.editingCustomerState();
    const saveRequest = customerBeingEdited
      ? this.customerService.updateCustomer(customerBeingEdited.customerId, customerRequest)
      : this.customerService.createCustomer(customerRequest);

    saveRequest
      .pipe(
        switchMap(() => this.customerService.getCustomers()),
        finalize(() => this.isSavingCustomerState.set(false)),
      )
      .subscribe({
        next: (customers) => {
          this.setCustomers(customers);
          this.clearFormState();
          this.toastService.success(
            customerBeingEdited ? 'Customer updated successfully' : 'Customer created successfully',
          );
        },
        error: (error: unknown) => {
          this.toastService.error(
            this.getApiErrorMessage(error, 'Unable to save customer. Please try again later.'),
          );
        },
      });
  }

  cancelForm(): void {
    this.clearFormState();
  }

  requestDeleteCustomer(customer: Customer): void {
    this.customerPendingDeleteState.set(customer);
  }

  cancelDeleteCustomer(): void {
    if (!this.isDeletingCustomerState()) {
      this.customerPendingDeleteState.set(null);
    }
  }

  confirmDeleteCustomer(): void {
    const customerToDelete = this.customerPendingDeleteState();

    if (!customerToDelete) {
      return;
    }

    this.isDeletingCustomerState.set(true);

    this.customerService
      .deleteCustomer(customerToDelete.customerId)
      .pipe(
        switchMap(() => this.customerService.getCustomers()),
        finalize(() => this.isDeletingCustomerState.set(false)),
      )
      .subscribe({
        next: (customers) => {
          this.setCustomers(customers);
          this.customerPendingDeleteState.set(null);

          if (this.editingCustomerState()?.customerId === customerToDelete.customerId) {
            this.clearFormState();
          }

          this.toastService.success('Customer deleted successfully');
        },
        error: (error: unknown) => {
          this.toastService.error(
            this.getApiErrorMessage(error, 'Unable to delete customer. Please try again later.'),
          );
        },
      });
  }

  private scrollToForm(): void {
    window.setTimeout(() => {
      this.formSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.customerFormComponent?.focusFirstField();
    });
  }

  private clearFormState(): void {
    this.editingCustomerState.set(null);
    this.formResetCounterState.update((counter) => counter + 1);
  }

  private setCustomers(customers: Customer[]): void {
    this.customersState.set([...customers]);
  }

  private getApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallbackMessage;
    }

    if (error.status === 0) {
      return 'Unable to connect to the server. Please try again later.';
    }

    const serverMessage = this.extractServerMessage(error.error);

    if (serverMessage) {
      return serverMessage;
    }

    if (error.status === 409) {
      return 'A customer with this email already exists.';
    }

    return fallbackMessage;
  }

  private extractServerMessage(payload: unknown): string | null {
    if (typeof payload === 'string' && payload.trim().length > 0) {
      return payload;
    }

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const response = payload as Partial<Record<'message' | 'error' | 'detail', unknown>>;
    const message = response.message ?? response.error ?? response.detail;

    return typeof message === 'string' && message.trim().length > 0 ? message : null;
  }
}
