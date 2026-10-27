import { CreateEditionDTO, EditionDBRecord, EditionDTO, mapEditionToDTO, UpdateEditionDTO } from "@src/types/dto/editions.dto";
import { db, Tables } from "../db";

export class EditionsModel {
    static async getEditions(
        limit: number,
        offset: number,
        filters?: { author?: string; title?: string; publisherName?: string; sortBy?: string; sortOrder?: "ASC" | "DESC" },
    ): Promise<EditionDTO[]> {
        try {
            const conditions: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (filters?.author) {
                conditions.push(`editions.author ILIKE $${paramIndex++}`);
                values.push(`%${filters.author}%`);
            }
            if (filters?.title) {
                conditions.push(`editions.title ILIKE $${paramIndex++}`);
                values.push(`%${filters.title}%`);
            }
            if (filters?.publisherName) {
                conditions.push(`publishers.publisher_name ILIKE $${paramIndex++}`);
                values.push(`%${filters.publisherName}%`);
            }

            let query = `
                SELECT 
                    editions.id,
                    editions.publisher_id,
                    editions.author,
                    editions.title,
                    editions.price,
                    editions.copies_sold,
                    publishers.publisher_name AS publisher_name
                FROM ${Tables.editions} editions
                LEFT JOIN ${Tables.publishers} publishers ON editions.publisher_id = publishers.id
            `;

            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(" AND ");
            }

            const validEditionSortColumns: Record<string, string> = {
                title: "editions.title",
                author: "editions.author",
                publisherName: "publishers.publisher_name",
                price: "editions.price",
                copiesSold: "editions.copies_sold",
            };

            if (filters?.sortBy && validEditionSortColumns[filters.sortBy]) {
                const col = validEditionSortColumns[filters.sortBy];
                const dir = filters.sortOrder === "DESC" ? "DESC" : "ASC";
                query += ` ORDER BY ${col} ${dir}`;
            } else {
                query += ` ORDER BY editions.title ASC`;
            }

            query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++};`;
            values.push(limit, offset);

            const data: EditionDBRecord[] = await db.any(query, values);
            return data.map(mapEditionToDTO);
        } catch (e) {
            throw e;
        }
    }

    static async createEdition(payload: CreateEditionDTO): Promise<EditionDTO> {
        try {
            const data = await db.one(
                `
                INSERT INTO ${Tables.editions}
                    (publisher_id, author, title, price)
                VALUES 
                    ($<publisherId>, $<author>, $<title>, $<price>)
                RETURNING *;
                `,
                payload,
            );
            return mapEditionToDTO(data);
        } catch (e) {
            throw e;
        }
    }

    static async updateEdition(id: string, payload: UpdateEditionDTO): Promise<EditionDTO> {
        const setPayload = [
            payload.publisherId ? `publisher_id = $<publisherId>` : null,
            payload.author ? `author = $<author>` : null,
            payload.title ? `title = $<title>` : null,
            payload.price !== undefined ? `price = $<price>` : null,
            payload.copiesSold !== undefined ? `copies_sold = $<copiesSold>` : null,
        ]
            .filter((el) => el)
            .join(", ");

        if (!setPayload) {
            throw new Error("No fields to update");
        }

        const data = await db.one(
            `
            UPDATE ${Tables.editions}
            SET ${setPayload}
            WHERE id=$<id>
            RETURNING *;
            `,
            { ...payload, id },
        );

        return mapEditionToDTO(data);
    }

    static async deleteEdition(id: string): Promise<boolean> {
        try {
            const result = await db.result(
                `
                DELETE FROM ${Tables.editions}
                WHERE id=$<id>;
                `,
                { id },
            );
            return result.rowCount > 0;
        } catch (e) {
            throw e;
        }
    }
}
