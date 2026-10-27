import { type Fields } from "@shared/types";

export interface Edition {
    id: string;
    publisherId: string;
    author: string;
    title: string;
    price: string;
    copiesSold: number;
    publisherName?: string;
}

export const EditionFields: Fields<Edition> = {
    id: "id",
    publisherId: "publisherId",
    author: "author",
    title: "title",
    price: "price",
    copiesSold: "copiesSold",
    publisherName: "publisherName",
};
