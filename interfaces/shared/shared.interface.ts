

export type OrderType = 'bidding' | 'all';

export interface Country {
    id: number
    name: string
    slug: string
    country_code: string
    cities: City[]
}
export interface currency {
    id: number
    name: string
    slug: string
}


export interface City {
    country: string
    id: number
    country_id:number
    country_name:string
    order: number
    name: string
    lat?: string
    lng?: string
    is_active_user: boolean
}


export interface Truck {
    id: number
    type: string
    brand: string
    model: string
    size: string
    accessories: string
    provider: string
}

export interface MapAddress {
    title: string;
    lat: string;
    lng: string;
}

export interface StatisticsResponse {
    data: Statistics
    success: boolean
}

export interface Statistics {
    users_count: number
    providers_count: number
    orders_count: number
    [key: string]: number;
}


