import { EditionsController } from "@src/controllers/editions.controller";
import { Router } from "express";

class EditionsRouter {
    router = Router();
    editionsController = new EditionsController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/editions", this.editionsController.getEditions);
        this.router.post("/editions", this.editionsController.createEdition);
        this.router.patch("/editions/:id", this.editionsController.updateEdition);
        this.router.delete("/editions/:id", this.editionsController.deleteEdition);
    }
}

export const EditionsRoutes = new EditionsRouter().router;
