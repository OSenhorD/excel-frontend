import { Injectable } from "@angular/core"

interface ILiterals {
  required: string
  pattern: string
  max: string
  min: string
  minlength: string
  maxlength: string
  minDate: string
  maxDate: string
}

@Injectable({
  providedIn: "root",
})

export class ErrorsService {
  private _literals: ILiterals = {
    required: "Campo obrigatório",
    pattern: "Campo não está dentro do padrão",
    min: "Valor mínimo de {1}",
    max: "Valor máximo de {1}",
    minlength: "Comprimento mínimo de {1} caracteres",
    maxlength: "Comprimento máximo de {1} caracteres",
    minDate: "Escolha uma data maior ou igual a {1}",
    maxDate: "Escolha uma data menor ou igual a {1}",
  }

  /**
   * Retorna uma mensagem padrão de exibição de erro
   *
   * @param error
   * @example
   * {
   *   required: true,
   *   minlength: { requiredLength: 3, actualLength: 1 }
   * }
   *
   * @returns
   */
  showError = (error: any): string => {
    console.log(error)
    if (!error) return this._literals.required

    switch (Object.keys(error)[0]) {
      case "pattern":
        return this._literals.pattern
      case "max":
        return this._literals.max.replace("{1}", error.max.max)
      case "min":
        return this._literals.min.replace("{1}", error.min.min)
      case "minlength":
        return this._literals.minlength.replace("{1}", error.minlength.requiredLength)
      case "maxlength":
        return this._literals.maxlength.replace("{1}", error.maxlength.requiredLength)
      case "minDate":
        return this._literals.minDate.replace("{1}", error.minDate.date)
      case "maxDate":
        return this._literals.maxDate.replace("{1}", error.maxDate.date)
      default:
        return this._literals.required
    }
  }
}
