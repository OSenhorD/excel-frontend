import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})

export class UtilsService {
  fileSize = (number: number, fixed: number = 1): string => {
    if (number >= 1048576) {
      const value = (number / 1048576).toFixed(fixed)
      return `${value.endsWith(".0") ? value.slice(0, value.length - 2) : value} MB`
    }

    if (number >= 1024) {
      const value = (number / 1024).toFixed(fixed)
      return `${value.endsWith(".0") ? value.slice(0, value.length - 2) : value} KB`
    }

    return `${number} bytes`
  }
}
