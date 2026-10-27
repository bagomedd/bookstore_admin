import { PublishersModel } from "@src/models/publishers.model";
import { Request, Response } from "express";

export class PublishersController {
    async getPublishers(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const publisherName = req.query.publisherName as string;
            const sortBy = req.query.sortBy as string;
            const sortOrder = (req.query.sortOrder as string)?.toUpperCase() === "DESC" ? "DESC" : "ASC";

            const data = await PublishersModel.getPublishers(limit, offset, { publisherName, sortBy, sortOrder });
            res.status(200).json(data);
        } catch (e) {
            console.error("Error in getPublishers:", e);
            res.status(500).json({ error: "Failed to fetch publishers" });
        }
    }
    async createPublisher(req: Request, res: Response) {
        try {
            const data = await PublishersModel.createPublisher(req.body);
            res.status(201).json(data);
        } catch (e) {
            console.error("Error in createPublisher:", e);
            res.status(500).json({ error: "Failed to create publisher" });
        }
    }

    async updatePublisher(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            const payload = req.body;
            if (!payload) {
                res.status(400).json({ error: "Payload is empty" });
                return;
            }

            const data = await PublishersModel.updatePublisher(id, payload);

            if (!data) {
                res.status(404).json({ error: "Publisher not found" });
                return;
            }
            res.status(200).json(data);
        } catch (e) {
            console.error("Error in updatePublisher:", e);
            res.status(500).json({ error: "Failed to update publisher" });
        }
    }
    async deletePublisher(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            const data = await PublishersModel.deletePublisher(id);

            if (!data) {
                res.status(404).json({ error: "Publisher not found" });
                return;
            }
            res.status(204).send();
        } catch (e) {
            console.error("Error in deletePublisher:", e);
            res.status(500).json({ error: "Failed to delete publisher" });
        }
    }
}
