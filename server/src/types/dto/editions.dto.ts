export interface EditionDBRecord {
    id: string;
    publisher_id: string;
    author: string;
    title: string;
    price: string;
    copies_sold: number;
    publisher_name?: string;
}
export interface EditionDTO {
    id: string;
    publisherId: string;
    author: string;
    title: string;
    price: string;
    copiesSold: number;
    publisherName?: string;
}

export interface CreateEditionDTO {
    publisherId: string;
    author: string;
    title: string;
    price: string | number;
}

export interface UpdateEditionDTO {
    publisherId?: string;
    author?: string;
    title?: string;
    price?: string | number;
    copiesSold?: number;
}
export const mapEditionToDTO = (row: EditionDBRecord): EditionDTO => ({
    id: row.id,
    publisherId: row.publisher_id,
    author: row.author,
    title: row.title,
    price: row.price,
    copiesSold: row.copies_sold,
    publisherName: row.publisher_name,
});
