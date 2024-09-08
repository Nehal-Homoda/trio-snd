export interface NotificationResponse {
    data: Notification[]
    links: Links
    meta: Meta
    success: boolean
  }
  
  export interface Notification {
    id: number
    title: string
    body: string
    type: string
    read_at: any
    icon: any
    is_read: boolean
    service_order_id: number
    created_at: string
  }
  
  export interface Links {
    first: string
    last: string
    prev: any
    next: string
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
  