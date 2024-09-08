


export interface ResponseError {
    error: ErrorSchema
    success: boolean
}

export interface ErrorSchema {
    message: string
    status_code: number
    code: any
    payload: ErrorSchemaPayload
}

export interface ErrorSchemaPayload {
    status: string
    type: string
    page: string
}




export interface ResponseData<T> {
    data: T[]
    links: Links
    meta: Meta
    success: boolean
}
export interface ResponseWithValue<T> {
    data: T
    success: boolean
    meta: {
        message: string;
    }
}


export interface Links {
    first: string
    last: string
    prev: any
    next: any
}

export interface Meta {
    current_page: number
    from: number
    last_page: number
    links: Link[]
    path: string
    per_page: number
    to: number
    total: number
    message: any
}

export interface Link {
    url?: string
    label: string
    active: boolean
}