interface IDataDTO {
  id: string
  CODCOLIGADA: string
  FILIAL_NOME: string
  ANOCOMP: number
  MESCOMP: number
  CHAPA: string
  NOME: string
  CODCCUSTO: string
  COLIGADA_NOME: string
  CCUSTO: string
  SITUACAO_NOME: string
  DATAADMISSAO: Date
  DATADEMISSAO: Date
  EVENTO: string
  CODCONTADEBITO: string
  DEBITO: string
  CLASSIF_FUNCIONARIO: string
  VALOR: number
}

export interface IDataListRes {
  id: string
  CODCOLIGADA: string
  FILIAL_NOME: string
  ANOCOMP: number
  MESCOMP: number
  CHAPA: string
  NOME: string
  CODCCUSTO: string
  COLIGADA_NOME: string
  CCUSTO: string
  SITUACAO_NOME: string
  DATAADMISSAO: Date
  DATADEMISSAO: Date
  EVENTO: string
  CODCONTADEBITO: string
  DEBITO: string
  CLASSIF_FUNCIONARIO: string
  VALOR: number
}

export interface IListLiterals {
  title: string
  columns: {
    CODCOLIGADA: string
    FILIAL_NOME: string
    ANOCOMP: string
    MESCOMP: string
    CHAPA: string
    NOME: string
    CODCCUSTO: string
    COLIGADA_NOME: string
    CCUSTO: string
    SITUACAO_NOME: string
    DATAADMISSAO: string
    DATADEMISSAO: string
    EVENTO: string
    CODCONTADEBITO: string
    DEBITO: string
    CLASSIF_FUNCIONARIO: string
    VALOR: string
  }
  table: {
    actions: {
      import: {
        label: string
        success: string
      }
      export: {
        label: string
        success: string
      }
    }
  }
  modal: {
    import: {
      confirm: string
      cancel: string
      upload: string
    }
  }
}
