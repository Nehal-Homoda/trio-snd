
export interface OrderOptionsResponse {
    data: OrderOption[]
    success: boolean
    meta: Meta
}

export interface OrderOption {
    id: number
    name: string
    type: string
    is_required: boolean
    appearance_in_orders: boolean
    values: OrderOptionValue[]
    placeholder: string
}

export interface OrderOptionValue {
    id: number
    name: string
    has_number: boolean
}

export interface Meta {
    message: any
}
