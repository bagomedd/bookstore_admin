import { CreatePublisherDTO, mapPublisherToDTO, PublisherDBRecord, PublisherDTO, UpdatePublisherDTO } from "@src/types/dto/publisher.dto";
import { db, Tables } from "../db";

export class PublishersModel {
    static async getPublishers(
        limit: number,
        offset: number,
        filters?: { publisherName?: string; sortBy?: string; sortOrder?: "ASC" | "DESC" },
    ): Promise<PublisherDTO[]> {
        try {
            const conditions: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (filters?.publisherName) {
                conditions.push(`publisher_name ILIKE $${paramIndex++}`);
                values.push(`%${filters.publisherName}%`);
            }

            let query = `SELECT * FROM ${Tables.publishers}`;
            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(" AND ");
            }

            const validPublisherSortColumns: Record<string, string> = {
                publisherName: "publisher_name",
                contractStartDate: "contract_start_date",
                contractEndDate: "contract_end_date",
                totalBooks: "total_books",
                totalTurnover: "total_turnover",
            };

            if (filters?.sortBy && validPublisherSortColumns[filters.sortBy]) {
                const col = validPublisherSortColumns[filters.sortBy];
                const dir = filters.sortOrder === "DESC" ? "DESC" : "ASC";
                query += ` ORDER BY ${col} ${dir}`;
            } else {
                query += ` ORDER BY publisher_name ASC`;
            }

            query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++};`;
            values.push(limit, offset);

            const data: PublisherDBRecord[] = await db.any(query, values);
            const dataDTO: PublisherDTO[] = data.map(mapPublisherToDTO);
            return dataDTO;
        } catch (e) {
            throw e;
        }
    }
    static async createPublisher(payload: CreatePublisherDTO): Promise<PublisherDTO> {
        try {
            const data = await db.one(
                `
                INSERT INTO ${Tables.publishers}
                    (publisher_name, contract_start_date, contract_end_date, total_turnover)
                VALUES 
                    ($<publisherName>, $<contractStartDate>, $<contractEndDate>, COALESCE($<totalTurnover>, 0.00))
                RETURNING *;
                `,
                payload,
            );
            const dataDTO = mapPublisherToDTO(data);
            return dataDTO;
        } catch (e) {
            throw e;
        }
    }
    static async updatePublisher(id: string, payload: UpdatePublisherDTO): Promise<PublisherDTO> {
        const setPayload = [
            payload.publisherName ? `publisher_name = $<publisherName>` : null,
            payload.contractStartDate ? `contract_start_date = $<contractStartDate>` : null,
            payload.contractEndDate ? `contract_end_date = $<contractEndDate>` : null,
            payload.totalTurnover !== undefined ? `total_turnover = $<totalTurnover>` : null,
        ]
            .filter((el) => el)
            .join(", ");

        const data = await db.one(
            `
            UPDATE ${Tables.publishers}
            SET ${setPayload}
            WHERE id=$<id>
            RETURNING *;
            `,
            { ...payload, id: id },
        );

        const dataDTO = mapPublisherToDTO(data);
        return dataDTO;
    }

    static async deletePublisher(id: string): Promise<boolean> {
        try {
            const result = await db.result(
                `
            DELETE FROM ${Tables.publishers}
            WHERE id=$<id>;
            `,
                { id },
            );
            console.log(result);
            return result.rowCount > 0;
        } catch (e) {
            throw e;
        }
    }
}
