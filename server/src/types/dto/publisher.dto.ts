export interface PublisherDBRecord {
    id: string;
    publisher_name: string;
    contract_start_date: Date;
    contract_end_date: Date;
    total_turnover: string;
    total_books: number;
}

export interface PublisherDTO {
    id: string;
    publisherName: string;
    contractStartDate: string;
    contractEndDate: string;
    totalTurnover: string;
    totalBooks: number;
}

export interface CreatePublisherDTO {
    publisherName: string;
    contractStartDate: string;
    contractEndDate: string;
    totalTurnover?: string | number;
}

export interface UpdatePublisherDTO {
    publisherName?: string;
    contractStartDate?: string;
    contractEndDate?: string;
    totalTurnover?: string | number;
}

export const mapPublisherToDTO = (row: PublisherDBRecord): PublisherDTO => ({
    id: row.id,
    publisherName: row.publisher_name,
    contractStartDate: row.contract_start_date.toISOString().split("T")[0],
    contractEndDate: row.contract_end_date.toISOString().split("T")[0],
    totalTurnover: row.total_turnover,
    totalBooks: row.total_books,
});
