import {
  booleanAttribute,
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core"

import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms"

import { ErrorsService } from "src/app/services/validators/errors.service"

@Component({
  selector: "form-cnpj",
  standalone: true,
  template: `
    <div class="mb-4 h-[80px]">
      <label for="form_cnpj_{{ name }}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label || name }}
        @if (!readonly && required) {
          <span class="absolute text-base font-medium text-red-500">*</span>
        }
      </label>

      @if (!readonly) {
        <input
          id="form_cnpj_{{ name }}"
          type="text"
          [formControlName]="name"
          [required]="required"
          [placeholder]="placeholder"
          [minlength]="18"
          [maxlength]="18"
          (ngModelChange)="onChange($event)"
          class="block w-full p-2.5 sm:text-sm rounded-lg border bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          [class.border-red-300]="isInvalid()"
          [class.dark:border-red-600]="isInvalid()"
          />

        @if (isInvalid()) {
          <p class="mt-2 text-sm text-red-600 dark:text-red-500">
            <span class="font-medium">Oops!</span>
            {{ showError() }}
          </p>
        }
      } @else {
        <input
          id="form_cnpj_{{ name }}"
          type="text"
          [formControlName]="name"
          readonly
          [placeholder]="placeholder"
          class="block w-full p-2.5 sm:text-sm rounded-lg border bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
      }
    </div>
  `,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})

export class CnpjComponent implements OnInit {
  private readonly _formGroupDirective: FormGroupDirective = inject(FormGroupDirective)
  private readonly _errorsService: ErrorsService = inject(ErrorsService)

  @Input() name: string = ''
  @Input() label: string = ''
  @Input({ transform: booleanAttribute }) required: boolean = false
  @Input({ transform: booleanAttribute }) readonly: boolean = false
  @Input() placeholder: string = ''
  @Input() pattern: string = ''

  private _field!: AbstractControl

  ngOnInit(): void {
    this._field = this._formGroupDirective.form.controls[this.name]
  }

  protected isInvalid = (): boolean => this._field?.touched && this._field?.invalid

  protected showError = (): string => this._errorsService.showError(this._field.errors)

  protected onChange = (value: string): void => {
    const newValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    this._field.setValue(newValue, { emitEvent: false })
  }
}
