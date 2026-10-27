import { type Fields } from "@shared/types";

export interface Publisher {
    id: string;
    publisherName: string;
    contractStartDate: string;
    contractEndDate: string;
    totalTurnover: string;
    totalBooks: number;
}

export const PublisherFields: Fields<Publisher> = {
    id: "id",
    publisherName: "publisherName",
    contractStartDate: "contractStartDate",
    contractEndDate: "contractEndDate",
    totalTurnover: "totalTurnover",
    totalBooks: "totalBooks",
};
