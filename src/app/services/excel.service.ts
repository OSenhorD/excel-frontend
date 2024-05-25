import { inject, Injectable } from "@angular/core"

import { RestService } from "src/app/services/rest.service"

import { HttpResponse } from "src/app/interfaces/shared/http"

@Injectable({
  providedIn: "root"
})

export class ExcelService {
  private readonly _restService: RestService = inject(RestService)

  getExcel(url: string, filename: string) {
    return this._restService.get(`${url}`).subscribe({
      next: (res: HttpResponse) => this.createDownload(res?.data || res, filename),
      error: (error: any) => console.error(error),
    })
  }

  getExcelAsync(url: string, filename: string) {
    return new Promise<boolean>((resolve) => {
      this._restService.get(`${url}`).subscribe({
        next: (res: HttpResponse) => {
          this.createDownload(res?.data || res, filename)
          resolve(true)
        },
        error: (error: any) => {
          console.error(error)
          resolve(false)
        },
      })
    })
  }

  postExcel(url: string, filename: string, body: any) {
    return this._restService.post(`${url}`, body).subscribe({
      next: (res: any) => this.createDownload(res?.data || res, filename),
      error: (error: any) => console.error(error),
    })
  }

  uploadExcel(url: string, file: File) {
    const formData = new FormData()
    formData.append("file", file, file.name)

    return this._restService.post(`${url}`, formData)
  }

  createDownload(buffer: any, filename: string) {
    const data = new Uint8Array(buffer?.data || buffer)
    const blob = new Blob([data], { type: "xlsx" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.xlsx`
    link.click()
  }
}
