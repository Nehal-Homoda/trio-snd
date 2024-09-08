export interface AuthResponse {
    data: User
    success: boolean
    meta: Meta
}

export interface User {
    id: number
    name: string
    phone_number: string | null;
    country_code: string
    email: string
    is_active: boolean
    complete_data: boolean
    avatar_path: string | null;
    city: City | null;
    verification_cards: UserVerficationCards | null;
}
export interface UserVerficationCards {
    card_id_front: string
    card_id_back: string
    status: string
}

export interface City {
    id: number
    order: number
    name: string
    lat: string
    lng: string
    is_active_user: boolean
}

export interface Meta {
    message: string
    token: string
    expires_at: string
}
