import { Component } from "@angular/core"

import { PageListComponent } from "src/app/components/page-list.component"
import { ITableColumn } from "src/app/components/table.component"

import { IDataListRes, IListLiterals } from "src/app/interfaces/pages/database/data"

@Component({
  selector: "page-data-list",
  standalone: true,
  templateUrl: "./data-list.component.html",
  imports: [
    PageListComponent,
  ],
})

export class DataListComponent {
  protected items: IDataListRes[] = []

  protected literals: IListLiterals = {
    title: "Cadastro de Leads",
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
}
