import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  open = input.required<boolean>();
  title = input.required<string>();
  description = input.required<string>();
  confirmText = input('Confirm');
  cancelText = input('Cancel');
  confirmVariant = input<'danger' | 'primary'>('danger');

  confirmed = output<void>();
  cancelled = output<void>();
}
