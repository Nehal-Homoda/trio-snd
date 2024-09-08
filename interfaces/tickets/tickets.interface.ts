


export interface Ticket {
    id: number
    title: string
    body: string
    service: string
    check_status:string
    date: string
    status: string
    type: string
    messages: TicketMessage[]
}


export interface TicketMessage {
    id: number
    owner: string
    message: string
}
