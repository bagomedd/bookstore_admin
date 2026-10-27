import express, { Application, Request, Response } from "express";
import Routes from "./routes/routes";

const app: Application = express();
const PORT = 3000;

app.use(express.json());

new Routes(app);

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
