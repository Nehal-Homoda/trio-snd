
export interface Provider 

{
    id:                      number;
    name:                    string;
    phone_number:            string;
    full_phone_number:       string;
    avatar_path:             null | string;
    business_type:           BusinessType;
    company_name:            null | string;
    avg_rate:                number;
    lat:                     null | string;
    lng:                     null | string;
    recieve_orders:          boolean;
    appear_in_direct_orders: boolean;
    joined_at:               Date;
    services:                Service[];
    cities:                  City[];
    Truck:                   null;
}

export enum BusinessType {
    شركه = "شركه",
    فرد = "فرد",
}

export interface City {
    id:             number;
    order:          number;
    name:           string;
    lat:            null | string;
    lng:            null | string;
    is_active_user: boolean;
}

export interface Service {
    id:          number;
    name:        string;
    description: null | string;
    icon_path:   string;
    featured:    boolean;
    type:        Type;
    banners:     any[];
}

export enum Type {
    All = "all",
    Bid = "bid",
}

export interface Links {
    first: string;
    last:  string;
    prev:  null;
    next:  null;
}

export interface Meta {
    current_page: number;
    from:         number;
    last_page:    number;
    links:        Link[];
    path:         string;
    per_page:     number;
    to:           number;
    total:        number;
    message:      null;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
