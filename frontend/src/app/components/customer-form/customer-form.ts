import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Customer, CustomerRequest, CustomerStatus } from '../../models/customer.model';

type CustomerFormControls = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  mobileNumber: FormControl<string>;
  dateOfBirth: FormControl<string>;
  gender: FormControl<string>;
  address: FormControl<string>;
  city: FormControl<string>;
  state: FormControl<string>;
  pincode: FormControl<string>;
  status: FormControl<CustomerStatus>;
};

type CustomerFormField = keyof CustomerFormControls;

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-form.html',
})
export class CustomerFormComponent implements OnChanges {
  @Input() customer: Customer | null = null;
  @Input() isSaving = false;
  @Input() resetCounter = 0;

  @Output() saveCustomer = new EventEmitter<CustomerRequest>();
  @Output() cancelCustomer = new EventEmitter<void>();

  @ViewChild('firstNameInput') private firstNameInput?: ElementRef<HTMLInputElement>;

  readonly genderOptions = ['Male', 'Female', 'Other'];
  readonly statusOptions: CustomerStatus[] = ['ACTIVE', 'INACTIVE'];
  readonly indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  readonly customerForm: FormGroup<CustomerFormControls>;
  submitted = false;

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      dateOfBirth: ['', [Validators.required, this.minimumAgeValidator(18)]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.maxLength(250)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      status: this.formBuilder.control<CustomerStatus>('ACTIVE', [Validators.required]),
    });
  }

  get isEditMode(): boolean {
    return this.customer !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer']) {
      if (this.customer) {
        this.patchForm(this.customer);
      } else {
        this.resetForm();
      }
    }

    if (changes['resetCounter'] && !changes['resetCounter'].firstChange) {
      this.resetForm();
    }
  }

  submitForm(): void {
    this.submitted = true;

    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.saveCustomer.emit(this.toCustomerRequest());
  }

  resetForm(): void {
    this.customerForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      status: 'ACTIVE',
    });
    this.customerForm.markAsPristine();
    this.customerForm.markAsUntouched();
    this.submitted = false;
  }

  cancelForm(): void {
    this.cancelCustomer.emit();
  }

  focusFirstField(): void {
    window.setTimeout(() => {
      this.firstNameInput?.nativeElement.focus();
    });
  }

  isFieldInvalid(field: CustomerFormField): boolean {
    const control = this.customerForm.controls[field];
    return control.invalid && (control.touched || this.submitted);
  }

  getErrorMessage(field: CustomerFormField): string {
    const errors = this.customerForm.controls[field].errors;

    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return this.requiredMessage(field);
    }

    if (errors['email']) {
      return 'Valid email is required';
    }

    if (errors['pattern']) {
      if (field === 'mobileNumber') {
        return 'Valid 10 digit mobile number required';
      }

      if (field === 'pincode') {
        return 'Valid 6 digit pincode required';
      }
    }

    if (errors['minlength']) {
      return this.minLengthMessage(field);
    }

    if (errors['maxlength']) {
      return this.maxLengthMessage(field);
    }

    if (errors['minimumAge']) {
      return 'Customer must be at least 18 years old';
    }

    if (errors['invalidDate']) {
      return 'Valid date of birth is required';
    }

    return 'Invalid value';
  }

  private patchForm(customer: Customer): void {
    this.customerForm.reset({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      mobileNumber: customer.mobileNumber,
      dateOfBirth: customer.dateOfBirth,
      gender: customer.gender,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      status: customer.status,
    });
    this.customerForm.markAsPristine();
    this.customerForm.markAsUntouched();
    this.submitted = false;
  }

  private toCustomerRequest(): CustomerRequest {
    const formValue = this.customerForm.getRawValue();

    return {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim(),
      mobileNumber: formValue.mobileNumber.trim(),
      dateOfBirth: formValue.dateOfBirth,
      gender: formValue.gender,
      address: formValue.address.trim(),
      city: formValue.city.trim(),
      state: formValue.state,
      pincode: formValue.pincode.trim(),
      status: this.isEditMode ? formValue.status : 'ACTIVE',
    };
  }

  private minimumAgeValidator(minimumAge: number): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(`${control.value}T00:00:00`);

      if (Number.isNaN(birthDate.getTime())) {
        return { invalidDate: true };
      }

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      const birthdayNotReached =
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate());

      if (birthdayNotReached) {
        age -= 1;
      }

      return age >= minimumAge ? null : { minimumAge: { requiredAge: minimumAge } };
    };
  }

  private requiredMessage(field: CustomerFormField): string {
    const messages: Record<CustomerFormField, string> = {
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Valid email is required',
      mobileNumber: 'Valid 10 digit mobile number required',
      dateOfBirth: 'Date of birth is required',
      gender: 'Please select gender',
      address: 'Address is required',
      city: 'City is required',
      state: 'State is required',
      pincode: 'Valid 6 digit pincode required',
      status: 'Status is required',
    };

    return messages[field];
  }

  private minLengthMessage(field: CustomerFormField): string {
    const messages: Partial<Record<CustomerFormField, string>> = {
      firstName: 'First name must be at least 2 characters',
      lastName: 'Last name must be at least 2 characters',
      city: 'City must be at least 2 characters',
    };

    return messages[field] ?? 'Value is too short';
  }

  private maxLengthMessage(field: CustomerFormField): string {
    const messages: Partial<Record<CustomerFormField, string>> = {
      firstName: 'First name cannot exceed 50 characters',
      lastName: 'Last name cannot exceed 50 characters',
      address: 'Address cannot exceed 250 characters',
      city: 'City cannot exceed 50 characters',
    };

    return messages[field] ?? 'Value is too long';
  }
}
