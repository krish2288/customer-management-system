import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Customer, StatusFilter } from '../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.html',
})
export class CustomerListComponent implements OnChanges {
  @Input() customers: Customer[] = [];
  @Input() loading = false;
  @Input() refreshing = false;

  @Output() editCustomer = new EventEmitter<Customer>();
  @Output() deleteCustomer = new EventEmitter<Customer>();
  @Output() refreshCustomers = new EventEmitter<void>();

  readonly itemsPerPage = 10;
  searchQuery = '';
  statusFilter: StatusFilter = 'ALL';
  currentPage = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customers']) {
      this.normalizeCurrentPage();
    }
  }

  get filteredCustomers(): Customer[] {
    const query = this.searchQuery.trim().toLowerCase();

    return this.customers.filter((customer) => {
      const statusMatches = this.statusFilter === 'ALL' || customer.status === this.statusFilter;

      if (!statusMatches) {
        return false;
      }

      if (!query) {
        return true;
      }

      const fullName = `${customer.firstName} ${customer.lastName}`;
      const searchableValues = [
        customer.customerId,
        customer.firstName,
        customer.lastName,
        fullName,
        customer.email,
        customer.mobileNumber,
        customer.city,
        customer.state,
      ];

      return searchableValues.some((value) => value.toLowerCase().includes(query));
    });
  }

  get paginatedCustomers(): Customer[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCustomers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalEntries(): number {
    return this.filteredCustomers.length;
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get showingStart(): number {
    return this.totalEntries === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showingEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalEntries);
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
  }

  onStatusFilterChange(event: Event): void {
    const selectedStatus = (event.target as HTMLSelectElement).value;

    if (selectedStatus === 'ALL' || selectedStatus === 'ACTIVE' || selectedStatus === 'INACTIVE') {
      this.statusFilter = selectedStatus;
      this.currentPage = 1;
    }
  }

  refresh(): void {
    this.refreshCustomers.emit();
  }

  edit(customer: Customer): void {
    this.editCustomer.emit(customer);
  }

  delete(customer: Customer): void {
    this.deleteCustomer.emit(customer);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getCustomerName(customer: Customer): string {
    return `${customer.firstName} ${customer.lastName}`;
  }

  private normalizeCurrentPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }
}
