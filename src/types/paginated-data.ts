interface PaginateLinks {
    first: string
    last: string
    next: string
    prev: string
}

interface PaginateMeta {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
}

export interface Paginated<T> {
    data: T[]
    links: PaginateLinks
    meta: PaginateMeta
}