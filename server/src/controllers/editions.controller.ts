import { EditionsModel } from "@src/models/editions.model";
import { Request, Response } from "express";

export class EditionsController {
    async getEditions(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const author = req.query.author as string;
            const title = req.query.title as string;
            const publisherName = req.query.publisherName as string;
            const sortBy = req.query.sortBy as string;
            const sortOrder = (req.query.sortOrder as string)?.toUpperCase() === "DESC" ? "DESC" : "ASC";

            const data = await EditionsModel.getEditions(limit, offset, { author, title, publisherName, sortBy, sortOrder });
            res.status(200).json(data);
        } catch (e) {
            console.error("Error in getEditions:", e);
            res.status(500).json({ error: "Failed to fetch editions" });
        }
    }

    async createEdition(req: Request, res: Response) {
        try {
            const data = await EditionsModel.createEdition(req.body);
            res.status(201).json(data);
        } catch (e) {
            console.error("Error in createEdition:", e);
            res.status(500).json({ error: "Failed to create edition" });
        }
    }

    async updateEdition(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const payload = req.body;

            if (!payload) {
                res.status(400).json({ error: "Payload is empty" });
                return;
            }

            const data = await EditionsModel.updateEdition(id, payload);

            if (!data) {
                res.status(404).json({ error: "Edition not found" });
                return;
            }
            res.status(200).json(data);
        } catch (e: any) {
            console.error("Error in updateEdition:", e);
            if (e.message === "No fields to update") {
                res.status(400).json({ error: e.message });
                return;
            }
            res.status(500).json({ error: "Failed to update edition" });
        }
    }

    async deleteEdition(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            const data = await EditionsModel.deleteEdition(id);

            if (!data) {
                res.status(404).json({ error: "Edition not found" });
                return;
            }
            res.status(204).send();
        } catch (e) {
            console.error("Error in deleteEdition:", e);
            res.status(500).json({ error: "Failed to delete edition" });
        }
    }
}
