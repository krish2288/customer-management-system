import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() isProcessing = false;
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure you want to continue?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    if (!this.isProcessing) {
      this.confirmed.emit();
    }
  }

  cancel(): void {
    if (!this.isProcessing) {
      this.cancelled.emit();
    }
  }
}
