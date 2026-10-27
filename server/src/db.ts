import pgPromise from "pg-promise";

const pgp = pgPromise();

export const db = pgp({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

export const Tables = {
    publishers: "publishers",
    editions: "editions",
};
