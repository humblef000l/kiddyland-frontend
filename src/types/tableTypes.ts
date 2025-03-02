export interface TColumn<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: "left" | "center" | "right"
  hide?: boolean
}

export type TSortDirection = "asc" | "desc"

export interface TTableProps<T> {
  data: T[]
  columns: TColumn<T>[]
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  fullWidth?: boolean
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowClassName?: (row: T, index: number) => string | undefined
  cellClassName?: (value: T[keyof T], row: T, columnKey: keyof T) => string | undefined
  pageSize?: number
  defaultSortKey?: keyof T
  defaultSortOrder?: TSortDirection
  onRowClick?: (row: T, index: number) => void
  noDataMessage?: React.ReactNode
  showPagination?: boolean
  initialPage?: number
  onPageChange?: (page: number) => void
  onSort?: (key: keyof T, direction: TSortDirection) => void
  manualSort?: boolean
  manualPagination?: boolean
  totalCount?: number
  loading?: boolean
  loadingComponent?: React.ReactNode
  stickyHeader?: boolean
}