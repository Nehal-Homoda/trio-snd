export interface ProviderOrderStatisticsResponse {
    data: ProviderOrderStatistics
    success: boolean
}

export interface ProviderOrderStatistics {
    fresh: number
    sent: number
    scheduled: number
    cancelled: number
    active: number
    completed: number
    direct: number
    [key: string]: number
}
