import { Injectable } from "@angular/core"
import { AbstractControl, ValidationErrors } from "@angular/forms"

interface ILiterals {
  equals: string
}

@Injectable({
  providedIn: "root"
})

export class EqualService {
  private _literals: ILiterals = {
    equals: "O campo \"{1}\" precisa ser igual ao \"{2}\"",
  }

  equals = (first: string, second: string, firstLabel?: string, secondLabel?: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
      const firstValue = control.get(first)?.value
      const secondValue = control.get(second)?.value
      if (!firstValue || !secondValue || secondValue === firstValue) return null

      let error: any = {}
      error[first] = this._literals.equals.replace("{1}", `${firstLabel || first}`).replace("{2}", `${secondLabel || second}`)
      return error
    }
  }
}
