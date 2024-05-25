import {
  booleanAttribute,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core"

import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms"

import { AlertService } from "src/app/services/alert.service"
import { UtilsService } from "src/app/services/utils.service"
import { ErrorsService } from "src/app/services/validators/errors.service"

export interface IUploadRestrictions {
  minFileSize: number
  maxFileSize: number
  allowedExtensions: string[]
}

interface IUpcloadLiterals {
  maxFileSize: string
  minFileSize: string
  extensionNotAllowed: string
}

@Component({
  selector: "form-upload",
  standalone: true,
  template: `
    <div class="mb-4 h-[80px]">
      <label for="form_file_{{ name }}" class="block mt-1 mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label || name }}
        @if (!readonly && required) {
          <span class="absolute text-base font-medium text-red-500">*</span>
        }
      </label>

      @if (!readonly) {
        <input
          id="form_file_{{ name }}"
          type="file"
          [disabled]="readonly"
          [required]="required"
          [accept]="allowedExtensions"
          class="block w-full p-2 sm:text-sm border rounded-lg cursor-pointer focus:outline-none text-gray-900 border-gray-300 bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          (change)="onFileSelected($event)"
          />

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
          {{ allowedExtensionsFormated }} (MAX: {{ maxFileSizeFormated }})
        </p>
      } @else {
        <input
          id="form_file_{{ name }}"
          type="file"
          disabled
          class="block w-full p-2 sm:text-sm border rounded-lg cursor-pointer focus:outline-none text-gray-900 border-gray-300 bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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

export class UploadComponent implements OnInit {
  private readonly _formGroupDirective: FormGroupDirective = inject(FormGroupDirective)
  private readonly _alertService: AlertService = inject(AlertService)
  private readonly _utilsService: UtilsService = inject(UtilsService)
  private readonly _errorsService: ErrorsService = inject(ErrorsService)

  @Input() name: string = ''
  @Input() label: string = ''
  @Input({ transform: booleanAttribute }) required: boolean = false
  @Input({ transform: booleanAttribute }) readonly: boolean = false

  @Input({ transform: transformRestrictions }) restrictions: IUploadRestrictions = {
    maxFileSize: 1048576,
    minFileSize: 0,
    allowedExtensions: [".png", ".jpg", ".jpeg"],
  }

  @Output("on-upload") protected onUploadEvent = new EventEmitter<File>()

  protected literals: IUpcloadLiterals = {
    maxFileSize: "Tamanho máximo {1}",
    minFileSize: "Tamanho mínimo {1}",
    extensionNotAllowed: "Extensão do arquivo não permitida",
  }

  private _field!: AbstractControl

  ngOnInit(): void {
    this._field = this._formGroupDirective.form.controls[this.name]
  }

  protected get allowedExtensions(): string {
    return this.restrictions.allowedExtensions.join(",")
  }

  protected get allowedExtensionsFormated(): string {
    return this.allowedExtensions.toUpperCase().replaceAll(".", "").replaceAll(",", ", ")
  }

  protected get maxFileSizeFormated(): string {
    return this._utilsService.fileSize(this.restrictions.maxFileSize)
  }

  protected isInvalid = (): boolean => this._field?.touched && this._field?.invalid

  protected showError = (): string => this._errorsService.showError(this._field.errors)

  protected onFileSelected = (event: Event): void => {
    const inputElement = event.target as HTMLInputElement
    if (!inputElement.files || inputElement.files.length == 0) return

    const extension = inputElement.files[0].name.split(".").reverse()[0]
    if (!this.restrictions.allowedExtensions.includes(`.${extension}`)) {
      this._alertService.warning(this.literals.extensionNotAllowed)
      return
    }

    if (inputElement.files[0].size > this.restrictions.maxFileSize) {
      this._alertService.warning(this.literals.maxFileSize.replace("{1}", this._utilsService.fileSize(this.restrictions.maxFileSize)))
      return
    }

    if (inputElement.files[0].size < this.restrictions.minFileSize) {
      this._alertService.warning(this.literals.minFileSize.replace("{1}", this._utilsService.fileSize(this.restrictions.minFileSize)))
      return
    }

    this.onUploadEvent.emit(inputElement.files[0])
    this._field.setValue(inputElement.files[0], { emitEvent: false })
  }
}

function transformRestrictions(restrictions?: IUploadRestrictions): IUploadRestrictions {
  return {
    maxFileSize: restrictions?.maxFileSize || 1048576,
    minFileSize: restrictions?.minFileSize || 0,
    allowedExtensions: Array.isArray(restrictions?.allowedExtensions) ? restrictions?.allowedExtensions as string[] : [".png", ".jpg", ".jpeg"],
  }
}
