export type Column<T> = {
    key: keyof T
    header: string
    width?: string
    sortable?: boolean
    render?: (value: any, row: T) => React.ReactNode
  }
  
  export type Filter = {
    key: string
    value: string | number | null
  }
  
  export type RowAction<T> = {
    label: string
    onClick: (row: T) => void
  }
  