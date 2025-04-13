import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgxFwContent, NgxFwFormComponent } from '../../../../lib';
import { FormService } from '../../../../lib/services/form.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngxfw-form-integration-host',
  imports: [ReactiveFormsModule, NgxFwFormComponent],
  templateUrl: './form-integration-host.component.html',
  providers: [FormService],
})
export class FormIntegrationHostComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly formContent = input.required<NgxFwContent[]>();
  readonly autoUpdate = input<boolean>(false);
  readonly formValues = signal<{ path: string; value: unknown }[]>([]);

  form = this.formBuilder.group({});

  constructor() {
    this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (!this.autoUpdate()) {
        return;
      }
      this.onSubmit();
    });
  }

  reset() {
    this.form.reset();
  }

  patchValue() {
    this.form.patchValue({
      first: 'patched-first',
      second: 'patched-second',
      third: 'patched-third',
      fourth: 'patched-fourth',
      fifth: 'patched-fifth',
    });
  }

  onSubmit() {
    const formValue = this.form.getRawValue();
    const result = this.flattenFormValues(formValue);
    this.formValues.set(result);
  }

  flattenFormValues(
    obj: object,
    parentPath = '',
  ): { path: string; value: unknown }[] {
    let result: { path: string; value: unknown }[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      const path = parentPath ? `${parentPath}.${key}` : key;

      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        result = result.concat(this.flattenFormValues(value as object, path));
        return;
      }

      result.push({ path, value });
    });

    return result;
  }
}
