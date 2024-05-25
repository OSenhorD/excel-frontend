import { Component, inject } from "@angular/core"

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms"

import { PageListComponent } from "src/app/components/page-list.component"
import { LoadingComponent } from "src/app/components/loading.component"
import { ModalComponent } from "src/app/components/modal.component"
import { ITableAction } from "src/app/components/table-actions.component"
import { ITableColumn } from "src/app/components/table.component"
import { IUploadRestrictions, UploadComponent } from "src/app/components/forms/upload.component"

import { AlertService } from "src/app/services/alert.service"
import { ExcelService } from "src/app/services/excel.service"
import { RestService } from "src/app/services/rest.service"

import { IDataListRes, IListLiterals } from "src/app/interfaces/pages/database/data"

@Component({
  selector: "page-data-list",
  standalone: true,
  templateUrl: "./data-list.component.html",
  imports: [
    ReactiveFormsModule,
    PageListComponent,
    ModalComponent,
    UploadComponent,
    LoadingComponent,
  ],
})

export class DataListComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)
  private readonly _alertService: AlertService = inject(AlertService)
  private readonly _excelService: ExcelService = inject(ExcelService)
  private readonly _restService: RestService = inject(RestService)

  protected items: IDataListRes[] = []

  protected literals: IListLiterals = {
    title: "Dados",
    columns: {
      CODCOLIGADA: "",
      FILIAL_NOME: "",
      ANOCOMP: "",
      MESCOMP: "",
      CHAPA: "",
      NOME: "",
      CODCCUSTO: "",
      COLIGADA_NOME: "",
      CCUSTO: "",
      SITUACAO_NOME: "",
      DATAADMISSAO: "",
      DATADEMISSAO: "",
      EVENTO: "",
      CODCONTADEBITO: "",
      DEBITO: "",
      CLASSIF_FUNCIONARIO: "",
      VALOR: "",
    },
    table: {
      actions: {
        import: {
          label: "Importar",
          loading: "Importando Excel...",
          success: "Relatório importado com sucesso!",
        },
        export: {
          label: "Exportar",
          loading: "Criando Excel...",
          success: "Relatório exportado com sucesso!",
        },
      },
    },
    modal: {
      import: {
        confirm: "Upload",
        cancel: "Cancelar",
        upload: "Selecione o arquivo",
      },
    },
  }

  protected columns: ITableColumn[] = [
    {
      property: "CODCOLIGADA",
      label: this.literals.columns.CODCOLIGADA,
    },
    {
      property: "FILIAL_NOME",
      label: this.literals.columns.FILIAL_NOME,
    },
    {
      property: "ANOCOMP",
      label: this.literals.columns.ANOCOMP,
    },
    {
      property: "MESCOMP",
      label: this.literals.columns.MESCOMP,
    },
    {
      property: "CHAPA",
      label: this.literals.columns.CHAPA,
    },
    {
      property: "NOME",
      label: this.literals.columns.NOME,
    },
    {
      property: "CODCCUSTO",
      label: this.literals.columns.CODCCUSTO,
    },
    {
      property: "COLIGADA_NOME",
      label: this.literals.columns.COLIGADA_NOME,
    },
    {
      property: "CCUSTO",
      label: this.literals.columns.CCUSTO,
    },
    {
      property: "SITUACAO_NOME",
      label: this.literals.columns.SITUACAO_NOME,
    },
    {
      property: "DATAADMISSAO", type: "date",
      label: this.literals.columns.DATAADMISSAO,
    },
    {
      property: "DATADEMISSAO", type: "date",
      label: this.literals.columns.DATADEMISSAO,
    },
    {
      property: "EVENTO",
      label: this.literals.columns.EVENTO,
    },
    {
      property: "CODCONTADEBITO",
      label: this.literals.columns.CODCONTADEBITO,
    },
    {
      property: "DEBITO",
      label: this.literals.columns.DEBITO,
    },
    {
      property: "CLASSIF_FUNCIONARIO",
      label: this.literals.columns.CLASSIF_FUNCIONARIO,
    },
    {
      property: "VALOR",
      label: this.literals.columns.VALOR,
    },
  ]

  protected actions: ITableAction[] = [
    {
      name: "import",
      label: this.literals.table.actions.import.label,
      icon: "fa-solid fa-file-import",
      order: 10,
      class: {
        "bg-cyan-700": true,
        "hover:bg-cyan-800": true,
        "focus:ring-cyan-300": true,
        "dark:bg-cyan-600": true,
        "dark:hover:bg-cyan-700": true,
        "dark:focus:ring-cyan-800": true,
      },
      action: () => {
        this.form.reset()
        this.isShowModalImport = true
      },
    },
    {
      name: "export",
      label: this.literals.table.actions.export.label,
      icon: "fa-solid fa-file-export",
      order: 10,
      class: {
        "bg-green-700": true,
        "hover:bg-green-800": true,
        "focus:ring-green-300": true,
        "dark:bg-green-600": true,
        "dark:hover:bg-green-700": true,
        "dark:focus:ring-green-800": true,
      },
      action: () => this._export(),
    },
  ]

  protected readonly form = this._formBuilder.group(
    {
      excel: new FormControl("", { nonNullable: true }),
    },
  )

  protected isLoadingImport: boolean = false
  protected isLoadingExport: boolean = false
  protected isShowModalImport: boolean = false

  protected readonly fileRestrictions: IUploadRestrictions = {
    maxFileSize: 31457280, // 30mb
    minFileSize: 1,
    allowedExtensions: [".xlsx"],
  }

  protected onImport = () => {
    this.isLoadingImport = true
    const formData = new FormData()
    formData.append("excel", this.form.value.excel || "")

    const headers: { [header: string]: string } = {
      "-Content-Type": "multipart/form-data",
    }

    this._restService
      .post(`/database/data/import`, formData, headers)
      .subscribe({
        next: (result: any) => {
          this.isLoadingImport = false
          this.isShowModalImport = false

          const { label, success } = this.literals.table.actions.import
          this._alertService.success(label, success)
        },
        error: (error: Error) => {
          console.log(error?.message)
          this.isLoadingImport = false
        },
      })
  }

  private _export = async () => {
    this.isLoadingExport = true
    const date = new Date().toISOString().split("T")[0]

    const filename = `Dados ${date}`
    const url = `/database/data/export`

    const excel = await this._excelService.getExcelAsync(url, filename)
    if (!excel) return

    this.isLoadingExport = false

    const { label, success } = this.literals.table.actions.export
    this._alertService.success(label, success)
  }
}
