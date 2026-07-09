import { Component, Signal } from '@angular/core';

import { ToastMessage, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
})
export class ToastComponent {
  readonly messages: Signal<ToastMessage[]>;

  constructor(private readonly toastService: ToastService) {
    this.messages = this.toastService.messages;
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}
