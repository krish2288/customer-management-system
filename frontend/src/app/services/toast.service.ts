import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 1;
  private readonly toastMessages = signal<ToastMessage[]>([]);

  readonly messages = this.toastMessages.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  remove(id: number): void {
    this.toastMessages.update((messages) => messages.filter((message) => message.id !== id));
  }

  private show(type: ToastType, message: string): void {
    const toast: ToastMessage = {
      id: this.nextId,
      type,
      message,
    };

    this.nextId += 1;
    this.toastMessages.update((messages) => [...messages, toast]);

    window.setTimeout(() => {
      this.remove(toast.id);
    }, 4500);
  }
}
