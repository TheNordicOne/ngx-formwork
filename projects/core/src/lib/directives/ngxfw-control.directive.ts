import { computed, Directive, input } from '@angular/core';
import { NgxFwControl } from '../types/content.type';

@Directive({
  selector: '[ngxfwControl]',
})
export class NgxfwControlDirective<T extends NgxFwControl> {
  readonly content = input.required<T>();
  readonly testId = computed(() => this.content().id);
}
