export enum OperationTypeEnum {
  Income = 'income',
  Expense = 'expense'
}

export const operationTypeLists: Array<{ code: string, name: string }> = [
  {
    code: OperationTypeEnum.Income,
    name: 'Ingreso'
  },
  {
    code: OperationTypeEnum.Expense,
    name: 'Gasto'
  }
]