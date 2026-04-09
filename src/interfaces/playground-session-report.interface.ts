export interface PlaygroundSessionReportView {
    registrationNumber: string
    parentName: string
    parentPhone: string
    childName: string
    code: string
    duration: number
    endTime: string
}

export interface PlaygroundSessionReportSearch {
    registrationNumber: string
    page: number
    size: number
}