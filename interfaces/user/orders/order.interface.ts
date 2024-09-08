import type { City, Truck } from "~/interfaces/shared/shared.interface"


export interface MakeOrderFormDataItem {
    id: number;
    type: string;
    value: any;
}

export interface UserOrder {
    id: number
    uid: string
    status: string
    rate: boolean
    rate_user: boolean
    target_price: any
    service: UserService
    options: Option[]
    invoice_path: any
    created_at: string
    bids_count: number
    current_provider_lng: any
    current_provider_lat: any
    distance_order: number
    distance_from_to: any
    invoice_images: any[]
    item_images: any[]
    provider: Provider
    accepted_price: null | string;
}
export interface UserOffer {
    id: number
    uid: string
    status: string
    rate: boolean
    rate_user: boolean
    target_price: any
    service: UserService
    options: Option[]
    invoice_path: any
    created_at: string
    bids_count: number
    current_provider_lng: any
    current_provider_lat: any
    distance_order: any
    distance_from_to: any
    invoice_images: any[]
    item_images: any[]
    accepted_price: null | string;
    type: string
    provider: any
}

export interface UserService {
    id: number
    name: any
    description: any
    icon_path: string
    featured: boolean
    type: string
    banners: any[]
}

export interface Option {
    id: number
    name: any
    type: string
    native_value: any
    values: Value[]
}

export interface Value {
    id: number
    name: any
    quantity: any
}

export interface Provider {
    id: number
    name: string
    phone_number: string
    full_phone_number: string
    avatar_path: string
    business_type: string
    company_name: string
    avg_rate: number
    lat: any
    lng: any
    recieve_orders: boolean
    appear_in_direct_orders: boolean
    joined_at: string
    services: ProviderService[]
    cities: City[]
    Truck: Truck
}

export interface ProviderService {
    id: number
    name: any
    description: any
    icon_path: string
    featured: boolean
    type: string
    banners: any[]
}
