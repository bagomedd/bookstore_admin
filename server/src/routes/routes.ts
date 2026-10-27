import { Application } from "express";
import { PublishersRoutes } from "./publishers.route";
import { EditionsRoutes } from "./editions.route";

export default class Routes {
    constructor(app: Application) {
        app.use("/api", PublishersRoutes);
        app.use("/api", EditionsRoutes);
    }
}
