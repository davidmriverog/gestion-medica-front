export interface IOptionList {
  apiUrl: string;
  columns: Array<DataTables.ColumnSettings>;
  pageLength: number;
}

export interface IColumnDatatable {
  data: string;
  width?: number | string;
}

export interface IDataTablesResponse<T> {
  data: Array<T>;
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
