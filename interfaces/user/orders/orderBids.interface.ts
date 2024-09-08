import type { City, Truck } from "~/interfaces/shared/shared.interface"
import type { UserOrder } from "./order.interface"



export interface orderBids {
    id: number
    price: string
    note: any
    created_at: string
    provider: Provider
    order: UserOrder
    status: string
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
    services: Service[]
    cities: City[]
    Truck?: Truck
}

export interface Service {
    id: number
    name: string
    description?: string
    icon_path: string
    featured: boolean
    type: string
    banners: any[]
}

