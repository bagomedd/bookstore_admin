import { PublishersController } from "@src/controllers/publishers.controller";
import { Router } from "express";

class PublishersRouter {
    router = Router();
    publishersController = new PublishersController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.get("/publishers", this.publishersController.getPublishers);
        this.router.post("/publishers", this.publishersController.createPublisher);
        this.router.patch("/publishers/:id", this.publishersController.updatePublisher);
        this.router.delete("/publishers/:id", this.publishersController.deletePublisher);
    }
}

export const PublishersRoutes = new PublishersRouter().router;
