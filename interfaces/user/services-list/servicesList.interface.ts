export interface UserServicesListResponse {
    data: UserServicesList[]
    success: boolean
    meta: Meta
  }
  
  export interface UserServicesList {
    id: number
    name: string
    description?: string
    icon_path: string
    featured: boolean
    type: string
    children: any[]
    parent: Parent
    banners: Banner[]
    is_target_price: boolean;
  }
  
  export interface Parent {
    id: number
    name: string
    description: any
    icon_path: string
    featured: boolean
    is_target_price: boolean;
    type: string
    banners: Banner[]
  }
  
  export interface Banner {
    id: number
    name: string
    image_path: string
    action: string
    action_path: string
    service: number
    location: string
    start_from: string
    end_at: string
    show_in_form: boolean
  }
  
  export interface Meta {
    message: any
  }
  