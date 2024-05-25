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
  selector: "form-toggle",
  standalone: true,
  template: `
    <div class="mb-4 h-[80px]">
      <label class="block mt-1 mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label || name }}
      </label>

      <input type="checkbox" id="form_toggle_{{ name }}" class="hidden" />

      <label for="form_toggle_{{ name }}" class="flex mt-4 cursor-pointer">
        <div
          class="w-10 h-6 rounded-full shadow-inner"
          [class.bg-blue-600]="isTrue()"
          [class.bg-gray-400]="!isTrue()"
          (click)="onChange()"
          >
        </div>

        <div
          class="relative w-6 h-6 rounded-full shadow-md bg-white"
          [class.right-[24px]]="isTrue()"
          [class.right-[40px]]="!isTrue()"
          (click)="onChange()"
          >
        </div>
      </label>
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

export class ToggleComponent implements OnInit {
  private readonly _formGroupDirective: FormGroupDirective = inject(FormGroupDirective)
  private readonly _errorsService: ErrorsService = inject(ErrorsService)

  @Input() name: string = ''
  @Input() label: string = ''
  @Input({ transform: booleanAttribute }) readonly: boolean = false

  private _field!: AbstractControl

  ngOnInit(): void {
    this._field = this._formGroupDirective.form.controls[this.name]
  }

  protected isInvalid = (): boolean => this._field?.touched && this._field?.invalid

  protected showError = (): string => this._errorsService.showError(this._field.errors)

  protected isTrue = () => this._field.value == true

  protected onChange = () => {
    if (this.readonly) return

    this._field.setValue(!this.isTrue())
  }
}
