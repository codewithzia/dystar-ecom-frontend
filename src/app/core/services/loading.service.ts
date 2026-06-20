import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = signal(0);
  loading = computed(() => this.counter() > 0);

  show(): void {
    this.counter.update(c => c + 1);
  }

  hide(): void {
    this.counter.update(c => Math.max(0, c - 1));
  }
}
