export interface UserBannerResponse {
    data: UserBanner[]
    success: boolean
    meta: Meta
}

export interface UserBanner {
    id: number
    name: string
    image_path: string
    action: string
    action_path: string
    service: any
    location: string
    start_from: string
    end_at: string
    show_in_form: boolean
    description: string | null
}

export interface Meta {
    message: any
}
