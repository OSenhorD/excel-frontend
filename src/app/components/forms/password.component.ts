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
  selector: "form-password",
  standalone: true,
  template: `
    <div class="mb-4 h-[80px]">
      <label for="form_password_{{ name }}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label || name }}
        @if (!readonly && required) {
          <span class="absolute text-base font-medium text-red-500">*</span>
        }
      </label>

      @if (!readonly) {
        <input
          id="form_password_{{ name }}"
          type="password"
          [formControlName]="name"
          [required]="required"
          [placeholder]="placeholder"
          [minlength]="minlength"
          [maxlength]="maxlength"
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
          id="form_password_{{ name }}"
          type="password"
          [formControlName]="name"
          readonly
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

export class PasswordComponent implements OnInit {
  private readonly _formGroupDirective: FormGroupDirective = inject(FormGroupDirective)
  private readonly _errorsService: ErrorsService = inject(ErrorsService)

  @Input() name: string = ''
  @Input() label: string = ''
  @Input({ transform: booleanAttribute }) required: boolean = false
  @Input({ transform: booleanAttribute }) readonly: boolean = false
  @Input() minlength!: number
  @Input() maxlength!: number
  @Input() placeholder: string = ''

  private _field!: AbstractControl

  ngOnInit(): void {
    this._field = this._formGroupDirective.form.controls[this.name]
  }

  protected isInvalid = (): boolean => this._field?.touched && this._field?.invalid

  protected showError = (): string => this._errorsService.showError(this._field.errors)
}
